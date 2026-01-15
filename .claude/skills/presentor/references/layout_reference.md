# Presos Layout Reference

Guide to available layouts and themes for Presos presentations.

## Table of Contents

1. [Available Layouts](#available-layouts)
2. [Layout Comparison](#layout-comparison)
3. [Themes](#themes)
4. [Customization](#customization)
5. [Choosing the Right Layout](#choosing-the-right-layout)

---

## Available Layouts

Layouts are specified in YAML frontmatter:

```yaml
---
title: "Your Presentation"
layout: spring
---
```

### 1. `plain` Layout

**Description**: Basic deck.js presentation with minimal styling.

**Best For**:
- Generic presentations
- Custom styling
- Non-branded content

**Features**:
- Clean, minimal design
- Standard deck.js navigation
- No corporate branding

**Example**:
```yaml
---
title: "Introduction to Python"
layout: plain
---
```

---

### 2. `spring` Layout

**Description**: Spring Framework branded presentation.

**Best For**:
- Spring-related technical talks
- Educational content about Spring
- Conference presentations
- **Recommended for educational/course materials**

**Features**:
- Spring logo and color scheme (green/white)
- Professional technical appearance
- Code-friendly styling
- Clear typography for educational content

**Example**:
```yaml
---
title: "Spring Boot Fundamentals"
layout: spring
---
```

**Why Spring for Education?**
- Clean, professional appearance
- Excellent code block rendering
- High contrast for projectors
- Familiar to technical audiences

---

### 3. `springio` Layout

**Description**: Spring.io website-themed presentation.

**Best For**:
- Spring.io ecosystem content
- Community presentations
- Web-focused talks

**Features**:
- Matches Spring.io website design
- Modern, web-friendly styling
- Responsive design elements

**Example**:
```yaml
---
title: "Spring Cloud Overview"
layout: springio
---
```

---

### 4. `springlarge` Layout

**Description**: Spring layout optimized for large screens/projectors.

**Best For**:
- Conference halls with large screens
- Auditorium presentations
- High-resolution displays

**Features**:
- Larger fonts
- Increased spacing
- Better visibility from distance

**Example**:
```yaml
---
title: "Keynote: Spring Framework 6"
layout: springlarge
---
```

---

### 5. `springone` Layout

**Description**: SpringOne conference branded layout.

**Best For**:
- SpringOne conference talks
- Special event presentations
- Conference-specific content

**Features**:
- SpringOne branding
- Conference-specific colors
- Event logo integration

**Example**:
```yaml
---
title: "Reactive Spring"
layout: springone
---
```

**Variants**:
- `springone13` - SpringOne 2013 theme
- `springone14` - SpringOne 2014 theme

---

### 6. `pivotal` Layout

**Description**: Pivotal company branded layout.

**Best For**:
- Pivotal-related content
- Enterprise presentations
- Corporate training

**Features**:
- Pivotal branding
- Enterprise styling
- Corporate color scheme

**Example**:
```yaml
---
title: "Cloud Native Java"
layout: pivotal
---
```

---

## Layout Comparison

| Layout | Branding | Font Size | Best Use Case |
|--------|----------|-----------|---------------|
| `plain` | None | Standard | Generic/Custom |
| `spring` | Spring | Standard | **Educational/Technical** |
| `springio` | Spring.io | Standard | Web/Community |
| `springlarge` | Spring | Large | Large Venues |
| `springone` | Conference | Standard | Events |
| `pivotal` | Corporate | Standard | Enterprise |

---

## Themes

In addition to layouts, you can specify deck.js themes:

```yaml
---
title: "Your Presentation"
layout: spring
theme: web-2.0
---
```

### Available Themes

| Theme | Description |
|-------|-------------|
| `web-2.0` | Modern, glossy web design |
| `swiss` | Clean, minimalist Swiss design |
| `neon` | Dark background with neon accents |
| `beamer` | LaTeX Beamer-inspired academic style |

### Theme vs Layout

- **Layout**: Overall structure and branding (header, footer, logo)
- **Theme**: Visual styling (colors, fonts, decorations)

### Combining Layouts and Themes

```yaml
---
title: "Advanced Topics"
layout: spring
theme: swiss
---
```

**Recommendation**: Stick to default themes for most presentations. Custom themes may conflict with layout branding.

---

## Customization

### Custom CSS

Add custom styling to specific slides using HTML:

```html
<style>
.custom-slide {
    background-color: #f0f0f0;
    padding: 20px;
}
</style>

<div class="custom-slide">
Custom styled content
</div>
```

### Slide-Specific Classes

Add classes to slides using HTML:

```html
## Regular Slide

Content here

<section class="slide dark-background">

## Custom Slide

Dark background content

</section>
```

### Override Layout Styles

For presentation-wide custom styling, add CSS after frontmatter:

```markdown
---
title: "Custom Styled Presentation"
layout: spring
---

<style>
h2 { color: #0066cc; }
code { background-color: #f5f5f5; }
</style>

# Title Slide
```

---

## Choosing the Right Layout

### Decision Tree

**Is this educational/technical content?**
→ Yes: Use `spring` layout (clean, professional, code-friendly)

**Is this for a large venue/projector?**
→ Yes: Use `springlarge` layout (bigger fonts, better visibility)

**Is this for a specific conference?**
→ Yes: Use event-specific layout (`springone`, etc.)

**Need complete control over styling?**
→ Yes: Use `plain` layout and add custom CSS

**Default recommendation**: Use `spring` layout for most educational content.

---

## Educational Content Recommendations

### For Course Materials

```yaml
---
title: "Session 1: Introduction to AI"
layout: spring
---
```

**Why `spring`?**
- Professional appearance builds credibility
- Excellent for code examples (syntax highlighting)
- High contrast works well with projectors
- Familiar to technical/educational audiences
- Clean design doesn't distract from content

### For Multi-Session Courses

Keep layout consistent across all sessions:

```yaml
# Session 1
---
title: "AI Fundamentals - Week 1"
layout: spring
---

# Session 2
---
title: "AI Fundamentals - Week 2"
layout: spring
---
```

### For Workshops/Labs

```yaml
---
title: "Hands-On Workshop: Building ML Models"
layout: spring
---
```

---

## Best Practices

### Layout Selection

1. **Be consistent** - Use same layout throughout presentation series
2. **Match audience** - Technical audiences expect clean, code-friendly layouts
3. **Test visibility** - Check readability on target display/projector
4. **Avoid over-branding** - Let content shine, not branding

### Font Sizes

- **Standard layouts**: Good for laptop/desktop viewing
- **Large layouts**: Required for conference halls, large classrooms
- **Rule of thumb**: If presenting to 20+ people, consider large layout

### Color Schemes

- **Light backgrounds** (`spring`, `plain`) - Better for bright rooms
- **Dark backgrounds** (custom themes) - Better for dark rooms, video recording

### Testing

Always test your chosen layout:
1. Build presentation locally
2. View on target display (if possible)
3. Check from back of room distance
4. Verify code blocks are readable
5. Confirm images scale appropriately

---

## Examples by Use Case

### Educational Lecture

```yaml
---
title: "Machine Learning Fundamentals - Lecture 3"
layout: spring
---
```

### Technical Workshop

```yaml
---
title: "Building Your First AI Model"
layout: spring
---
```

### Conference Talk (Standard Room)

```yaml
---
title: "Advanced Spring Techniques"
layout: spring
theme: web-2.0
---
```

### Conference Talk (Large Auditorium)

```yaml
---
title: "Keynote: Future of Spring"
layout: springlarge
---
```

### Internal Training

```yaml
---
title: "Company Onboarding: Development Tools"
layout: plain
---
```

### Research Presentation

```yaml
---
title: "Study Results: Performance Analysis"
layout: plain
theme: beamer
---
```

---

## Layout Files Location

Layouts are stored in Presos repository:

```
~/presos/_layouts/
├── plain.html
├── spring.html
├── springio.html
├── springlarge.html
├── springone.html
├── springone13.html
├── springone14.html
└── pivotal.html
```

### Viewing Layout Source

To understand how a layout works, read its HTML file:

```bash
cat ~/presos/_layouts/spring.html
```

### Creating Custom Layouts

Advanced users can create custom layouts:

1. Copy existing layout: `cp spring.html custom.html`
2. Modify HTML/CSS as needed
3. Reference in frontmatter: `layout: custom`

---

## Troubleshooting

### Layout Not Applied

**Issue**: Presentation uses default styling instead of specified layout

**Solutions**:
- Check layout name spelling (case-sensitive)
- Verify layout exists in `_layouts/` directory
- Rebuild presentation: `bundle exec jekyll build`

### Layout Looks Wrong

**Issue**: Layout renders incorrectly or has missing elements

**Solutions**:
- Clear browser cache
- Check Jekyll build output for errors
- Verify deck.js submodule is initialized
- Test with `plain` layout to isolate issue

### Custom CSS Not Working

**Issue**: Custom styles don't apply to slides

**Solutions**:
- Ensure `<style>` tag is after frontmatter
- Check CSS syntax for errors
- Use browser inspector to debug
- Try `!important` to override layout defaults

---

## Summary

**For Most Educational Content**:
```yaml
---
title: "Your Course Title"
layout: spring
---
```

**Quick Reference**:
- Educational/technical: `spring`
- Large venue: `springlarge`
- Custom styling: `plain`
- Default choice: `spring` (when in doubt)
