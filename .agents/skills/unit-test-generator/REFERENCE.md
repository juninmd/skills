# Unit Test Generator Reference

## Recommended Tools

### 1. `read_file`
**Description:** Essential for analyzing the source code before generating tests.
**Usage:** Read the implementation file to understand the logic and identify test cases.

### 2. `run_shell_command`
**Description:** Used to execute the tests and check for coverage.
**Examples:**
- `pytest tests/test_my_code.py`
- `npm test`
- `python -m unittest discover`

### 3. `write_file`
**Description:** Used to save the generated test code.

## Framework-Specific Tips

### Pytest (Python)
- Use `pytest.mark.parametrize` for multiple test cases on the same function.
- Use fixtures for setup and teardown logic.

### Unittest (Python)
- Inherit from `unittest.TestCase`.
- Use `self.assertEqual`, `self.assertRaises`, etc.

### Jest (JavaScript/TypeScript)
- Use `describe` and `it`/`test` blocks.
- Use `expect().toBe()`, `expect().toEqual()`, etc.
