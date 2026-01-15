# Prompt Creator Command

Guides you through building a detailed and effective prompt for large language models like Gemini and Claude.

## Usage
/prompt-creator

## Description
This command orchestrates a process for creating well-structured prompts by asking a series of questions and then using a specialized subagent to build the final prompts, optimized for different models.

## Process Flow

1.  **Questioning**: The command will prompt you to answer a series of questions to define the core components of your desired prompt.
2.  **Synthesis**: It will then pass your answers to the `prompt-builder` subagent.
3.  **Generation**: The subagent will generate two optimized prompts (one for Gemini, one for Claude) based on your input and model-specific best practices.
4.  **Output**: The final, ready-to-use prompts will be displayed for you to copy.

## Questions to Answer
*   **Goal**: What is the primary goal of your prompt? (e.g., generate code, write a blog post, summarize text, plan a project)
*   **Audience**: Who is the target audience for the output? (e.g., technical expert, beginner, marketing manager)
*   **Format**: What is the desired format for the output? (e.g., Markdown, JSON, a bulleted list, a table)
*   **Context**: Provide any background information, input data, or text the model needs to work with.
*   **Constraints & Rules**: List any specific rules, constraints, or negative constraints (things to avoid). Be explicit. (e.g., "use only Python," "do not mention pricing," "the tone must be formal")
*   **Example**: Provide a small, clear example of the desired output. This is one of the most effective ways to guide the model.

## Command Implementation
```bash
#!/bin/bash

echo "🚀 Starting the Prompt Creation Process..."
echo "Please answer the following questions to build your prompt."

# Collect user input
read -p "1. What is the primary GOAL of your prompt? " goal
read -p "2. Who is the target AUDIENCE for the output? " audience
read -p "3. What is the desired FORMAT for the output? " format
echo "4. Provide any CONTEXT or input data (end with Ctrl+D on a new line):"
context=$(cat)
echo "5. List any CONSTRAINTS or rules to follow (end with Ctrl+D on a new line):"
constraints=$(cat)
echo "6. Provide an EXAMPLE of the desired output (end with Ctrl+D on a new line):"
example=$(cat)

# Create a temporary file with the collected information
PROMPT_DATA_FILE=$(mktemp)
cat <<EOF > "$PROMPT_DATA_FILE"
# Prompt Requirements

## Goal
$goal

## Audience
$audience

## Format
$format

## Context
$context

## Constraints
$constraints

## Example
$example
EOF

echo "🧠 Building optimized prompts for Gemini and Claude..."

# Call the subagent with the collected data
claude --subagent prompt-builder --input "$(cat "$PROMPT_DATA_FILE")"

# Clean up the temporary file
rm "$PROMPT_DATA_FILE"

echo "✅ Prompts created successfully."
```
