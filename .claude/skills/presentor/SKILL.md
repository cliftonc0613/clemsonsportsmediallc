---
name: presentor
description: This skill should be used when creating, editing, or converting presentations using Presos (Jekyll-based presentation framework). Activates for requests like "create presentation about X", "build slides for Y", or "turn this outline into a presentation". Specializes in educational and course materials with a mandatory two-phase workflow: notes approval, then slide generation.
---

# Presentor

## Overview

Generate educational presentations using the Presos framework (Jekyll-based, deck.js-powered slide generator). Follow a structured two-phase workflow: (1) create detailed presentation notes for user approval, (2) generate production-ready Presos markdown slides.

## When to Use This Skill

Trigger this skill when requests involve:

* **Creating presentations**: "Create a presentation about [topic]", "Build slides for [subject]"
* **Content conversion**: "Turn this document into a presentation", "Convert my outline to slides"
* **Editing presentations**: "Update the Presos presentation", "Add slides about [topic]"
* **Format conversion**: "Convert this PowerPoint to Presos", "Transform these notes into slides"

**Key indicator**: Any request involving slide creation, presentation building, or educational material formatting.

## Core Workflow

### Phase 1: Create Presentation Notes Through Conversation (MANDATORY)

Build presentation notes collaboratively through an interactive conversation. This is NOT a single question-and-answer session - it's an ongoing dialogue where you build the presentation structure together with the user.

**IMPORTANT - File Organization**:
Before starting, ensure a `slides/` folder exists for organizing all presentation notes and working files:
```bash
mkdir -p slides
```

All notes and intermediate files should be saved to the `slides/` directory.

#### Conversational Approach

**Start with Open-Ended Questions**

Begin the conversation by understanding the big picture:

* "What topic would you like to create a presentation about?"
* "Who is your audience for this presentation?"
* "How long will this presentation be?"
* "What are the main things you want your audience to learn or take away?"

**Listen and Ask Follow-Up Questions**

Based on their answers, dig deeper:

* "That's interesting - can you tell me more about [specific point they mentioned]?"
* "What level of knowledge does your audience have about [topic]?"
* "Are there any specific examples or use cases you want to include?"
* "Do you have any existing materials or outlines I should work from?"

#### Build Notes Incrementally

**Don't create all slides at once.** Instead, build the presentation structure through conversation:

1. **Start with Metadata**
   - After initial questions, propose: "Based on what you've told me, here's what I'm thinking for the presentation structure..."
   - Show metadata section:
     ```markdown
     # Presentation Notes: [Topic]

     ## Metadata
     - **Title**: [Proposed title based on conversation]
     - **Audience**: [Based on their description]
     - **Duration**: [Time they specified]
     - **Learning Objectives**: [3-5 objectives based on discussion]
     ```
   - Ask: "Does this capture what you're aiming for? Would you like to adjust anything?"

2. **Work on Slide Sections Together**
   - Propose one section at a time: "Let's start with the introduction. I'm thinking we could have:"
     ```markdown
     ### Slide 1: Title Slide
     **Title**: [Topic Name]
     **Content**: Your name, date, context
     **Visual**: None

     ### Slide 2: Why This Matters
     **Title**: Why Learn [Topic]?
     **Content**:
     - Real-world application 1
     - Real-world application 2
     **Visual**: Perhaps a diagram showing use cases?
     ```
   - Ask: "What do you think? Should we add, remove, or change anything here?"

3. **Continue the Dialogue**
   - After they respond, incorporate their feedback and suggest the next section
   - Ask clarifying questions: "For the code examples section, what language would you like to use? Python? JavaScript?"
   - Build on their ideas: "You mentioned [X] - should we dedicate a whole slide to that, or include it as part of [Y]?"
   - Show incremental progress: "Great! So far we have 5 slides planned. Let's work on the hands-on exercise section next..."

4. **Iterate Based on Feedback**
   - If they suggest changes: "Got it - let me update that section..."
   - Show the revised version
   - Ask: "Better? What should we tackle next?"

5. **Check In Regularly**
   - "We're at 12 slides now. How does the flow feel so far?"
   - "Do you want to add more depth to any particular section?"
   - "Should we include more examples, or are we good to move to the conclusion?"

#### Save Work-in-Progress Notes

As you build the presentation through conversation, maintain a notes file that grows incrementally.

**IMPORTANT**: Create a `slides/` folder if it doesn't exist, and save all working files there.

**File**: `slides/[topic]_NOTES.md`

**Before creating the file**, ensure the directory exists:
```bash
mkdir -p slides
```

**Structure** (builds up through conversation):
```markdown
# Presentation Notes: [Topic]

## Metadata
[Agreed upon in early conversation]

## Slide Structure

[Slides added section by section through dialogue]

### Slide 1: [Title]
[Details discussed and agreed upon]

### Slide 2: [Topic]
[Details discussed and agreed upon]

[Continue as slides are developed together...]

## Total Slide Count: [X slides so far]

## Image Requirements
[Updated as slides with visuals are discussed]

## Conversation Notes
- [Track any open questions or items to revisit]
- [Alternative approaches discussed]
```

**File Organization**:
- All notes and working files: `slides/` directory
- Final Presos markdown: `[PRESOS_DIR]/decks/` directory
- Images: `[PRESOS_DIR]/decks/images/` directory

#### Conversational Signals to Watch For

**User wants to move forward:**
- "That looks good"
- "Let's keep going"
- "What's next?"
- "Perfect"

→ Continue building the next section

**User wants to revise:**
- "Actually, can we..."
- "I'd prefer..."
- "What if instead..."
- "Can we add..."

→ Update the current section and show revised version

**User is ready to finalize:**
- "I think we're good"
- "That's everything"
- "Ready to generate the slides"
- "Let's move to the next phase"

→ Show complete notes and ask for final approval

#### Final Approval Step

**CRITICAL**: Only when the user indicates they're satisfied with the notes:

1. **Show the complete notes file** one final time
2. **Summarize what you've built together**:
   - "We've created a [X]-slide presentation covering [main topics]"
   - "It includes [key features like code examples, exercises, diagrams]"
   - "The flow goes: [brief outline of structure]"

3. **Request explicit approval**:
   - "Are you ready for me to generate the actual Presos slides from these notes?"
   - "Once I move to Phase 2, I'll create the markdown file and build the presentation."

4. **Wait for user to say yes**:
   - "Yes, generate the slides"
   - "Looks good, let's do it"
   - "Ready to proceed"

**Do NOT proceed to Phase 2 until user explicitly approves.**

#### Conversational Example Flow

**User**: "Create a presentation about Python functions"

**You**: "Great! Let's build this together. A few questions to get started:
- Who's your audience? Complete beginners, or folks with some programming experience?
- How long do you have for this presentation?
- What are the key things you want them to understand about functions by the end?"

**User**: "Beginners with some basic Python knowledge. It's a 1-hour session. I want them to understand what functions are, how to write them, and when to use them."

**You**: "Perfect! Based on that, here's what I'm thinking for the presentation structure:

```markdown
# Presentation Notes: Python Functions for Beginners

## Metadata
- **Title**: Python Functions: Writing Reusable Code
- **Audience**: Beginners with basic Python knowledge
- **Duration**: 1 hour (60 minutes)
- **Learning Objectives**:
  - Understand what functions are and why they're useful
  - Write functions with parameters and return values
  - Identify when to extract code into functions
```

Does this capture what you're going for? Would you adjust anything about the title or learning objectives?"

**User**: "That's great!"

**You**: "Awesome! Let's start building the slide structure. I'm thinking we kick off with:

```markdown
### Slide 1: Title Slide
**Title**: Python Functions: Writing Reusable Code
**Content**: Your name, date
**Visual**: None

### Slide 2: What We'll Learn Today
**Title**: Learning Objectives
**Content**:
- What functions are and why they matter
- How to write your own functions
- When to use functions in your code
**Visual**: None

### Slide 3: The Problem
**Title**: Why Do We Need Functions?
**Content**: Show repetitive code example
**Visual**: Code block showing the same code repeated 3 times
```

What do you think? Should we start this way, or would you prefer a different opening?"

[Continue conversation, building slides incrementally, incorporating feedback, until user indicates satisfaction]

### Phase 2: Generate Presos Slides (AFTER APPROVAL ONLY)

Once notes are approved, generate the actual Presos markdown file.

#### Step 1: Determine Presos Location

Ask the user (or check environment):
* "Where is your Presos installation located?"
* Default: `~/presos`
* Set `PRESOS_DIR` environment variable if different

#### Step 2: Generate Presos Markdown

Create file in `[PRESOS_DIR]/decks/[topic-name].md` with:

**Frontmatter**:
```yaml
---
title: "[Full Presentation Title]"
layout: spring
---
```

**Title Slide** (single `#`):
```markdown
# [Presentation Title]
Subtitle or Session Details

**Presenter Name**
*Date*
```

**Content Slides** (double `##`):
```markdown
## [Slide Title]

Content with:
* Bullet points
* **Bold emphasis**
* Clear structure

## [Code Example Slide]

Brief explanation.

```python
# Code block with proper syntax highlighting
def example():
    return "result"
```

## [Image Slide]

![Description](images/filename.png)

Supporting text and context.
```

**Guidelines**:
* Use `layout: spring` for educational content (professional, code-friendly)
* Use `##` for each content slide
* Specify language for all code blocks (```python, ```java, etc.)
* Use relative image paths: `images/filename.png`
* Keep slides focused (one concept per slide)
* Include 15-30 slides for 1-hour sessions

#### Step 3: Handle Images

For any images referenced:

**Option A**: If images exist elsewhere
* Copy to `[PRESOS_DIR]/decks/images/[filename].png`
* Verify paths match references in markdown

**Option B**: If images need creation
* Document what images are needed
* Provide descriptions for user to create/provide
* Use placeholder text: `![Placeholder: [description]](images/[filename].png)`

#### Step 4: Validate Generated File

Run validation script:

```bash
python scripts/validate_presos_file.py [PRESOS_DIR]/decks/[topic-name].md [PRESOS_DIR]
```

Fix any errors reported:
* YAML frontmatter issues
* Missing language specifications on code blocks
* Invalid image paths
* Incorrect slide structure

#### Step 5: Build Presentation

Run build script:

```bash
bash scripts/build_presentation.sh --open [PRESOS_DIR]/decks/[topic-name].md
```

This will:
* Verify Presos installation
* Check Jekyll/Bundler dependencies
* Build the presentation
* Open in browser (if `--open` flag used)

**Provide user with**:
* File location: `[PRESOS_DIR]/decks/[topic-name].md`
* Generated HTML: `[PRESOS_DIR]/_site/decks/[topic-name].html`
* Viewing URL: `file://[PRESOS_DIR]/_site/decks/[topic-name].html`

## Editing Existing Presentations

### Workflow for Edits

1. **Read existing file**: `Read [PRESOS_DIR]/decks/[filename].md`
2. **Clarify changes**: Ask user what they want to modify
3. **Make edits**: Update the markdown file
4. **Validate**: Run validation script
5. **Rebuild**: Run build script to regenerate HTML
6. **Confirm**: Provide updated file location

### Common Edit Types

**Adding slides**:
* Insert new `##` section at appropriate location
* Maintain consistent formatting with existing slides

**Updating content**:
* Edit text, code blocks, or images within existing slides
* Preserve slide structure (title, content, visuals)

**Reordering slides**:
* Move `##` sections in the markdown file
* Update any cross-references

**Changing layout/theme**:
* Modify frontmatter `layout:` field
* Rebuild to see changes

## Converting from Other Formats

### From PowerPoint/PDF

1. **Extract content**: Ask user to provide text outline or key points
2. **Create notes first**: Follow Phase 1 workflow
3. **After approval**: Generate Presos slides (Phase 2)
4. **Handle images**:
   * Request image files separately
   * Copy to `decks/images/` directory
   * Reference in markdown

### From Documents/Outlines

1. **Read source**: Use Read tool to load existing content
2. **Analyze structure**: Identify main sections, topics, examples
3. **Create notes**: Transform into presentation notes format
4. **Get approval**: Show notes before generating slides
5. **Generate slides**: Follow Phase 2 workflow

### From Existing Markdown

1. **Read source**: Load existing markdown file
2. **Assess format**: Determine how close it is to Presos format
3. **Transform**:
   * Add/fix YAML frontmatter
   * Convert headers to `#` (title) and `##` (slides)
   * Add syntax highlighting to code blocks
   * Fix image paths
4. **Validate and build**: Run scripts

## Using Bundled Resources

### Templates (assets/)

Two templates available for different use cases:

**template_educational.md**: Single-session presentations
* Use for: Lectures, workshops, standalone talks
* Structure: Learning objectives → concepts → examples → exercises → Q&A
* Customize: Replace placeholder content with actual material

**template_multi_session.md**: Multi-session course materials
* Use for: Course series, training programs, multi-week workshops
* Structure: Progress tracking → recap → new content → exercises → preview
* Features: Session numbering, course trajectory, portfolio connections

**How to use templates**:
1. Copy appropriate template to working directory
2. Rename to match your topic
3. Replace all bracketed placeholders `[like this]`
4. Customize sections to match your content
5. Follow Phase 1 workflow (notes) using template structure

### Syntax Reference (references/)

**presos_syntax_guide.md**: Complete Presos markdown reference
* Consult for: Frontmatter format, code blocks, image syntax, tables, HTML integration
* When to read: Complex formatting needs, troubleshooting rendering issues
* Key sections: Slide structure, code blocks, images, best practices

**layout_reference.md**: Layout and theme options
* Consult for: Choosing appropriate layout, understanding themes
* Recommended layout: `spring` for educational content
* When to use others: Large venues (`springlarge`), custom styling (`plain`)

**Best practice**: Reference these guides when:
* User requests specific formatting
* Troubleshooting validation errors
* Implementing advanced features (tables, custom HTML, icons)

### Scripts (scripts/)

**validate_presos_file.py**: Validate Presos markdown before building

Usage:
```bash
python scripts/validate_presos_file.py [path-to-markdown] [presos-dir]
```

Checks:
* YAML frontmatter format and required fields
* Slide structure (# for title, ## for content)
* Code blocks have language specified
* Image paths exist
* File is in correct location

**build_presentation.sh**: Build and serve Presos presentations

Usage:
```bash
# Build only
bash scripts/build_presentation.sh --build [markdown-file]

# Build and serve with auto-reload
bash scripts/build_presentation.sh --serve [markdown-file]

# Build and open in browser
bash scripts/build_presentation.sh --open [markdown-file]
```

Environment:
* Set `PRESOS_DIR` if not using `~/presos`
* Script checks for Jekyll/Bundler dependencies
* Provides helpful error messages

## Best Practices

### Content Guidelines

1. **One concept per slide** - Don't overcrowd slides
2. **Visual hierarchy** - Use headers, bullets, emphasis appropriately
3. **Code examples** - Keep short, focused, commented
4. **Images** - Use diagrams to clarify complex concepts
5. **Consistency** - Maintain formatting patterns throughout

### Technical Guidelines

1. **Always specify code languages** - Enables syntax highlighting
2. **Use relative image paths** - `images/file.png` not absolute paths
3. **Test in browser** - Verify rendering before presenting
4. **Validate before building** - Catch errors early
5. **Keep source files organized** - One presentation per file

### Educational Content Best Practices

1. **Start with learning objectives** - Clear, measurable outcomes
2. **Include examples** - Concrete demonstrations of concepts
3. **Provide hands-on exercises** - Active learning opportunities
4. **Add review/Q&A slides** - Recap and address questions
5. **Preview next session** - Build continuity in course series

### File Naming

* Use lowercase with hyphens: `spring-boot-intro.md`
* Be descriptive: `ml-fundamentals-session-3.md`
* Avoid special characters and spaces
* Include session numbers for courses: `ai-course-week-01.md`

## Troubleshooting

### Validation Errors

**Error**: "Missing YAML frontmatter"
* **Fix**: Add `---` markers with `title:` and `layout:` fields

**Error**: "No title slide found"
* **Fix**: Ensure first content has single `#` header

**Error**: "Code block missing language"
* **Fix**: Change ` ``` ` to ` ```python ` (or appropriate language)

**Error**: "Image not found"
* **Fix**: Verify image exists in `decks/images/` directory

### Build Errors

**Error**: "Presos directory not found"
* **Fix**: Set correct `PRESOS_DIR` or install Presos

**Error**: "Bundler not installed"
* **Fix**: Run `gem install bundler`

**Error**: "Jekyll build failed"
* **Fix**: Check Jekyll output for syntax errors in markdown

### Rendering Issues

**Issue**: Slides not separating correctly
* **Fix**: Ensure `##` headers have proper spacing

**Issue**: Code not highlighted
* **Fix**: Verify language specification in code fence

**Issue**: Images not showing
* **Fix**: Check file path, extension, and existence

## Example Workflow

### Complete Example: Creating Educational Presentation (Conversational Approach)

**User Request**: "Create a presentation about Python functions for beginners"

**Phase 1: Conversational Notes Building**

**You**: "Great! Let's build this presentation together. A few questions to start:
- Who's your audience? Complete beginners to programming, or folks with some basic Python knowledge?
- How long is this presentation?
- What are the key things you want them to walk away understanding?"

**User**: "They have basic Python knowledge - variables, loops, conditionals. It's a 1-hour session. I want them to understand what functions are, how to write them, and when to use them."

**You**: "Perfect! Based on that, here's what I'm thinking for the metadata:

```markdown
# Presentation Notes: Python Functions for Beginners

## Metadata
- **Title**: Python Functions: Writing Reusable Code
- **Audience**: Beginners with basic Python knowledge (variables, loops, conditionals)
- **Duration**: 1 hour (60 minutes)
- **Learning Objectives**:
  - Understand what functions are and why they're useful
  - Write functions with parameters and return values
  - Identify when to extract code into functions
```

Does this capture your vision? Any adjustments to the title or objectives?"

**User**: "Love it!"

**You**: "Awesome! Let's start building the slides. I think we should open with:

```markdown
### Slide 1: Title Slide
**Title**: Python Functions: Writing Reusable Code
**Content**: Your name, date
**Visual**: None

### Slide 2: Learning Objectives
**Title**: What We'll Learn Today
**Content**:
- What functions are and why they matter
- How to write your own functions
- When to use functions in your code
**Visual**: None

### Slide 3: The Problem - Repetitive Code
**Title**: Why Do We Need Functions?
**Content**: Show a code example with the same logic repeated 3 times
**Visual**: Code block showing repetitive greeting code
**Code**:
```python
print("Hello, Alice!")
print("Welcome to Python!")
print("---")

print("Hello, Bob!")
print("Welcome to Python!")
print("---")

print("Hello, Carol!")
print("Welcome to Python!")
print("---")
```
```

How does this opening feel? Should we start differently?"

**User**: "Perfect start!"

**You**: "Great! Now let's tackle the core concept. I'm thinking:

```markdown
### Slide 4: Introducing Functions
**Title**: What is a Function?
**Content**:
- A reusable block of code
- Runs only when called
- Can accept inputs (parameters)
- Can return outputs
**Visual**: Simple diagram showing function concept (box with input → process → output)

### Slide 5: Function Syntax
**Title**: How to Write a Function
**Content**: Basic function structure
**Visual**: Code example with annotations
**Code**:
```python
def greet_user(name):        # Function definition
    message = f"Hello, {name}!"
    print(message)
    print("Welcome to Python!")

greet_user("Alice")          # Function call
```
```

What do you think? Should I add more detail here, or is this the right level?"

**User**: "Add a slide about return values - that's usually where they get confused."

**You**: "Great point! Let me add that:

```markdown
### Slide 6: Return Values
**Title**: Functions That Give Back Results
**Content**: Difference between print and return
**Visual**: Side-by-side code comparison
**Code**:
```python
# This prints but returns None
def greet_v1(name):
    print(f"Hello, {name}!")

# This returns a value we can use
def greet_v2(name):
    return f"Hello, {name}!"

# Now we can store and reuse it
message = greet_v2("Alice")
print(message)
print(message.upper())
```
```

Better? We're at 6 slides so far. Should we do hands-on exercises next, or more examples?"

**User**: "Let's do one more example with multiple parameters, then exercises."

**You**: "Got it! Adding:

```markdown
### Slide 7: Functions with Multiple Parameters
**Title**: Passing Multiple Inputs
**Content**: Functions can take multiple arguments
**Visual**: Code example
**Code**:
```python
def calculate_area(length, width):
    area = length * width
    return area

room_area = calculate_area(10, 12)
print(f"Room area: {room_area} sq ft")
```
```

Now for the hands-on part - what kind of exercise did you have in mind?"

**User**: "Have them write a function that calculates the average of three numbers."

**You**: "Perfect! Here's the exercise slide:

```markdown
### Slide 8: Hands-On Exercise
**Title**: Try It Yourself!
**Content**: Write a function called `calculate_average` that:
- Takes three numbers as parameters
- Returns their average
- Test it with: calculate_average(80, 90, 85)
**Visual**: None (students will code)

Time: 10 minutes
```

We're at 8 slides, about 30 minutes into the presentation. Should we add review, more examples, or wrap up with best practices?"

**User**: "Add a slide about when to use functions, then review and Q&A."

**You**: "Perfect! Adding those:

```markdown
### Slide 9: When to Use Functions
**Title**: Knowing When to Write a Function
**Content**:
- You're repeating the same code
- Code needs to be reusable
- You want to break complex code into smaller pieces
- You want to give a name to what the code does
**Visual**: Before/after code example showing refactoring

### Slide 10: Review
**Title**: What We Learned
**Content**:
- ✓ What functions are (reusable code blocks)
- ✓ How to write them (def, parameters, return)
- ✓ When to use them (avoid repetition, improve clarity)
**Visual**: None

### Slide 11: Q&A
**Title**: Questions?
**Content**: Your contact info, office hours
**Visual**: None
```

That's 11 slides total for a 1-hour session. Does this feel complete, or should we add anything else?"

**User**: "That's perfect! Let's generate the slides."

**You**: "Excellent! Let me save these notes to the slides folder first:

[Create `slides/` directory if it doesn't exist]
[Save complete notes to `slides/python-functions-intro_NOTES.md`]

Here's what we built together:

```
slides/python-functions-intro_NOTES.md
```

We have an 11-slide presentation covering:
- Opening with the problem (repetitive code)
- Core concepts (what functions are, syntax, return values)
- Multiple parameters example
- Hands-on exercise
- When to use functions
- Review and Q&A

Ready for me to generate the actual Presos slides from these notes?"

**User**: "Yes, generate them!"

**Phase 2: Generate Presos Slides**

**You**: [Now proceed with Phase 2]

1. **Ensure slides folder exists**: Run `mkdir -p slides` (already done)
2. **Determine Presos location**: Ask about `~/presos` or get PRESOS_DIR
3. **Generate markdown file**: Create `~/presos/decks/python-functions-intro.md`
   - Add frontmatter with `layout: spring`
   - Convert notes from `slides/python-functions-intro_NOTES.md` to proper Presos format
   - Include all code blocks with `python` syntax highlighting
4. **Validate**: Run `python scripts/validate_presos_file.py ~/presos/decks/python-functions-intro.md`
5. **Build**: Run `bash scripts/build_presentation.sh --open ~/presos/decks/python-functions-intro.md`
6. **Deliver**:
   - "Your presentation is ready!"
   - "Notes: slides/python-functions-intro_NOTES.md"
   - "Presos source: ~/presos/decks/python-functions-intro.md"
   - "View at: file://~/presos/_site/decks/python-functions-intro.html"
   - "The server is running at http://localhost:4000 if you used --serve"

## Summary

**Key Principles**:
* Two-phase workflow: Conversational Notes → Approval → Slides
* **Phase 1 is conversational**: Build notes through back-and-forth dialogue, not all at once
* Ask questions, listen to responses, iterate on slides incrementally
* Show progress regularly and ask for feedback
* Always get explicit approval before generating slides
* Use templates for consistent structure (when helpful)
* Validate before building
* Test in browser before delivering

**File Locations**:
* Notes and working files: `slides/[topic]_NOTES.md`
* Presos source: `[PRESOS_DIR]/decks/[topic].md`
* Images: `[PRESOS_DIR]/decks/images/`
* Generated HTML: `[PRESOS_DIR]/_site/decks/[topic].html`

**Directory Setup**:
* Always create `slides/` folder first: `mkdir -p slides`
* Save all notes and intermediate files to `slides/`
* Keep working directory organized

**Success Criteria**:
* User reviews and approves notes before slide generation
* Generated Presos file passes validation
* Presentation builds successfully with Jekyll
* Slides render correctly in browser
* User can navigate and present effectively
