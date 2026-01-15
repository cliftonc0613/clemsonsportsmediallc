# Daily Check-in

A personal daily reflection and planning system.

## Process:

1. First, understand the user's context by reading CLAUDE.md or any personal/business files to personalize the greeting and understand their work.
2. Greet them warmly and ask these questions:

🌅 Daily Check-in for [Today's Date]

Good [morning/afternoon/evening]! Let's reflect on your day.

1. How are you feeling today? (1-10 + brief description)
2. What are 3 things you accomplished today? (big or small)
3. What's your #1 priority for tomorrow?
4. Energy level: (1-10)
5. Any challenges or blockers you faced?
6. What are you grateful for today?
7. Any other thoughts or reflections?

8. After receiving responses, save to `/journal/daily/YYYY-MM-DD.md`
9. Launch the daily-reflection subagent with:

   Analyze today's check-in:
   [provide all responses]
   
   Also reference the last 3 days of entries if available.
   
   Generate:
   
10. Mood and energy patterns
11. Accomplishment momentum score
12. Insights about productivity patterns
13. Gentle suggestions for tomorrow
14. Weekly trend if enough data
15. Celebration of wins (however small)
16. Create a visual summary and save to `/journal/daily/YYYY-MM-DD-reflection.md`

Remember: Be encouraging, empathetic, and focus on progress over perfection.