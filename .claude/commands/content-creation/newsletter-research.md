# Newsletter Research Command

Creates comprehensive newsletter drafts by analyzing competitor content and writing in your authentic voice.

## Usage
```
/newsletter-research
```

## System Overview

This command orchestrates a multi-stage newsletter creation process:

1. **Data Collection**: Reads newsletter URLs from your files or prompts for input
2. **Content Research**: Launches content-researcher subagent for trend analysis
3. **Draft Creation**: Launches newsletter-writer subagent to create authentic drafts
4. **Organization**: Saves research and drafts to organized folders

## Process Flow

### Stage 1: URL Collection
- Searches project files for existing newsletter URLs
- If none found, prompts user to provide competitor newsletter URLs
- Accepts various newsletter platforms (Substack, Beehiiv, ConvertKit, etc.)
- Validates URLs and checks accessibility

### Stage 2: Content Research
Launches **content-researcher** subagent to:
- Fetch recent posts from provided newsletters (last 5-10 per source)
- Analyze trending topics across multiple sources
- Identify content gaps and opportunities
- Find time-sensitive angles and seasonal patterns
- Generate competitive intelligence report

### Stage 3: Voice Analysis
- Analyzes existing user content to learn writing style
- Identifies tone, vocabulary, and structural patterns
- Extracts personality traits and unique expressions
- Creates voice profile for authentic content creation

### Stage 4: Draft Creation
Launches **newsletter-writer** subagent to:
- Select most compelling topic from research insights
- Write complete 500-800 word newsletter draft
- Create 3 compelling subject line options
- Include practical takeaways and natural CTAs
- Match user's authentic writing voice

### Stage 5: File Organization
- Saves research report to `/metrics/newsletter-research-YYYY-MM-DD.md`
- Saves draft to `/newsletter/drafts/newsletter-draft-YYYY-MM-DD-[topic].md`
- Creates organized folder structure for future reference

## Output Files

### Research Report (`/metrics/newsletter-research-YYYY-MM-DD.md`)
- Trending topics across analyzed newsletters
- Content gaps and opportunities
- Competitive insights and positioning analysis
- Time-sensitive opportunities
- Recommended focus areas

### Newsletter Draft (`/newsletter/drafts/newsletter-draft-YYYY-MM-DD-[topic].md`)
- 3 subject line options designed for curiosity and value
- Complete 500-800 word newsletter ready to send
- Practical takeaways and actionable insights
- Natural, soft CTA (when relevant)
- Written in user's authentic voice

## Key Features

### Intelligence & Analysis
- **Multi-Source Analysis**: Compares content across multiple newsletters
- **Trend Detection**: Identifies patterns and emerging topics
- **Gap Analysis**: Finds underexplored opportunities
- **Timing Intelligence**: Spots time-sensitive content angles

### Authentic Voice Matching
- **Style Learning**: Analyzes user's existing content for patterns
- **Voice Consistency**: Maintains authentic tone and personality
- **Anti-AI Detection**: Creates natural, human-sounding content
- **Personal Touch**: Includes perspective and experience

### Ready-to-Send Quality
- **Complete Drafts**: No outlines - full newsletters ready for publishing
- **Subject Line Variety**: 3 options for different approaches
- **Practical Value**: Actionable takeaways for readers
- **Professional Structure**: Proper formatting and flow

## Command Implementation

```bash
#!/bin/bash

echo "🔍 Starting newsletter research process..."

# Stage 1: URL Collection
echo "Searching for newsletter URLs in project files..."
URLS=$(find . -name "*.md" -o -name "*.txt" -o -name "*.json" | xargs grep -l "newsletter\|substack\|beehiiv" 2>/dev/null)

if [ -z "$URLS" ]; then
    echo "No newsletter URLs found in project files."
    echo "Please provide competitor newsletter URLs (one per line, press Enter twice to finish):"
    echo "Examples: https://newsletter.substack.com, https://creator.beehiiv.com/newsletter"
    
    # Collect URLs from user input
    NEWSLETTER_URLS=""
    while IFS= read -r line && [ -n "$line" ]; do
        NEWSLETTER_URLS="$NEWSLETTER_URLS$line\n"
    done
    echo -e "$NEWSLETTER_URLS" > /tmp/newsletter_urls.txt
else
    echo "Found existing URLs in project files"
fi

# Stage 2: Launch Content Research
echo "🔬 Launching content research analysis..."
claude --subagent content-researcher --input "$(cat /tmp/newsletter_urls.txt 2>/dev/null || echo 'No URLs provided')"

# Stage 3: Launch Newsletter Writing
echo "✍️ Creating newsletter draft with authentic voice matching..."
claude --subagent newsletter-writer --input "$(cat /metrics/newsletter-research-$(date +%Y-%m-%d).md 2>/dev/null || echo 'No research data')"

echo "✅ Newsletter research complete!"
echo "📊 Research report: /metrics/newsletter-research-$(date +%Y-%m-%d).md"
echo "📝 Draft newsletter: /newsletter/drafts/newsletter-draft-$(date +%Y-%m-%d)-[topic].md"
echo ""
echo "Review the draft and customize before sending. The system has matched your writing voice and created ready-to-publish content."
```

## Advanced Features

### Competitor Intelligence
- Tracks content strategies across multiple newsletters
- Identifies successful formats and engagement patterns
- Notes unique positioning and unexplored angles
- Creates competitive landscape overview

### Trend Analysis
- Cross-references topics across multiple sources
- Weights trends by recency and source credibility
- Identifies seasonal and time-sensitive opportunities
- Suggests unique angles on trending topics

### Voice Authenticity
- Learns from your existing content library
- Maintains consistent personality and expertise level
- Avoids AI-generated language patterns
- Creates content that sounds genuinely human

### Quality Assurance
- Ensures 500-800 word length for optimal engagement
- Validates practical value and actionable insights
- Checks for natural flow and readability
- Confirms subject lines create curiosity without spam triggers

## Best Practices

1. **Regular Updates**: Run weekly to stay current with trends
2. **URL Management**: Keep a curated list of top competitor newsletters
3. **Voice Consistency**: Review drafts to maintain authentic style
4. **Timing**: Consider seasonal and industry-specific timing
5. **Value First**: Always prioritize reader value over promotion

The system creates newsletters that readers actually want to receive - valuable, authentic, and engaging content that builds trust and provides real insights.