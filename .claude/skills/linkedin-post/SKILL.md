---
name: linkedin-post
description: This skill should be used when creating LinkedIn posts using Will's Content Grid framework. It guides users through a conversational, iterative process that combines the freedom of describing post ideas naturally with the structure of Will's 8-bucket framework (Do, Believe, Hate, Hope × Teach/Tell a Story). The skill asks clarifying questions, generates optimized drafts, and refines posts based on Adam Danyal's LinkedIn algorithm expertise until the user is satisfied.
---

# LinkedIn Post Skill

## Overview

Create LinkedIn posts that stop the scroll, drive engagement, and build thought leadership using Will's proven Content Grid framework combined with Adam Danyal's algorithm optimization insights. This skill guides users through a conversational, back-and-forth workflow that feels like working with a content strategist who understands LinkedIn's algorithm.

## Conversational Workflow

The skill follows a **hybrid conversational flow** that balances structure with freedom:

### Phase 1: Free Entry & Bucket Recognition
- **User enters naturally**: Describes their post idea without choosing from menus
  - Example: "I want to write about how I rescued a client from a terrible WordPress agency"
  - Example: "I have a contrarian take on AI hype that I want to share"
- **Skill intelligently recognizes** the bucket (Do/Believe/Hate/Hope) and delivery method (Teach/Tell a Story)
- **Skill confirms**: "Got it - this is a 'Tell a Story About What You Hate' post (Bucket 6: Rescue Story)"

### Phase 2: Guided Question Framework
- **Skill asks structured questions** based on Will's outline for that specific bucket
- Each bucket has a different outline structure (see references/linkedin-content-grid.md)
- Questions are conversational, not robotic
- User answers iteratively; Claude captures the key details

**Example for Bucket 6 (Rescue Story):**
- "Tell me about the situation: What was the client's problem before they came to you?"
- "Who was the villain here? What did the previous agency do wrong?"
- "What's the specific transformation or result now?"
- "What's the key insight or lesson people should take from this?"

### Phase 3: Draft Generation
- **Skill generates a first draft** incorporating:
  - User's answers from Phase 2
  - Will's proven hook patterns for that bucket
  - Natural, conversational tone (not generic template voice)
  - Appropriate length for LinkedIn (typically 150-400 words for text posts)

### Phase 4: Iterative Refinement
- **Skill asks**: "How does this feel? Want to adjust anything?"
- **User provides feedback**: Refine the hook, punch up a section, change the tone, expand a story, etc.
- **Back-and-forth refinement** continues until user is satisfied
- Skill makes iterative changes and shows diffs/highlights of what changed

### Phase 5: Optimization Layer (Adam Danyal)
- **Before finalizing**, skill consults Adam's optimization guidelines
- **Skill offers optimization suggestions**:
  - Hashtag strategy (industry-specific, problem-focused, or transformation-focused)
  - Optimal posting timing (commute windows: 7-9am, 12-1pm EST typically)
  - Engagement velocity CTA (questions that invite comments, not just reactions)
  - First-2-hours engagement strategy (what to do after posting)
- **User decides**: Accept suggestions or keep original version

### Phase 6: Final Post & Next Steps
- **Skill outputs final post** ready to copy/paste into LinkedIn
- **Skill offers**: Schedule timing, hashtag list, comment response strategy for first hour
- **Skill asks**: Want to create a follow-up post? Pick another bucket?

## Key Conversational Principles

**To maintain natural, strategic conversation:**

1. **Never feel like a form**: Questions should flow conversationally, not like a checklist
2. **Show the framework, but don't force it**: Reference Will's bucket structure, but don't make it feel mechanical
3. **Validate thinking**: Acknowledge user's ideas and explain why they work for LinkedIn's algorithm
4. **Offer perspective**: Share Adam's insights about what performs vs. what doesn't
5. **Empower user decisions**: Offer optimization suggestions but let user decide (not prescriptive)
6. **Build momentum**: Each phase flows into the next naturally

## Understanding Will's 8-Bucket Framework

See `references/linkedin-content-grid.md` for:
- **Do** (tangible work): Teach What You Do, Tell a Story About What You Do
- **Believe** (your philosophy): Teach What You Believe, Tell a Story About What You Believe
- **Hate** (your passion): Teach What You Hate, Tell a Story About What You Hate
- **Hope** (transformation): Teach What You Hope, Tell a Story About What You Hope

Each bucket has 3 specific prompt templates with proven hooks and outlines.

## Understanding Algorithm Optimization

See `references/adam-optimization-tips.md` for:
- **Which buckets perform best** (Hate > Hope > Believe > Do by engagement velocity)
- **Hashtag strategy by bucket type**
- **Optimal posting times** (commute windows, first 2 hours matter most)
- **Engagement velocity tactics** (CTA psychology, comment-worthy questions)
- **Hook formulas** that stop the scroll
- **Content mixing** (weekly cadence to avoid algorithmic throttling)

## When to Trigger This Skill

**Trigger this skill when:**
- User says "help me write a LinkedIn post"
- User says "I want to create LinkedIn content about [topic]"
- User describes a story/idea and asks "should I post this on LinkedIn?"
- User asks "how do I use the LinkedIn Content Grid for a post?"
- User says "optimize this LinkedIn post"

**Don't trigger if:**
- User is asking general LinkedIn strategy questions (use the Social Media Boardroom instead)
- User is asking how to grow followers (different workflow)
- User is asking about content calendar planning (use content-creator skill instead)

## Skill Output Examples

**Example 1: Rescue Story Post (Bucket 6)**
```
A client came to me in tears after her WordPress site was butchered by a "cheap" agency.

They'd installed bloated plugins, broken the checkout flow, and left her with technical debt costing $2k/month in server fees. Her sales were down 40%.

We came in and rebuilt the foundation. Removed the junk. Optimized the infrastructure. Fixed the UX.

Three months later? Sales are up 35%. Server costs cut to $300/month. She finally sleeps at night.

If you're considering a WordPress rebuild, don't cheap out. Find someone who understands that speed, security, and stability aren't negotiable.

What's the worst technical debt you've inherited from a previous vendor? Drop it in the comments—I want to know I'm not alone in seeing this pattern.
```

**Example 2: Contrarian Take Post (Bucket 3)**
```
Unpopular opinion: You don't need to post 10x a day to grow on LinkedIn.

Everyone's chasing volume. Post more, post faster, post always.

Here's what actually happens: Your followers see robot content. Shallow takes. No substance.

The algorithm doesn't reward quantity. It rewards *consumption rate*—how long people actually spend reading your post.

One thoughtful, controversial idea beats ten generic tips every single time.

What content on LinkedIn actually makes you *stop the scroll*? Is it the volume players or the thinkers?
```

## Important Notes

- **Adam's optimization is suggestive, not prescriptive**: User decides what to include
- **The framework is scaffolding, not a template**: Posts should feel natural and authentic, not like they came from a grid
- **Engagement velocity matters most**: First 2 hours determine algorithmic reach; what happens before that matters
- **Authenticity drives performance**: Generic bucket-filling posts underperform; unique, personal stories outperform
- **Test and iterate**: Track which buckets perform best for this specific user's audience

## Resources

### references/
- **linkedin-content-grid.md** - Will's complete 8-bucket framework with all 24 prompts and outlines
- **adam-optimization-tips.md** - Adam Danyal's algorithm insights, hashtag strategy, timing, and engagement velocity tactics
