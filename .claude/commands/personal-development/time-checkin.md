# Time-Based Check-in

A time-aware personal check-in system that adapts questions based on EST time zones.

## Process:

1. **Determine Current Time**: Check current time and convert to EST
2. **Select Question Set**: Choose appropriate questions based on time:
   - **Before 10:00 AM EST**: Morning planning and energy questions
   - **10:00 AM - 3:00 PM EST**: Midday progress and momentum questions  
   - **After 5:00 PM EST**: Evening reflection and accomplishment questions

3. **Personalized Greeting**: Greet based on time period and ask the time-appropriate questions

## Question Sets:

### Morning Check-in (Before 10:00 AM EST)
🌅 Morning Check-in for [Today's Date]

Good morning! Let's set your intentions for the day.

1. Energy Level: On a scale of 1-10, how is your energy level right now?
2. Sleep Quality: How well did you sleep last night? (1-10)
3. Top Priority: What is your #1 priority for today?
4. Intention Setting: What mindset or approach do you want to bring to today?
5. Physical State: How is your physical well-being this morning?
6. Gratitude: What is one thing you're grateful for as you start this day?
7. Challenge Preparation: What potential obstacle might you face today, and how will you handle it?

### Midday Check-in (10:00 AM - 3:00 PM EST)
☀️ Midday Check-in for [Today's Date]

How's your day progressing? Let's check your momentum.

1. Progress Assessment: On a scale of 1-10, how is your day going so far?
2. Morning Goals: Did you accomplish what you set out to do this morning?
3. Energy Check: How is your energy level compared to this morning?
4. Focus Quality: How well have you been able to focus and concentrate today?
5. Course Correction: Is there anything you need to adjust or pivot for the rest of the day?
6. Stress Level: What is your current stress level? (1-10)
7. Afternoon Intention: What do you want to accomplish before the day ends?

### Evening Check-in (After 5:00 PM EST)
🌆 Evening Check-in for [Today's Date]

Time to reflect on your day and wind down.

1. Day Rating: On a scale of 1-10, how would you rate your overall day?
2. Key Accomplishment: What is one thing you accomplished today that you're proud of?
3. Learning Moment: What did you learn about yourself or your work today?
4. Challenge Reflection: What was the biggest challenge you faced today and how did you handle it?
5. Energy Transition: How are you feeling as you transition from work to personal time?
6. Gratitude: What are you most grateful for from today?
7. Tomorrow Preparation: What is one thing you want to focus on tomorrow?

## After Collecting Responses:

4. **Save Entry**: Save responses to `journal/time-checkins/YYYY-MM-DD-[morning|midday|evening]-checkin.md`

5. **Launch Analysis**: Launch the daily-reflection subagent with:

   Analyze this time-based check-in:
   Time Period: [morning|midday|evening]
   [provide all responses]
   
   Also reference previous time-checkin entries if available from the same time period and recent daily check-ins.
   
   Generate the same format as daily check-ins:
   - 📊 Today's Snapshot (mood, energy, wins)
   - 📈 Patterns Noticed (what's working, observations, correlations)
   - 🎯 Tomorrow's Focus (affirm priorities, suggest timing, tiny improvements)
   - 🙏 Gratitude Reflection (acknowledge gratitude, note patterns)
   - Visual mood/energy trends and momentum tracking

6. **Save Analysis**: Save insights to `journal/time-checkins/YYYY-MM-DD-[period]-reflection.md`

## Tone Guidelines:
- **Morning**: Energetic, planning-focused, forward-looking
- **Midday**: Supportive, momentum-checking, course-correcting
- **Evening**: Reflective, appreciative, closure-oriented

Always maintain an encouraging, non-judgmental approach that celebrates progress over perfection.