#!/usr/bin/env python3
"""
Course Package Generator

This script generates a complete course package based on course specifications.
It creates instructor notes, student handouts, session playbooks, a package guide,
and a README manifest. Files are saved to knowledge/published/ directory.
"""

import os
import sys
from datetime import datetime
from pathlib import Path


def load_template(template_name):
    """Load a template file from the assets/templates directory."""
    template_path = Path(__file__).parent.parent / "assets" / "templates" / f"{template_name}_template.md"
    if template_path.exists():
        with open(template_path, 'r') as f:
            return f.read()
    return None


def create_readme_manifest(course_data):
    """Generate README manifest from template."""
    template = load_template("readme_manifest")
    if not template:
        return "# README Manifest Template Not Found"

    content = template
    content = content.replace("[Date]", course_data.get("creation_date", datetime.now().strftime('%B %d, %Y')))
    content = content.replace("[Module Name]", course_data.get("module_name", "Untitled Module"))
    content = content.replace("[Course Name]", course_data.get("course_name", "Course"))
    content = content.replace("[Duration]", course_data.get("duration", "TBD"))
    content = content.replace("[Audience Description]", course_data.get("audience", "Learners"))

    # Replace all [MODULE_NAME] placeholders with actual module name
    module_name_upper = course_data.get("module_name", "MODULE").upper().replace(" ", "_")
    content = content.replace("[MODULE_NAME]", module_name_upper)

    return content


def create_instructor_notes(course_data):
    """Generate instructor notes from template and course data."""
    template = load_template("instructor_notes")
    if not template:
        return "# Instructor Notes Template Not Found"

    # Replace placeholders with course-specific data
    content = template
    module_name = course_data.get("module_name", "Introduction")
    content = content.replace("[X]", module_name)
    content = content.replace("[Session Title]", course_data.get("module_name", "Introduction"))
    content = content.replace("[Date]", course_data.get("creation_date", "TBD"))
    content = content.replace("[Hours/Minutes]", course_data.get("duration", "3 hours"))
    content = content.replace("[Name]", course_data.get("instructor_name", "[Instructor Name]"))
    content = content.replace("[Location]", course_data.get("location", "[Location TBD]"))

    # Add session-specific activities
    activities = course_data.get("activities", [])
    activity_section = ""
    for i, activity in enumerate(activities, 1):
        activity_section += f"""
### Activity {i}: {activity.get('name', f'Activity {i}')} (Time: {activity.get('time', '30 min')})
**Problem:** {activity.get('problem', 'Complete the task assigned')}

**Instructions:**
"""
        for j, step in enumerate(activity.get('steps', ['Complete the activity']), 1):
            activity_section += f"{j}. {step}\n"

        activity_section += "\n**What to look for:**\n"
        for indicator in activity.get('success_indicators', ['Completion']):
            activity_section += f"- {indicator}\n"

    if activity_section:
        content = content.replace("[Repeat structure for each activity]", activity_section)

    return content


def create_student_handout(course_data):
    """Generate student handout from template and course data."""
    template = load_template("student_handout")
    if not template:
        return "# Student Handout Template Not Found"

    content = template
    module_name = course_data.get("module_name", "Introduction")
    content = content.replace("[X]", module_name)
    content = content.replace("[Session Title]", course_data.get("module_name", "Introduction"))

    # Add learning objectives
    objectives = course_data.get("learning_objectives", [])
    obj_section = ""
    for i, obj in enumerate(objectives, 1):
        obj_section += f"- {obj}\n"
    if obj_section:
        content = content.replace("- [Learning objective 1]\n- [Learning objective 2]\n- [Learning objective 3]", obj_section)

    # Add activities
    activities = course_data.get("activities", [])
    activity_sections = ""
    for i, activity in enumerate(activities[:3], 1):  # Limit to 3 in handout
        activity_sections += f"""
## ACTIVITY {i}: {activity.get('name', f'Activity {i}')}

### The Challenge
{activity.get('problem', 'Complete the assigned task')}

### Your Task
"""
        for j, step in enumerate(activity.get('steps', ['Follow instructions']), 1):
            activity_sections += f"{j}. {step}\n"

        activity_sections += f"""
### My Response

[Space for your work]

### Quick Reflection
{activity.get('reflection_question', 'What did you learn from this activity?')}
_________________________
"""

    # Replace placeholder activities
    if activity_sections:
        placeholder_start = content.find("## ACTIVITY 1:")
        placeholder_end = content.find("## KEY TERMS")
        if placeholder_start > -1 and placeholder_end > -1:
            content = content[:placeholder_start] + activity_sections + "\n" + content[placeholder_end:]

    return content


def create_session_playbook(course_data):
    """Generate session playbook from template and course data."""
    template = load_template("session_playbook")
    if not template:
        return "# Session Playbook Template Not Found"

    content = template
    module_name = course_data.get("module_name", "Introduction")
    content = content.replace("[X]", module_name)
    content = content.replace("[Name]", course_data.get("module_name", "Introduction"))

    # Calculate timing based on total duration and number of activities
    duration = course_data.get("duration_minutes", 180)
    activities = course_data.get("activities", [])
    activity_count = len(activities)

    if activity_count > 0:
        teach_time = min(45, duration // 4)
        setup_time = 10
        build_time = duration - teach_time - setup_time - 15  # 15 min for showcase
        activity_time = build_time // activity_count

        # Update timing roadmap
        timing_row = f"| 0:00-0:{teach_time:02d} | TEACH | Core concepts + stories | Make it relevant |\n"
        timing_row += f"| 0:{teach_time:02d}-0:{teach_time+setup_time:02d} | SETUP | Distribute materials | Logistics |\n"
        timing_row += f"| 0:{teach_time+setup_time:02d}-2:45 | BUILD | Hands-on activities | Circulate + support |"
        content = content.replace("| 0:00-0:10 | WELCOME | Energy + icebreaker | Set positive tone |", timing_row)

    # Add activity quick reference
    activity_refs = ""
    for i, activity in enumerate(activities, 1):
        activity_time_val = activity.get('time', f'{int(duration/len(activities)) if len(activities) > 0 else 30} min')
        activity_refs += f"""
### Activity {i}: {activity.get('name', f'Activity {i}')} (Time: {activity_time_val})
**Goal:** {activity.get('goal', 'Complete the activity')}
**Success:** {', '.join(activity.get('success_indicators', ['Completion']))}
**Common issue:** → {activity.get('common_issue', 'Ask for help')}
"""

    if activity_refs:
        content = content.replace("[Repeat structure for each activity]", activity_refs)

    return content


def create_package_guide(course_data):
    """Create a comprehensive package guide."""
    module_name = course_data.get("module_name", "Module")
    module_name_upper = module_name.upper().replace(" ", "_")

    guide = f"""# {module_name_upper} - COMPLETE PACKAGE GUIDE

**Package Date:** {datetime.now().strftime('%B %d, %Y')}
**Module/Session Name:** {module_name}
**Course:** {course_data.get('course_name', 'Course')}
**Session Duration:** {course_data.get('duration', '3 hours')}
**Target Audience:** {course_data.get('audience', 'Adult learners')}

---

## 📦 WHAT'S IN THIS PACKAGE

### Complete Documents (5 files)

1. **{module_name_upper}_INSTRUCTOR_NOTES.md** - Complete session guide with scripts and timing
2. **{module_name_upper}_STUDENT_HANDOUT.md** - Workbook with activities and reflection
3. **{module_name_upper}_PLAYBOOK.md** - One-page quick reference for delivery
4. **{module_name_upper}_COMPLETE_PACKAGE_GUIDE.md** - This document
5. **README_MANIFEST.md** - Overview and instructions

---

## 📋 HOW TO USE EACH DOCUMENT

### Instructor Notes
- **Read:** 2 days before session
- **Use:** During session preparation and as backup reference
- **Contains:** Complete scripts, timing, troubleshooting, all activities

### Student Handout
- **Print:** One per student
- **Distribute:** At start of hands-on activities
- **Collect:** At end of session (first portfolio artifact)

### Session Playbook
- **Print:** One copy for instructor
- **Laminate:** For durability (optional)
- **Use:** During session for quick reference

### Complete Package Guide
- **Read:** Once before preparation
- **Reference:** For questions about using materials

### README Manifest
- **Read:** For overview and quick start guide
- **Use:** For complete package organization details

---

## 🚀 PREPARATION CHECKLIST

### 2 Days Before
- [ ] Read all documents thoroughly
- [ ] Print student handouts ({course_data.get('expected_students', 20)} copies)
- [ ] Print and laminate session playbook
- [ ] Test all technology and software
- [ ] Prepare demonstration materials

### Day Of Session
- [ ] Arrive 30 minutes early
- [ ] Set up room layout
- [ ] Test WiFi and all tech
- [ ] Distribute materials
- [ ] Welcome atmosphere ready

---

## ⏰ TIMING OVERVIEW

Total Session Time: {course_data.get('duration', '3 hours')}

- Welcome & Introduction: 15 minutes
- Core Concepts & Stories: 30 minutes
- Setup & Instructions: 10 minutes
- Hands-on Activities: {course_data.get('duration_minutes', 180) - 70} minutes
- Showcase & Celebration: 15 minutes

---

## ✅ SUCCESS INDICATORS

You'll know this session worked if:

✅ {course_data.get('attendance_target', '90%')}+ attendance
✅ 100% artifact completion
✅ Students say "I can do this"
✅ High engagement in activities
✅ Successful showcase presentations

---

## 🔧 COMMON ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Tech not working | Use prepared offline activities |
| Students behind | Pair with faster students |
| Students finished early | Add challenge questions |
| Low energy | Quick stretch break, change activity |

---

## 📞 SUPPORT

If you need help:
- Review the troubleshooting guide in Instructor Notes
- Check the Session Playbook for quick fixes
- Refer to README_MANIFEST for package overview
- Remember: flexibility is key - adapt as needed

---

**Remember:** You have everything you need for a successful session. Trust the process, focus on student confidence, and celebrate every win!
"""

    return guide


def save_package(course_data, documents):
    """Save package to knowledge/published/ directory."""

    # Determine output directory
    module_name = course_data.get("module_name", "Module")
    module_name_sanitized = module_name.replace(" ", "_").replace("-", "_").upper()

    # Get the project root (go up from scripts folder)
    project_root = Path(__file__).parent.parent.parent.parent.parent
    published_dir = project_root / "knowledge" / "published" / module_name_sanitized

    # Create directory if it doesn't exist
    published_dir.mkdir(parents=True, exist_ok=True)

    # Save each document
    for filename, content in documents.items():
        filepath = published_dir / filename
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"✅ Created {filename}")

    return published_dir


def main():
    """Main function to generate course package."""
    print("🎓 Course Package Generator")
    print("=" * 50)

    # Get course information
    course_data = {
        "module_name": input("\n📝 Module/Session Name: ").strip(),
        "course_name": input("📚 Course Name: ").strip(),
        "duration": input("⏱️  Session Duration (e.g., 3 hours): ").strip(),
        "audience": input("👥 Target Audience: ").strip(),
        "expected_students": input("📊 Expected Number of Students: ").strip(),
        "instructor_name": input("👨‍🏫 Instructor Name: ").strip(),
        "location": input("📍 Location/Room: ").strip(),
        "creation_date": datetime.now().strftime('%B %d, %Y'),
        "learning_objectives": [],
        "activities": [],
        "additional_files": []
    }

    # Convert duration to minutes for calculations
    duration_str = course_data["duration"]
    if "hour" in duration_str.lower():
        try:
            hours = int(duration_str.split()[0])
            course_data["duration_minutes"] = hours * 60
        except:
            course_data["duration_minutes"] = 180
    else:
        course_data["duration_minutes"] = 180  # Default to 3 hours

    # Get learning objectives
    print("\n📖 Learning Objectives (one per line, empty line to finish):")
    while True:
        obj = input("  - ").strip()
        if not obj:
            break
        course_data["learning_objectives"].append(obj)

    # Get activities
    print("\n🎯 Activities (enter name, problem, time in minutes):")
    while True:
        print("\n  Activity (or press Enter to finish):")
        name = input("    Name: ").strip()
        if not name:
            break

        activity = {
            "name": name,
            "problem": input("    Problem/challenge: ").strip(),
            "time": input("    Time (minutes): ").strip(),
            "goal": input("    Learning goal: ").strip()
        }

        # Get steps
        activity["steps"] = []
        print("    Steps (one per line, empty line to finish):")
        while True:
            step = input(f"      Step {len(activity['steps']) + 1}: ").strip()
            if not step:
                break
            activity["steps"].append(step)

        # Get success indicators
        activity["success_indicators"] = []
        print("    Success indicators (one per line, empty line to finish):")
        while True:
            indicator = input("      Indicator: ").strip()
            if not indicator:
                break
            activity["success_indicators"].append(indicator)

        activity["reflection_question"] = input("    Reflection question: ").strip()
        activity["common_issue"] = input("    Common issue and solution: ").strip()

        course_data["activities"].append(activity)

    # Ask about additional files/assets
    print("\n📎 Additional Files or Assets")
    print("   Will you be including any additional files with this module?")
    additional = input("   (e.g., slides, templates, reference docs - describe): ").strip()
    if additional:
        course_data["additional_files"] = [additional]

    # Generate documents
    print("\n📄 Generating documents...")

    documents = {
        "README_MANIFEST.md": create_readme_manifest(course_data),
        f"{course_data['module_name'].upper().replace(' ', '_')}_INSTRUCTOR_NOTES.md": create_instructor_notes(course_data),
        f"{course_data['module_name'].upper().replace(' ', '_')}_STUDENT_HANDOUT.md": create_student_handout(course_data),
        f"{course_data['module_name'].upper().replace(' ', '_')}_PLAYBOOK.md": create_session_playbook(course_data),
        f"{course_data['module_name'].upper().replace(' ', '_')}_COMPLETE_PACKAGE_GUIDE.md": create_package_guide(course_data)
    }

    # Save to published directory
    output_dir = save_package(course_data, documents)

    print(f"\n🎉 Course package created successfully!")
    print(f"📁 Location: {output_dir.absolute()}")
    print("\nNext steps:")
    print("1. Review all generated documents")
    print("2. Customize content as needed")
    print("3. Print student handouts and instructor playbook")
    print("4. Prepare for your session!")

    if course_data["additional_files"]:
        print("\n💡 Additional files you mentioned:")
        for f in course_data["additional_files"]:
            print(f"   • {f}")
        print("\n   Add these files to the package directory when ready.")


if __name__ == "__main__":
    main()
