# Website Research Command

Performs comprehensive SEO audits, keyword extraction, and competitive analysis for any website URL. Perfect for prospecting, competitor research, and identifying optimization opportunities.

## Usage
```
/website-research [website-url]
```

## System Overview

This command orchestrates a complete website analysis using three specialized subagents:

1. **URL Input**: Accepts any website URL for analysis
2. **SEO Audit**: Launches seo-auditor subagent for technical and on-page analysis
3. **Keyword Extraction**: Launches keyword-extractor subagent for keyword opportunities
4. **Competitive Analysis**: Launches competitor-analyzer subagent for market intelligence
5. **Comprehensive Reports**: Saves detailed findings to organized folders

## Process Flow

### Stage 1: Website URL Processing
- Validates and processes the provided website URL
- Fetches website content, meta tags, and structure
- Identifies website type (local business, e-commerce, service provider, etc.)
- Determines analysis focus based on website characteristics

### Stage 2: Technical SEO Audit
Launches **seo-auditor** subagent to:
- Analyze page speed and Core Web Vitals performance
- Assess mobile responsiveness and user experience
- Evaluate technical SEO implementation (meta tags, headers, structure)
- Identify on-page optimization opportunities
- Review local SEO factors (if applicable)
- Generate priority-based improvement recommendations

### Stage 3: Keyword Research & Extraction
Launches **keyword-extractor** subagent to:
- Extract current keywords from website content and meta tags
- Analyze keyword density and distribution across pages
- Research related keyword opportunities and search volumes
- Identify long-tail keyword potential and gaps
- Map search intent to content types
- Provide strategic keyword targeting recommendations

### Stage 4: Competitive Intelligence
Launches **competitor-analyzer** subagent to:
- Identify direct and indirect competitors in search results
- Compare SEO strategies and technical implementations
- Analyze competitor keyword rankings and content gaps
- Assess competitive strengths and weaknesses
- Discover underserved market opportunities
- Provide competitive positioning recommendations

### Stage 5: Report Generation & Organization
- Combines insights from all three subagents
- Creates executive summary with key findings
- Saves detailed reports to organized folders
- Generates actionable improvement priorities
- Provides implementation timeline and resource estimates

## Output Files

### SEO Audit Report (`/website-research/audits/seo-audit-[domain]-YYYY-MM-DD.md`)
- **Technical SEO Analysis**: Page speed, mobile optimization, crawlability
- **On-Page SEO Evaluation**: Meta tags, content optimization, internal linking
- **Local SEO Assessment**: GMB optimization, citations, local keywords (if applicable)
- **Priority Recommendations**: High, medium, and low priority improvements
- **Implementation Timeline**: Specific actions with expected timeframes

### Keyword Research Report (`/website-research/keywords/keywords-[domain]-YYYY-MM-DD.md`)
- **Current Keyword Profile**: Existing keyword usage and optimization levels
- **Keyword Opportunities**: High-value targets with search volume data
- **Long-tail Opportunities**: Specific phrases with low competition
- **Search Intent Analysis**: Content recommendations by keyword type
- **Competitive Keywords**: Terms competitors rank for that website doesn't

### Competitive Analysis Report (`/website-research/competitors/competitive-[domain]-YYYY-MM-DD.md`)
- **Competitor Landscape**: Direct and indirect competitor identification
- **SEO Comparison**: Technical and content strategy benchmarking
- **Keyword Gap Analysis**: High-value opportunities competitors are missing
- **Content Opportunities**: Topics and formats to outperform competitors
- **Strategic Positioning**: Unique differentiation opportunities

### Executive Summary (`/website-research/reports/summary-[domain]-YYYY-MM-DD.md`)
- **Key Findings**: Top insights from all analysis areas
- **Priority Opportunities**: Highest-impact improvements to pursue first
- **Quick Wins**: Low-effort, high-impact optimizations
- **Strategic Recommendations**: Long-term competitive positioning advice
- **Implementation Roadmap**: 30/60/90-day action plan

## Key Features

### Comprehensive Analysis
- **Technical SEO**: Full technical audit with specific improvement recommendations
- **Content Optimization**: Keyword research and content strategy insights
- **Competitive Intelligence**: Market positioning and opportunity identification
- **Local SEO**: Location-based optimization (automatically detected)

### Business-Focused Insights
- **ROI-Oriented**: Prioritizes improvements by business impact potential
- **Actionable Recommendations**: Specific, implementable advice with timelines
- **Resource Planning**: Estimates effort and expertise required for improvements
- **Competitive Advantage**: Identifies unique positioning opportunities

### Professional Reporting
- **Client-Ready**: Professional reports suitable for prospect presentations
- **Executive Summaries**: High-level insights for decision makers
- **Technical Details**: In-depth analysis for implementation teams
- **Visual Data**: Charts and comparisons for easy understanding

## Command Implementation

```bash
#!/bin/bash

# Check if URL provided
if [ -z "$1" ]; then
    echo "❌ Please provide a website URL"
    echo "Usage: /website-research [website-url]"
    echo "Example: /website-research https://example.com"
    exit 1
fi

WEBSITE_URL="$1"
DOMAIN=$(echo "$WEBSITE_URL" | sed -E 's/https?:\/\///' | sed -E 's/\/.*//' | sed -E 's/www\.//')
DATE=$(date +%Y-%m-%d)

echo "🔍 Starting comprehensive website research for: $WEBSITE_URL"
echo "📊 Analysis Date: $DATE"
echo "💾 Reports will be saved with domain: $DOMAIN"
echo ""

# Create domain-specific folders
mkdir -p "/website-research/audits"
mkdir -p "/website-research/keywords"  
mkdir -p "/website-research/competitors"
mkdir -p "/website-research/reports"

# Stage 1: SEO Audit
echo "🛠️ Stage 1/4: Running comprehensive SEO audit..."
claude --subagent seo-auditor --input "Website URL: $WEBSITE_URL
Domain: $DOMAIN
Analysis Focus: Comprehensive SEO audit including technical, on-page, and local SEO factors
Output: Save to /website-research/audits/seo-audit-$DOMAIN-$DATE.md"

# Stage 2: Keyword Extraction & Research
echo "🔍 Stage 2/4: Extracting keywords and researching opportunities..."
claude --subagent keyword-extractor --input "Website URL: $WEBSITE_URL
Domain: $DOMAIN  
Analysis Focus: Extract current keywords, research opportunities, analyze search intent
Output: Save to /website-research/keywords/keywords-$DOMAIN-$DATE.md"

# Stage 3: Competitive Analysis
echo "⚔️ Stage 3/4: Analyzing competitive landscape..."
claude --subagent competitor-analyzer --input "Website URL: $WEBSITE_URL
Domain: $DOMAIN
Analysis Focus: Identify competitors, analyze strategies, find opportunities
Output: Save to /website-research/competitors/competitive-$DOMAIN-$DATE.md"

# Stage 4: Executive Summary
echo "📋 Stage 4/4: Generating executive summary and action plan..."
echo "# Website Research Executive Summary" > "/website-research/reports/summary-$DOMAIN-$DATE.md"
echo "*Website: $WEBSITE_URL*" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"
echo "*Analysis Date: $DATE*" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"
echo "" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"

# Compile summary from all reports
cat "/website-research/audits/seo-audit-$DOMAIN-$DATE.md" | grep -A 5 "Executive Summary" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"
cat "/website-research/keywords/keywords-$DOMAIN-$DATE.md" | grep -A 5 "Executive Summary" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"
cat "/website-research/competitors/competitive-$DOMAIN-$DATE.md" | grep -A 5 "Executive Summary" >> "/website-research/reports/summary-$DOMAIN-$DATE.md"

echo "✅ Website research complete!"
echo ""
echo "📁 Reports Generated:"
echo "🛠️ SEO Audit: /website-research/audits/seo-audit-$DOMAIN-$DATE.md"
echo "🔍 Keyword Research: /website-research/keywords/keywords-$DOMAIN-$DATE.md"
echo "⚔️ Competitive Analysis: /website-research/competitors/competitive-$DOMAIN-$DATE.md"
echo "📋 Executive Summary: /website-research/reports/summary-$DOMAIN-$DATE.md"
echo ""
echo "🎯 Key Insights Ready For:"
echo "   • Client prospect presentations"
echo "   • Competitive analysis briefings" 
echo "   • SEO improvement planning"
echo "   • Keyword targeting strategy"
echo "   • Market opportunity assessment"
```

## Use Cases

### Business Development
- **Prospect Research**: Analyze potential client websites before sales calls
- **Competitive Intelligence**: Research competitors for positioning and pricing
- **Market Analysis**: Understand SEO landscape in target industries
- **Opportunity Assessment**: Identify service opportunities and value propositions

### SEO & Marketing
- **Client Onboarding**: Comprehensive baseline analysis for new clients
- **Competitive Benchmarking**: Regular competitor monitoring and analysis
- **Keyword Research**: Identify content and optimization opportunities
- **Technical Audits**: Find and prioritize website improvement opportunities

### Sales & Proposals
- **Proposal Development**: Data-driven insights for service proposals
- **Problem Identification**: Specific issues to address in sales presentations
- **Value Demonstration**: Show potential improvements and ROI opportunities
- **Competitive Positioning**: Differentiate services based on competitor analysis

## Advanced Features

### Automated Competitor Discovery
- Identifies competitors through keyword research and market analysis
- Analyzes top-ranking websites for target keywords
- Discovers indirect competitors and market opportunities
- Maps competitive landscape automatically

### Local SEO Intelligence
- Automatically detects local business websites
- Analyzes Google My Business optimization
- Reviews local citation profiles and consistency
- Identifies local keyword opportunities

### Technical SEO Depth
- Core Web Vitals and performance analysis
- Mobile optimization and user experience review
- Structured data and schema markup assessment
- Crawlability and indexing evaluation

### Keyword Opportunity Scoring
- Search volume and difficulty analysis
- Competition assessment and gap identification
- Search intent mapping and content recommendations
- ROI potential estimation for keyword targets

## Best Practices

### For HVAC/Service Business Research
1. **Local Focus**: Emphasize local SEO factors and geographic keywords
2. **Service Keywords**: Target service-specific and problem-solving keywords
3. **Seasonal Opportunities**: Identify HVAC seasonal keyword trends
4. **Competitor Local Presence**: Analyze local competitor GMB and citations

### For Prospect Analysis
1. **Business Context**: Consider industry and target market when analyzing
2. **Opportunity Sizing**: Estimate traffic and business impact potential
3. **Implementation Feasibility**: Assess website platform and technical constraints
4. **Resource Requirements**: Estimate time and expertise needed for improvements

### For Ongoing Monitoring
1. **Regular Analysis**: Monthly competitor and keyword monitoring
2. **Trend Tracking**: Identify seasonal patterns and emerging opportunities
3. **Performance Benchmarking**: Track improvements over time
4. **Strategy Adjustment**: Adapt approach based on competitive changes

The system provides comprehensive website intelligence perfect for business development, competitive analysis, and SEO strategy development.