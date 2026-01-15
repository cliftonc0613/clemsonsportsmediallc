#!/usr/bin/env python3
"""
Voice DNA Formatter and Validator

This script validates and formats voice DNA profile data into a properly structured JSON file.
Usage: python format_voice_dna.py <output_path> [--merge]
"""

import json
import os
from datetime import datetime
from pathlib import Path


def load_schema():
    """Load the voice DNA schema."""
    schema_path = Path(__file__).parent.parent / "references" / "voice-dna-schema.json"
    with open(schema_path, 'r') as f:
        return json.load(f)


def validate_profile(data):
    """
    Basic validation of voice DNA profile data.
    Returns (is_valid, error_message)
    """
    required_sections = [
        'personality_and_tone',
        'core_values_and_beliefs',
        'language_and_patterns',
        'storytelling_and_connection',
        'audience_connection',
        'communication_guidelines'
    ]

    for section in required_sections:
        if section not in data:
            return False, f"Missing section: {section}"

    # Check for metadata
    if '_metadata' not in data:
        return False, "Missing metadata section"

    return True, "Valid"


def merge_with_existing(existing_data, new_data):
    """
    Merge new data with existing voice DNA profile, only updating changed fields.
    """
    def deep_merge(existing, new):
        result = existing.copy()
        for key, value in new.items():
            if key.startswith('_'):
                # Skip metadata fields during merge
                continue
            if isinstance(value, dict) and key in result and isinstance(result[key], dict):
                result[key] = deep_merge(result[key], value)
            elif value or value == "":  # Allow empty strings but skip None
                result[key] = value
        return result

    # Preserve metadata
    merged = deep_merge(existing_data, new_data)
    merged['_metadata']['updated_date'] = datetime.utcnow().isoformat() + 'Z'

    return merged


def save_profile(output_path, profile_data, is_new=True):
    """
    Save voice DNA profile to JSON file with proper formatting.
    """
    # Set timestamps
    now = datetime.utcnow().isoformat() + 'Z'
    if is_new:
        profile_data['_metadata']['created_date'] = now
    profile_data['_metadata']['updated_date'] = now

    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Write with proper formatting
    with open(output_path, 'w') as f:
        json.dump(profile_data, f, indent=2)

    return output_path


def load_existing_profile(path):
    """Load existing voice DNA profile if it exists."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python format_voice_dna.py <output_path> [--merge]")
        sys.exit(1)

    output_path = sys.argv[1]
    merge_mode = "--merge" in sys.argv

    # Load schema as template
    schema = load_schema()

    # Check if file exists and merge if requested
    existing = load_existing_profile(output_path)
    if existing and merge_mode:
        print(f"Merging with existing voice DNA profile at {output_path}")
        # In merge mode, the new data would come from user input
        # For now, we just validate the existing data
        is_valid, msg = validate_profile(existing)
        print(f"Validation: {msg}")
    else:
        # Create new profile from schema
        save_profile(output_path, schema, is_new=True)
        print(f"Voice DNA profile created at {output_path}")
