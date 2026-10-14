# Advanced TypeScript Patterns

Guidelines for leveraging type-level logic and modern features.

## 1. Conditional and Template Types
- **Conditional:** `type IsString<T> = T extends string ? true : false;`.
- **Template Literals:** `type Event = `${"mouse" | "key"}${Action}`;`.

## 2. Mapped and Utility Types
- Use `Readonly<T>`, `Partial<T>`, and `Record<K, T>` instead of reinventing them.
- Avoid deep-nesting mapped types without documentation.

## 3. Function Overloads
- **Order:** Place specific signatures before the general signature.
- **Preference:** Use Union types over multiple overloads where possible for simplicity.

## 4. Generics
- Generics MUST use their type parameters in the interface or function body.
- Avoid `<T = any>`—provide a meaningful default or leave it required.
