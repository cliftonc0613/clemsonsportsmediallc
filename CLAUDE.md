# Starter WP Theme

A starter theme for when starting a WordPress project.

**Project Type:** Service-based business

## Project Overview

This WordPress theme is set up with Claude Code automation for streamlined development and content management.

## Quick Start

### Available Commands

Run these commands to accelerate your workflow:

| Category | Commands |
|----------|----------|
| **Content Creation** | `/newsletter-research`, `/blog-research` |
| **Development** | `/sync-wp-astro`, `/sync-code`, `/shadcn` |
| **Media & Communications** | `/press-release` |
| **Personal Development** | `/daily-checkin`, `/weekly-checkin` |
| **Research & Analysis** | `/website-research`, `/youtube-research`, `/market-research` |
| **Utilities** | `/meta-agent`, `/lp-creator` |

### Available Agents

| Category | Agents |
|----------|--------|
| **Content Research** | Content analysis, competitor research |
| **Design & Development** | Frontend, WordPress development |
| **Market Research** | Business analysis, market intelligence |
| **Personal Development** | Productivity, wellness tracking |
| **Project Management** | Task planning, phase management |
| **Utilities** | Meta-agent, prompt creation |
| **YouTube Analytics** | Channel analysis, content strategy |

### Available Skills

- `ai-boardroom` - Virtual board of expert advisors
- `brand-guidelines` - Apply brand colors and typography
- `business-profile-creator` - Create business profiles
- `content-creator` - SEO-optimized marketing content
- `course-creator` - Training courses and materials
- `ideal-client-profile` - Create client personas (ICP)
- `linkedin-post` - LinkedIn posts with Content Grid framework
- `pdf-anthropic` - PDF manipulation toolkit
- `pdf-creator` - Professional styled PDFs
- `pdf-processing` - Extract text, fill forms, merge docs
- `presentor` - Create presentations with Presos
- `proposal-contract-generator` - Project proposals and contracts
- `research-verification` - Verify research quality
- `skill-creator` - Create new skills
- `voice-dna` - Create voice DNA profiles
- `wordpress-starter` - Headless WordPress setup
- `youtube-content-generator` - YouTube content creation

## Project Structure

```
mytheme/
├── .claude/
│   ├── agents/          # AI agent configurations
│   ├── commands/        # Custom slash commands
│   ├── skills/          # Specialized skills
│   └── config.json      # Claude Code configuration
├── context/
│   └── core/
│       ├── business-profile.json   # Business documentation
│       ├── voice-dna.json          # Communication style
│       └── icp.json                # Ideal client profiles
├── knowledge/
│   ├── drafts/          # Work in progress
│   ├── published/       # Final content
│   ├── notes/           # Research notes
│   └── research/        # Research materials
└── CLAUDE.md            # This file
```

## Getting Started

1. **Fill out your profiles** - Start with `business-profile.json` to help AI understand your business
2. **Define your voice** - Complete `voice-dna.json` for consistent communication
3. **Know your audience** - Document ideal clients in `icp.json`

### Fill Out Profiles with Skills

```
/business-profile-creator  # Interactive business profile setup
/voice-dna                 # Define your communication style
/ideal-client-profile      # Create client personas
```

## WordPress Theme Development

This is a WordPress theme project. Common tasks:

- **Theme files**: `style.css`, `functions.php`, `header.php`, `footer.php`
- **Templates**: `index.php`, `single.php`, `page.php`, `archive.php`
- **Assets**: CSS, JavaScript, images in appropriate directories


## Code Style Guidelines

### Styling Practices
- Never, ever use inline styles; always use the global style sheet.


## Frontend Design Aesthetics

**CRITICAL: Avoid generic "AI slop" aesthetics. Create distinctive, surprising frontends that delight users.**

### Typography
- Choose fonts that are beautiful, unique, and interesting
- **Avoid generic fonts**: Arial, Inter, Roboto, system fonts
- **Avoid overused "creative" fonts**: Space Grotesk (commonly AI-selected)
- Opt for distinctive choices that elevate the frontend's character
- Each project should feel intentionally designed, not template-generated

### Color & Theme
- Commit to a cohesive aesthetic using CSS variables for consistency
- **Dominant colors with sharp accents** outperform timid, evenly-distributed palettes
- Draw inspiration from IDE themes and cultural aesthetics
- **Avoid clichéd schemes**: purple gradients on white backgrounds
- Vary between light and dark themes based on context
- Make unexpected color choices that feel genuinely designed for the specific project

### Motion & Animation
- Use animations for effects and micro-interactions
- Prioritize CSS-only solutions for HTML projects
- Use Motion library for React when available
- **Focus on high-impact moments**: One well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions

### Backgrounds & Atmosphere
- Create atmosphere and depth rather than defaulting to solid colors
- Layer CSS gradients for visual interest
- Use geometric patterns or contextual effects matching the overall aesthetic
- Build environments that immerse users in the design

### What to Avoid
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (purple gradients, generic blues)
- Predictable layouts and component patterns
- Cookie-cutter design lacking context-specific character
- Convergence toward "safe" AI-common choices

### Design Philosophy
Interpret creatively and make unexpected choices. Think outside the box—each frontend should feel handcrafted for its specific context, not generated from a template. Surprise and delight should be the goal.


## Notes

- Created: January 7, 2025
- Synced from: https://github.com/cliftonc0613/claude-starter
