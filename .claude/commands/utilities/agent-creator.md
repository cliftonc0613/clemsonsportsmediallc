# Agent Creator Command

Creates new Claude Code sub-agents using the meta-agent architecture for specialized task automation.

## Usage
```
/agent-creator
```

## System Overview

This command streamlines the creation of new specialized sub-agents by leveraging the meta-agent infrastructure:

1. **Requirements Gathering**: Interactive prompting for agent specifications
2. **Agent Generation**: Invokes meta-agent to create complete agent configuration
3. **Validation**: Ensures proper file structure and formatting
4. **Integration**: Adds agent to project workflow with usage documentation

## Process Flow

### Stage 1: Agent Requirements Collection
- Prompts user for agent purpose and primary tasks
- Collects domain expertise and specialization details
- Identifies required tools and capabilities
- Determines optimal model selection (haiku/sonnet/opus)
- Selects appropriate color coding for organization

### Stage 2: Meta-Agent Invocation
Launches **meta-agent** subagent to:
- Generate complete agent configuration with proper frontmatter
- Create structured system prompt with clear instructions
- Define step-by-step workflow for the new agent
- Include relevant best practices for the agent's domain
- Format output according to Claude Code standards

### Stage 3: Agent Creation & Validation
- Writes new agent file to `.claude/agents/` directory
- Validates proper Markdown structure and frontmatter
- Ensures unique agent name without conflicts
- Confirms tool selections are valid and available
- Verifies agent description is delegation-ready

### Stage 4: Documentation & Integration
- Updates project documentation with new agent capabilities
- Provides usage examples and invocation patterns
- Suggests integration points with existing workflows
- Creates quick-reference for agent's primary functions

## Output Files

### Agent Configuration (`/.claude/agents/[agent-name].md`)
- Complete agent definition with frontmatter metadata
- Structured system prompt with clear purpose statement
- Step-by-step workflow instructions
- Domain-specific best practices
- Professional output formatting guidelines

### Usage Documentation
- Integration examples with existing commands
- Suggested workflow patterns
- Tool combination recommendations
- Performance optimization tips

## Key Features

### Intelligent Agent Design
- **Purpose-Driven**: Focuses on specific, well-defined tasks
- **Tool Optimization**: Selects minimal necessary tool set
- **Delegation Ready**: Creates descriptions that enable automatic delegation
- **Best Practices**: Incorporates domain expertise and proven patterns

### Seamless Integration
- **Naming Conventions**: Follows kebab-case naming standards
- **Color Organization**: Uses visual coding for agent categories
- **Model Selection**: Matches complexity to appropriate AI model
- **Workflow Compatibility**: Integrates with existing command structure

### Quality Assurance
- **Validation Checks**: Ensures proper file structure and formatting
- **Conflict Prevention**: Checks for naming conflicts with existing agents
- **Tool Verification**: Confirms selected tools are available
- **Documentation Standards**: Maintains consistent documentation quality

## Command Implementation

```bash
#!/bin/bash

echo "🤖 Starting agent creation process..."

# Stage 1: Requirements Gathering
echo "Let's create your new specialized agent!"
echo ""
echo "Please provide the following information:"
echo ""

# Agent purpose and domain
echo "1. What specific task or domain should this agent handle?"
echo "   (e.g., 'API testing and validation', 'CSS optimization', 'database migration')"
read -p "Agent Purpose: " AGENT_PURPOSE

# Agent capabilities
echo ""
echo "2. What are the key capabilities this agent needs?"
echo "   (e.g., 'read files, run tests, generate reports')"
read -p "Key Capabilities: " AGENT_CAPABILITIES

# Tool requirements
echo ""
echo "3. What tools will this agent need? (comma-separated)"
echo "   Available: Read, Write, Edit, MultiEdit, Bash, Glob, Grep, WebFetch, TodoRead, TodoWrite"
read -p "Required Tools: " AGENT_TOOLS

# Model selection
echo ""
echo "4. What model complexity is needed?"
echo "   - haiku: Simple, fast tasks"
echo "   - sonnet: Balanced performance (default)"
echo "   - opus: Complex reasoning tasks"
read -p "Model [sonnet]: " AGENT_MODEL
AGENT_MODEL=${AGENT_MODEL:-sonnet}

# Color selection
echo ""
echo "5. Choose a color for organization:"
echo "   Available: red, blue, green, yellow, purple, orange, pink, cyan"
read -p "Color [cyan]: " AGENT_COLOR
AGENT_COLOR=${AGENT_COLOR:-cyan}

# Stage 2: Generate agent description
echo ""
echo "🔬 Generating agent configuration..."

# Create description for meta-agent
AGENT_DESCRIPTION="Create a specialized agent for: $AGENT_PURPOSE

Key capabilities needed: $AGENT_CAPABILITIES
Required tools: $AGENT_TOOLS
Model: $AGENT_MODEL
Color: $AGENT_COLOR

The agent should be designed for automatic delegation when users need help with: $AGENT_PURPOSE"

# Stage 3: Invoke meta-agent
echo "🎯 Creating agent with meta-agent..."
echo ""

# Save description to temp file for meta-agent input
echo "$AGENT_DESCRIPTION" > /tmp/agent_description.txt

# Invoke meta-agent to create the new agent
claude --subagent meta-agent --input "$(cat /tmp/agent_description.txt)"

# Stage 4: Validation and feedback
echo ""
echo "✅ Agent creation process complete!"
echo ""

# Find the newly created agent file
NEW_AGENT_FILE=$(find .claude/agents/ -name "*.md" -newer /tmp/agent_description.txt | head -1)

if [ -n "$NEW_AGENT_FILE" ]; then
    AGENT_NAME=$(basename "$NEW_AGENT_FILE" .md)
    echo "📁 New agent created: $NEW_AGENT_FILE"
    echo "🚀 Agent name: $AGENT_NAME"
    echo ""
    echo "Usage: claude --subagent $AGENT_NAME"
    echo ""
    echo "Your new agent is ready to use! It will be automatically delegated when tasks match its specialization."
else
    echo "⚠️  Agent file not found. Please check .claude/agents/ directory manually."
fi

# Cleanup
rm -f /tmp/agent_description.txt

echo ""
echo "💡 Pro tip: Test your new agent with a simple task to ensure it works as expected."
```

## Advanced Features

### Intelligent Prompting
- Guides users through optimal agent design decisions
- Suggests appropriate tool combinations for common patterns
- Recommends model selection based on task complexity
- Provides color-coding suggestions for workflow organization

### Template Intelligence
- Leverages meta-agent's proven template system
- Incorporates best practices from successful existing agents
- Ensures consistent documentation and formatting standards
- Creates delegation-ready descriptions for automatic invocation

### Workflow Integration
- Considers existing agent ecosystem to avoid overlap
- Suggests complementary capabilities with other agents
- Designs for integration with existing slash commands
- Creates agents that enhance overall workflow efficiency

### Quality Controls
- Validates agent configurations before finalizing
- Checks tool availability and compatibility
- Ensures unique naming without conflicts
- Confirms proper frontmatter structure and metadata

## Best Practices

1. **Purpose Clarity**: Define specific, focused purposes for better delegation
2. **Tool Minimalism**: Select only necessary tools to avoid complexity
3. **Model Matching**: Choose model complexity appropriate to task demands
4. **Testing**: Validate new agents with simple tasks before full deployment
5. **Documentation**: Maintain clear usage examples and integration patterns

## Integration Examples

### With Existing Commands
```bash
# Create content analysis agent, then use with blog research
/agent-creator  # Create content-analyzer agent
/blog-research  # Automatically delegates to content-analyzer
```

### With Manual Invocation
```bash
# Create and test new agent
/agent-creator  # Create specialized agent
claude --subagent new-agent-name  # Test directly
```

The system creates purpose-built agents that seamlessly integrate into your workflow, automatically handling specialized tasks when invoked or delegated to by other commands.