import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

# Battery specifications for all 9 models (calibrated to 2048x1152 coordinate space)
BATTERY_SPECS = {
    'xs': {
        'name': 'iPhone Xs / X',
        'type': 'l_right',
        'stalk': (995, 625, 1125, 1075),
        'foot': (900, 915, 1125, 1075),
        'surface': 'black_pouch',
        'tabs': [(1045, 618), (925, 1078)],
        'fpc': (900, 920, 882, 890) # flex cable from corner to logic board
    },
    '11pro': {
        'name': 'iPhone 11 Pro',
        'type': 'l_right',
        'stalk': (1005, 675, 1115, 1070),
        'foot': (935, 925, 1115, 1070),
        'surface': 'black_pouch',
        'tabs': [(1050, 668), (955, 1073)],
        'fpc': (935, 930, 912, 895)
    },
    '12pro': {
        'name': 'iPhone 12 Pro',
        'type': 'rect',
        'box': (865, 670, 948, 1055),
        'surface': 'black_pouch',
        'tabs': [(895, 662), (895, 1058)],
        'fpc': (948, 710, 968, 725)
    },
    '13pro': {
        'name': 'iPhone 13 Pro',
        'type': 'l_left',
        'stalk': (895, 700, 985, 1055),
        'foot': (895, 935, 1075, 1055),
        'surface': 'black_pouch',
        'tabs': [(930, 692), (1030, 1058)],
        'fpc': (985, 740, 1010, 755)
    },
    '14pro': {
        'name': 'iPhone 14 Pro',
        'type': 'rect',
        'box': (890, 675, 980, 1060),
        'surface': 'black_pouch',
        'tabs': [(925, 668), (925, 1063)],
        'fpc': (980, 720, 1002, 735)
    },
    '15pro': {
        'name': 'iPhone 15 Pro',
        'type': 'rect',
        'box': (870, 675, 956, 1060),
        'surface': 'black_pouch',
        'tabs': [(905, 668), (905, 1063)],
        'fpc': (956, 720, 978, 735)
    },
    '16pro': {
        'name': 'iPhone 16 Pro',
        'type': 'rect',
        'box': (872, 675, 962, 1060),
        'surface': 'steel_cased',
        'tabs': [(908, 666), (908, 1063)],
        'fpc': (962, 715, 984, 730)
    },
    '17pro': {
        'name': 'iPhone 17 Pro',
        'type': 'rect',
        'box': (868, 670, 965, 1060),
        'surface': 'silicon_composite',
        'tabs': [(910, 662), (910, 1063)],
        'fpc': (965, 710, 988, 725)
    },
    '18pro': {
        'name': 'iPhone 18 Pro',
        'type': 'rect',
        'box': (870, 670, 965, 1060),
        'surface': 'graphene_matrix',
        'tabs': [(910, 662), (910, 1063)],
        'fpc': (965, 710, 988, 725)
    }
}

def render_battery_layer(spec, width=4096, height=2304):
    """
    Renders a pristine, text-free, photorealistic hardware battery pack
    directly into its exact chassis position at any resolution.
    Returns (battery_rgba, alpha_mask).
    """
    scale = width / 2048.0
    b_type = spec['type']
    surf = spec['surface']
    
    # 1. Create mask of the battery footprint
    mask = Image.new('L', (width, height), 0)
    dm = ImageDraw.Draw(mask)
    
    rad = int(14 * scale)
    if b_type == 'l_right' or b_type == 'l_left':
        s0 = (int(spec['stalk'][0] * scale), int(spec['stalk'][1] * scale))
        s1 = (int(spec['stalk'][2] * scale), int(spec['stalk'][3] * scale))
        f0 = (int(spec['foot'][0] * scale), int(spec['foot'][1] * scale))
        f1 = (int(spec['foot'][2] * scale), int(spec['foot'][3] * scale))
        dm.rounded_rectangle([s0[0], s0[1], s1[0], s1[1]], radius=rad, fill=255)
        dm.rounded_rectangle([f0[0], f0[1], f1[0], f1[1]], radius=rad, fill=255)
        bx0 = min(s0[0], f0[0])
        by0 = min(s0[1], f0[1])
        bx1 = max(s1[0], f1[0])
        by1 = max(s1[1], f1[1])
    else:
        box = spec['box']
        bx0 = int(box[0] * scale)
        by0 = int(box[1] * scale)
        bx1 = int(box[2] * scale)
        by1 = int(box[3] * scale)
        dm.rounded_rectangle([bx0, by0, bx1, by1], radius=rad, fill=255)
        
    bw = bx1 - bx0
    bh = by1 - by0

    # 2. Render surface texture onto battery canvas
    bat_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(bat_layer)
    
    # Fill based on surface type
    if surf == 'black_pouch':
        # Dark satin Li-ion pouch with subtle 3D lighting gradient
        for y in range(by0, by1 + 1):
            t = (y - by0) / float(bh) if bh > 0 else 0
            # Specular sheen across upper third
            shine = math.exp(-((t - 0.28) ** 2) / 0.05) * 34
            base_l = int(24 + (1.0 - t) * 8 + shine)
            r = base_l
            g = int(base_l * 1.04)
            b = int(base_l * 1.08)
            d.line([(bx0, y), (bx1, y)], fill=(r, g, b, 255))
            
    elif surf == 'steel_cased':
        # Brushed stainless steel enclosure with metallic gradient
        for y in range(by0, by1 + 1):
            t = (y - by0) / float(bh) if bh > 0 else 0
            # Metallic specular bands
            band = math.sin(t * 12.0) * 15 + math.exp(-((t - 0.35)**2)/0.04) * 45
            lum = int(np.clip(185 + band, 140, 245))
            d.line([(bx0, y), (bx1, y)], fill=(lum, lum, int(lum * 1.03), 255))
            
    elif surf == 'silicon_composite':
        # Next-gen dark iridescent silicon composite
        for y in range(by0, by1 + 1):
            t = (y - by0) / float(bh) if bh > 0 else 0
            r = int(20 + t * 15)
            g = int(32 + t * 20)
            b = int(45 + t * 25)
            d.line([(bx0, y), (bx1, y)], fill=(r, g, b, 255))
            
    elif surf == 'graphene_matrix':
        # Advanced carbon-graphene composite
        for y in range(by0, by1 + 1):
            t = (y - by0) / float(bh) if bh > 0 else 0
            r = int(18 + t * 10)
            g = int(28 + t * 18)
            b = int(24 + t * 14)
            d.line([(bx0, y), (bx1, y)], fill=(r, g, b, 255))

    # Mask the battery fill to the exact footprint
    bat_layer = Image.composite(bat_layer, Image.new('RGBA', (width, height), (0, 0, 0, 0)), mask)
    d = ImageDraw.Draw(bat_layer)
    
    # 3. Add perimeter bevel / stamped lip
    border_w = max(1, int(1.5 * scale))
    r_outer = max(4, int(12 * scale))
    r_inner = max(3, int(11 * scale))
    o1 = max(1, int(2 * scale))
    o2 = max(2, int(4 * scale))
    if surf == 'steel_cased':
        # Distinct pressed metallic bezel edge
        d.rounded_rectangle([bx0 + o1, by0 + o1, bx1 - o1, by1 - o1], radius=r_outer, outline=(245, 248, 255, 220), width=border_w)
        d.rounded_rectangle([bx0 + o2, by0 + o2, bx1 - o2, by1 - o2], radius=r_inner, outline=(130, 135, 145, 180), width=border_w)
    else:
        # Subtle pouch weld border
        d.rounded_rectangle([bx0 + o1, by0 + o1, bx1 - o1, by1 - o1], radius=r_outer, outline=(55, 60, 68, 160), width=border_w)
        d.rounded_rectangle([bx0 + o2, by0 + o2, bx1 - o2, by1 - o2], radius=r_inner, outline=(15, 18, 22, 180), width=border_w)

    # 4. Adhesive pull tabs
    for (ptx, pty) in spec['tabs']:
        tx = int(ptx * scale)
        ty = int(pty * scale)
        tab_w = int(24 * scale)
        tab_h = int(10 * scale)
        tab_col = (230, 235, 242, 220) if surf != 'steel_cased' else (50, 52, 58, 220)
        d.rounded_rectangle([tx - tab_w//2, ty - tab_h//2, tx + tab_w//2, ty + tab_h//2], radius=max(2, int(3*scale)), fill=tab_col)
        # Pull direction arrow
        arr_col = (40, 45, 50, 240) if surf != 'steel_cased' else (220, 225, 235, 240)
        arr_dy = int(2 * scale) if ty > by0 + bh//2 else -int(2 * scale)
        arr_tip = int(5 * scale) if ty > by0 + bh//2 else -int(5 * scale)
        arr_dx = int(4 * scale)
        d.polygon([(tx - arr_dx, ty + arr_dy),
                   (tx + arr_dx, ty + arr_dy),
                   (tx, ty + arr_tip)], fill=arr_col)

    # 5. FPC ribbon cable connector
    fpc = [int(v * scale) for v in spec['fpc']]
    fpc_w1 = max(4, int(8 * scale))
    fpc_w2 = max(3, int(6 * scale))
    d.line([(fpc[0], fpc[1]), (fpc[2], fpc[3])], fill=(30, 32, 38, 255), width=fpc_w1)
    d.line([(fpc[0], fpc[1]), (fpc[2], fpc[3])], fill=(55, 58, 66, 255), width=fpc_w2)
    # Gold pins at connector head
    head_pad = int(5 * scale)
    head_h = int(8 * scale)
    d.rounded_rectangle([fpc[2] - head_pad, fpc[3] - head_h, fpc[2] + head_pad, fpc[3] + head_h],
                        radius=max(1, int(2*scale)), fill=(40, 42, 48, 255), outline=(70, 75, 85, 255))
    pin_pad = int(3 * scale)
    pin_h = int(6 * scale)
    d.rectangle([fpc[2] - pin_pad, fpc[3] - pin_h, fpc[2] + pin_pad, fpc[3] + pin_h], fill=(212, 175, 55, 255))

    # ZERO TEXT OR CERTIFICATION BOXES DRAWN (PURE HARDWARE)
    return bat_layer, mask

def add_ambient_shadow(base, obj_alpha, blur=8, opacity=160, dy=4):
    """Adds a soft natural ambient drop-shadow under components in the chassis cavity."""
    w, h = base.size
    shadow_mask = Image.new('L', (w, h), 0)
    shadow_mask.paste(obj_alpha, (0, dy))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(blur))
    shadow_fill = Image.new('RGBA', (w, h), (0, 0, 0, opacity))
    return Image.composite(shadow_fill, base, shadow_mask)

def generate_all_batteries():
    print("Generating custom, geometrically accurate 4K text-free batteries for all 9 iPhone models...")
    for model, spec in BATTERY_SPECS.items():
        base_path = f"assets/phone_{model}.png"
        if not os.path.exists(base_path):
            print(f"Base phone {base_path} not found!")
            continue
        base = Image.open(base_path).convert('RGBA')
        w, h = base.size
        scale = w / 2048.0
        
        # 1. Render custom battery layer and alpha mask at base phone resolution (4096x2304)
        bat_layer, mask = render_battery_layer(spec, w, h)
        
        # 2. Add realistic chassis cavity ambient shadow
        blur = max(4, int(6 * scale))
        dy = max(2, int(3 * scale))
        comp = add_ambient_shadow(base, mask, blur=blur, opacity=150, dy=dy)
        
        # 3. Composite battery onto base phone
        comp = Image.alpha_composite(comp, bat_layer)
        
        # 4. Save component cutaway image
        cutaway_path = f"assets/comp_{model}_battery.png"
        comp.save(cutaway_path, "PNG", compress_level=2)
        
        # 5. Save standalone isolated battery pack asset
        bbox = mask.getbbox()
        if bbox:
            pad = int(12 * scale)
            x0 = max(0, bbox[0] - pad)
            y0 = max(0, bbox[1] - pad)
            x1 = min(w, bbox[2] + pad)
            y1 = min(h, bbox[3] + pad)
            isolated = bat_layer.crop((x0, y0, x1, y1))
            isolated_path = f"assets/battery_{model}.png"
            isolated.save(isolated_path, "PNG", compress_level=2)
            
        print(f"✓ Generated {cutaway_path} ({w}x{h}) and assets/battery_{model}.png without text")

    # Generate a clean 512x512 badge_battery.png from the clean L-pack
    if os.path.exists('assets/battery_xs.png'):
        iso = Image.open('assets/battery_xs.png').convert('RGBA')
        # Center into 512x512
        badge = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
        # Aspect fit into 440x440
        iw, ih = iso.size
        fit_scale = min(440.0 / iw, 440.0 / ih)
        nw, nh = int(iw * fit_scale), int(ih * fit_scale)
        iso_scaled = iso.resize((nw, nh), Image.Resampling.LANCZOS)
        badge.paste(iso_scaled, ((512 - nw)//2, (512 - nh)//2), iso_scaled)
        badge.save('assets/badge_battery.png', 'PNG')
        print("✓ Updated assets/badge_battery.png (512x512, text-free)")

if __name__ == '__main__':
    generate_all_batteries()
