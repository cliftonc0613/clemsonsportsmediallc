---
name: vita-creator
description: Conversational skill to create a comprehensive curriculum vitae (CV) through guided question-based interviews. Collects professional experience, education, publications, skills, awards, and other relevant qualifications. Builds well-organized, detailed vitas for academic, research, and professional contexts. Use when a user wants to create or update their vita through a natural, dialogue-based process.
---

# Vita Creator

## Overview

This skill guides users through building a comprehensive curriculum vitae through conversational, targeted questions. Rather than presenting a blank form, it engages in natural dialogue to gather information about professional background, experience, education, publications, and achievements.

The conversational approach adapts based on responses—asking deeper follow-up questions about relevant areas while skipping inapplicable sections. The final vita follows professional academic/research conventions with clear sections and chronological organization.

## Workflow: Conversational Vita Interview

The vita creation follows a structured conversational flow:

### 1. Opening & Orientation
Start by introducing yourself and asking what type of vita they need (academic, industry, research, teaching-focused, etc.). This context shapes which sections to emphasize and what types of questions to ask.

**Conversational opener:**
"I'd like to help you build your vita! To get started, could you tell me a bit about your professional context? For example, are you in academia, industry, research, or another field? And what's the primary purpose of this vita—is it for a job application, promotion, grant funding, or something else?"

### 2. Personal & Professional Summary
Gather basic contact information and a professional summary if appropriate for their field.

**Questions to ask:**
- "What's your current title or position?"
- "How would you describe your professional focus or specialty?"
- "Do you want to include a brief professional summary or statement at the top of your vita?"

### 3. Education (Conversational)
Rather than asking for all degrees at once, ask about highest degree first, then work backward.

**Opening question:**
"Let's start with your education. What's the highest degree you've earned?"

**Follow-ups (adapt based on answer):**
- "What field was that in?"
- "What was your graduation year?"
- "Do you want to include your GPA, honors (like Summa Cum Laude), dissertation title, or advisor names?"
- "Do you have other degrees you'd like to include?"

### 4. Professional Experience (Conversational)
Ask about current/most recent position first, then work backward. Dig into specific achievements.

**Opening question:**
"Tell me about your current position or most recent role. What's your title and where do you work?"

**Follow-ups (ask naturally):**
- "How long have you been in this role?"
- "What are some of your key responsibilities or achievements?"
- "Any awards, recognitions, or significant projects you want to highlight?"
- "Do you have other positions you'd like to include?"

**Tip:** When they mention teaching, research, consulting, or special projects, ask follow-up questions to capture details that strengthen their vita.

### 5. Publications & Scholarly Work
Only ask if relevant to their field. Pay attention to whether they mention any publications and ask for details.

**Opening (if academic/research field):**
"Do you have publications or research work you'd like to include? This could be peer-reviewed articles, chapters, preprints, or other scholarly contributions."

**Follow-ups:**
- "What was your role—author, co-author, editor?"
- "Can you give me the title, journal or publication, and year?"
- "Are there other publications or presentations you'd like to include?"

### 6. Skills, Certifications & Technical Expertise
Tailor questions based on their field.

**Questions:**
- "What technical skills, certifications, or specialized expertise should we highlight?"
- "Are there languages you speak, software systems you're expert in, or research methodologies?"
- "Any professional certifications or licenses?"

### 7. Awards, Honors & Recognition
"Have you received any awards, honors, grants, fellowships, or other recognitions? This could include academic awards, professional recognition, or grants you've been awarded."

### 8. Professional Affiliations & Memberships
"What professional organizations, societies, or associations are you a member of? Any leadership roles?"

### 9. Adaptive Section: Domain-Specific Areas
Based on their responses, ask about field-specific areas they may have mentioned:

- **Teaching Experience** (if mentioned): "Tell me about the courses you've taught..."
- **Consulting Work** (if mentioned): "What types of consulting projects have you worked on?"
- **Grants or Funding** (if relevant): "What grants have you been awarded or worked on?"
- **Other Leadership Roles** (if mentioned): "Tell me about any leadership positions..."

### 10. Final Review & Organization
Once you've gathered information, present the vita structure back to them for confirmation before finalizing.

"Here's how I'm organizing your vita with sections for [list sections]. Does this capture everything, and is the organization working for you? Anything you'd like to adjust?"

## Tips for Conversational Flow

**Active Listening**: When users mention something interesting, dig deeper. If they mention they led a research team, ask "How many people? What were the outcomes?" 

**Skip Gracefully**: If something doesn't apply, simply say "Okay, let's move on" without making them feel bad about skipping sections.

**Prioritization**: Ask about what's most important first. Current role before past roles. Recent publications before early work.

**Natural Adaptation**: If they're in industry, you might skip "Teaching Experience" but ask about "Technical Certifications" and "Project Leadership." If they're in academia, prioritize publications and teaching.

**Formatting Readiness**: As you gather information, organize it mentally into the standard vita sections (Education, Professional Experience, Publications, Skills, etc.). When presenting the final vita, it should be properly formatted and ready to use.

## Output Format

The final vita should follow academic/professional conventions:

- **Header**: Name, title, contact information
- **Professional Summary** (optional): Brief statement of expertise
- **Education**: Degrees listed reverse-chronologically with details
- **Professional Experience**: Positions listed reverse-chronologically
- **Publications & Presentations**: Organized by type and year
- **Technical Skills & Expertise**: Categorized as relevant
- **Honors & Awards**: Listed with years
- **Professional Affiliations**: Memberships and roles
- **Additional Sections**: As relevant to their field

For detailed formatting guidance, see `references/vita_structure.md`.
