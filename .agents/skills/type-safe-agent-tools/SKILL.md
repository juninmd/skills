---
name: type-safe-agent-tools
description: |
  **TYPESCRIPT SKILL** - Design type-safe agent tools using branded types and schema inference.
  USE FOR: branded types for tool IDs, IIMT patterns for tool schemas, const type parameters, discriminated unions for state, type-driven tool definition.
  DO NOT USE FOR: general TypeScript patterns (use typescript-advanced-types), tool runtime validation (use agent-observability-and-testing), system prompts (use developing-ai-agents).
  INVOKES: typescript-advanced-types, developing-ai-agents, agent-observability-and-testing.
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Tool contracts require type, validation, error, and security examples."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Type-Safe Agent Tools

Professional guidance for designing type-safe agent tools using TypeScript patterns: branded types, IIMT (Immediately Indexed Mapped Types), const type parameters, and schema inference.

**USE FOR:**
- Creating branded types for tool IDs (prevent ID mixups at compile time).
- Using IIMT patterns to generate tool schemas from definitions.
- Preserving literal types via const type parameters (agent state machines).
- Building discriminated unions for agent states (idle | thinking | acting | observing).
- Inferring JSON schemas from TypeScript types (prevent schema-code drift).
- Type guards and narrowing for tool outputs.
- Type-driven tool definition: define once in TypeScript, derive system prompt and schemas.

**DO NOT USE FOR:**
- General TypeScript patterns (use `typescript-advanced-types`).
- Runtime validation logic (use `agent-observability-and-testing`).
- System prompt authoring (use `developing-ai-agents`).

**INVOKES:**
- `typescript-advanced-types` for foundational patterns.
- `developing-ai-agents` for prompt design.
- `agent-observability-and-testing` for validation testing.

## Core Patterns

1. **Branded Types for Tool IDs**
   ```typescript
   type SearchToolId = string & { readonly __brand: 'SearchToolId' };
   type EmailToolId = string & { readonly __brand: 'EmailToolId' };
   
   // Prevents accidental tool ID mixups
   const search: SearchToolId = 'search_web' as SearchToolId;
   // Type error: search cannot be assigned to EmailToolId
   ```

2. **IIMT (Immediately Indexed Mapped Types)**
   ```typescript
   type ToolSchema<T extends object> = {
     [K in keyof T]: T[K] extends (args: infer A) => any ? A : never;
   };
   
   // Auto-generates parameter schemas from function signatures
   type SearchParams = ToolSchema<typeof tools>;
   ```

3. **Const Type Parameters**
   ```typescript
   function defineAgent<const T extends AgentState>(state: T) {
     // T is now a literal union, not widened to string
     return state;
   }
   
   const myAgent = defineAgent({ status: 'idle', task: 'search' } as const);
   // typeof myAgent.status = 'idle' (not string)
   ```

4. **Discriminated Unions for Agent State**
   ```typescript
   type AgentState = 
     | { kind: 'idle' }
     | { kind: 'thinking'; reasoning: string }
     | { kind: 'acting'; toolId: string; params: unknown }
     | { kind: 'observing'; result: unknown };
   
   // Exhaustive pattern matching forced by TS
   ```

5. **Type-Driven Schema Inference**
   ```typescript
   // Tool definition
   const searchTool = z.object({
     query: z.string(),
     limit: z.number().min(1).max(10),
   });
   
   type SearchParams = z.infer<typeof searchTool>;
   // Zod → JSON Schema → system prompt (zero duplication)
   ```

6. **Type Guards for Tool Results**
   ```typescript
   function isSearchResult(obj: unknown): obj is SearchResult {
     return typeof obj === 'object' && obj !== null && 'items' in obj;
   }
   
   const result = await searchTool(query);
   if (isSearchResult(result)) {
     // result is narrowed; safe to access result.items
   }
   ```

## Workflow: Type-Driven Tool Definition

```
1. Define Tool in TypeScript (Zod schema)
   ↓
2. Auto-generate JSON Schema
   ↓
3. Generate system prompt from schema
   ↓
4. Agent calls tool with type-checked params
   ↓
5. Type guard validates result
   ↓
6. Agent uses narrowed result safely
```

## Checklist

- [ ] All tool IDs are branded types (prevent cross-tool ID confusion).
- [ ] Tool parameters defined in Zod or TypeScript types (schema is source of truth).
- [ ] JSON schemas auto-generated from TS types (no manual duplication).
- [ ] Agent state is discriminated union; exhaustive pattern matching enforced.
- [ ] Const type parameters used in state machines (literal types preserved).
- [ ] Type guards written for all tool result types.
- [ ] IIMT patterns used to infer parameter schemas from function signatures.
- [ ] No `any` in tool definitions; fallback to `unknown` + type guard.
- [ ] System prompt auto-generated from type definitions (source-of-truth); validated against actual schema.
