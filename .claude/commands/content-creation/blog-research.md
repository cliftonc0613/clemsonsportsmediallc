# Blog Research Command

Creates comprehensive, publication-ready blog posts by analyzing competitor content, identifying opportunities, and writing in your authentic voice with strategic SEO optimization.

## Usage
```
/blog-research
```

## System Overview

This command orchestrates a comprehensive blog creation process that combines competitive intelligence, SEO research, and authentic content creation:

1. **Data Collection**: Reads blog URLs from your files or prompts for competitor blogs
2. **Content Analysis**: Launches content-analyzer subagent for competitive intelligence
3. **Strategic Writing**: Launches blog-writer subagent to create publication-ready drafts
4. **Organization**: Saves research findings and drafts to organized folders

## Process Flow

### Stage 1: Blog URL Discovery
- Searches project files for existing competitor blog URLs
- If none found, prompts for competitor blog URLs in your niche
- Validates URLs and checks accessibility
- Prioritizes blogs with recent activity (last 30 days)

### Stage 2: Competitive Content Analysis
Launches **content-analyzer** subagent to:
- Crawl recent posts from competitor blogs (30-day window)
- Analyze trending topics and content themes
- Identify content gaps and untapped opportunities
- Research keyword opportunities and search intent patterns
- Map successful content formats and structures
- Generate comprehensive competitive intelligence report

### Stage 3: User Voice Analysis
- Analyzes your existing blog content to learn writing style
- Identifies tone, vocabulary, sentence structure patterns
- Extracts personality traits and unique positioning
- Creates voice profile for authentic content matching

### Stage 4: Strategic Blog Creation
Launches **blog-writer** subagent to:
- Select highest-opportunity topic from analysis
- Create 5 compelling headline options with different angles
- Write complete 1,200-2,000 word publication-ready blog post
- Structure content with proper SEO optimization
- Include actionable takeaways and strategic CTAs
- Match your authentic voice and brand positioning

### Stage 5: File Organization
- Saves competitive analysis to `/blog/research/blog-analysis-YYYY-MM-DD.md`
- Saves keyword research to `/blog/keywords/keywords-YYYY-MM-DD.md`
- Saves content ideas to `/blog/topics/topic-ideas-YYYY-MM-DD.md`
- Saves complete blog draft to `/blog/drafts/blog-draft-YYYY-MM-DD-[topic].md`

## Output Files

### Competitive Analysis Report (`/blog/research/blog-analysis-YYYY-MM-DD.md`)
- Trending topics across competitor blogs
- Content gap analysis and opportunities
- Competitor strengths and weaknesses
- Content format performance insights
- Strategic recommendations for differentiation

### Keyword Research Report (`/blog/keywords/keywords-YYYY-MM-DD.md`)
- High-opportunity keyword targets
- Long-tail keyword opportunities
- Search intent analysis
- Semantic keyword clusters
- Content optimization recommendations

### Topic Ideas Bank (`/blog/topics/topic-ideas-YYYY-MM-DD.md`)
- Prioritized content opportunities
- Seasonal and timely angles
- Content series possibilities
- Thought leadership positioning ideas
- Evergreen topic opportunities

### Publication-Ready Blog Draft (`/blog/drafts/blog-draft-YYYY-MM-DD-[topic].md`)
- 5 headline options with different psychological triggers
- Complete 1,200-2,000 word blog post
- Proper SEO optimization and heading structure
- Internal linking opportunities identified
- Strategic CTA and meta description
- Ready to publish with minimal editing

## Key Features

### Competitive Intelligence
- **Multi-Blog Analysis**: Analyzes multiple competitor blogs simultaneously
- **Trend Detection**: Identifies emerging topics and industry discussions
- **Gap Analysis**: Finds underserved content opportunities
- **Format Analysis**: Discovers successful content structures and approaches

### SEO Strategy Integration
- **Keyword Research**: Identifies high-opportunity, low-competition keywords
- **Search Intent Mapping**: Aligns content with user search behavior
- **Content Optimization**: Natural keyword integration without stuffing
- **Technical SEO**: Proper heading structure and meta optimization

### Authentic Voice Matching
- **Style Analysis**: Learns from your existing content patterns
- **Brand Consistency**: Maintains your unique voice and positioning
- **Human-Sounding Content**: Avoids AI-generated language patterns
- **Thought Leadership**: Positions you as an authority in your niche

### Publication-Ready Quality
- **Comprehensive Coverage**: 1,200-2,000 words of substantial content
- **Multiple Headlines**: 5 options with different psychological appeals
- **Actionable Value**: Practical takeaways readers can implement immediately
- **Strategic Structure**: Optimized for engagement and conversions

## Command Implementation

```bash
#!/bin/bash

echo "🔍 Starting comprehensive blog research process..."

# Stage 1: Blog URL Collection
echo "Searching for competitor blog URLs in project files..."
BLOG_URLS=$(find . -name "*.md" -o -name "*.txt" -o -name "*.json" | xargs grep -l "blog\|wordpress\|medium\|substack" 2>/dev/null)

if [ -z "$BLOG_URLS" ]; then
    echo "No competitor blog URLs found in project files."
    echo "Please provide competitor blog URLs in your niche (one per line, press Enter twice to finish):"
    echo "Examples: https://competitor-blog.com, https://industry-leader.com/blog"
    echo "Focus on blogs that:"
    echo "- Target your audience"
    echo "- Cover similar topics"
    echo "- Publish regularly"
    echo "- Rank well in search"
    
    # Collect URLs from user input
    COMPETITOR_BLOGS=""
    while IFS= read -r line && [ -n "$line" ]; do
        COMPETITOR_BLOGS="$COMPETITOR_BLOGS$line\n"
    done
    echo -e "$COMPETITOR_BLOGS" > /tmp/competitor_blogs.txt
else
    echo "Found existing competitor URLs in project files"
fi

# Stage 2: Launch Content Analysis
echo "🔬 Analyzing competitor content and identifying opportunities..."
claude --subagent content-analyzer --input "$(cat /tmp/competitor_blogs.txt 2>/dev/null || echo 'No competitor URLs provided')"

# Stage 3: Launch Blog Writing
echo "✍️ Creating publication-ready blog post with SEO optimization..."
claude --subagent blog-writer --input "$(cat /blog/research/blog-analysis-$(date +%Y-%m-%d).md 2>/dev/null || echo 'No analysis data available')"

echo "✅ Blog research and writing complete!"
echo ""
echo "📊 Files Created:"
echo "📈 Competitive Analysis: /blog/research/blog-analysis-$(date +%Y-%m-%d).md"
echo "🔍 Keyword Research: /blog/keywords/keywords-$(date +%Y-%m-%d).md"
echo "💡 Topic Ideas: /blog/topics/topic-ideas-$(date +%Y-%m-%d).md"
echo "📝 Blog Draft: /blog/drafts/blog-draft-$(date +%Y-%m-%d)-[topic].md"
echo ""
echo "🎯 Your blog post is publication-ready with:"
echo "   • 5 headline options"
echo "   • 1,200+ words of valuable content"
echo "   • Strategic SEO optimization"
echo "   • Your authentic voice and style"
echo "   • Actionable takeaways for readers"
echo ""
echo "Review the draft and customize before publishing. The system has created content that establishes thought leadership while driving organic traffic."
```

## Advanced Features

### Content Intelligence
- **Topic Trending**: Identifies what's gaining traction across multiple blogs
- **Seasonal Opportunities**: Finds timely content angles based on industry cycles
- **Content Series Potential**: Suggests related topics for comprehensive coverage
- **Update Opportunities**: Identifies existing content that could be refreshed

### SEO Strategy
- **Keyword Difficulty Analysis**: Balances opportunity with competition level
- **Content Length Optimization**: Matches successful competitor content depth
- **Featured Snippet Opportunities**: Structures content for Google featured snippets
- **Internal Linking Strategy**: Maps content connections for topical authority

### Voice Authentication
- **Writing Pattern Analysis**: Matches your sentence structure and flow
- **Vocabulary Consistency**: Uses your preferred terms and expressions
- **Expertise Positioning**: Maintains your level of technical depth
- **Brand Personality**: Preserves your unique perspective and approach

### Publication Excellence
- **Editorial Standards**: Professional-level content ready for immediate publishing
- **Engagement Optimization**: Structured to keep readers engaged throughout
- **Conversion Integration**: Strategic CTAs that feel natural and valuable
- **Social Sharing**: Headlines and content optimized for social media sharing

## Best Practices

1. **Regular Analysis**: Run monthly to stay ahead of industry trends
2. **Competitor Curation**: Maintain list of 5-10 top competitor blogs
3. **Content Calendar**: Use insights to plan strategic content series
4. **Performance Tracking**: Monitor which topics and formats perform best
5. **Voice Consistency**: Regularly review to maintain authentic brand voice

## Integration with Content Strategy

### Content Planning
- Use topic ideas bank for quarterly content planning
- Leverage seasonal opportunities for timely content
- Build content series around high-opportunity themes
- Plan evergreen content with trending hooks

### SEO Strategy
- Target keyword clusters for topical authority
- Create content hubs around core topics
- Optimize for featured snippets and voice search
- Build internal linking between related posts

### Thought Leadership
- Position yourself uniquely within competitive landscape
- Address content gaps with authoritative perspectives
- Create comprehensive resources that become industry references
- Establish expertise through consistent, valuable content

The system creates blog content that ranks well, engages readers, and establishes your authority while driving measurable business results through organic search traffic.