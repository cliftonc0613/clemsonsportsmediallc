#!/usr/bin/env python3
"""
Ideal Client Profile (ICP) Formatter and Validator

This script validates and formats ideal client profile data into a properly structured JSON file.
Supports multiple personas in a single file.
Usage: python format_icp.py <output_path> [--merge]
"""

import json
import os
from datetime import datetime
from pathlib import Path


def load_schema():
    """Load the ICP schema."""
    schema_path = Path(__file__).parent.parent / "references" / "icp-schema.json"
    with open(schema_path, 'r') as f:
        return json.load(f)


def validate_persona(persona):
    """
    Basic validation of a single persona.
    Returns (is_valid, error_message)
    """
    required_sections = [
        'persona_name',
        'demographics',
        'psychographics_and_mindset',
        'problems_and_pain_points',
        'goals_and_desired_outcomes',
        'budget_and_decision_making',
        'content_and_communication_preferences',
        'objections_and_hesitations',
        'buying_signals_and_readiness'
    ]

    for section in required_sections:
        if section not in persona:
            return False, f"Missing section in persona: {section}"

    if not persona.get('persona_name'):
        return False, "Persona must have a name"

    return True, "Valid"


def validate_icp_file(data):
    """
    Basic validation of entire ICP file.
    Returns (is_valid, error_message)
    """
    if '_metadata' not in data:
        return False, "Missing metadata section"

    if 'personas' not in data or not isinstance(data['personas'], list):
        return False, "Missing or invalid personas array"

    # Validate each persona
    for idx, persona in enumerate(data['personas']):
        is_valid, msg = validate_persona(persona)
        if not is_valid:
            return False, f"Persona {idx}: {msg}"

    return True, "Valid"


def merge_with_existing(existing_data, new_persona):
    """
    Merge new persona with existing ICP file, adding or updating personas.
    """
    # Find if persona already exists by name or id
    persona_name = new_persona.get('persona_name', '')
    persona_id = new_persona.get('persona_id', '')

    existing_personas = existing_data.get('personas', [])
    updated = False

    for idx, existing_persona in enumerate(existing_personas):
        if (existing_persona.get('persona_name') == persona_name or
            (persona_id and existing_persona.get('persona_id') == persona_id)):
            # Update existing persona
            existing_personas[idx] = new_persona
            updated = True
            break

    if not updated:
        # Add new persona
        existing_personas.append(new_persona)

    # Update metadata
    existing_data['personas'] = existing_personas
    existing_data['_metadata']['updated_date'] = datetime.utcnow().isoformat() + 'Z'
    existing_data['_metadata']['total_personas'] = len(existing_personas)

    return existing_data


def save_icp_file(output_path, icp_data):
    """
    Save ICP file to JSON with proper formatting.
    """
    # Update timestamps
    now = datetime.utcnow().isoformat() + 'Z'
    icp_data['_metadata']['updated_date'] = now

    # Ensure total_personas count is correct
    icp_data['_metadata']['total_personas'] = len(icp_data.get('personas', []))

    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Write with proper formatting
    with open(output_path, 'w') as f:
        json.dump(icp_data, f, indent=2)

    return output_path


def load_existing_icp(path):
    """Load existing ICP file if it exists."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None


def create_empty_icp():
    """Create an empty ICP file from schema."""
    schema = load_schema()
    schema['personas'] = []  # Start with empty personas array
    schema['_metadata']['total_personas'] = 0
    now = datetime.utcnow().isoformat() + 'Z'
    schema['_metadata']['created_date'] = now
    schema['_metadata']['updated_date'] = now
    return schema


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python format_icp.py <output_path> [--merge]")
        sys.exit(1)

    output_path = sys.argv[1]

    # Load or create ICP file
    existing = load_existing_icp(output_path)
    if not existing:
        icp_data = create_empty_icp()
        print(f"Creating new ICP file at {output_path}")
    else:
        icp_data = existing
        print(f"Loaded existing ICP file with {icp_data['_metadata']['total_personas']} persona(s)")

    # Validate and save
    is_valid, msg = validate_icp_file(icp_data)
    if is_valid:
        save_icp_file(output_path, icp_data)
        print(f"ICP file validated and saved successfully")
    else:
        print(f"Validation error: {msg}")
        sys.exit(1)
