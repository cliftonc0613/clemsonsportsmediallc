---
name: pdf-creator
description: This skill should be used when creating professional, styled PDF documents from Markdown content. Use conversational approach to gather user preferences for cover page design, styling, layout, and visual elements before generating the PDF. Supports multiple content sources (Markdown files, direct input, URLs) and flexible output formats (PDF, HTML, or both).
---

# PDF Creator

## Overview

Create professional, styled PDF documents from Markdown content with customizable templates, cover pages, and branding. This skill uses a conversational approach to understand the user's design preferences before generating high-quality PDFs suitable for lead magnets, reports, ebooks, and marketing materials.

## When to Use This Skill

Use this skill when the user requests:
- Creating a PDF from Markdown content
- Generating styled documents with cover pages
- Converting blog posts or articles into downloadable PDFs
- Creating lead magnets or white papers
- Designing branded ebooks or guides
- Producing marketing materials in PDF format
- Any request involving "create PDF from markdown," "generate styled PDF," "make a lead magnet," or similar

## Conversational Workflow

This skill uses a **conversational, question-driven approach** to create customized PDFs. Always engage the user with questions before generating the PDF.

### Step 1: Understand Content Source

First, determine what content will be used for the PDF:

- **Do you have a Markdown file?** If yes, ask for the file path
- **Is the content in a URL?** If yes, fetch and convert the content
- **Would you like to provide content directly?** If yes, accept direct input
- **Multiple sources?** Support combining content from multiple sources

### Step 2: Gather Cover Page Information

Ask about the cover page design:

**Essential Cover Elements:**
- What is the main title for the document?
- What subtitle or tagline should appear?
- Who is the author or company name?
- Should a date be included?

**Visual Options:**
- Do you have a logo file to include? (Ask for path)
- What color scheme do you prefer? (Consult style-guide.md for palettes)
- Any specific background style preference? (gradient, solid, white with border)

### Step 3: Collect Styling Preferences

Ask about the document styling:

**Typography:**
- What font style do you prefer? (modern sans-serif, classic serif, or specific fonts)
- Any font family preferences?

**Colors:**
- What are your brand colors? (Provide primary/secondary/accent hex codes)
- Or select from predefined palettes: Professional Blue, Elegant Purple, Modern Green, Bold Red, Monochromatic Black, Warm Orange

**Layout:**
- What page margin size? (narrow 0.5in, standard 0.75in, wide 1in)
- Should page numbers be shown?
- Should headers/footers be included?

### Step 4: Determine Content Options

Ask about how content should be presented:

- **Numbered sections?** If this is a list-style document (like "5 Reasons Why..."), use numbered sections
- **Include table of contents?** For longer documents
- **Any callout boxes?** For highlighting important information
- **Section icons?** To visually distinguish sections

### Step 5: Confirm Output Format

Ask about the desired output:

- **PDF only** - Standard downloadable PDF
- **HTML only** - Web-ready document
- **Both** - Generate both formats
- **What should the output filename be?**

### Step 6: Generate and Preview

After collecting all preferences:
1. Build the configuration with user preferences
2. Select appropriate templates (cover.html, content.html)
3. Generate the PDF using the `scripts/generate_pdf.py` script
4. Provide feedback on the generated file location

## Generating the PDF

### Script Usage

The main PDF generation script is located at `scripts/generate_pdf.py`.

**Basic usage:**
```bash
python scripts/generate_pdf.py --input content.md --output document.pdf
```

**With template and styling:**
```bash
python scripts/generate_pdf.py \
    --input content.md \
    --output document.pdf \
    --template templates/cover.html \
    --style assets/styles.css \
    --config assets/default-config.json
```

**With custom variables:**
```bash
python scripts/generate_pdf.py \
    --content "# Title\n\nContent here..." \
    --output document.pdf \
    --var TITLE "My Document" \
    --var AUTHOR "John Doe" \
    --var PRIMARY_COLOR "#2563eb"
```

### Configuration Structure

The PDF generation uses a JSON configuration file (see `assets/default-config.json`) with these sections:

- **title, subtitle, author, date** - Document metadata
- **branding** - Logo paths, website, email
- **colors** - Full color palette for all elements
- **typography** - Font families and sizes
- **layout** - Page margins, header/footer options
- **content_options** - Numbered sections, TOC, icons
- **output** - Format and filename

## Templates

### Cover Page Template

Located at `templates/cover.html`

The cover page includes:
- Logo placement
- Title and subtitle
- Decorative elements (corner decorations, divider)
- Author and date information
- Page number
- Gradient background using primary/secondary colors

**Key customizable elements:**
- Background style (gradient, solid, or custom)
- Corner decorations (can be removed or styled)
- Logo size and placement
- Typography settings

### Content Page Template

Located at `templates/content.html`

The content page includes:
- Header with logo and document title
- Main content area with full Markdown styling
- Footer with copyright and page numbers

**Supported Markdown features:**
- Headings (h1-h6) with styled colors
- Paragraphs with justified alignment
- Lists (ordered and unordered)
- Blockquotes with accent border
- Code blocks with syntax styling
- Tables with header styling
- Images with responsive sizing
- Links with underline styling

**Special content structures:**
- Numbered sections (for list-style content)
- Callout boxes (info, warning, success)
- Page break controls
- Keep-together containers

## Style Guide Reference

For detailed styling options, color palettes, typography choices, and layout configurations, consult `references/style-guide.md`.

Key sections in the style guide:
- **Color Palettes** - Pre-defined color schemes for different brand types
- **Typography** - Font recommendations and size guidelines
- **Layout Options** - Margin settings, header/footer configurations
- **Cover Page Elements** - Required and optional cover elements
- **Content Page Elements** - Numbered sections, callout boxes, tables
- **Page Break Control** - Manual and automatic page break options
- **Best Practices** - Design guidelines for professional PDFs

## Assets

### Included Assets

- **`assets/default-config.json`** - Default configuration template
- **`assets/styles.css`** - Default CSS stylesheet with color variables
- **`templates/cover.html`** - Cover page template
- **`templates/content.html`** - Content page template

### Adding Custom Assets

Users can add:
- **Logos** - Place in `assets/logos/` directory
- **Icons** - Place in `assets/icons/` directory
- **Fonts** - Place in `assets/fonts/` directory
- **Custom templates** - Create new template files as needed

## Example Conversations

**Example 1: Creating a Lead Magnet**

```
User: "I want to create a PDF from my blog post about SEO tips"

Claude: "I'd be happy to help you create a PDF from your SEO tips blog post! Let me gather some information about how you'd like it to look.

1. What's the file path to your Markdown file?
2. What title should appear on the cover?
3. Do you have a logo file I should include?
4. What color scheme matches your brand? (I can suggest options if you'd like)
5. Should I use numbered sections for the tips?
```

**Example 2: Custom Styling**

```
User: "Create a PDF from this content with my brand colors"

Claude: "Great! To make sure the PDF matches your brand, I'll need a few details:

1. What are your brand colors? (Please provide hex codes for primary, secondary, and accent colors)
2. What font style do you prefer - modern sans-serif or classic serif?
3. Do you want a cover page, or should we start directly with the content?
4. Should I include page numbers and a footer?
```

**Example 3: Quick Generation**

```
User: "Just make a simple PDF from this markdown file"

Claude: "I'll create a PDF using our default professional styling. The default includes:
- Professional blue color scheme
- Clean sans-serif fonts
- Cover page with title
- Standard page margins
- Page numbers and footer

If you'd like any customizations (colors, fonts, layout), just let me know. Otherwise, I'll proceed with the defaults.
```

## Troubleshooting

### Common Issues

**Issue: "WeasyPrint is not installed"**
- Solution: Install with `pip install weasyprint markdown`

**Issue: "Images not appearing in PDF"**
- Solution: Use absolute paths or ensure base_url is set correctly in the script

**Issue: "Fonts look different than expected"**
- Solution: Use system fonts or ensure web fonts are properly loaded in the template

**Issue: "Page breaks in awkward places"**
- Solution: Add CSS classes `page-break-before`, `page-break-after`, or `avoid-page-break` to control breaks

### Script Dependencies

The `generate_pdf.py` script requires:
- `weasyprint` - PDF generation from HTML/CSS
- `markdown` - Markdown to HTML conversion

Install dependencies:
```bash
pip install weasyprint markdown
```

## Quick Start Checklist

When a user requests PDF creation, follow this sequence:

1. [ ] Ask for content source (file path, URL, or direct input)
2. [ ] Gather cover page details (title, subtitle, author, logo)
3. [ ] Collect styling preferences (colors, fonts, layout)
4. [ ] Determine content options (numbered sections, TOC, callouts)
5. [ ] Confirm output format and filename
6. [ ] Build configuration with user preferences
7. [ ] Generate PDF using the script
8. [ ] Report success and file location

The conversational approach ensures each PDF matches the user's vision while leveraging professional templates and styling.
