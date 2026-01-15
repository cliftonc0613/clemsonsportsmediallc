---
name: course-creator
description: This skill should be used when creating comprehensive training courses and educational materials. Use for developing instructor guides, student workbooks, session plans, and complete course packages. Ideal for trade schools, corporate training, workshops, and educational programs that need structured, professional course content.
---

# Course Creator Skill

## Overview

This skill enables the creation of professional, complete course packages through a structured conversational process. It guides educators through designing comprehensive modules including instructor notes, student workbooks, session playbooks, and supporting documentation. After gathering all information through dialogue, the skill automatically generates a complete file structure with all documents ready for delivery.

**Key Feature:** All documents are created from proven templates stored in the skill's assets folder and saved directly to `knowledge/published/` for immediate use.

---

## How This Skill Works

### Phase 1: Gather Course Information (Conversational)

Ask questions one at a time in this order, waiting for complete answers before proceeding:

1. **Module/Session Name**
   - "What is the name of this module or session?"
   - Use this name for all filenames

2. **Course Name**
   - "What is the name of the overall course this belongs to?"

3. **Session Duration**
   - "How long will each session be? (e.g., 2 hours, 3 hours, full day)"

4. **Target Audience**
   - "Who is this course designed for? Describe their background and experience level."

5. **Expected Number of Students**
   - "How many students do you expect in each session?"

6. **Instructor Name**
   - "Who will be teaching this session?"

7. **Location/Room**
   - "Where will the session be held?"

8. **Learning Objectives** (ask one at a time)
   - "By the end of this session, what should participants be able to do?"
   - "Any additional learning objectives?"
   - Continue until all objectives are captured

9. **Activities** (ask for each activity)
   - "What is the name of the first activity?"
   - "What problem or challenge will they solve?"
   - "How long should this activity take (in minutes)?"
   - "What is the learning goal?"
   - "What are the step-by-step instructions?" (ask one at a time)
   - "What indicates success?" (ask one at a time for success indicators)
   - "What reflection question should they answer?"
   - "What's a common issue students face with this activity, and how should you address it?"
   - Repeat for each activity

10. **Additional Files/Assets**
    - "Will you be including any additional files with this module? (e.g., slides, templates, reference documents)"
    - This helps set expectations for supplementary materials

### Phase 2: Generate Files (Automatic)

After gathering all information, generate the complete course package:

**The file structure created will be:**

```
knowledge/published/[MODULE_NAME]/
├── README_MANIFEST.md
├── [MODULE_NAME]_INSTRUCTOR_NOTES.md
├── [MODULE_NAME]_STUDENT_HANDOUT.md
├── [MODULE_NAME]_PLAYBOOK.md
└── [MODULE_NAME]_COMPLETE_PACKAGE_GUIDE.md
```

**What each file contains:**

- **README_MANIFEST.md** - Overview of the package, instructions for use, setup timeline, and quick start guide
- **[MODULE_NAME]_INSTRUCTOR_NOTES.md** - Complete teaching guide with scripts, timing, troubleshooting, and detailed activity instructions
- **[MODULE_NAME]_STUDENT_HANDOUT.md** - Interactive workbook for students with activities, reflection questions, and space for work
- **[MODULE_NAME]_PLAYBOOK.md** - One-page quick reference for delivery with timing roadmap and key messages
- **[MODULE_NAME]_COMPLETE_PACKAGE_GUIDE.md** - Comprehensive guide on how to use each document effectively

---

## Assets and Templates

This skill uses proven templates from the `assets/templates/` directory:

- `instructor_notes_template.md` - Framework for complete instructor guides
- `student_handout_template.md` - Student workbook structure
- `session_playbook_template.md` - One-page quick reference format
- `readme_manifest_template.md` - Package overview and instructions

**How templates are used:**
- User answers provide specific content (module name, activities, objectives)
- Templates provide the structure and format
- Python script combines them into complete documents
- All placeholders (like [Module Name], [Activity Name]) are replaced with user-provided information

### Example Assets Structure

The skill includes an example package at `assets/examples/session-1a-example/` showing exactly how a completed package is organized and formatted. Refer to this as a reference for the structure and quality level.

---

## Implementation Process

1. **Ask questions conversationally** - One question at a time, waiting for complete answers
2. **Never overwhelm** - Never ask multiple questions in a single message
3. **Use dynamic naming** - Always ask for the actual module/session name, not fixed numbers
4. **Gather activity details** - Each activity needs problem statement, steps, success indicators, and reflection question
5. **Ask about supplementary files** - Understand if additional assets will be included
6. **Generate complete package** - Run the Python script to create all files from templates
7. **Save to correct location** - Automatically save to `knowledge/published/[MODULE_NAME]/`
8. **Confirm completion** - Show user the file location and structure created

---

## Example Workflow

**User:** "I need to create a course on AI Basics for Teachers"

**You:** "Great! I'll help you create a complete course package. Let's start with the basics. What is the name of this module or session?"

**User:** "AI Fundamentals for Educators"

**You:** "Perfect! AI Fundamentals for Educators will be the name for all the documents. What is the name of the overall course this belongs to?"

**User:** "AI for Teachers"

**You:** "Got it. How long will each session be? (e.g., 2 hours, 3 hours, full day)"

[...continues one question at a time until all information is gathered...]

**You:** [After all information collected]

"Perfect! I have all the information needed. Let me generate your complete course package..."

[Runs the Python script which creates:]
- README_MANIFEST.md
- AI_FUNDAMENTALS_FOR_EDUCATORS_INSTRUCTOR_NOTES.md
- AI_FUNDAMENTALS_FOR_EDUCATORS_STUDENT_HANDOUT.md
- AI_FUNDAMENTALS_FOR_EDUCATORS_PLAYBOOK.md
- AI_FUNDAMENTALS_FOR_EDUCATORS_COMPLETE_PACKAGE_GUIDE.md

**You:** "Your course package has been created! Here's what was generated:

📁 Location: `/Users/cliftoncanady/Web Apps/ai-teachers/knowledge/published/AI_FUNDAMENTALS_FOR_EDUCATORS/`

📦 Files created:
- README_MANIFEST.md - Start here for overview and instructions
- AI_FUNDAMENTALS_FOR_EDUCATORS_INSTRUCTOR_NOTES.md - Complete teaching guide
- AI_FUNDAMENTALS_FOR_EDUCATORS_STUDENT_HANDOUT.md - Student workbook
- AI_FUNDAMENTALS_FOR_EDUCATORS_PLAYBOOK.md - Quick reference guide
- AI_FUNDAMENTALS_FOR_EDUCATORS_COMPLETE_PACKAGE_GUIDE.md - Usage instructions

Next steps:
1. Review the README_MANIFEST for a quick overview
2. Customize the documents as needed
3. Print student handouts (one per student)
4. Print and laminate the Playbook for easy reference during delivery
5. You're ready to teach!"

---

## Key Guidelines

1. **Ask ONE question at a time** - Never ask multiple questions in a single response
2. **Wait for complete answers** - Ensure you understand each response fully before moving to the next question
3. **Use dynamic module names** - Always ask what the user wants to call the module; don't assume a fixed naming scheme
4. **Capture activity details thoroughly** - Each activity needs complete information for quality output
5. **Reference proven templates** - Explain that templates are from proven educational structures
6. **Save to knowledge/published/** - All packages automatically save to the correct location
7. **Document the file structure** - Make it clear what files will be created and where
8. **Ask about supplementary materials** - Understand if additional assets will be included with the package
9. **Provide clear next steps** - After generation, give the user clear instructions on what to do next

---

## Special Considerations

### For Different Course Types

**Technical Courses:**
- Include hands-on practice activities
- Provide troubleshooting guides
- Include backup plans for tech failures

**Soft Skills Courses:**
- Incorporate role-play scenarios
- Include peer feedback components
- Add personal reflection opportunities

**Trade School Programs:**
- Focus on practical skill development
- Include portfolio artifacts
- Emphasize hands-on learning

**Corporate Training:**
- Align with business objectives
- Include measurement of success
- Provide follow-up support guidance

### Adaptations

- The structure (Teach → Build → Showcase) can be customized based on user preference
- Activity timing automatically adjusts based on total session duration
- Success indicators are customized per activity
- Troubleshooting guides reflect the specific content and context

---

## What Users Get

✅ Complete, professionally-formatted course materials
✅ Instructor guide with exact scripts and timing
✅ Student workbook ready to print and distribute
✅ One-page playbook for quick reference during delivery
✅ Comprehensive usage guide
✅ Package manifest with instructions
✅ All files saved to knowledge/published/ for immediate access
✅ Ready-to-deliver materials on day one

---

## Quality Assurance

The generated packages include:
- ✅ Complete timing for all phases
- ✅ Detailed activity instructions
- ✅ Troubleshooting guides
- ✅ Success metrics and indicators
- ✅ Pre-session and post-session checklists
- ✅ Student reflection prompts
- ✅ Portfolio artifacts checklist
- ✅ Backup plans for common issues

---

## Support Materials

This skill includes:
- **Templates** in `assets/templates/` - Proven structures for each document type
- **Examples** in `assets/examples/` - Complete reference packages showing quality level
- **References** in `references/` - Additional templates and strategies
- **Scripts** - Python script that handles all file generation and formatting

