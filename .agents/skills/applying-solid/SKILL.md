---
name: applying-solid
description: Skill for applying SOLID object-oriented design principles. Use when designing or refactoring class hierarchies, interfaces, and dependencies to improve flexibility and maintainability.
---

# Applying SOLID Principles

## Concept
SOLID is an acronym for five principles of object-oriented design that aim to make software designs more understandable, flexible, and maintainable.

## Guidelines
1. **Single Responsibility Principle (SRP)**: A class should have only one reason to change.
2. **Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification. Use interfaces/abstract classes instead of modifying existing code.
3. **Liskov Substitution Principle (LSP)**: Objects of a superclass shall be replaceable with objects of its subclasses without breaking the application. Avoid throwing `NotImplementedException` in subclasses.
4. **Interface Segregation Principle (ISP)**: No client should be forced to depend on methods it does not use. Split large interfaces into smaller, more specific ones.
5. **Dependency Inversion Principle (DIP)**: Depend upon abstractions, not concretions. Use Dependency Injection to provide concrete implementations.

## Execution
- Analyze the system for tight coupling and rigid hierarchies.
- Introduce interfaces to decouple components.
- Invert dependencies where high-level modules depend on low-level modules.
