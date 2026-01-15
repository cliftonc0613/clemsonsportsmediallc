# PDF Creator Style Guide

This reference guide explains the styling system for PDF generation, including color palettes, typography options, and layout configurations.

## Color Palettes

### Professional Blue (Default)
Best for: Business documents, reports, professional materials

```
Primary: #2563eb    (Vibrant blue)
Secondary: #1e40af  (Dark blue)
Accent: #f59e0b     (Amber)
```

### Elegant Purple
Best for: Creative agencies, luxury brands, modern tech

```
Primary: #7c3aed    (Purple)
Secondary: #5b21b6  (Dark purple)
Accent: #f59e0b     (Amber)
```

### Modern Green
Best for: Health, wellness, environmental, financial services

```
Primary: #059669    (Green)
Secondary: #047857  (Dark green)
Accent: #fbbf24     (Yellow)
```

### Bold Red
Best for: Sports, fitness, urgent communications

```
Primary: #dc2626    (Red)
Secondary: #b91c1c  (Dark red)
Accent: #fbbf24     (Yellow)
```

### Monochromatic Black
Best for: Minimalist design, luxury fashion, high-end brands

```
Primary: #111827    (Nearly black)
Secondary: #374151  (Dark gray)
Accent: #d1d5db     (Light gray)
```

### Warm Orange
Best for: Food, entertainment, friendly brands

```
Primary: #ea580c    (Orange)
Secondary: #c2410c  (Dark orange)
Accent: #fbbf24     (Yellow)
```

## Typography

### Heading Fonts

| Font Family | Best For | Notes |
|-------------|----------|-------|
| Inter | Modern, clean, tech | Requires web font loading |
| Segoe UI | Windows, professional | System font |
| Helvetica Neue | Apple, minimalist | System font |
| Arial | Universal compatibility | System font |
| Montserrat | Modern, geometric | Requires web font loading |
| Poppins | Friendly, rounded | Requires web font loading |

### Body Fonts

| Font Family | Best For | Notes |
|-------------|----------|-------|
| Georgia | Classic, readable | Serif, good for long text |
| Times New Roman | Academic, formal | Serif, traditional |
| Merriweather | Modern serif | Requires web font loading |
| Lato | Clean, modern | Sans-serif, versatile |
| Open Sans | Friendly, readable | Sans-serif, popular |

### Font Size Guidelines

- **Body text**: 10-12pt (standard: 11pt)
- **H1 headings**: 1.8-2.2x body size
- **H2 headings**: 1.3-1.6x body size
- **H3 headings**: 1.1-1.3x body size
- **Captions/footnotes**: 0.8-0.9x body size

## Layout Options

### Page Margins

| Setting | Best For | Value |
|---------|----------|-------|
| Narrow | Handouts, internal docs | 0.5in |
| Standard (default) | Most documents | 0.75in |
| Wide | Formal reports, presentations | 1in |

### Header/Footer Options

- **Show header**: Yes/No - Displays logo and document title at top
- **Show footer**: Yes/No - Displays copyright and page numbers at bottom
- **Page number placement**: Center, Left, Right, Outside
- **Start page number**: 1 (cover) or 2 (first content page)

### Section Numbering

- **Disabled**: No section numbers
- **Decimal**: 1, 2, 3... (simple)
- **Hierarchical**: 1, 1.1, 1.2, 2, 2.1... (for complex documents)

## Cover Page Elements

### Required Elements
- Title (prominent display)
- Subtitle (optional but recommended)
- Branding (logo or company name)

### Optional Elements
- Author name
- Date
- Edition/version
- Disclaimer text
- Contact information
- Website URL
- Social media handles

### Cover Page Styles

**Gradient Background**: Modern, eye-catching
- Uses primary to secondary color gradient
- White text for contrast
- Decorative elements (circles, patterns)

**Solid Color**: Clean, professional
- Single primary color background
- White text
- Minimal decoration

**White with Border**: Traditional, formal
- White background
- Colored border frame
- Dark text

## Content Page Elements

### Numbered Sections

For list-style content (like "5 Reasons Why..."), use numbered sections:

```
<div class="numbered-section">
    <div class="section-number">1</div>
    <div class="section-content">
        <h3>Section Title</h3>
        <p>Content goes here...</p>
    </div>
</div>
```

### Callout Boxes

For highlighting important information:

**Info (Blue)**
```
<div class="callout info">
    <div class="callout-title">Note</div>
    <p>Informational content...</p>
</div>
```

**Warning (Orange)**
```
<div class="callout warning">
    <div class="callout-title">Warning</div>
    <p>Warning content...</p>
</div>
```

**Success (Green)**
```
<div class="callout success">
    <div class="callout-title">Success</div>
    <p>Success content...</p>
</div>
```

### Tables

Standard table styling with:
- Header row with background color
- Borders between rows
- Hover effect (in PDF, this affects alternate visual presentation)

### Blockquotes

For testimonials or important quotes:
- Left border accent color
- Light gray background
- Italic text

## Page Break Control

### Manual Breaks

```
<div class="page-break-before"></div>  <!-- Force break before -->
<div class="page-break-after"></div>   <!-- Force break after -->
```

### Keep Together

```
<div class="avoid-page-break">
    <!-- Content that should stay on one page -->
</div>
```

Useful for:
- Images with captions
- Tables
- Related content groups
- Callout boxes

## Assets Organization

### Logo Files

Place logos in `assets/logos/`:
- `logo.png` - Main logo (for cover page)
- `logo-small.png` - Small logo (for headers)
- `logo.svg` - Vector version (if available)

Recommended sizes:
- Cover logo: Up to 300px wide, up to 80px tall
- Header logo: Up to 150px wide, up to 40px tall

### Icon Sets

Place icons in `assets/icons/`:
- SVG format recommended
- Named descriptively (e.g., `chart-icon.svg`, `warning-icon.svg`)
- Use consistent style throughout

### Custom Fonts

Place font files in `assets/fonts/`:
- `.woff2` format recommended (best compression)
- `.woff` as fallback
- Include web font CSS in template

## Template Customization

### Variables Available in Templates

- `{{TITLE}}` - Document title
- `{{SUBTITLE}}` - Document subtitle
- `{{AUTHOR}}` - Author name
- `{{DATE}}` - Publication date
- `{{LOGO_HTML}}` - Full logo HTML
- `{{LOGO_HTML_SMALL}}` - Small logo HTML
- `{{CONTENT}}` - Main content HTML
- `{{PAGE_NUMBER}}` - Current page number
- `{{COPYRIGHT}}` - Copyright text

### Color Variables

All colors from the config are available:
- `{{PRIMARY_COLOR}}`
- `{{SECONDARY_COLOR}}`
- `{{ACCENT_COLOR}}`
- `{{TEXT_COLOR}}`
- etc.

### Font Variables

- `{{FONT_FAMILY_HEADING}}`
- `{{FONT_FAMILY_BODY}}`
- `{{BASE_FONT_SIZE}}`

## Best Practices

1. **Contrast**: Ensure text contrast ratio of at least 4.5:1 for accessibility
2. **Consistency**: Use consistent spacing and alignment throughout
3. **Whitespace**: Don't crowd content; allow breathing room
4. **Typography**: Limit to 2 font families (heading + body)
5. **Colors**: Use a primary color for 60-70%, secondary for 20-30%, accent for 10%
6. **Page breaks**: Review generated PDF to avoid awkward breaks
7. **Testing**: Always generate test PDFs to verify appearance

## Common Issues and Solutions

### Issue: Images not appearing
- **Solution**: Use absolute paths or ensure base_url is set correctly
- **Alternative**: Embed images as base64 data URIs

### Issue: Fonts not rendering
- **Solution**: Use system fonts or ensure web fonts are properly loaded
- **Alternative**: Convert to PDF-compatible fonts

### Issue: Page breaks in wrong places
- **Solution**: Use `page-break-inside: avoid` on containers
- **Manual**: Add explicit page break divs

### Issue: Colors look different in PDF
- **Solution**: WeasyPrint may convert RGB to CMYK; use print-optimized colors
- **Alternative**: Specify colors in CMYK for precise print control
