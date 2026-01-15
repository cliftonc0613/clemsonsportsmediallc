#!/usr/bin/env python3

"""
Presos File Validator

Validates Presos markdown files for common issues:
- YAML frontmatter format
- Slide structure (# for title, ## for content slides)
- Image path references
- Code block syntax
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import List, Tuple, Dict


class PresosValidator:
    """Validates Presos markdown files"""

    def __init__(self, file_path: str, presos_dir: str = None):
        self.file_path = Path(file_path)
        self.presos_dir = Path(presos_dir) if presos_dir else Path.home() / "presos"
        self.errors = []
        self.warnings = []
        self.content = ""
        self.frontmatter = {}

    def validate(self) -> bool:
        """Run all validation checks"""
        if not self.file_path.exists():
            self.errors.append(f"File not found: {self.file_path}")
            return False

        self.content = self.file_path.read_text()

        # Run checks
        self._check_frontmatter()
        self._check_slide_structure()
        self._check_code_blocks()
        self._check_image_paths()
        self._check_file_location()

        return len(self.errors) == 0

    def _check_frontmatter(self):
        """Validate YAML frontmatter"""
        # Match frontmatter between --- markers
        frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', self.content, re.DOTALL)

        if not frontmatter_match:
            self.errors.append("Missing or invalid YAML frontmatter (must be between --- markers)")
            return

        try:
            self.frontmatter = yaml.safe_load(frontmatter_match.group(1))

            # Check required fields
            if 'title' not in self.frontmatter:
                self.errors.append("Frontmatter missing required 'title' field")

            if 'layout' not in self.frontmatter:
                self.warnings.append("Frontmatter missing 'layout' field (will use default)")

            # Validate layout value
            valid_layouts = ['spring', 'plain', 'springio', 'springlarge', 'springone', 'pivotal']
            if 'layout' in self.frontmatter and self.frontmatter['layout'] not in valid_layouts:
                self.warnings.append(
                    f"Unknown layout '{self.frontmatter['layout']}'. "
                    f"Valid options: {', '.join(valid_layouts)}"
                )

        except yaml.YAMLError as e:
            self.errors.append(f"Invalid YAML frontmatter: {e}")

    def _check_slide_structure(self):
        """Validate slide structure (headers)"""
        # Remove frontmatter for analysis
        content_without_frontmatter = re.sub(r'^---\s*\n.*?\n---\s*\n', '', self.content, flags=re.DOTALL)

        # Find all headers
        h1_count = len(re.findall(r'^# (?!#)', content_without_frontmatter, re.MULTILINE))
        h2_count = len(re.findall(r'^## (?!#)', content_without_frontmatter, re.MULTILINE))

        # Check title slide (single #)
        if h1_count == 0:
            self.warnings.append("No title slide found (should have one # header)")
        elif h1_count > 1:
            self.warnings.append(f"Multiple title slides found ({h1_count}). Only one # header expected")

        # Check content slides (##)
        if h2_count == 0:
            self.warnings.append("No content slides found (should have ## headers)")
        elif h2_count < 3:
            self.warnings.append(f"Only {h2_count} content slides found. Presentations typically have more")

        # Check for ### (not supported well in deck.js)
        h3_count = len(re.findall(r'^### ', content_without_frontmatter, re.MULTILINE))
        if h3_count > 0:
            self.warnings.append(
                f"Found {h3_count} ### headers. These may not render as separate slides in deck.js"
            )

    def _check_code_blocks(self):
        """Validate code blocks have language specified"""
        # Find fenced code blocks
        code_blocks = re.findall(r'^```(\w*)\s*\n', self.content, re.MULTILINE)

        for i, lang in enumerate(code_blocks, 1):
            if not lang:
                self.warnings.append(
                    f"Code block #{i} missing language specification (e.g., ```python, ```java)"
                )

    def _check_image_paths(self):
        """Validate image paths exist"""
        # Find markdown image syntax
        md_images = re.findall(r'!\[.*?\]\((.*?)\)', self.content)

        # Find HTML image tags
        html_images = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', self.content)

        all_images = md_images + html_images

        for img_path in all_images:
            # Skip external URLs
            if img_path.startswith(('http://', 'https://', '//')):
                continue

            # Check relative to presos/decks/ directory
            full_path = self.presos_dir / "decks" / img_path

            if not full_path.exists():
                self.errors.append(f"Image not found: {img_path} (expected at {full_path})")

    def _check_file_location(self):
        """Check if file is in correct location"""
        # Should be in presos/decks/ directory
        expected_parent = self.presos_dir / "decks"

        if not str(self.file_path.resolve()).startswith(str(expected_parent)):
            self.warnings.append(
                f"File should be in {expected_parent} directory for Presos to build it"
            )

    def print_results(self):
        """Print validation results"""
        print("\n" + "=" * 60)
        print("  Presos File Validation Results")
        print("=" * 60)
        print(f"\nFile: {self.file_path}")
        print()

        if self.frontmatter:
            print(f"Title: {self.frontmatter.get('title', 'N/A')}")
            print(f"Layout: {self.frontmatter.get('layout', 'default')}")
            print()

        if self.errors:
            print(f"❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"   • {error}")
            print()

        if self.warnings:
            print(f"⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"   • {warning}")
            print()

        if not self.errors and not self.warnings:
            print("✅ All checks passed! File is valid.")
            print()

        if self.errors:
            print("❌ Validation FAILED - fix errors before building")
            return False
        else:
            print("✅ Validation PASSED - ready to build")
            return True


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: validate_presos_file.py <path-to-markdown-file> [presos-directory]")
        print()
        print("Examples:")
        print("  validate_presos_file.py decks/my-talk.md")
        print("  validate_presos_file.py ~/presos/decks/spring-boot.md ~/presos")
        sys.exit(1)

    file_path = sys.argv[1]
    presos_dir = sys.argv[2] if len(sys.argv) > 2 else None

    validator = PresosValidator(file_path, presos_dir)

    if validator.validate():
        validator.print_results()
        sys.exit(0)
    else:
        validator.print_results()
        sys.exit(1)


if __name__ == "__main__":
    main()
