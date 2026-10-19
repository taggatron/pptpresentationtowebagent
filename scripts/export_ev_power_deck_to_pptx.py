#!/usr/bin/env python3
"""
Export script for Lesson 05: Electrical Power & EV Charging Calculations
Generates 16:9 widescreen PowerPoint presentation files (.pptx) from slide images.
"""

import os
import sys
from pptx import Presentation
from pptx.util import Inches
from PIL import Image

SLIDES_DIR = os.path.abspath("public/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations/slides")
DECK_DIR = os.path.abspath("public/decks/physics_electricity_magnetism/Lesson_05_EV_Power_Calculations")
OUTPUT_DIR = os.path.abspath("output/powerpoints_physics_electricity_magnetism")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Standard 16:9 Widescreen dimensions
SLIDE_WIDTH = Inches(17.77777777777778)
SLIDE_HEIGHT = Inches(10.0)

# Slide speaker notes definitions
SPEAKER_NOTES = {
    1: """Title: The Physics of Ultra-Rapid EV Charging
GCSE Physics (9-1) · Electricity, Energy Transfer & High-Power Engineering
Core topics covered:
• Electrical Power (P = IV and P = I²R)
• Charge Flow & Energy (Q = It and E = QV)
• Energy Transfer Rate (P = E / t)""",

    2: """Starter Activity: Knowledge Retrieval Practice (6-Question Grid)
Questions & Answers:
1. What formula links electrical charge (Q), current (I), and time (t)?
   → Answer: Q = I × t (Coulombs = Amps × seconds)
2. What is the unit of electrical power, and what does 1 Watt equal in energy per second?
   → Answer: Watt (W) = 1 Joule per second (1 J/s)
3. What equation links energy transferred (E), charge (Q), and potential difference (V)?
   → Answer: E = Q × V (Joules = Coulombs × Volts)
4. A domestic kettle operates on 230 V mains and draws 10 A. Calculate its power rating.
   → Answer: P = V × I = 230 V × 10 A = 2,300 W (2.3 kW)
5. How much electrical energy is transferred when a 2.3 kW kettle boils water for 200 seconds?
   → Answer: E = P × t = 2,300 W × 200 s = 460,000 J (460 kJ)
6. If electrical current through a charging cable doubles, by what factor does resistive heat loss increase?
   → Answer: Power quadruples (increases 4×, since P = I²R has a squared relationship)""",

    3: """The 60-Second Hook: The Kettle vs. The Supercharger (~152 Kettle Puzzle)
Prompt:
A standard kitchen kettle draws 2,300 W. An ultra-rapid EV supercharger delivers 350,000 W.
How many boiling kettles of electrical power are flowing simultaneously through that single charging cable?
Calculation:
350,000 W ÷ 2,300 W ≈ 152.17 → ~152 Simultaneous Boiling Kettles!
Mission:
How do engineers deliver the power of 152 kettles through a single handheld cable without melting it or destroying the battery?""",

    4: """Energy in Perspective: From AI Queries to Boiling Kettles & EV Batteries
Comparative Energy Demands:
• 1 AI query: ~0.0003 kWh (1 kJ)
• Boiling 1 domestic kettle: ~0.11 kWh (400 kJ)
• 600 AI requests per month: ~0.69 kWh
• Typical EV full battery charge: ~60–75 kWh (equivalent to boiling ~600 kettles)""",

    5: """Fundamental Formula: Power as Rate of Energy Transfer (P = E / t)
1. Formula Breakdown:
   • P = E / t (Power in Watts = Energy transferred in Joules ÷ Time taken in seconds)
   • 1 Watt (W) = 1 Joule per second (1 J/s)
   • Formula Triangle: E on top; P and t on bottom (P = E/t, E = P × t, t = E/P)
   • EV Analogy: Energy (kWh) is the battery tank size; Power (kW) is the pump flow rate.

2. Student Calculation Task (75 kWh Battery):
   • Scenario 1 (3-Pin): P = 75 kWh ÷ 32.6 h ≈ 2.3 kW (2,300 W)
   • Scenario 2 (Wallbox): P = 75 kWh ÷ 10.1 h ≈ 7.4 kW (7,425 W)
   • Scenario 3 (Rapid DC): P = 75 kWh ÷ 0.5 h = 150 kW (150,000 W)

3. Critical Question: Are the battery graphics accurate?
   • Flaw: The battery graphics showing 5%, 50%, and 95% are physically misleading.
   • Rationale: The times given (32.6 h, 10.1 h, 30 min) represent the duration needed for each charger to fully charge the SAME 75 kWh battery to 100%. Showing low vs high percentages mistakenly implies that a slower charger only fills a battery to 5%, confusing charging speed (rate of power transfer) with the final state of charge!""",

    6: """The Physics Inside the Battery: Charge Flow (Q = It) & Energy (E = QV)
1. Charge Flow: Q = I × t
   • At 200 A for 30 minutes (1,800 s): Q = 200 × 1,800 = 360,000 Coulombs (C)
2. Energy per Charge: E = Q × V
   • At 400 V: E = 360,000 C × 400 V = 144,000,000 J (144 MJ or 40 kWh)
3. Synthesis proof linking to power:
   • E = Q × V = (I × t) × V = I × V × t
   • P = E / t = I × V""",

    7: """The Heat Trap: The Physics of Dissipated Energy (P = I²R)
Core Concept:
Cables have internal resistance (R). Forcing heavy current through resistance generates wasted thermal dissipation.
The Squared Effect:
• P = I²R
• Doubling current (2×) increases heat dissipation by 4× (2²).
• Tripling current (3×) increases heat dissipation by 9× (3²).
Engineers cannot simply pump infinite current through copper cables.""",

    8: """The Voltage Solution: Outsmarting Resistance (400V vs. 800V)
Delivering 350 kW without melting the cable:
• Option A: Crank Current (I) → Cable becomes dangerously heavy and overheats.
• Option B: Boost Voltage (V) → Why modern performance EVs use 800 V architectures.
Worked example at 150 kW:
• At 230 V: I = 150,000 ÷ 230 = 652 A (hazardous heat loss)
• At 800 V: I = 150,000 ÷ 800 = 187.5 A (safe, lightweight, manageable cable)""",

    9: """Where Does the Lost Energy Go? (Sankey Diagram & Cable Cooling)
Key Concepts:
• Conservation of energy: Input power = Useful battery storage + Dissipated thermal energy.
• Active liquid cooling: Dialectric coolant channels circulating inside the charging cable to absorb resistive heat.""",

    10: """The Examiner's Trap: Units & Significant Figures
High-Value Calculation Pitfalls:
1. Time: Convert minutes/hours into seconds (s) before calculating energy.
2. Prefixes:
   • kW = 1,000 W
   • MW = 1,000,000 W
   • kJ = 1,000 J
   • MJ = 1,000,000 J
3. Significant Figures: Round only at the very final stage to match question precision.""",

    11: """The EV Charging Network Matrix: Voltage, Current, Power & Time
Comprehensive ecosystem synthesis comparing:
• Domestic 3-Pin (230 V, 10 A, 2.3 kW)
• Home Fast Wallbox (230 V / 400 V, 32 A, 7.4 kW / 22 kW)
• Commercial Rapid DC (400 V, 125 A, 50 kW)
• Motorway Ultra-Rapid DC (800 V, 350 A–500 A, 150–350 kW)""",

    12: """Step-by-Step: The 6-Mark Exam Challenge (Interlocking Formulas)
Problem:
An EV charger operates at 400 V and delivers 120 A of current for 45 minutes. Calculate total energy transferred in Joules. Give answer to 2 significant figures.
Step-by-Step Solution:
• Step 1 (Trap - Time Conversion): t = 45 min × 60 s/min = 2,700 s
• Step 2 (Power Formula): P = I × V = 120 A × 400 V = 48,000 W (48 kW)
• Step 3 (Energy Formula): E = P × t = 48,000 W × 2,700 s = 129,600,000 J
• Step 4 (Significant Figures): 129,600,000 J = 1.3 × 10⁸ J (or 130,000,000 J to 2 s.f.)""",

    13: """The Engineering Toolkit: Interlocking Equation Synthesis Map
Final consolidation map showing how the fundamental equations connect:
• Q = I × t
• E = Q × V
• P = I × V
• P = I² × R
• P = E / t"""
}


def add_slide_image(prs, img_path, notes_text=""):
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    slide.shapes.add_picture(img_path, Inches(0), Inches(0), width=prs.slide_width, height=prs.slide_height)
    if notes_text:
        notes_slide = slide.notes_slide
        notes_slide.notes_text_frame.text = notes_text
    return slide


def generate_standard_deck():
    """Generates the clean 13-slide standard deck."""
    print("Building Standard 13-Slide PowerPoint...")
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

    for num in range(1, 14):
        filename = f"slide_{num:02d}.png"
        img_path = os.path.join(SLIDES_DIR, filename)
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"Missing slide image: {img_path}")

        notes = SPEAKER_NOTES.get(num, "")
        add_slide_image(prs, img_path, notes)
        print(f"  Added Slide {num:02d}: {filename}")

    # Save to deck dir and output dir
    dest1 = os.path.join(DECK_DIR, "Lesson_05_EV_Power_Calculations.pptx")
    dest2 = os.path.join(OUTPUT_DIR, "Lesson_05_EV_Power_Calculations.pptx")
    prs.save(dest1)
    prs.save(dest2)
    print(f"  ✓ Saved to: {dest1}")
    print(f"  ✓ Saved to: {dest2}")
    return dest1


def generate_builds_deck():
    """Generates the interactive 19-slide deck with progressive reveal steps."""
    print("\nBuilding Interactive 19-Slide Progressive Builds PowerPoint...")
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

    build_sequence = [
        # Slide 1: Title
        ("slide_01.png", 1, "Slide 1: Title & Hook"),

        # Slide 2: Starter Retrieval Grid
        ("slide_02.png", 2, "Slide 2: Activating Your Physics Toolkit (6-Question Grid)"),

        # Slide 3: Kettle Puzzle Build 1 (Question Prompt) & Build 2 (Answer Reveal)
        ("slide_03_puzzle_question.png", 3, "Slide 3 [Build 1]: The Kettle Puzzle (Question Posed)"),
        ("slide_03.png", 3, "Slide 3 [Build 2]: The 152 Kettle Puzzle (~152 Simultaneous Kettles Answer Reveal)"),

        # Slide 4: Energy in Perspective
        ("slide_04.png", 4, "Slide 4: Energy in Perspective (AI Queries vs Kettles vs EV)"),

        # Slide 5: 3-Stage Progressive Sequence (Formula Explanation -> Calculation Task -> Solution Reveal)
        ("slide_05_formula_explained.png", 5, "Slide 5 [Build 1]: Electrical Power Formula Explained (P = E / t)"),
        ("slide_05_calculation_task.png", 5, "Slide 5 [Build 2]: Student Task — Calculate Power for 3 Scenarios & Check Battery Graphics"),
        ("slide_05.png", 5, "Slide 5 [Build 3]: Power Dictates Charging Speed (Calculated Solutions & Graphic Flaw Reveal)"),

        # Slide 6: Physics Inside the Battery & Power P = IV Split Slides
        ("slide_06.png", 6, "Slide 6 [Build 1]: Charge Flow (Q = It) & Energy per Charge (E = QV)"),
        ("slide_06_power_p_iv_part1_intuition.png", 6, "Slide 6 [Build 2]: Physical Intuition: Why Power = Current × Voltage"),
        ("slide_06_power_p_iv_part2_formula.png", 6, "Slide 6 [Build 3]: The Circuit Power Formula (P = I × V & 800V EV Metric)"),

        # Slide 7: The Heat Trap Build 1 (Base Formula) & Build 2 (Heat Callout)
        ("slide_08_heat_trap_base.png", 7, "Slide 7 [Build 1]: The Heat Trap Formula (P = I²R)"),
        ("slide_07.png", 7, "Slide 7 [Build 2]: The Heat Trap Warning Callout (Squared Resistance Dissipation)"),

        # Slide 8: The Voltage Solution
        ("slide_08.png", 8, "Slide 8: The Voltage Solution (Outsmarting Resistance: 400V vs 800V)"),

        # Slide 9: Where Does Lost Energy Go?
        ("slide_09.png", 9, "Slide 9: Where Does the Lost Energy Go? (Sankey Diagram & Cable Cooling)"),

        # Slide 10: Examiner's Trap
        ("slide_10.png", 10, "Slide 10: The Examiner's Trap (Units & Significant Figures)"),

        # Slide 11: EV Charging Matrix
        ("slide_11.png", 11, "Slide 11: The EV Charging Network Matrix"),

        # Slide 12: 5-Stage Progressive 6-Mark Exam Calculation Challenge
        ("slide_12_step1_question_only.png", 12, "Slide 12 [Step 1]: The 6-Mark Challenge Prompt (Question & Parameters)"),
        ("slide_12_step2_trap_conversions.png", 12, "Slide 12 [Step 2]: Time Conversion Trap (45 min = 2,700 s)"),
        ("slide_12_step3_power_equation.png", 12, "Slide 12 [Step 3]: Power Equation (P = I × V = 48,000 W)"),
        ("slide_12_step4_energy_equation.png", 12, "Slide 12 [Step 4]: Energy Equation (E = P × t = 129,600,000 J)"),
        ("slide_12.png", 12, "Slide 12 [Step 5]: Final Significant Figures Polish (1.3 × 10⁸ J Answer)"),

        # Slide 13: Summary Toolkit
        ("slide_13.png", 13, "Slide 13: The Engineering Toolkit (Synthesis Equation Map)")
    ]

    for idx, (filename, original_slide_num, label) in enumerate(build_sequence, 1):
        img_path = os.path.join(SLIDES_DIR, filename)
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"Missing build image: {img_path}")

        notes = f"[{label}]\n\n" + SPEAKER_NOTES.get(original_slide_num, "")
        add_slide_image(prs, img_path, notes)
        print(f"  Added Slide {idx:02d}: {filename} ({label})")

    dest1 = os.path.join(DECK_DIR, "Lesson_05_EV_Power_Calculations_with_builds.pptx")
    dest2 = os.path.join(OUTPUT_DIR, "Lesson_05_EV_Power_Calculations_with_builds.pptx")
    prs.save(dest1)
    prs.save(dest2)
    print(f"  ✓ Saved to: {dest1}")
    print(f"  ✓ Saved to: {dest2}")
    return dest1


def generate_video_deck():
    """Generates the presentation with embedded MP4 video on Slide 1."""
    print("\nBuilding Presentation with Embedded 1080p Video Hook...")
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

    # Find the video file
    video_files = [f for f in os.listdir(SLIDES_DIR) if f.endswith(".mp4")]
    if not video_files:
        print("  Notice: No MP4 video found, skipping video deck.")
        return None

    video_path = os.path.join(SLIDES_DIR, video_files[0])
    poster_path = os.path.join(SLIDES_DIR, "slide_01.png")

    blank_layout = prs.slide_layouts[6]

    # Slide 1 with video
    slide1 = prs.slides.add_slide(blank_layout)
    slide1.shapes.add_movie(
        video_path,
        Inches(0), Inches(0),
        width=prs.slide_width,
        height=prs.slide_height,
        poster_frame_image=poster_path,
        mime_type="video/mp4"
    )
    if 1 in SPEAKER_NOTES:
        slide1.notes_slide.notes_text_frame.text = "[Embedded Video Hook]\n" + SPEAKER_NOTES[1]
    print(f"  Added Slide 01: Embedded Video ({video_files[0]})")

    # Remaining slides 2 to 13
    for num in range(2, 14):
        filename = f"slide_{num:02d}.png"
        img_path = os.path.join(SLIDES_DIR, filename)
        notes = SPEAKER_NOTES.get(num, "")
        add_slide_image(prs, img_path, notes)
        print(f"  Added Slide {num:02d}: {filename}")

    dest1 = os.path.join(DECK_DIR, "Lesson_05_EV_Power_Calculations_with_video.pptx")
    dest2 = os.path.join(OUTPUT_DIR, "Lesson_05_EV_Power_Calculations_with_video.pptx")
    prs.save(dest1)
    prs.save(dest2)
    print(f"  ✓ Saved to: {dest1}")
    print(f"  ✓ Saved to: {dest2}")
    return dest1


def update_companion_pdf():
    """Updates the companion PDF document with the high-resolution 13 slides."""
    print("\nUpdating companion PDF document...")
    images = []
    for num in range(1, 14):
        filename = f"slide_{num:02d}.png"
        img_path = os.path.join(SLIDES_DIR, filename)
        im = Image.open(img_path).convert("RGB")
        images.append(im)

    pdf_dest1 = os.path.join(DECK_DIR, "Lesson_05_EV_Power_Calculations.pdf")
    pdf_dest2 = os.path.join(OUTPUT_DIR, "Lesson_05_EV_Power_Calculations.pdf")
    images[0].save(pdf_dest1, save_all=True, append_images=images[1:], resolution=150.0)
    images[0].save(pdf_dest2, save_all=True, append_images=images[1:], resolution=150.0)
    print(f"  ✓ Saved PDF to: {pdf_dest1}")
    print(f"  ✓ Saved PDF to: {pdf_dest2}")


def main():
    print("=== Exporting Lesson 05 Slides to PowerPoint (.pptx) ===")
    f1 = generate_standard_deck()
    f2 = generate_builds_deck()
    f3 = generate_video_deck()
    update_companion_pdf()
    print("\n✦ Export complete! All files generated successfully.")


if __name__ == "__main__":
    main()
