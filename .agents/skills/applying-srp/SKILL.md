---
name: applying-srp
description: Skill for refactoring code to follow the Single Responsibility Principle (SRP). Use when a class, module, or function has more than one reason to change or handles multiple responsibilities.
---

# Applying SRP (Single Responsibility Principle)

## Concept
A class, module, or function should have one, and only one, reason to change. It should encapsulate a single responsibility or a single piece of functionality within the software architecture.

## Guidelines
1. **Identify Responsibilities**: Analyze the code and list the different tasks it performs. If it's doing logging, business logic, and database access, it violates SRP.
2. **Extract Methods/Classes**: Move secondary responsibilities into their own dedicated classes or functions.
3. **Cohesion**: Ensure that all methods and fields in a class are closely related to the core responsibility of that class.
4. **Naming**: If you can't describe what a function/class does without using the word "and", it likely violates SRP.

## Execution
- Always ask: "What is the single responsibility of this component?"
- Create new abstractions to handle extracted responsibilities.
- Ensure the refactored code passes all existing tests.
