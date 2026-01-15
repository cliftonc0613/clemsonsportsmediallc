#!/bin/bash

# Market Research Command
# Creates comprehensive market research studies from topics and research links

echo "🔬 Market Research Command"
echo "═══════════════════════════"
echo "Creates professional market research studies from your topic and source links"
echo ""

# Check if research brief file provided as argument
if [ -n "$1" ]; then
    RESEARCH_BRIEF="$1"
    echo "📄 Using research brief: $RESEARCH_BRIEF"
    
    # Verify file exists
    if [ ! -f "$RESEARCH_BRIEF" ]; then
        echo "❌ Error: Research brief file '$RESEARCH_BRIEF' not found"
        echo ""
        echo "Usage Examples:"
        echo "  /market-research research-brief.md"
        echo "  /market-research saas-market-study.md"
        echo ""
        echo "Or run without arguments to create a new research brief interactively"
        exit 1
    fi
else
    # Interactive mode - create research brief
    echo "📝 Interactive Research Brief Creation"
    echo ""
    
    # Get research topic
    echo "What market/topic would you like to research?"
    echo "(e.g., 'AI-powered customer service platforms', 'Upstate SC construction market', 'B2B SaaS project management tools')"
    read -p "Research Topic: " RESEARCH_TOPIC
    
    echo ""
    echo "What's the primary research objective?"
    echo "(e.g., 'Market entry analysis', 'Competitive intelligence', 'Market sizing study', 'Customer needs analysis')"
    read -p "Research Objective: " RESEARCH_OBJECTIVE
    
    echo ""
    echo "What's the geographic scope?"
    echo "(e.g., 'United States', 'Southeast US', 'Upstate South Carolina', 'Global')"
    read -p "Geographic Scope: " GEOGRAPHIC_SCOPE
    
    echo ""
    echo "Who is the target audience for this research?"
    echo "(e.g., 'Executive team', 'Marketing department', 'Investment committee', 'Sales leadership')"
    read -p "Target Audience: " TARGET_AUDIENCE
    
    # Generate timestamp and filename
    DATE=$(date +%Y-%m-%d)
    TIMESTAMP=$(date +%H%M%S)
    SAFE_TOPIC=$(echo "$RESEARCH_TOPIC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    RESEARCH_BRIEF="market-research/research-brief-$SAFE_TOPIC-$DATE.md"
    
    # Create research brief template
    cat > "$RESEARCH_BRIEF" << EOF
# Market Research Brief: $RESEARCH_TOPIC

**Date Created:** $(date +"%B %d, %Y")  
**Research Objective:** $RESEARCH_OBJECTIVE  
**Geographic Scope:** $GEOGRAPHIC_SCOPE  
**Target Audience:** $TARGET_AUDIENCE  

## Research Questions
Please add specific questions you want the research to answer:

1. What is the market size and growth potential?
2. Who are the key competitors and what are their strategies?
3. What are the primary customer segments and their needs?
4. What are the main market trends and drivers?
5. What opportunities exist for market entry or expansion?

*Add your specific research questions here...*

## Research Sources
Please add URLs and links to research sources:

### Industry Reports
- [ ] [Source Name](URL) - Description of what this source covers

### Competitor Analysis Sources  
- [ ] [Company Website](URL) - Primary competitor
- [ ] [Company Website](URL) - Secondary competitor

### Market Data Sources
- [ ] [Research Report](URL) - Market sizing data
- [ ] [Industry Publication](URL) - Trend analysis

### News & Analysis
- [ ] [News Article](URL) - Recent market developments
- [ ] [Analysis Report](URL) - Expert commentary

### Additional Sources
- [ ] [Source](URL) - Description
- [ ] [Source](URL) - Description

*Add more sources as needed. The more comprehensive your source list, the better the analysis.*

## Specific Focus Areas
What specific aspects should the research emphasize?

- [ ] Market sizing and growth projections
- [ ] Competitive landscape and positioning
- [ ] Customer segmentation and behavior
- [ ] Pricing analysis and trends
- [ ] Technology trends and adoption
- [ ] Regulatory environment
- [ ] Geographic market variations
- [ ] Investment and funding landscape

*Check all that apply and add specific notes.*

## Expected Deliverables
- [ ] Executive Summary (2-3 pages)
- [ ] Full Market Research Report (15-30 pages)
- [ ] Competitive Analysis Matrix
- [ ] Market Opportunity Assessment
- [ ] Strategic Recommendations
- [ ] Presentation Deck (10-15 slides)

## Timeline
- **Research Brief Completion:** [Date]
- **Data Analysis Phase:** [Date range]  
- **Market Research Phase:** [Date range]
- **Report Writing Phase:** [Date range]
- **Final Deliverable:** [Target completion date]

## Notes
Add any specific requirements, constraints, or additional context here:

*This brief will be used by AI subagents to conduct comprehensive market research and create professional reports.*
EOF

    echo "✅ Research brief created: $RESEARCH_BRIEF"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Open and edit the research brief file"
    echo "2. Add specific research questions and sources"
    echo "3. Include URLs for competitor analysis and industry reports"
    echo "4. Run the command again with your completed brief:"
    echo "   /market-research $RESEARCH_BRIEF"
    echo ""
    exit 0
fi

# Main research execution workflow
echo "🚀 Starting Market Research Analysis"
echo ""

# Parse research brief
TOPIC=$(grep "^# Market Research Brief:" "$RESEARCH_BRIEF" | sed 's/# Market Research Brief: //')
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%H%M%S)
SAFE_TOPIC=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

echo "📊 Research Topic: $TOPIC"
echo "📂 Creating analysis workspace..."

# Create working directories
mkdir -p "market-research/studies/$SAFE_TOPIC-$DATE"
mkdir -p "market-research/data/$SAFE_TOPIC-$DATE" 
mkdir -p "market-research/reports/$SAFE_TOPIC-$DATE"

# Phase 1: Data Analysis
echo ""
echo "📈 Phase 1: Data Collection and Analysis"
echo "═══════════════════════════════════════"

# Extract URLs from research brief for data analysis
grep -o 'https\?://[^)]*' "$RESEARCH_BRIEF" > "/tmp/research_urls_$TIMESTAMP.txt"
URL_COUNT=$(wc -l < "/tmp/research_urls_$TIMESTAMP.txt")

echo "🔍 Found $URL_COUNT source URLs in research brief"
echo "🤖 Launching Data Analyzer subagent..."

# Launch data-analyzer subagent
claude --subagent data-analyzer --input "Research Brief: $(cat "$RESEARCH_BRIEF")
Source URLs: $(cat "/tmp/research_urls_$TIMESTAMP.txt")
Task: Analyze all provided sources and extract market data, statistics, competitor information, and trends
Focus: Create structured data analysis that supports comprehensive market research
Output: Save detailed data analysis to market-research/data/$SAFE_TOPIC-$DATE/data-analysis-$DATE.md
Include: Market sizing data, competitive intelligence, trend analysis, and source credibility assessment"

echo "✅ Data analysis phase initiated"

# Phase 2: Market Research Analysis  
echo ""
echo "🎯 Phase 2: Market Research and Intelligence"
echo "═══════════════════════════════════════════"
echo "🤖 Launching Market Researcher subagent..."

# Launch market-researcher subagent
claude --subagent market-researcher --input "Research Brief: $(cat "$RESEARCH_BRIEF")
Data Analysis: $(cat "market-research/data/$SAFE_TOPIC-$DATE/data-analysis-$DATE.md")
Task: Conduct comprehensive market research analysis using data and research brief
Focus: Market sizing, competitive landscape, customer analysis, opportunities, strategic recommendations
Output: Save comprehensive market research to market-research/studies/$SAFE_TOPIC-$DATE/market-analysis-$DATE.md
Include: Executive summary, competitive intelligence, market opportunities, risk assessment, strategic recommendations"

echo "✅ Market research phase initiated"

# Phase 3: Professional Report Creation
echo ""
echo "📝 Phase 3: Professional Report Writing"
echo "════════════════════════════════════════"
echo "🤖 Launching Report Writer subagent..."

# Launch report-writer subagent  
claude --subagent report-writer --input "Research Brief: $(cat "$RESEARCH_BRIEF")
Market Analysis: $(cat "market-research/studies/$SAFE_TOPIC-$DATE/market-analysis-$DATE.md")
Data Analysis: $(cat "market-research/data/$SAFE_TOPIC-$DATE/data-analysis-$DATE.md")
Task: Create professional, executive-level market research report
Focus: Executive summary, actionable recommendations, professional formatting, data visualization
Outputs: 
- Full report: market-research/reports/$SAFE_TOPIC-$DATE/market-research-report-$DATE.md
- Executive summary: market-research/reports/$SAFE_TOPIC-$DATE/executive-summary-$DATE.md
- One-page brief: market-research/reports/$SAFE_TOPIC-$DATE/one-page-summary-$DATE.md
Include: Professional formatting, clear recommendations, supporting data, implementation roadmap"

echo "✅ Report writing phase initiated"

# Phase 4: Final Package Assembly
echo ""
echo "📦 Phase 4: Final Package Assembly"
echo "═══════════════════════════════════"

# Create final package summary
cat > "market-research/reports/$SAFE_TOPIC-$DATE/research-package-summary-$DATE.md" << EOF
# Market Research Package: $TOPIC
**Completed:** $(date +"%B %d, %Y at %I:%M %p")

## Package Contents

### Core Deliverables
1. **Full Market Research Report** - \`market-research-report-$DATE.md\`
   - Comprehensive 15-30 page market analysis
   - Executive summary, competitive landscape, opportunities, recommendations

2. **Executive Summary** - \`executive-summary-$DATE.md\`  
   - 2-3 page standalone brief for senior leadership
   - Key findings and strategic recommendations

3. **One-Page Summary** - \`one-page-summary-$DATE.md\`
   - Executive overview for quick reference
   - Essential findings and next steps

### Supporting Analysis
4. **Market Data Analysis** - \`../data/$SAFE_TOPIC-$DATE/data-analysis-$DATE.md\`
   - Detailed data extraction and analysis from all sources
   - Market sizing, trends, competitive intelligence

5. **Comprehensive Market Study** - \`../studies/$SAFE_TOPIC-$DATE/market-analysis-$DATE.md\`
   - Full research methodology and detailed findings
   - In-depth competitive and opportunity analysis

6. **Research Brief** - \`../$RESEARCH_BRIEF\`
   - Original research requirements and source materials
   - Research questions and focus areas

## Quality Metrics
- **Sources Analyzed:** $URL_COUNT URLs plus additional research
- **Report Pages:** Full comprehensive analysis
- **Data Points:** Quantified market insights and statistics
- **Recommendations:** Prioritized, actionable strategic guidance

## Next Steps
1. Review executive summary for key findings
2. Share one-page summary with stakeholders
3. Use full report for detailed strategic planning
4. Implement high-priority recommendations

## Research Methodology
- Multi-source data analysis and validation
- Comprehensive competitive intelligence gathering
- Market opportunity sizing and prioritization
- Strategic recommendation development with implementation guidance

*All documents created using AI subagent orchestration for professional market research quality.*
EOF

# Cleanup temporary files
rm -f "/tmp/research_urls_$TIMESTAMP.txt"

# Final output and next steps
echo ""
echo "🎉 Market Research Study Complete!"
echo "═══════════════════════════════════"
echo ""
echo "📁 Research Package Location:"
echo "   market-research/reports/$SAFE_TOPIC-$DATE/"
echo ""
echo "📊 Key Deliverables Created:"
echo "   ✅ Full Market Research Report (15-30 pages)"
echo "   ✅ Executive Summary (2-3 pages)"  
echo "   ✅ One-Page Summary (executive brief)"
echo "   ✅ Data Analysis Report (source analysis)"
echo "   ✅ Market Intelligence Study (detailed findings)"
echo ""
echo "🎯 Recommended Next Steps:"
echo "   1. Review executive summary: executive-summary-$DATE.md"
echo "   2. Share with stakeholders: one-page-summary-$DATE.md"
echo "   3. Deep dive planning: market-research-report-$DATE.md"
echo "   4. Strategic implementation: Follow recommendation priorities"
echo ""
echo "💡 Pro Tip: Use the one-page summary for quick stakeholder updates"
echo "    and the full report for detailed strategic planning sessions."
echo ""
echo "📈 Your professional market research study is ready for strategic decision-making!"