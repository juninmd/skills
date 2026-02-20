---
name: modeling-mathematics
description: Formulate and solve mathematical models including optimization problems, statistical simulations, and differential equations
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Mathematical Modeler Skill

## Description
This skill enables the agent to formulate and solve mathematical models, including optimization problems, statistical simulations, and differential equations. It leverages libraries like NumPy, SciPy, and SymPy.

## Workflow

### 1. Problem Formulation
- Define the objective (minimize cost, maximize efficiency).
- Identify variables and constraints.
- Choose the appropriate mathematical model (Linear Programming, Monte Carlo Simulation, etc.).

### 2. Implementation
- Implement the model using Python libraries.
- For symbolic math, use SymPy.
- For numerical optimization, use SciPy.optimize.
- For data manipulation, use NumPy.

### 3. Solution & Simulation
- Run the solver or simulation.
- Analyze the results (optimal values, sensitivity analysis).
- Validate the model against known data or theoretical results.

### 4. Visualization & Reporting
- Plot results using Matplotlib or Seaborn.
- Interpret the mathematical results in the context of the original problem.

## Best Practices
- **Vectorization:** Use vectorized operations in NumPy for performance.
- **Validation:** Always check if the solution makes sense physically or economically.
- **Documentation:** Clearly explain the assumptions and limitations of the model.
