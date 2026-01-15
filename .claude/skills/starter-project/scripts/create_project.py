#!/usr/bin/env python3
"""
Starter Project Setup Script

This script creates the complete project structure including:
- context/core/ directory
- knowledge/ directory with subdirectories
- Placeholder JSON files for profiles
"""

import json
import os
from datetime import datetime
from pathlib import Path


def create_directories(project_path):
    """Create all required directories for the starter project."""
    directories = [
        "context/core",
        "knowledge/drafts",
        "knowledge/published",
        "knowledge/notes",
        "knowledge/research",
    ]

    created = []
    for directory in directories:
        dir_path = os.path.join(project_path, directory)
        os.makedirs(dir_path, exist_ok=True)
        created.append(directory)

    return created


def load_schema(schema_name):
    """Load a schema from the references directory."""
    schema_path = Path(__file__).parent.parent / "references" / f"{schema_name}-schema.json"
    with open(schema_path, 'r') as f:
        return json.load(f)


def create_profile_files(project_path):
    """Create placeholder profile JSON files in context/core/."""
    core_path = os.path.join(project_path, "context", "core")
    os.makedirs(core_path, exist_ok=True)

    now = datetime.utcnow().isoformat() + 'Z'
    files_created = []

    # Business Profile
    business_profile = load_schema("business-profile")
    business_profile['_metadata']['created_date'] = now
    business_profile['_metadata']['updated_date'] = now

    business_path = os.path.join(core_path, "business-profile.json")
    with open(business_path, 'w') as f:
        json.dump(business_profile, f, indent=2)
    files_created.append("business-profile.json")

    # Voice DNA
    voice_dna = load_schema("voice-dna")
    voice_dna['_metadata']['created_date'] = now
    voice_dna['_metadata']['updated_date'] = now

    voice_path = os.path.join(core_path, "voice-dna.json")
    with open(voice_path, 'w') as f:
        json.dump(voice_dna, f, indent=2)
    files_created.append("voice-dna.json")

    # Ideal Client Profile
    icp = load_schema("icp")
    icp['_metadata']['created_date'] = now
    icp['_metadata']['updated_date'] = now

    icp_path = os.path.join(core_path, "icp.json")
    with open(icp_path, 'w') as f:
        json.dump(icp, f, indent=2)
    files_created.append("icp.json")

    return files_created


def create_project_claude_md(project_path, project_name, project_type, description):
    """Create a project-specific CLAUDE.md file."""
    claude_md_content = f"""# {project_name} - CLAUDE.md

## Project Overview

**Project Name:** {project_name}
**Project Type:** {project_type}
**Description:** {description}

## Project Structure

```
{project_name}/
├── .claude/
│   ├── agents/          # Specialized AI agents
│   ├── commands/        # Custom slash commands
│   └── skills/          # Reusable skills
├── context/
│   └── core/
│       ├── business-profile.json    # Your business positioning
│       ├── voice-dna.json           # Your communication style
│       └── icp.json                 # Your ideal client profiles
├── knowledge/
│   ├── drafts/          # Work in progress
│   ├── published/       # Finalized content
│   ├── notes/           # Quick notes and ideas
│   └── research/        # Research materials
└── CLAUDE.md            # This file
```

## Available Skills

This project includes access to pre-built skills for:

- **business-profile-creator** - Document your business positioning
- **voice-dna** - Capture your unique communication style
- **ideal-client-profile** - Define your ideal customer personas
- **starter-project** - Initialize new projects with this setup

To use a skill:
```
/skill-name
```

## Available Agents

Specialized agents are available in `.claude/agents/` for:
- Content creation and research
- Design and UI development
- Market analysis and competitive intelligence
- Marketing and copywriting
- And more...

## Getting Started

1. **Fill out your profiles**:
   - Run `/business-profile-creator` to document your business
   - Run `/voice-dna` to capture your communication style
   - Run `/ideal-client-profile` to define your ideal clients

2. **Explore available commands**:
   - Check `.claude/commands/` for custom slash commands
   - Run `/status` for project overview

3. **Start creating**:
   - Use agents and commands for your first tasks
   - Save research and drafts in the `knowledge/` folder

## Notes

- This project was initialized with the starter-project skill
- All placeholder JSON files are ready for you to fill out
- Agents and commands are accessible throughout the project

For questions about available tools, check the agent and command descriptions in `.claude/`.
"""

    claude_path = os.path.join(project_path, "CLAUDE.md")
    with open(claude_path, 'w') as f:
        f.write(claude_md_content)

    return "CLAUDE.md"


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 4:
        print("Usage: python create_project.py <project_path> <project_name> <project_type> <description>")
        sys.exit(1)

    project_path = sys.argv[1]
    project_name = sys.argv[2]
    project_type = sys.argv[3]
    description = sys.argv[4] if len(sys.argv) > 4 else ""

    print(f"Setting up project: {project_name}")
    print(f"Project type: {project_type}")
    print()

    # Create directories
    print("Creating directories...")
    directories = create_directories(project_path)
    for d in directories:
        print(f"  ✓ {d}/")

    # Create profile files
    print("\nCreating placeholder profile files...")
    profile_files = create_profile_files(project_path)
    for f in profile_files:
        print(f"  ✓ context/core/{f}")

    # Create project-specific CLAUDE.md
    print("\nCreating project documentation...")
    claude_file = create_project_claude_md(project_path, project_name, project_type, description)
    print(f"  ✓ {claude_file}")

    print("\n✓ Project setup complete!")
    print(f"\nNext steps:")
    print(f"  1. Fill out your profiles using the available skills")
    print(f"  2. Check .claude/commands/ for available commands")
    print(f"  3. Start creating with available agents")
