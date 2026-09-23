# Automation Candidates

Before writing any new agent asset, decide **if** a recurring task needs one and, if so, what kind.
Writing a skill once it is justified is [skill-creator.md](skill-creator.md); this step comes first.
Most candidates turn out to need something lighter than a skill, and plenty need nothing at all.

## Preflight
```bash
ls ~/.claude/skills .agents/skills 2>/dev/null                        # user and repository skills
rg -l 'description:' .agents/skills/*/SKILL.md | wc -l
ls .claude/commands .claude/agents ~/.claude/agents 2>/dev/null          # commands and subagents
jq '.hooks // {} | keys' .claude/settings.json ~/.claude/settings.json 2>/dev/null
rg -n -i '<task keyword>' CLAUDE.md AGENTS.md .agents/skills 2>/dev/null | head   # is it covered already?
```

## Workflow
1. List what already exists before suggesting anything new.
2. Gather evidence that the task recurs, from the conversation, project notes, memory, and any
   session records the user lets you read.
3. Rate each candidate.
4. Choose the lightest option that does the job.
5. Present the proposal with its evidence, and wait for approval before touching any prompt, skill,
   command, agent, hook, permission, or MCP access.
6. Say which changes only take effect after the client restarts.

## 1. What exists

When something already handles the task, extend it or point to it. The expensive mistake here is a
second skill that almost duplicates the first: two descriptions fighting over the same trigger make
routing worse for both.

## 2. Evidence that a task recurs

- Separate sessions run the same series of commands.
- The user asks for the same procedure by hand again and again, like a release checklist or setting
  up an environment.
- The agent repeats the same lookup or context collection each time.
- The user has to explain the same project rule more than once.
- The agent fails the same way repeatedly for lack of a written rule, a tool, or an access grant.

Trust the evidence in this order: what the user said explicitly; project notes and memory; assets
that already exist; session logs, only where reading them is safe. Keep the search inside the
project and its sessions; nothing personal, no secrets, no private chats, no third-party logins.

## 3. Rating

| Question | Look for |
|---|---|
| How often? | two or more real occurrences; a single one is a story, not a pattern |
| What does it cost? | time, tokens, money, or attention actually lost |
| What goes wrong when it varies? | breakage or unsafe results when done differently each time |
| Is it predictable? | known inputs and a known expected result |
| Does it end? | a clear point where the task is finished |
| Is it handled? | an existing asset that already does it well |

Good candidates recur, are predictable, have a clear end, and are not handled yet.

## 4. Lightest option first

Ordered from lightest to heaviest; take the first that works.

| Option | Right when |
|---|---|
| Do nothing | weak evidence, a one-time case, a sensitive subject, or already handled |
| A line in `CLAUDE.md` or `AGENTS.md` | the agent keeps getting one behavior wrong |
| A reference file under an existing skill | the procedure sits inside a domain a skill already covers |
| A new skill | a separate area of decisions no skill covers; continue with [skill-creator.md](skill-creator.md) |
| A command | the user triggers it by hand, with the same inputs each time |
| A subagent | the work needs its own context and clear rules for when to hand it off |
| A hook | it must run every single time, not only when the model remembers |
| A permission or MCP change | what blocks the agent is access, not knowledge |

A rule or a reference file beats a subagent when either is enough, and a short project note beats a
skill.

## 5. Proposal

```text
Task:        <the recurring task, one line>
Evidence:    <each occurrence and where it was seen>
Handled by:  <existing asset, or none>
Option:      <chosen option>; why the lighter one is not enough
Change:      <files to add or edit>
Restart:     <yes/no, which client>
```

"Do nothing" is a complete answer. Write down why the candidate was dropped, so the next review does
not bring it up again.
