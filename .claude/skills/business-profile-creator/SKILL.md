---
name: business-profile-creator
description: This skill should be used when creating or updating a comprehensive business profile. It guides users through a conversational Q&A process to capture business overview, positioning, offerings, audience, and operations, then formats all responses into a structured JSON file stored in context/core/business-profile.json.
---

# Business Profile Creator Skill

## Purpose

This skill creates or updates a comprehensive business profile by asking conversational questions about your business, services, positioning, and operations. All responses are formatted into a structured JSON file that serves as a single source of truth for your business information.

## When to Use This Skill

Use this skill when:
- Creating a new business profile from scratch
- Updating an existing business profile with new or revised information
- Documenting your business positioning and offerings for AI agents, team members, or external stakeholders
- Preparing information for marketing, sales, or strategic planning

## How to Use This Skill

### Step 1: Check for Existing Profile
Before starting, determine if a business profile already exists at `context/core/business-profile.json`. If it exists, ask the user if they want to:
- Create a completely new profile
- Update the existing profile (show existing values and ask if they want to keep/change each field)

### Step 2: Conduct Conversational Interview
Ask the following questions **one at a time** in a conversational manner. Wait for the user's response before proceeding to the next question. Organize questions into logical sections:

#### Overview Section
1. What is your business name?
2. In one sentence, what do you do?
3. Who do you serve (target audience/ideal customer)?
4. What is the primary transformation or change you create for people?
5. What is your business mission (why it exists)?
6. What is your vision (where you're heading)?

#### Positioning Section
7. What is your unique angle or perspective?
8. What makes you different from competitors or alternatives? (List 3-5 key differentiators)
9. What is your core philosophy or belief that drives your work?
10. What is your methodology or approach (how you do what you do)?
11. What problem are you solving?
12. What is your core value proposition?

#### Offerings Section
13. What free offerings or content do you provide? (Get name, description, where to get it)
14. What paid offerings do you sell? (Get name, description, pricing model, where to get it)
15. What are your service delivery methods? (e.g., courses, consulting, software, community, etc.)

#### Audience & Market Section
16. What are the key pain points your audience faces?
17. What outcomes or results do your customers expect?
18. What stage are your ideal customers at in their journey?

#### Operations Section
19. What is your team size or organizational structure?
20. Are there any key metrics or KPIs you track?

### Step 3: Format and Save JSON
After collecting all responses, format the data into the JSON structure shown in the Reference Schema. Include:
- `_instructions`: A brief description of the profile's purpose
- `_metadata`: Created/updated timestamps, version
- All user responses organized by section
- Empty arrays/objects for free and paid offerings to maintain structure

Save the file to `context/core/business-profile.json` with proper indentation (2 spaces).

### Step 4: Confirm and Review
After saving, display the created profile to the user and ask if they want to make any adjustments.

## Reference Schema

See `references/business-profile-schema.json` for the complete JSON structure.

## Key Considerations

- **Tone**: Keep the conversation natural and encouraging. Explain why each question matters.
- **Flexibility**: If a user doesn't have an answer to a question, note it as empty string or null and continue.
- **Updates**: When updating an existing profile, only modify fields the user explicitly changes.
- **Metadata**: Always include `created_date` (if new) and `updated_date` for tracking purposes.

## Bundled Resources

- `references/business-profile-schema.json` - Complete JSON structure template
- `scripts/format_profile.py` - Python script to validate and format JSON (optional, for robust validation)
