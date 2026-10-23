#!/usr/bin/env python3
"""
Export all slides for each lesson in public/decks/physics_electricity_magnetism to high-quality multi-page PDF documents.
Ensures every lesson has a companion PDF slide export in:
  1. public/decks/physics_electricity_magnetism/<lesson_id>/<lesson_id>.pdf
  2. output/powerpoints_physics_electricity_magnetism/<lesson_id>.pdf
  3. NotebookLMagent/output/powerpoints_physics_electricity_magnetism/<lesson_id>.pdf (if directory exists)
"""

import os
import sys
import json
import shutil
from PIL import Image
from pypdf import PdfReader

BASE_DIR = os.path.abspath("public/decks/physics_electricity_magnetism")
OUTPUT_DIR = os.path.abspath("output/powerpoints_physics_electricity_magnetism")
NOTEBOOK_AGENT_OUTPUT = os.path.abspath(
    "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/NotebookLMagent/output/powerpoints_physics_electricity_magnetism"
)

def process_slide_image(img_path):
    """
    Open slide image and convert to RGB.
    If image has transparency (RGBA, LA, or P with transparency),
    composite cleanly onto a solid white background to avoid black fringes or dark artifacts.
    """
    with Image.open(img_path) as im:
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            im_rgba = im.convert("RGBA")
            bg = Image.new("RGB", im_rgba.size, (255, 255, 255))
            bg.paste(im_rgba, mask=im_rgba.split()[3])
            return bg
        else:
            return im.convert("RGB")


def export_lesson_to_pdf(lesson_dir_name):
    """Export a single lesson deck to PDF."""
    lesson_path = os.path.join(BASE_DIR, lesson_dir_name)
    manifest_path = os.path.join(lesson_path, "manifest.json")
    
    if not os.path.exists(manifest_path):
        print(f"  [ERROR] Manifest not found: {manifest_path}")
        return False, 0, 0, "Manifest missing"

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    raw_slides = manifest.get("slides", [])
    if not raw_slides:
        print(f"  [ERROR] No slides defined in manifest for {lesson_dir_name}")
        return False, 0, 0, "No slides"

    # Sort slides in strict sequential order
    slides = sorted(raw_slides, key=lambda s: int(s.get("number", 0)))
    slide_count = len(slides)

    processed_images = []
    missing_files = []

    for s in slides:
        num = s.get("number")
        img_name = s.get("imageFileName") or s.get("imageUrl") or s.get("image")
        if not img_name:
            missing_files.append((num, "No filename"))
            continue

        if img_name.startswith("/"):
            resolved = os.path.join(os.path.abspath("public"), img_name.lstrip("/"))
        else:
            resolved = os.path.join(lesson_path, "slides", img_name)
            if not os.path.exists(resolved):
                resolved = os.path.join(lesson_path, img_name)

        if not os.path.exists(resolved):
            missing_files.append((num, resolved))
            continue

        rgb_image = process_slide_image(resolved)
        processed_images.append(rgb_image)

    if missing_files:
        print(f"  [ERROR] Missing slide images in {lesson_dir_name}: {missing_files}")
        return False, 0, 0, f"Missing {len(missing_files)} images"

    if not processed_images:
        return False, 0, 0, "No processed images"

    # Define destinations
    deck_pdf_path = os.path.join(lesson_path, f"{lesson_dir_name}.pdf")
    output_pdf_path = os.path.join(OUTPUT_DIR, f"{lesson_dir_name}.pdf")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Save to primary location
    processed_images[0].save(
        deck_pdf_path,
        save_all=True,
        append_images=processed_images[1:],
        resolution=150.0,
        quality=95
    )

    # Copy to output/powerpoints_physics_electricity_magnetism
    shutil.copyfile(deck_pdf_path, output_pdf_path)

    # Copy to NotebookLMagent output if available
    agent_pdf_path = None
    if os.path.exists(NOTEBOOK_AGENT_OUTPUT):
        agent_pdf_path = os.path.join(NOTEBOOK_AGENT_OUTPUT, f"{lesson_dir_name}.pdf")
        shutil.copyfile(deck_pdf_path, agent_pdf_path)

    # Verification with pypdf
    reader = PdfReader(deck_pdf_path)
    actual_pages = len(reader.pages)
    file_size_bytes = os.path.getsize(deck_pdf_path)
    file_size_mb = file_size_bytes / (1024 * 1024)

    if actual_pages != slide_count:
        print(f"  [WARN] Page count mismatch for {lesson_dir_name}: expected {slide_count}, got {actual_pages}")
        return False, actual_pages, file_size_mb, "Page count mismatch"

    return True, actual_pages, file_size_mb, "OK"


def main():
    print("=" * 70)
    print("Exporting Physics Electricity & Magnetism Slide Decks to PDF")
    print(f"Source Directory: {BASE_DIR}")
    print(f"Target Output:   {OUTPUT_DIR}")
    if os.path.exists(NOTEBOOK_AGENT_OUTPUT):
        print(f"Mirror Target:   {NOTEBOOK_AGENT_OUTPUT}")
    print("=" * 70)

    lesson_dirs = sorted([
        d for d in os.listdir(BASE_DIR)
        if os.path.isdir(os.path.join(BASE_DIR, d)) and not d.startswith(".")
    ])

    results = []
    all_success = True

    for lesson in lesson_dirs:
        print(f"\nProcessing {lesson}...")
        success, pages, size_mb, status = export_lesson_to_pdf(lesson)
        if not success:
            all_success = False
        results.append({
            "lesson": lesson,
            "success": success,
            "pages": pages,
            "size_mb": size_mb,
            "status": status
        })
        if success:
            print(f"  ✓ Exported {pages} slides ({size_mb:.2f} MB)")

    print("\n" + "=" * 70)
    print(f"{'Lesson Directory':<40} {'Pages':<8} {'Size (MB)':<12} {'Status'}")
    print("-" * 70)
    total_pages = 0
    total_mb = 0.0
    for r in results:
        status_sym = "✓ PASS" if r["success"] else "✗ FAIL"
        print(f"{r['lesson']:<40} {r['pages']:<8} {r['size_mb']:<12.2f} {status_sym}")
        if r["success"]:
            total_pages += r["pages"]
            total_mb += r["size_mb"]
    print("-" * 70)
    print(f"TOTAL: {len(results)} Decks | {total_pages} Slides | {total_mb:.2f} MB")
    print("=" * 70)

    if not all_success:
        sys.exit(1)
    print("\n✦ All slide decks exported to PDF successfully!")


if __name__ == "__main__":
    main()
