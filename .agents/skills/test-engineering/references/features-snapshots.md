---
name: snapshot-testing
description: Snapshot testing with file, inline, and file snapshots
---

# Snapshot Testing

## Contents

- Basic Snapshot
- Inline Snapshots
- File Snapshots
- Snapshot Hints
- Object Shape Matching
- Error Snapshots
- Updating Snapshots
- Custom Serializers
- Snapshot Format Options
- Concurrent Test Snapshots
- Snapshot File Location
- When a Snapshot Hides a Regression
- Key Points

Snapshot tests capture output and compare against stored references.

## Basic Snapshot

```ts
import { expect, test } from 'vitest'

test('snapshot', () => {
  const result = generateOutput()
  expect(result).toMatchSnapshot()
})
```

First run creates `.snap` file:

```js
// __snapshots__/test.spec.ts.snap
exports['snapshot 1'] = `
{
  "id": 1,
  "name": "test"
}
`
```

## Inline Snapshots

Stored directly in test file:

```ts
test('inline snapshot', () => {
  const data = { foo: 'bar' }
  expect(data).toMatchInlineSnapshot()
})
```

Vitest updates the test file:

```ts
test('inline snapshot', () => {
  const data = { foo: 'bar' }
  expect(data).toMatchInlineSnapshot(`
    {
      "foo": "bar",
    }
  `)
})
```

## File Snapshots

Compare against explicit file:

```ts
test('render html', async () => {
  const html = renderComponent()
  await expect(html).toMatchFileSnapshot('./expected/component.html')
})
```

## Snapshot Hints

Add descriptive hints:

```ts
test('multiple snapshots', () => {
  expect(header).toMatchSnapshot('header')
  expect(body).toMatchSnapshot('body content')
  expect(footer).toMatchSnapshot('footer')
})
```

## Object Shape Matching

Match partial structure:

```ts
test('shape snapshot', () => {
  const data = { 
    id: Math.random(), 
    created: new Date(),
    name: 'test' 
  }
  
  expect(data).toMatchSnapshot({
    id: expect.any(Number),
    created: expect.any(Date),
  })
})
```

## Error Snapshots

```ts
test('error message', () => {
  expect(() => {
    throw new Error('Something went wrong')
  }).toThrowErrorMatchingSnapshot()
})

test('inline error', () => {
  expect(() => {
    throw new Error('Bad input')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: Bad input]`)
})
```

## Updating Snapshots

```bash
# Update all snapshots
vitest -u
vitest --update

# In watch mode, press 'u' to update failed snapshots
```

## Custom Serializers

Add custom snapshot formatting:

```ts
expect.addSnapshotSerializer({
  test(val) {
    return val && typeof val.toJSON === 'function'
  },
  serialize(val, config, indentation, depth, refs, printer) {
    return printer(val.toJSON(), config, indentation, depth, refs)
  },
})
```

Or via config:

```ts
// vitest.config.ts
defineConfig({
  test: {
    snapshotSerializers: ['./my-serializer.ts'],
  },
})
```

## Snapshot Format Options

```ts
defineConfig({
  test: {
    snapshotFormat: {
      printBasicPrototype: false, // Don't print Array/Object prototypes
      escapeString: false,
    },
  },
})
```

## Concurrent Test Snapshots

Use context's expect:

```ts
test.concurrent('concurrent 1', async ({ expect }) => {
  expect(await getData()).toMatchSnapshot()
})

test.concurrent('concurrent 2', async ({ expect }) => {
  expect(await getOther()).toMatchSnapshot()
})
```

## Snapshot File Location

Default: `__snapshots__/<test-file>.snap`

Customize:

```ts
defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => {
      return testPath.replace('__tests__', '__snapshots__') + snapExtension
    },
  },
})
```

## When a Snapshot Hides a Regression

A snapshot only proves the output did not change; it proves nothing about
whether the output was correct in the first place, including the day it was
first recorded. Two failure modes turn that into false safety:

- **Approving without reading.** Running `vitest -u` on a red suite and
  committing the new snapshot is the same as deleting the assertion — the
  reviewer now has to diff the whole snapshot file by eye, and a large one gets
  skimmed, not read.
- **Snapshotting the whole object.** A full-page HTML snapshot or a large JSON
  blob fails on any change anywhere inside it, so a real regression buried
  among ten unrelated formatting changes reads as noise the reviewer approves
  along with everything else. Snapshot only genuinely opaque output a human
  will actually review — rendered markup, CLI output, generated config — and
  assert the specific field that matters with `toEqual`/`toMatchObject`
  everywhere else.

Treat the first commit of a snapshot with the same scrutiny as a new assertion:
read the generated value before committing it, not after.

## Key Points

- Commit snapshot files to version control
- Review snapshot changes in code review
- Use hints for multiple snapshots in one test
- Use `toMatchFileSnapshot` for large outputs (HTML, JSON)
- Inline snapshots auto-update in test file
- Use context's `expect` for concurrent tests

<!-- 
Source references:
- https://vitest.dev/guide/snapshot.html
- https://vitest.dev/api/expect.html#tomatchsnapshot
-->
