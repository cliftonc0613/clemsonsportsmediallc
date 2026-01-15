---
name: ideal-client-profile
description: This skill should be used when creating or updating ideal client personas (ICPs). It guides users through a conversational Q&A process to capture demographics, psychographics, pain points, goals, budget, decision-making process, objections, content preferences, and buying signals, then formats all responses into a structured JSON file stored in context/core/icp.json supporting multiple personas.
---

# Ideal Client Profile (ICP) Skill

## Purpose

This skill creates or updates comprehensive ideal client personas by asking conversational questions about who your best customers are, what they struggle with, what they want, and how they make decisions. The resulting JSON file serves as a single source of truth for your target audience—helping with marketing messaging, sales targeting, product development, and content strategy.

## When to Use This Skill

Use this skill when:
- Creating detailed profiles of your ideal customers or client personas
- Updating existing client personas with new market insights
- Defining who to target in marketing campaigns
- Aligning sales and marketing messaging
- Guiding product development and feature prioritization
- Creating content that resonates with your target audience
- Improving customer targeting and segmentation
- Understanding customer journey and decision-making process

## How to Use This Skill

### Step 1: Check for Existing Profiles
Before starting, determine if an ICP file already exists at `context/core/icp.json`. If it exists, ask the user if they want to:
- Create a new client persona (add to existing file)
- Update an existing persona (show existing values and ask if they want to keep/change each field)
- View all existing personas

### Step 2: Get Persona Name
Ask the user: "What would you like to name this client persona?" (e.g., "Startup Founder", "Enterprise Manager", "Solopreneur", etc.)

### Step 3: Conduct Conversational Interview
Ask the following questions **one at a time** in a conversational manner. Wait for the user's response before proceeding to the next question. Organize questions into logical sections:

#### Demographics Section
1. What is their age range?
2. What industry or industries do they work in?
3. What is their company size (solo, startup, SMB, enterprise)?
4. What is their job title or role?
5. What is their location or geography? (global, specific countries/regions, remote, etc.)
6. What is their income/revenue level?

#### Psychographics & Mindset Section
7. What are their core values and beliefs?
8. What is their mindset or philosophy about [your industry/solution]?
9. What aspirations or ambitions drive them?
10. What are their fears or anxieties?
11. How would they describe their ideal future state?

#### Problems & Pain Points Section
12. What are their top 3-5 pain points or challenges?
13. How much does this problem cost them (time, money, opportunity, morale)?
14. What have they already tried to solve this problem?
15. Why haven't those solutions worked?

#### Goals & Desired Outcomes Section
16. What is their primary goal or desired outcome?
17. What success looks like for them (metrics, feelings, results)?
18. What are their secondary goals?
19. What is their timeline for solving this problem?

#### Budget & Decision Making Section
20. What is their budget range for solutions?
21. Who is involved in the buying decision? (decision maker, influencer, gatekeeper, etc.)
22. What is their decision-making process? (How do they evaluate options?)
23. How long is their typical sales/decision cycle?

#### Content & Communication Preferences Section
24. How do they prefer to consume information? (video, podcasts, articles, webinars, etc.)
25. Where do they spend time online? (LinkedIn, Reddit, Twitter, industry forums, etc.)
26. What publications, blogs, or influencers do they follow?
27. How do they discover new solutions or vendors?

#### Objections & Hesitations Section
28. What are their common objections or hesitations?
29. What would disqualify a solution in their eyes?
30. What are their biggest concerns about change or trying something new?

#### Buying Signals & Readiness Section
31. What signals indicate they're ready to buy?
32. What would make them choose you over competitors?
33. What are deal-breakers for them?

### Step 4: Format and Save JSON
After collecting all responses, format the data into the JSON structure shown in the Reference Schema. Include:
- `_instructions`: A brief description of the file's purpose
- `_metadata`: Created/updated timestamps, version
- A `personas` array containing all client personas
- Each persona organized by section

Save the file to `context/core/icp.json` with proper indentation (2 spaces).

### Step 5: Confirm and Review
After saving, display the created/updated ICP file to the user and ask if they want to make any adjustments or add additional personas.

## Reference Schema

See `references/icp-schema.json` for the complete JSON structure.

## Key Considerations

- **Tone**: Keep the conversation exploratory and insightful. Help users think deeply about their ideal customers.
- **Specificity**: Encourage concrete, detailed answers rather than generic ones.
- **Multiple Personas**: Users may have 2-3 ideal client types. Support adding multiple personas to the same file.
- **Flexibility**: If a user doesn't have an answer, note it as empty string and continue.
- **Real Data**: Encourage users to base answers on real customers they love working with.
- **Metadata**: Always include `created_date` (if new), `updated_date`, and persona version tracking.

## Bundled Resources

- `references/icp-schema.json` - Complete JSON structure template
- `scripts/format_icp.py` - Python script to validate and format JSON
