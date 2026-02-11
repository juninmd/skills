import argparse
import json

def generate_prompt_request(task_type, target_model, goal, context, output_format, constraints):
    request = {
        "task_type": task_type,
        "target_model": target_model,
        "goal": goal,
        "input_context": context,
        "output_format": output_format,
        "constraints": constraints
    }
    return json.dumps(request, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a prompt engineering request.")
    parser.add_argument("--task-type", required=True, help="Type of task (e.g., Code Gen, Summarization)")
    parser.add_argument("--target-model", required=True, help="Target LLM (e.g., GPT-4, Gemini)")
    parser.add_argument("--goal", required=True, help="Goal of the prompt")
    parser.add_argument("--context", help="Context for the prompt")
    parser.add_argument("--output-format", help="Desired output format")
    parser.add_argument("--constraints", help="Any constraints")

    args = parser.parse_args()
    print(generate_prompt_request(args.task_type, args.target_model, args.goal, args.context, args.output_format, args.constraints))
