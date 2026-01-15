#!/usr/bin/env python3
"""
Business Profile Formatter and Validator

This script validates and formats business profile data into a properly structured JSON file.
Usage: python format_profile.py <output_path> <input_data>
"""

import json
import os
from datetime import datetime
from pathlib import Path


def load_schema():
    """Load the business profile schema."""
    schema_path = Path(__file__).parent.parent / "references" / "business-profile-schema.json"
    with open(schema_path, 'r') as f:
        return json.load(f)


def validate_profile(data):
    """
    Basic validation of profile data.
    Returns (is_valid, error_message)
    """
    required_fields = {
        'overview': ['business_name', 'what_you_do'],
        'positioning': ['unique_angle'],
        'offerings': ['free_offerings', 'paid_offerings']
    }

    for section, fields in required_fields.items():
        if section not in data:
            return False, f"Missing section: {section}"
        for field in fields:
            if field not in data[section]:
                return False, f"Missing field: {section}.{field}"

    return True, "Valid"


def merge_with_existing(existing_data, new_data):
    """
    Merge new data with existing profile, only updating changed fields.
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
    Save profile to JSON file with proper formatting.
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
    """Load existing profile if it exists."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python format_profile.py <output_path> [--merge]")
        sys.exit(1)

    output_path = sys.argv[1]
    merge_mode = "--merge" in sys.argv

    # Load schema as template
    schema = load_schema()

    # Check if file exists and merge if requested
    existing = load_existing_profile(output_path)
    if existing and merge_mode:
        print(f"Merging with existing profile at {output_path}")
        # In merge mode, the new data would come from user input
        # For now, we just validate the existing data
        is_valid, msg = validate_profile(existing)
        print(f"Validation: {msg}")
    else:
        # Create new profile from schema
        save_profile(output_path, schema, is_new=True)
        print(f"Profile created at {output_path}")
