# Course Creator Skill

This skill helps educators create comprehensive, professional training courses through a conversational, question-by-question approach. It automatically generates a complete course package with all necessary materials ready for immediate use.

## How It Works

The Course Creator skill follows a proven 2-phase process:

### Phase 1: Conversational Gathering
- Asks one question at a time about course content, audience, and structure
- Never overwhelms with multiple questions
- Waits for complete answers before proceeding
- Asks for the actual module name, not fixed numbers
- Gathers detailed information about activities, learning objectives, and supplementary files

### Phase 2: Automatic File Generation
- Uses proven templates from the skill's assets folder
- Generates a complete course package with 5 files
- Saves everything to `knowledge/published/[MODULE_NAME]/`
- Creates ready-to-teach materials

## Generated Package Contents

Each course package includes:

1. **README_MANIFEST.md** - Overview of the package, instructions for use, and quick start guide
2. **[MODULE_NAME]_INSTRUCTOR_NOTES.md** - Complete teaching guide with scripts, timing, and troubleshooting
3. **[MODULE_NAME]_STUDENT_HANDOUT.md** - Interactive workbook with activities and reflection questions
4. **[MODULE_NAME]_PLAYBOOK.md** - One-page quick reference for delivery
5. **[MODULE_NAME]_COMPLETE_PACKAGE_GUIDE.md** - Comprehensive usage instructions

## Key Features

- **Templates-Based**: Uses proven structures from successful educational programs
- **Dynamic Naming**: All files use the actual module name you provide
- **Automatic Organization**: Files saved directly to `knowledge/published/`
- **Complete Packages**: Every course includes all necessary materials
- **Flexible**: Adapts to any subject, audience, or session format
- **Practical**: Includes timing, materials lists, troubleshooting, and success metrics
- **Ready-to-Deliver**: Materials are professionally formatted and immediately usable

## When to Use This Skill

Use when creating:
- Trade school courses
- Corporate training materials
- Workshop content
- Educational session plans
- Instructor guides
- Student workbooks
- Complete course packages

## Example Usage

```
User: I need to create a course on data visualization

Course Creator: Great! I'll help you create a complete course package.
                What is the name of this module or session?

User: Data Visualization Fundamentals

Course Creator: Perfect! Data Visualization Fundamentals will be used in
                all the documents. What is the name of the overall course
                this belongs to?

[...continues one question at a time...]

Course Creator: [After gathering all information]
                Your complete course package has been created!

                📁 Location: knowledge/published/DATA_VISUALIZATION_FUNDAMENTALS/

                📦 Files created:
                - README_MANIFEST.md
                - DATA_VISUALIZATION_FUNDAMENTALS_INSTRUCTOR_NOTES.md
                - DATA_VISUALIZATION_FUNDAMENTALS_STUDENT_HANDOUT.md
                - DATA_VISUALIZATION_FUNDAMENTALS_PLAYBOOK.md
                - DATA_VISUALIZATION_FUNDAMENTALS_COMPLETE_PACKAGE_GUIDE.md
```

## What's Included

This skill comes with:
- **Templates** - Proven structures for each document type
- **Examples** - Reference packages showing the quality and format
- **Python Script** - Handles all file generation and formatting
- **Assets** - Reusable materials and supporting documentation

## Quick Start

1. Activate the skill
2. Answer questions as they come, one at a time
3. Provide detailed information about activities and objectives
4. Mention any supplementary files you'll include
5. Files are automatically generated and saved to `knowledge/published/`
6. Review and customize as needed

## Generated File Structure

```
knowledge/published/[MODULE_NAME]/
├── README_MANIFEST.md
├── [MODULE_NAME]_INSTRUCTOR_NOTES.md
├── [MODULE_NAME]_STUDENT_HANDOUT.md
├── [MODULE_NAME]_PLAYBOOK.md
└── [MODULE_NAME]_COMPLETE_PACKAGE_GUIDE.md
```

Each file serves a specific purpose:
- **Manifest** - Overview and instructions
- **Instructor Notes** - Complete teaching guide with scripts
- **Student Handout** - Workbook for participants
- **Playbook** - Quick reference during delivery
- **Package Guide** - How to use each document

## Quality Assurance

Generated packages include:
- Complete timing for all phases
- Detailed activity instructions with step-by-step guidance
- Troubleshooting guides for common issues
- Success metrics and indicators
- Pre-session and post-session checklists
- Student reflection prompts
- Portfolio artifacts checklist
- Backup plans for common constraints

## Next Steps After Generation

1. Review the README_MANIFEST for a quick overview
2. Customize the documents as needed for your context
3. Print student handouts (one per student)
4. Print and laminate the Playbook for easy reference
5. Gather any supplementary files you mentioned
6. You're ready to deliver!

## Questions?

Refer to the README_MANIFEST included in your generated package for complete instructions on how to use each document and prepare for your session.
