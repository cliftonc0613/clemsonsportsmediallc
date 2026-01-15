# Presos Syntax Guide

Complete reference for creating Presos presentations using Markdown.

## Table of Contents

1. [Frontmatter](#frontmatter)
2. [Slide Structure](#slide-structure)
3. [Text Formatting](#text-formatting)
4. [Code Blocks](#code-blocks)
5. [Images](#images)
6. [Lists](#lists)
7. [Quotes](#quotes)
8. [Tables](#tables)
9. [HTML Integration](#html-integration)
10. [Special Features](#special-features)

---

## Frontmatter

Every Presos presentation starts with YAML frontmatter between `---` markers:

```yaml
---
title: "Your Presentation Title"
layout: spring
---
```

### Required Fields

- **title**: Presentation title (appears in browser tab and title slide)

### Optional Fields

- **layout**: Template to use (default: `plain`)
  - Options: `spring`, `plain`, `springio`, `springlarge`, `springone`, `pivotal`
- **theme**: deck.js theme (e.g., `web-2.0`)
- **date**: Presentation date

### Example Frontmatter

```yaml
---
title: "Introduction to Spring Boot"
layout: spring
theme: web-2.0
---
```

---

## Slide Structure

### Title Slide (Single `#`)

Use one `#` for the title slide:

```markdown
# Introduction to Spring Boot
Dave Syer, 2024
```

### Content Slides (Double `##`)

Each `##` header creates a new slide:

```markdown
## What is Spring Boot?

Spring Boot makes it easy to create stand-alone applications.

## Key Features

* Opinionated defaults
* Embedded servers
* Production-ready
```

### Slide Naming

- Keep titles concise (fit on one line)
- Use descriptive titles for navigation
- Avoid special characters

---

## Text Formatting

### Basic Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Paragraphs

Separate paragraphs with blank lines:

```markdown
First paragraph with some text.

Second paragraph with more text.
```

### Line Breaks

Use two spaces at end of line for line breaks:

```markdown
First line
Second line
Third line
```

---

## Code Blocks

### Fenced Code Blocks

Always specify the language for syntax highlighting:

````markdown
```python
def hello_world():
    print("Hello, World!")
```

```java
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

```bash
$ npm install
$ npm start
```
````

### Supported Languages

- python, java, javascript, typescript
- bash, sh, shell
- ruby, go, rust, c, cpp
- html, css, scss
- sql, yaml, json, xml

### Inline Code

Use backticks for inline code:

```markdown
Use the `@SpringBootApplication` annotation to enable auto-configuration.
```

---

## Images

### Markdown Syntax

```markdown
![Alt text](images/diagram.png)
```

### HTML Syntax (for sizing)

```html
<img src="images/architecture.png" width="50%">
<img src="images/logo.png" height="200px">
```

### Image Paths

- Store images in `decks/images/` subdirectory
- Use relative paths: `images/your-image.png`
- Supported formats: PNG, JPG, GIF, SVG

### Example Slide with Image

```markdown
## System Architecture

![Architecture Overview](images/architecture-diagram.png)

The diagram shows the three-tier architecture.
```

---

## Lists

### Unordered Lists

```markdown
* First item
* Second item
* Third item
  - Sub-item
  - Another sub-item
    - Nested sub-item
```

### Ordered Lists

```markdown
1. First step
2. Second step
3. Third step
   1. Sub-step
   2. Another sub-step
```

### Mixed Lists

```markdown
1. Main point one
   * Supporting detail
   * Another detail
2. Main point two
   * More details
```

---

## Quotes

### Blockquotes

```markdown
> "Spring Boot is awesome"
> -- Dave Syer
```

### Multi-line Quotes

```markdown
> This is a longer quote
> that spans multiple lines
> for emphasis.
```

---

## Tables

### Basic Table

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Aligned Columns

```markdown
| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Data         | Data           | Data          |
| More         | More           | More          |
```

### Table Example Slide

```markdown
## Comparison

| Feature    | Spring Boot | Traditional |
|------------|-------------|-------------|
| Setup Time | Minutes     | Hours       |
| Config     | Minimal     | Extensive   |
| Deploy     | Embedded    | External    |
```

---

## HTML Integration

### Custom Styling

```html
<div style="color: red; font-size: 24px;">
Important message
</div>
```

### Two-Column Layout

```html
<div style="float:left; width:50%;">
Left column content
</div>
<div style="float:right; width:50%;">
Right column content
</div>
```

### Font Awesome Icons

```html
<i class="icon-smile icon-3x"></i>
<i class="icon-heart"></i>
<i class="icon-warning-sign"></i>
```

### Custom Classes

```html
<div class="important">
Highlighted content
</div>
```

---

## Special Features

### Centered Content

```html
<div style="text-align: center;">
Centered text
</div>
```

### Large Text

```html
<div style="font-size: 48px;">
BIG TEXT
</div>
```

### Color Highlighting

```html
<span style="background-color: yellow;">Highlighted text</span>
<span style="color: red;">Red text</span>
```

### Slide Notes (Speaker Notes)

deck.js supports speaker notes (not visible in presentation):

```html
<aside class="notes">
These are speaker notes - only visible in presenter view
</aside>
```

---

## Best Practices

### Content

1. **One concept per slide** - Keep slides focused
2. **Use visual hierarchy** - Headers → bullets → details
3. **Limit text** - Aim for 3-5 bullets per slide
4. **Add images** - Break up text-heavy slides

### Formatting

1. **Specify code languages** - Always use syntax highlighting
2. **Use consistent styling** - Stick to one format throughout
3. **Test in browser** - Verify rendering before presenting
4. **Keep paths relative** - Use `images/file.png` not absolute paths

### Structure

1. **Title slide first** - Single `#` header
2. **Content slides** - Use `##` consistently
3. **Logical flow** - Intro → Content → Conclusion
4. **End slide** - Thank you / Q&A / Contact info

---

## Complete Example

```markdown
---
title: "Spring Boot Workshop"
layout: spring
---

# Spring Boot Workshop
Building Modern Applications
Dave Syer, 2024

## Agenda

* What is Spring Boot?
* Quick Start Demo
* Key Features
* Hands-on Exercise

## What is Spring Boot?

> "Spring Boot makes it easy to create stand-alone,
> production-grade Spring applications"

* **Opinionated** defaults configuration
* **Embedded** server (Tomcat, Jetty, Undertow)
* **Production-ready** features out of the box

## Quick Start

```java
@SpringBootApplication
@RestController
public class DemoApp {
    @GetMapping("/")
    public String home() {
        return "Hello Spring Boot!";
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApp.class, args);
    }
}
```

## Architecture

![Spring Boot Architecture](images/spring-boot-architecture.png)

## Key Features

| Feature | Description |
|---------|-------------|
| Auto-config | Automatic configuration based on classpath |
| Starters | Curated dependency descriptors |
| Actuator | Production-ready monitoring |

## Thank You!

<div style="text-align: center;">
<i class="icon-smile icon-3x"></i>

Questions?

**dave@example.com**
</div>
```

---

## Troubleshooting

### Common Issues

**Slides not separating**
- Ensure `##` headers have space after them
- Check no `###` headers (not well supported)

**Code not highlighting**
- Verify language is specified: ` ```python` not just ` ``` `
- Check language name is correct (lowercase)

**Images not showing**
- Verify path is relative: `images/file.png`
- Check file exists in `decks/images/`
- Confirm image file extension matches

**Frontmatter errors**
- Ensure `---` markers are on their own lines
- Check YAML syntax (proper indentation)
- Quote strings with special characters

---

## Additional Resources

- **Markdown Guide**: https://www.markdownguide.org/
- **deck.js Documentation**: http://imakewebthings.com/deck.js/
- **Presos GitHub**: https://github.com/dsyer/presos
- **Font Awesome Icons**: https://fontawesome.com/v4/icons/
