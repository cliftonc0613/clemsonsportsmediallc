#!/usr/bin/env python3
"""
Sync .claude configuration from central repository to current project.
Handles cloning, selective pulling, and backup management.
"""

import os
import sys
import json
import shutil
import tempfile
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple

class ClaudeSyncer:
    def __init__(self, central_repo_url: str, project_root: str):
        self.central_repo_url = central_repo_url
        self.project_root = Path(project_root)
        self.claude_dir = self.project_root / ".claude"
        self.temp_dir = None
        self.config = self._load_config()

    def _load_config(self) -> Dict:
        """Load configuration from central repo's config.json"""
        config_path = self.claude_dir / "config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {}

    def clone_central_repo(self) -> Path:
        """Clone the central repository to a temporary directory"""
        self.temp_dir = tempfile.mkdtemp(prefix="claude_sync_")
        print(f"Cloning central repository to {self.temp_dir}...")

        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", self.central_repo_url, self.temp_dir],
                check=True,
                capture_output=True,
                text=True
            )
            print("✓ Repository cloned successfully")
            return Path(self.temp_dir)
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to clone repository: {e.stderr}")
            raise

    def _create_backup(self, target_path: Path) -> Path:
        """Create a backup of existing .claude directory"""
        if not target_path.exists():
            return None

        backup_dir = self.project_root / f".claude.backup.{self._get_timestamp()}"
        print(f"Creating backup at {backup_dir}...")
        shutil.copytree(target_path, backup_dir)
        print(f"✓ Backup created")
        return backup_dir

    def _get_timestamp(self) -> str:
        """Get current timestamp for backup naming"""
        from datetime import datetime
        return datetime.now().strftime("%Y%m%d_%H%M%S")

    def get_available_items(self, category: str) -> Dict[str, List[str]]:
        """Get list of available agents/commands/skills from central repo"""
        items = {}

        if category not in self.config.get("categories", {}):
            return items

        cat_config = self.config["categories"][category]
        source_path = Path(self.temp_dir) / cat_config["path"]

        if not source_path.exists():
            return items

        # Get subcategories
        for subcat_dir in source_path.iterdir():
            if subcat_dir.is_dir() and not subcat_dir.name.startswith('.'):
                items[subcat_dir.name] = [
                    f.stem for f in subcat_dir.glob("*.md")
                ]

        return items

    def sync_category(self, category: str, selections: Dict[str, List[str]]) -> bool:
        """Sync selected items from a specific category"""
        if category not in self.config.get("categories", {}):
            print(f"✗ Category '{category}' not found in config")
            return False

        cat_config = self.config["categories"][category]
        source_path = Path(self.temp_dir) / cat_config["path"]
        target_path = self.project_root / cat_config["path"]

        if not source_path.exists():
            print(f"✗ Source path {source_path} does not exist")
            return False

        # Create backup if target exists
        if target_path.exists() and self.config.get("syncOptions", {}).get("backupBeforeSync"):
            self._create_backup(target_path)

        # Sync selected items
        synced_count = 0
        for subcat, items in selections.items():
            source_subcat = source_path / subcat
            target_subcat = target_path / subcat

            if not source_subcat.exists():
                continue

            target_subcat.mkdir(parents=True, exist_ok=True)

            if "all" in items or not items:
                # Sync entire subcategory
                print(f"  Syncing {category}/{subcat}...")
                shutil.rmtree(target_subcat, ignore_errors=True)
                shutil.copytree(source_subcat, target_subcat)
                synced_count += len(list(source_subcat.glob("*.md")))
            else:
                # Sync selected items
                for item in items:
                    source_file = source_subcat / f"{item}.md"
                    if source_file.exists():
                        target_file = target_subcat / f"{item}.md"
                        shutil.copy2(source_file, target_file)
                        synced_count += 1
                        print(f"  ✓ Synced {category}/{subcat}/{item}")

        print(f"✓ Synced {synced_count} files from {category}")
        return True

    def sync_all(self) -> bool:
        """Sync all categories"""
        for category in ["agents", "commands", "skills"]:
            if self.config.get("categories", {}).get(category, {}).get("enabled"):
                available = self.get_available_items(category)
                selections = {subcat: ["all"] for subcat in available.keys()}
                self.sync_category(category, selections)
        return True

    def cleanup(self):
        """Clean up temporary directory"""
        if self.temp_dir and Path(self.temp_dir).exists():
            shutil.rmtree(self.temp_dir)
            print("✓ Cleanup completed")

def main():
    if len(sys.argv) < 2:
        print("Usage: sync_claude_repo.py <central_repo_url> [project_root]")
        sys.exit(1)

    central_repo = sys.argv[1]
    project_root = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()

    try:
        syncer = ClaudeSyncer(central_repo, project_root)
        syncer.clone_central_repo()
        syncer.sync_all()
        syncer.cleanup()
        print("\n✓ Sync completed successfully")
    except Exception as e:
        print(f"\n✗ Sync failed: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
