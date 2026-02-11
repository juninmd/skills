# Shell Command Expert Forms

## 1. Command Execution Plan (command_plan.md)

### Goal
Define the sequence of commands to achieve a specific objective.

### Fields
- **Objective:** [What are we trying to achieve?]
- **Environment:** [OS, Shell type, specific working directory]
- **Command Sequence:**
    1. `[Command 1]` - [Purpose of command 1]
    2. `[Command 2]` - [Purpose of command 2]
    3. ...
- **Expected Outcome:** [What should be the final state or output?]
- **Potential Risks:** [e.g., File deletion, high resource usage]

## 2. Command Execution Log (command_log.md)

### Goal
Document the results of executed commands for audit and troubleshooting.

### Fields
- **Execution Date/Time:** [Timestamp]
- **Command:** `[The exact command executed]`
- **Exit Code:** [0 for success, or the error code]
- **Standard Output (stdout):**
    [Summary or snippet of stdout]
- **Standard Error (stderr):**
    [Any error messages received]
- **Status:** [Success / Failure / Partially Successful]
- **Notes/Next Steps:** [Adjustments made or further actions needed]
