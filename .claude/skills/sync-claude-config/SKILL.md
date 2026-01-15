---
name: sync-claude-config
description: This skill should be used when syncing agents, commands, and skills from a central Claude Code repository. It guides users through selecting what to pull (all items, specific categories, or individual items) and handles cloning, backups, and safe overwriting.
---

# Sync Claude Config Skill

## Purpose

This skill enables efficient synchronization of reusable `.claude` configurations (agents, commands, skills) from a central repository to any project. It handles repository cloning, selective pulling, backup management, and safe overwriting.

## When to Use

Use this skill when:
- Starting a new project and want to pull in standard agents/commands
- Updating existing agents/commands to latest versions from central repo
- Syncing multiple projects to maintain consistency
- Selectively pulling specific agents or categories

## How It Works

### Overview

1. **Repository Detection**: Reads central repo URL from `.claude/config.json`
2. **Interactive Selection**: Asks what to sync (all, by category, or specific items)
3. **Safe Cloning**: Clones central repo to temporary directory
4. **Backup Creation**: Automatically creates timestamped backups before sync
5. **Selective Sync**: Pulls only selected items, overwriting existing files
6. **Cleanup**: Removes temporary files

### Sync Modes

**Mode 1: Sync Everything**
- Pulls all agents, commands, and skills
- Overwrites existing files with latest versions
- Best for fresh projects or major updates

**Mode 2: Sync by Category**
- Choose which categories to sync (agents, commands, skills)
- Within each category, choose subcategories
- Useful for targeted updates

**Mode 3: Sync Specific Items**
- Select individual agents/commands/skills
- Only pulls what you need
- Useful for picking specific improvements

### Configuration File (.claude/config.json)

The skill reads from `.claude/config.json` which defines:

```json
{
  "centralRepoUrl": "https://github.com/username/repo.git",
  "categories": {
    "agents": {
      "enabled": true,
      "path": ".claude/agents",
      "categories": {
        "research": "...",
        "design-development": "..."
      }
    },
    "commands": {
      "enabled": true,
      "path": ".claude/commands",
      "categories": {}
    },
    "skills": {
      "enabled": true,
      "path": ".claude/skills",
      "categories": {}
    }
  },
  "syncOptions": {
    "backupBeforeSync": true,
    "overwriteExisting": true
  }
}
```

## Implementation Steps

### 1. Determine Sync Scope

Ask the user which sync mode they want:
- **All**: Sync everything from central repo
- **By Category**: Choose agents/commands/skills
- **Selective**: Pick specific items

### 2. Read Configuration

Load `.claude/config.json` to get:
- Central repository URL
- Available categories and subcategories
- Current sync settings

### 3. Execute Sync

For the chosen scope:

**Option A: Sync All**
```bash
python scripts/sync_claude_repo.py <repo_url> <project_root>
```

**Option B: Sync Specific Categories**
- Use Python script with category-specific parameters
- Script handles listing available items
- User selects which ones to pull

**Option C: Interactive Selection**
- Display available agents/commands/skills
- User checks boxes for what to sync
- Script syncs only selections

### 4. Verify Results

After sync completes:
- Confirm files were copied successfully
- Check that backup was created (if applicable)
- List what was synced
- Show any conflicts or errors

### 5. Next Steps

Provide user with:
- Location of backup (if created)
- List of synced items
- How to undo (restore from backup)
- Recommendation to test updated agents/commands

## Bundled Resources

- `scripts/sync_claude_repo.py`: Main sync engine handling cloning, backups, and selective pulling
- `.claude/config.json`: Configuration file defining central repo and available items (located in project root)

## Key Features

- **Safe**: Creates timestamped backups before overwriting
- **Flexible**: Sync all, by category, or specific items
- **Efficient**: Clones only what's needed using shallow clone
- **Reversible**: Easy to restore from backup if needed
- **Interactive**: Asks what to sync before making changes

## Error Handling

If something goes wrong:
- Check git connectivity to central repo
- Verify central repo URL is correct in `.claude/config.json`
- Look for backup files (`.claude.backup.YYYYMMDD_HHMMSS/`)
- Restore from backup if needed

## Configuration Example

To use this skill with your own central repository:

1. Update central repo URL in `.claude/config.json`:
```json
{
  "centralRepoUrl": "https://github.com/yourname/your-claude-configs.git"
}
```

2. Ensure central repo has `.claude/` directory with agents/commands/skills

3. Run the skill and choose your sync mode

## Best Practices

- Run sync regularly to stay up-to-date
- Review changes after sync before committing
- Keep backups for a few weeks in case rollback is needed
- Test updated agents/commands before relying on them
- Maintain a `CHANGELOG.md` in central repo for tracking updates
