#!/usr/bin/env python3
"""
PDF Creator Script - Generates styled PDFs from Markdown content

This script uses WeasyPrint to convert HTML/CSS to professional PDFs.
Supports customizable templates, cover pages, and styling.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Optional, Dict, Any

try:
    import weasyprint
    from weasyprint import HTML, CSS
except ImportError:
    print("Error: WeasyPrint is not installed.")
    print("Install it with: pip install weasyprint")
    sys.exit(1)

try:
    import markdown
    from markdown.extensions import extra, meta
except ImportError:
    print("Error: Python-Markdown is not installed.")
    print("Install it with: pip install markdown")
    sys.exit(1)


def load_template(template_path: str) -> str:
    """Load HTML template from file."""
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


def load_style(style_path: str) -> str:
    """Load CSS stylesheet from file."""
    with open(style_path, 'r', encoding='utf-8') as f:
        return f.read()


def markdown_to_html(markdown_content: str, extensions: Optional[list] = None) -> str:
    """Convert Markdown content to HTML."""
    if extensions is None:
        extensions = ['extra', 'meta', 'tables', 'fenced_code']

    md = markdown.Markdown(extensions=extensions)
    html_content = md.convert(markdown_content)

    return html_content


def build_html_document(
    content_html: str,
    template: str,
    config: Optional[Dict[str, Any]] = None
) -> str:
    """Build final HTML document by injecting content into template."""
    if config is None:
        config = {}

    html_doc = template

    # Replace content placeholder
    html_doc = html_doc.replace('{{CONTENT}}', content_html)

    # Replace config placeholders
    for key, value in config.items():
        placeholder = '{{' + key.upper() + '}}'
        html_doc = html_doc.replace(placeholder, str(value))

    return html_doc


def generate_pdf(
    output_path: str,
    html_content: str,
    css_content: Optional[str] = None,
    stylesheets: Optional[list] = None,
    base_url: Optional[str] = None
) -> None:
    """Generate PDF from HTML content using WeasyPrint."""
    # Prepare stylesheets
    css_stylesheets = []
    if css_content:
        css_stylesheets.append(CSS(string=css_content))
    if stylesheets:
        for style_path in stylesheets:
            css_stylesheets.append(CSS(filename=style_path))

    # Create HTML document
    html_doc = HTML(string=html_content, base_url=base_url)

    # Generate PDF
    html_doc.write_pdf(
        target=output_path,
        stylesheets=css_stylesheets,
        presentational_hints=True
    )

    print(f"PDF generated successfully: {output_path}")


def load_config(config_path: str) -> Dict[str, Any]:
    """Load configuration from JSON file."""
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(
        description='Generate styled PDF from Markdown content'
    )

    # Input options
    parser.add_argument(
        '--input', '-i',
        help='Input Markdown file path'
    )
    parser.add_argument(
        '--content',
        help='Direct Markdown content string'
    )

    # Output options
    parser.add_argument(
        '--output', '-o',
        default='output.pdf',
        help='Output PDF file path (default: output.pdf)'
    )

    # Template options
    parser.add_argument(
        '--template',
        help='HTML template file path'
    )
    parser.add_argument(
        '--style',
        help='CSS stylesheet file path'
    )
    parser.add_argument(
        '--config',
        help='JSON configuration file with template variables'
    )

    # Content options
    parser.add_argument(
        '--var', '-v',
        action='append',
        nargs=2,
        metavar=('KEY', 'VALUE'),
        help='Template variable (can be used multiple times)'
    )

    # Format options
    parser.add_argument(
        '--format',
        choices=['pdf', 'html', 'both'],
        default='pdf',
        help='Output format (default: pdf)'
    )
    parser.add_argument(
        '--html-output',
        help='HTML output file path (when format is html or both)'
    )

    args = parser.parse_args()

    # Validate input
    if not args.input and not args.content:
        print("Error: Please provide either --input file or --content string")
        sys.exit(1)

    # Load content
    if args.input:
        with open(args.input, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
    else:
        markdown_content = args.content

    # Convert to HTML
    content_html = markdown_to_html(markdown_content)

    # Build config dict
    config = {}
    if args.config:
        config.update(load_config(args.config))
    if args.var:
        for key, value in args.var:
            config[key] = value

    # Get template or use default
    if args.template:
        template = load_template(args.template)
    else:
        # Default simple template
        template = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{TITLE}}</title>
</head>
<body>
    <main>
        {{CONTENT}}
    </main>
</body>
</html>"""
        if 'TITLE' not in config:
            config['TITLE'] = 'Document'

    # Build HTML document
    html_document = build_html_document(content_html, template, config)

    # Load CSS if provided
    css_content = None
    if args.style:
        css_content = load_style(args.style)

    # Determine base URL for relative assets
    base_url = str(Path(args.input).parent) if args.input else None

    # Generate output
    if args.format in ['html', 'both']:
        html_output = args.html_output or args.output.replace('.pdf', '.html')
        with open(html_output, 'w', encoding='utf-8') as f:
            f.write(html_document)
        print(f"HTML generated: {html_output}")

    if args.format in ['pdf', 'both']:
        generate_pdf(
            output_path=args.output,
            html_content=html_document,
            css_content=css_content,
            base_url=base_url
        )


if __name__ == '__main__':
    main()
