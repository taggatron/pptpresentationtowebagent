import os
import glob
from PIL import Image, ImageFilter

TARGET_MODELS = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro']
TARGET_W = 4096
TARGET_H = 2304

def upscale_phone(input_path, output_path):
    print(f"Upscaling {input_path} -> {output_path} (4096x2304 4K UHD)...")
    im = Image.open(input_path).convert('RGBA')
    w, h = im.size
    
    # 1. High-order Lanczos resampling
    up = im.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    
    # 2. Extract channels to apply edge enhancement to RGB without fringing transparent edges
    r, g, b, a = up.split()
    rgb = Image.merge('RGB', (r, g, b))
    
    # Subtle professional unsharp mask to crisp up hardware chamfers, glass bevels, and OLED details
    rgb_sharp = rgb.filter(ImageFilter.UnsharpMask(radius=1.2, percent=105, threshold=2))
    
    sr, sg, sb = rgb_sharp.split()
    final_img = Image.merge('RGBA', (sr, sg, sb, a))
    
    final_img.save(output_path, "PNG", compress_level=2)
    print(f"✓ Saved {output_path} ({TARGET_W}x{TARGET_H})")

def main():
    print("Beginning 4K UHD upscaling for all 9 iPhone studio presentation images...")
    for model in TARGET_MODELS:
        in_path = f"assets/backup_2048/phone_{model}.png"
        if not os.path.exists(in_path):
            in_path = f"assets/phone_{model}.png"
        out_path = f"assets/phone_{model}.png"
        upscale_phone(in_path, out_path)
    print("All 9 iPhone phone presentation models successfully upscaled to 4K resolution!")

if __name__ == '__main__':
    main()
