---
name: designing-game-mechanics
description: Design and implement game logic, physics systems, state machines, and AI behaviors for games
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Game Mechanics Designer Skill

## Description
This skill enables the agent to design and implement game logic, physics systems, and player interactions. It covers concepts like state machines, collision detection, and AI behaviors for games.

## Workflow

### 1. Define Rules & Systems
- Design core loops (e.g., move -> shoot -> score).
- Define entity attributes (health, speed, damage).
- Establish win/loss conditions.

### 2. Implement Physics & Movement
- Implement movement logic (gravity, friction, acceleration).
- Handle collision detection and response (bounding boxes, raycasting).
- Manage time steps (delta time) for smooth animation.

### 3. State Management
- Use Finite State Machines (FSM) to manage game states (Menu, Playing, Paused, GameOver).
- Manage entity states (Idle, Walking, Attacking, Dead).

### 4. AI & Behaviors
- Implement basic AI for NPCs (pathfinding, steering behaviors).
- Design behavior trees for complex decision making.

## Best Practices
- **Decoupling:** Keep game logic separate from rendering code.
- **Component-Based:** Use Entity-Component-System (ECS) or similar patterns for flexibility.
- **Performance:** Optimize collision checks and update loops to maintain high frame rates.
