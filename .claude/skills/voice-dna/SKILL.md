---
name: voice-dna
description: This skill should be used when creating or updating a comprehensive voice DNA profile. It guides users through a conversational Q&A process to capture communication style, personality traits, core values, storytelling approach, language patterns, and audience connection methods, then formats all responses into a structured JSON file stored in context/core/voice-dna.json.
---

# Voice DNA Skill

## Purpose

This skill creates or updates a comprehensive voice DNA profile by asking conversational questions about your communication style, personality, values, and how you connect with your audience. The resulting JSON file serves as a single source of truth for your unique voice—helping AI agents, writers, and team members understand and replicate your authentic communication style.

## When to Use This Skill

Use this skill when:
- Creating a detailed profile of your unique voice and communication style
- Updating your voice DNA with new insights or evolved perspectives
- Brief AI agents on your communication preferences and personality
- Ensuring consistency across content created in your voice
- Training AI models or writers to sound authentically like you
- Documenting your personal brand's communication DNA for team members

## How to Use This Skill

### Step 1: Check for Existing Profile
Before starting, determine if a voice DNA profile already exists at `context/core/voice-dna.json`. If it exists, ask the user if they want to:
- Create a completely new voice DNA profile
- Update the existing profile (show existing values and ask if they want to keep/change each field)

### Step 2: Conduct Conversational Interview
Ask the following questions **one at a time** in a conversational manner. Wait for the user's response before proceeding to the next question. Organize questions into logical sections:

#### Personality & Tone Section
1. How would you describe your overall communication tone? (e.g., formal, casual, witty, educational, inspiring)
2. What adjectives best describe your personality when communicating? (List 3-5)
3. What is your default energy level when you communicate? (high-energy, calm, balanced, etc.)
4. How much humor do you incorporate into your communication, and what type? (self-deprecating, sarcasm, observational, etc.)
5. Do you tend to be more vulnerable/personal or professional/reserved? Where's your balance?

#### Core Values & Beliefs Section
6. What core values drive how you communicate?
7. What do you believe about your audience? (potential, intelligence, needs, etc.)
8. What's a belief or conviction you're known for that shows up in your voice?
9. What do you absolutely refuse to compromise on in your communication?

#### Language & Patterns Section
10. What are your signature phrases, catchphrases, or expressions you use frequently?
11. Do you have any patterns in how you structure your thoughts? (e.g., lists, storytelling, analogies)
12. Are there words or phrases you avoid? Why?
13. How do you typically use punctuation? (exclamation points, dashes, ellipses, etc.)
14. Do you use slang, colloquialisms, or industry jargon? Which ones are distinctly "you"?

#### Storytelling & Connection Section
15. How do you typically tell stories? (Linear, with a hook, with lessons learned, etc.)
16. What type of stories resonate most with you? (Personal failures, surprising wins, client transformations, etc.)
17. How do you like to establish credibility—through experience, data, perspective, or something else?
18. What's your stance on vulnerability in communication? (Open, selective, minimal, etc.)
19. How do you make your audience feel? (Inspired, understood, challenged, empowered, entertained, etc.)

#### Audience Connection Section
20. How do you address your audience directly? (First person, questions, direct address, etc.)
21. What's your stance on being "on brand" vs. being authentic and evolving?

### Step 3: Format and Save JSON
After collecting all responses, format the data into the JSON structure shown in the Reference Schema. Include:
- `_instructions`: A brief description of the voice DNA's purpose
- `_metadata`: Created/updated timestamps, version
- All user responses organized by section
- Sections for signature elements and communication guidelines

Save the file to `context/core/voice-dna.json` with proper indentation (2 spaces).

### Step 4: Confirm and Review
After saving, display the created voice DNA profile to the user and ask if they want to make any adjustments.

## Reference Schema

See `references/voice-dna-schema.json` for the complete JSON structure.

## Key Considerations

- **Tone**: Keep the conversation warm and exploratory. Help the user reflect on their authentic voice.
- **Authenticity**: Encourage specific, concrete examples rather than generic answers.
- **Evolution**: Remind users that voice evolves, and this profile can be updated as they grow.
- **Flexibility**: If a user doesn't have an answer, note it as empty string and continue.
- **Metadata**: Always include `created_date` (if new) and `updated_date` for tracking purposes.

## Bundled Resources

- `references/voice-dna-schema.json` - Complete JSON structure template
- `scripts/format_voice_dna.py` - Python script to validate and format JSON
