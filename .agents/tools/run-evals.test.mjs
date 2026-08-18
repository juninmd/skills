import assert from "node:assert/strict";
import test from "node:test";
import { buildIndex, rankSkills, descriptionCollisions, stem, tokenize } from "./skill-router.mjs";
import { evaluate } from "./run-evals.mjs";

const SKILLS = [
  {
    name: "sql-authoring",
    description:
      "Write and tune SQL. Use for PostgreSQL and MySQL queries, joins, window functions, CTEs, and index design.",
  },
  {
    name: "webapp-testing",
    description:
      "Drive a real browser. Use for Playwright end-to-end flows, authentication journeys, and visual regression.",
  },
  {
    name: "release-management",
    description:
      "Ship a version. Use for conventional commits, changelog generation, release branches, and GitHub Releases.",
  },
];

const caseFile = (name, positive, negative) => ({
  file: `${name}.json`,
  data: { skill_name: name, trigger: { positive, negative } },
});

const FULL_CASES = [
  caseFile(
    "sql-authoring",
    [
      { prompt: "Write a window function query over orders" },
      { prompt: "Design the index for this PostgreSQL table" },
      { prompt: "Turn this into a SQL join with a CTE" },
    ],
    [
      { prompt: "Run the Playwright end-to-end suite", owner: "webapp-testing" },
      { prompt: "Generate the changelog for this release", owner: "release-management" },
    ],
  ),
  caseFile(
    "webapp-testing",
    [
      { prompt: "Drive the browser through the login journey" },
      { prompt: "Write a Playwright end-to-end test" },
      { prompt: "Add a visual regression check in the browser" },
    ],
    [
      { prompt: "Design the PostgreSQL index", owner: "sql-authoring" },
      { prompt: "Cut the release branch", owner: "release-management" },
    ],
  ),
  caseFile(
    "release-management",
    [
      { prompt: "Generate the changelog from conventional commits" },
      { prompt: "Cut a release branch and publish the GitHub Release" },
      { prompt: "Bump the version for this release" },
    ],
    [
      { prompt: "Write a SQL window function", owner: "sql-authoring" },
      { prompt: "Run the Playwright browser flow", owner: "webapp-testing" },
    ],
  ),
];

test("stemming clusters obvious inflections", () => {
  assert.equal(stem("migrations"), stem("migration"));
  assert.equal(stem("caching"), stem("cache"));
  assert.equal(stem("committed"), stem("commit"));
});

test("tokenize drops stop words and splits hyphenated names", () => {
  assert.deepEqual(tokenize("Use the sql-authoring skill"), ["sql", "author", "skill"]);
});

test("ranking is deterministic and puts the owning skill first", () => {
  const index = buildIndex(SKILLS);
  const first = rankSkills("Write a window function query in PostgreSQL", index);
  const second = rankSkills("Write a window function query in PostgreSQL", index);
  assert.equal(first[0].name, "sql-authoring");
  assert.deepEqual(first, second);
});

test("a clean catalog produces no errors", () => {
  const report = evaluate(SKILLS, FULL_CASES);
  assert.deepEqual(report.errors, []);
  assert.equal(report.stats.rank1, 9);
  assert.equal(report.stats.rank1Rate, 1);
});

test("a skill without a case file fails coverage", () => {
  const report = evaluate(SKILLS, FULL_CASES.slice(0, 2));
  assert.ok(report.errors.some((error) => error.includes("missing routing evals")));
});

test("a case file whose skill_name disagrees with the file name fails", () => {
  const broken = [...FULL_CASES];
  broken[0] = { ...broken[0], data: { ...broken[0].data, skill_name: "not-a-skill" } };
  const report = evaluate(SKILLS, broken);
  assert.ok(report.errors.some((error) => error.includes("must equal the file name")));
});

test("too few prompts fails the schema gate", () => {
  const thin = [...FULL_CASES];
  thin[0] = caseFile(
    "sql-authoring",
    [{ prompt: "Write a window function query over orders" }],
    [{ prompt: "Run the Playwright suite", owner: "webapp-testing" }],
  );
  const report = evaluate(SKILLS, thin);
  assert.ok(report.errors.some((error) => error.includes("at least 3 positive")));
  assert.ok(report.errors.some((error) => error.includes("at least 2 negative")));
});

test("a positive prompt outside top_k is reported with its winner", () => {
  const drifted = [...FULL_CASES];
  drifted[0] = caseFile(
    "sql-authoring",
    [
      { prompt: "Write a window function query over orders" },
      { prompt: "Design the index for this PostgreSQL table" },
      { prompt: "Publish the GitHub Release from conventional commits", top_k: 1 },
    ],
    FULL_CASES[0].data.trigger.negative,
  );
  const report = evaluate(SKILLS, drifted);
  assert.ok(report.errors.some((error) => error.includes("winner was 'release-management'")));
});

test("a negative prompt the skill wins is reported", () => {
  const wrong = [...FULL_CASES];
  wrong[0] = caseFile("sql-authoring", FULL_CASES[0].data.trigger.positive, [
    { prompt: "Design the PostgreSQL index for this table", owner: "webapp-testing" },
    { prompt: "Cut the release branch", owner: "release-management" },
  ]);
  const report = evaluate(SKILLS, wrong);
  assert.ok(report.errors.some((error) => error.includes("must not win")));
});

test("a negative prompt naming an unknown owner fails", () => {
  const wrong = [...FULL_CASES];
  wrong[0] = caseFile("sql-authoring", FULL_CASES[0].data.trigger.positive, [
    { prompt: "Run the Playwright suite", owner: "no-such-skill" },
    { prompt: "Cut the release branch", owner: "release-management" },
  ]);
  const report = evaluate(SKILLS, wrong);
  assert.ok(report.errors.some((error) => error.includes("unknown skill")));
});

test("an unreachable skill is reported", () => {
  const shadowed = [
    ...SKILLS,
    { name: "sql-authoring-duplicate", description: SKILLS[0].description },
  ];
  const cases = [
    ...FULL_CASES,
    caseFile(
      "sql-authoring-duplicate",
      [
        { prompt: "Write a window function query over orders" },
        { prompt: "Design the index for this PostgreSQL table" },
        { prompt: "Turn this into a SQL join with a CTE" },
      ],
      [
        { prompt: "Run the Playwright suite", owner: "webapp-testing" },
        { prompt: "Cut the release branch", owner: "release-management" },
      ],
    ),
  ];
  const report = evaluate(shadowed, cases);
  assert.ok(report.errors.some((error) => error.includes("unreachable")));
});

test("near-duplicate descriptions are flagged as a collision", () => {
  const duplicated = [
    ...SKILLS,
    { name: "sql-writing", description: SKILLS[0].description },
  ];
  const collisions = descriptionCollisions(duplicated);
  assert.equal(collisions[0].left, "sql-authoring");
  assert.equal(collisions[0].right, "sql-writing");
  assert.ok(collisions[0].similarity > 0.99, `expected a near-1 score, got ${collisions[0].similarity}`);
});

test("invalid JSON in a case file is reported, not thrown", () => {
  const report = evaluate(SKILLS, [
    ...FULL_CASES,
    { file: "broken.json", parseError: "Unexpected token" },
  ]);
  assert.ok(report.errors.some((error) => error.includes("invalid JSON")));
});
