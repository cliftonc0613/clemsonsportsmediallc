# Press Release Command

Creates professional, media-ready press releases and develops strategic distribution plans for newspapers, journals, and media outlets. Perfect for company announcements, product launches, awards, and newsworthy events.

## Usage
```
/press-release
```

## System Overview

This command creates comprehensive press release packages including:

1. **Story Development**: Identifies newsworthy angles and develops compelling narratives
2. **Professional Writing**: Creates media-ready press releases following AP Style guidelines
3. **Media Research**: Identifies target journalists, editors, and publications
4. **Distribution Strategy**: Develops tiered media outreach plans
5. **Supporting Materials**: Provides contact lists, templates, and submission guidelines

## Process Flow

### Stage 1: Story Discovery & Development
- Prompts for announcement details and key information
- Identifies the newsworthy angle and primary story elements
- Gathers stakeholder quotes and supporting information
- Determines target audience and media relevance

### Stage 2: Professional Press Release Creation
Launches **press-release-writer** subagent to:
- Craft compelling headlines that grab media attention
- Write lead paragraphs answering the 5 W's and H
- Structure content using inverted pyramid format
- Include strategic quotes from key executives
- Format according to AP Style and media standards
- Create multiple headline and angle variations

### Stage 3: Media Research & Distribution Planning
Launches **media-researcher** subagent to:
- Identify relevant newspapers, magazines, and online publications
- Research target journalists and editors who cover the topic
- Create tiered distribution lists (Tier 1, 2, 3 targets)
- Develop timing strategies for maximum coverage
- Provide submission guidelines and contact information

### Stage 4: Complete Media Package Creation
- Combines press release with distribution strategy
- Creates submission-ready email templates
- Provides follow-up scripts and timing recommendations
- Generates tracking templates for coverage monitoring

## Output Files

### Press Release Draft (`/press-releases/drafts/press-release-YYYY-MM-DD-[topic].md`)
- **Professional Format**: Complete, publication-ready press release
- **AP Style Compliance**: Follows journalism industry standards
- **Multiple Headlines**: 3-5 headline options for different angles
- **Strategic Quotes**: Compelling stakeholder quotes for credibility
- **Contact Information**: Complete media contact details

### Media Distribution List (`/press-releases/media-lists/media-targets-YYYY-MM-DD-[topic].md`)
- **Tier 1 Targets**: Major newspapers, national publications, key industry journals
- **Tier 2 Targets**: Regional publications, trade magazines, specialized outlets
- **Tier 3 Targets**: Online publications, blogs, niche media for volume coverage
- **Contact Details**: Journalist names, emails, phone numbers, submission preferences
- **Distribution Timeline**: Strategic timing for maximum coverage impact

### Distribution Templates (`/press-releases/templates/`)
- **Email Templates**: Personalized outreach templates for different media tiers
- **Subject Lines**: Compelling email subjects for various outlet types
- **Follow-up Scripts**: Phone and email follow-up messaging
- **Submission Guidelines**: Format requirements for different publications

### Distribution Strategy (`/press-releases/distribution/distribution-plan-YYYY-MM-DD-[topic].md`)
- **Phase 1**: Exclusive opportunities with major outlets
- **Phase 2**: Broad media push to primary targets
- **Phase 3**: Volume distribution to secondary and online outlets
- **Timing Strategy**: Optimal days and times for media outreach

## Key Features

### Professional Press Release Writing
- **AP Style Compliance**: Follows journalism industry formatting standards
- **Compelling Headlines**: Multiple options designed to grab media attention
- **Strong Leads**: Opening paragraphs that answer all essential questions
- **Strategic Structure**: Inverted pyramid format preferred by journalists
- **Newsworthy Focus**: Emphasis on genuine news value, not marketing fluff

### Comprehensive Media Research
- **Targeted Journalist Lists**: Reporters who actually cover your industry/topic
- **Publication Analysis**: Understanding of editorial preferences and requirements
- **Contact Verification**: Current, accurate contact information
- **Submission Guidelines**: Format and timing requirements for each outlet

### Strategic Distribution Planning
- **Tiered Approach**: Prioritizes high-impact outlets while ensuring broad coverage
- **Timing Optimization**: Strategic scheduling for maximum media attention
- **Multiple Angles**: Different story approaches for various outlet types
- **Follow-up Strategy**: Professional persistence without being intrusive

### Industry Adaptability
- **Technology**: Product launches, funding announcements, partnership deals
- **Healthcare**: Research findings, facility openings, treatment advances
- **Business Services**: Awards, expansions, leadership changes
- **Local Businesses**: Community impact, grand openings, milestone achievements

## Command Implementation

```bash
#!/bin/bash

echo "📰 Starting professional press release development..."
echo "Let's create a media-ready announcement that gets coverage!"
echo ""

# Gather story information
echo "🎯 Story Development Questions:"
echo "Please provide the following information about your announcement:"
echo ""
echo "1. What is the main announcement/news?"
echo "2. Who is involved (company, people, organizations)?"
echo "3. When did this happen or when will it happen?"
echo "4. Where is this taking place (location relevance)?"
echo "5. Why is this newsworthy/important?"
echo "6. How does this impact your audience/industry?"
echo "7. Do you have any quotes from executives or stakeholders?"
echo "8. What industry/sector does this relate to?"
echo "9. Is there a local angle (city, state, region)?"
echo "10. Are there any supporting statistics or data points?"
echo ""

# Collect user responses
read -p "Please provide your announcement details (or press Enter to continue): " STORY_DETAILS

DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%H%M%S)

# Create story brief file
echo "Story Details: $STORY_DETAILS" > "/tmp/press_release_brief.txt"
echo "Date: $DATE" >> "/tmp/press_release_brief.txt"

# Stage 1: Press Release Creation
echo "✍️ Stage 1/2: Creating professional press release..."
claude --subagent press-release-writer --input "Story Brief: $(cat /tmp/press_release_brief.txt)
Request: Create a complete, media-ready press release following AP Style guidelines
Include: Multiple headline options, strong lead paragraph, strategic quotes, proper formatting
Output: Save to /press-releases/drafts/press-release-$DATE-$TIMESTAMP.md"

# Stage 2: Media Research & Distribution Planning
echo "📋 Stage 2/2: Researching media outlets and creating distribution strategy..."
claude --subagent media-researcher --input "Press Release: $(cat /press-releases/drafts/press-release-$DATE-$TIMESTAMP.md)
Story Focus: $STORY_DETAILS
Request: Research target media outlets, journalists, and create distribution strategy
Include: Tier 1/2/3 targets, contact information, submission guidelines, timing strategy
Output: Save media list to /press-releases/media-lists/media-targets-$DATE-$TIMESTAMP.md
Output: Save distribution plan to /press-releases/distribution/distribution-plan-$DATE-$TIMESTAMP.md"

# Create submission templates
echo "📧 Creating submission templates and materials..."
cat > "/press-releases/templates/email-template-tier1.txt" << 'EOF'
Subject: FOR IMMEDIATE RELEASE: [Compelling Headline Relevant to Publication]

Dear [Journalist Name],

I hope this email finds you well. Given your recent coverage of [relevant topic/industry], I thought you might be interested in this breaking news from [Company Name].

[Brief 2-sentence summary of the news and why it's relevant to their beat]

The full press release is attached and pasted below. I'm happy to provide additional information, arrange interviews, or supply high-resolution images as needed.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
[Company Name]
[Phone Number]
[Email Address]

[Press Release Content Here]
EOF

cat > "/press-releases/templates/follow-up-template.txt" << 'EOF'
Subject: Follow-up: [Brief, compelling story hook]

Hi [Journalist Name],

I wanted to follow up on the press release I sent regarding [brief story summary]. I know you receive many announcements, but I thought this might be particularly relevant because [specific reason related to their beat/recent coverage].

A few additional angles that might interest your readers:
• [Local angle if applicable]
• [Industry trend connection]
• [Human interest element]

I'm happy to provide additional information, facilitate interviews, or supply any other materials you might need.

Thank you for your consideration.

Best regards,
[Your Name]
EOF

echo "✅ Press release package complete!"
echo ""
echo "📁 Files Created:"
echo "📰 Press Release: /press-releases/drafts/press-release-$DATE-$TIMESTAMP.md"
echo "📋 Media Targets: /press-releases/media-lists/media-targets-$DATE-$TIMESTAMP.md"
echo "🎯 Distribution Plan: /press-releases/distribution/distribution-plan-$DATE-$TIMESTAMP.md"
echo "📧 Email Templates: /press-releases/templates/"
echo ""
echo "🚀 Your press release is ready for distribution!"
echo ""
echo "Next Steps:"
echo "1. Review press release for accuracy and approve final version"
echo "2. Gather high-resolution images, logos, and supporting materials"
echo "3. Begin Phase 1 distribution to Tier 1 media outlets"
echo "4. Schedule follow-up outreach according to distribution timeline"
echo "5. Track coverage and media responses for future relationship building"
echo ""
echo "💡 Pro Tip: Send releases Tuesday-Thursday, 10 AM - 2 PM for best response rates"
```

## Use Cases & Applications

### Product/Service Launches
- **New Product Announcements**: Feature benefits, availability, market impact
- **Service Expansion**: Geographic or capability expansion announcements  
- **Technology Releases**: Software updates, platform launches, innovation news
- **Partnership Announcements**: Strategic alliances, joint ventures, collaborations

### Corporate Milestones
- **Funding Announcements**: Investment rounds, grants, financial milestones
- **Awards & Recognition**: Industry awards, certifications, rankings
- **Leadership Changes**: Executive appointments, promotions, board changes
- **Company Expansion**: Office openings, team growth, market expansion

### Research & Data
- **Study Results**: Industry research, survey findings, market analysis
- **Annual Reports**: Key metrics, growth achievements, future projections  
- **Trend Analysis**: Industry insights, market predictions, expert commentary
- **White Paper Releases**: Thought leadership, technical research, best practices

### Community Impact
- **Charitable Initiatives**: Community partnerships, donation announcements, volunteer programs
- **Local Economic Impact**: Job creation, local investment, community development
- **Environmental News**: Sustainability initiatives, green certifications, impact metrics
- **Educational Programs**: Scholarship programs, training initiatives, educational partnerships

## Advanced Features

### Multi-Angle Development
- **Primary Angle**: Main newsworthy element for national/major media
- **Local Angle**: Community impact focus for regional publications
- **Industry Angle**: Technical/market implications for trade publications
- **Human Interest**: Personal stories for feature sections and lifestyle publications

### Media Relationship Building
- **Beat Reporter Database**: Ongoing relationships with journalists who cover your industry
- **Editorial Calendar Alignment**: Timing releases with publication special issues
- **Exclusive Opportunities**: Offering embargoed information to major outlets
- **Expert Positioning**: Establishing executives as go-to industry experts

### Distribution Optimization
- **Tier Strategy**: Strategic prioritization of media outlets by impact and relevance
- **Timing Coordination**: Optimal scheduling for maximum coverage potential
- **Format Customization**: Adapting releases for different outlet preferences
- **Follow-up Automation**: Systematic follow-up without being intrusive

### Coverage Tracking
- **Media Monitoring**: Track where releases are published and coverage quality
- **Relationship Scoring**: Rate journalist relationships and response history
- **Performance Analysis**: Measure coverage success and improvement opportunities
- **ROI Assessment**: Track business impact from media coverage

## Best Practices

### Writing Excellence
1. **Lead with News**: Put the most newsworthy element in the headline and first paragraph
2. **Quote Strategy**: Include quotes that add insight, not just promotional statements
3. **Fact Verification**: Ensure all claims are accurate and can be substantiated
4. **AP Style Compliance**: Follow standard journalism formatting for credibility

### Media Relations
1. **Personalization**: Research journalists and personalize outreach appropriately
2. **Timing Respect**: Don't call journalists on deadline or during breaking news
3. **Value Addition**: Offer additional resources, interviews, and expert access
4. **Professional Persistence**: Follow up professionally without being pushy

### Strategic Distribution
1. **Quality over Quantity**: Target relevant outlets rather than mass distribution
2. **Relationship Building**: Focus on long-term media relationships, not one-time coverage
3. **Multiple Touchpoints**: Use email, phone, and social media appropriately
4. **Coverage Monitoring**: Track results and adjust strategy for future releases

The system creates press releases that journalists actually want to publish because they provide genuine news value and are formatted professionally for immediate use.