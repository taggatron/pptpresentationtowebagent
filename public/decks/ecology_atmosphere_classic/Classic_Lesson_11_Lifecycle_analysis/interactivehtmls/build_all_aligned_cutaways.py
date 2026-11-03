import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

# All 9 iPhone generations
TARGET_MODELS = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro']

# Load base badge assets (512x512, clean text-free)
bat_badge = Image.open('assets/badge_battery.png').convert('RGBA')
pcb_badge = Image.open('assets/badge_circuit_boards.png').convert('RGBA')
coil_badge = Image.open('assets/badge_other.png').convert('RGBA')
disp_badge = Image.open('assets/badge_display.png').convert('RGBA')
frame_badge = Image.open('assets/badge_stainless_steel.png').convert('RGBA')

# Model-specific hardware specifications
MODEL_SPECS = {
    'xs': {
        'frame_type': 'steel_round', 'has_magsafe': False
    },
    '11pro': {
        'frame_type': 'steel_round', 'has_magsafe': False
    },
    '12pro': {
        'frame_type': 'steel_flat', 'has_magsafe': True
    },
    '13pro': {
        'frame_type': 'steel_flat', 'has_magsafe': True
    },
    '14pro': {
        'frame_type': 'steel_flat', 'has_magsafe': True
    },
    '15pro': {
        'frame_type': 'titanium_brushed', 'has_magsafe': True
    },
    '16pro': {
        'frame_type': 'titanium_microblast', 'has_magsafe': True
    },
    '17pro': {
        'frame_type': 'titanium_microblast', 'has_magsafe': True
    },
    '18pro': {
        'frame_type': 'titanium_microblast', 'has_magsafe': True
    },
}

# Coordinate bounds calibrated to base 2048x1152 coordinate space
# (Automatically dynamically scaled to 4096x2304 or any resolution)
PHONE_GEOMETRY = {
    'xs':    {'front': (488, 541, 797, 1147), 'back': (860, 541, 1168, 1147), 'cx_back': 1014, 'cy_back': 844},
    '11pro': {'front': (577, 549, 819, 1147), 'back': (842, 549, 1073, 1147), 'cx_back': 957, 'cy_back': 848},
    '12pro': {'front': (585, 553, 821, 1144), 'back': (843, 554, 1069, 1144), 'cx_back': 956, 'cy_back': 849},
    '13pro': {'front': (580, 554, 819, 1146), 'back': (843, 554, 1072, 1146), 'cx_back': 958, 'cy_back': 850},
    '14pro': {'front': (577, 551, 818, 1146), 'back': (842, 552, 1071, 1146), 'cx_back': 956, 'cy_back': 849},
    '15pro': {'front': (587, 555, 825, 1141), 'back': (846, 555, 1068, 1144), 'cx_back': 957, 'cy_back': 849},
    '16pro': {'front': (578, 553, 810, 1147), 'back': (845, 553, 1077, 1147), 'cx_back': 961, 'cy_back': 850},
    '17pro': {'front': (581, 552, 815, 1147), 'back': (841, 553, 1075, 1147), 'cx_back': 958, 'cy_back': 850},
    '18pro': {'front': (583, 551, 810, 1142), 'back': (846, 551, 1073, 1142), 'cx_back': 959, 'cy_back': 846},
}

def get_scaled_geo(model, width):
    scale = width / 2048.0
    g = PHONE_GEOMETRY.get(model, PHONE_GEOMETRY['xs'])
    return {
        'front': tuple(int(v * scale) for v in g['front']),
        'back': tuple(int(v * scale) for v in g['back']),
        'cx_back': int(g['cx_back'] * scale),
        'cy_back': int(g['cy_back'] * scale),
        'scale': scale
    }

def add_ambient_shadow(base, obj_alpha, x=0, y=0, blur=5, opacity=140):
    """Adds a soft natural ambient occlusion drop-shadow under hardware components."""
    w, h = base.size
    shadow_mask = Image.new('L', (w, h), 0)
    shadow_mask.paste(obj_alpha, (x, y + max(2, int(blur * 0.5))))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(blur))
    shadow_fill = Image.new('RGBA', (w, h), (0, 0, 0, opacity))
    return Image.composite(shadow_fill, base, shadow_mask)

def draw_chip_label(draw, cx, cy, scale=1.0):
    """Draws an authentic Apple Silicon BGA package with dark ceramic lid, chamfers, and pin index. NO text."""
    w, h = int(92 * scale), int(80 * scale)
    x0, y0 = cx - w//2, cy - h//2
    rad = max(4, int(8 * scale))
    border_w = max(1, int(scale))
    
    # Dark ceramic heat-spreader body
    draw.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=rad, fill=(22, 25, 30, 250), outline=(52, 58, 66, 255), width=border_w)
    
    # Chamfered inner lid highlight
    inner_rad = max(3, int(6 * scale))
    o = max(2, int(3 * scale))
    draw.rounded_rectangle([x0 + o, y0 + o, x0 + w - o, y0 + h - o], radius=inner_rad, outline=(38, 43, 50, 240), width=border_w)
    
    # Gold Pin-1 index mark dot at top-left
    dot_sz = max(4, int(7 * scale))
    dx = x0 + int(12 * scale)
    dy = y0 + int(12 * scale)
    draw.ellipse([dx, dy, dx + dot_sz, dy + dot_sz], fill=(212, 175, 55, 230))
    
    # Subtle corner test pads
    pad_sz = max(2, int(4 * scale))
    draw.rectangle([x0 + w - int(14*scale), y0 + int(10*scale), x0 + w - int(14*scale) + pad_sz, y0 + int(10*scale) + pad_sz], fill=(212, 175, 55, 220))
    draw.rectangle([x0 + w - int(14*scale), y0 + h - int(14*scale), x0 + w - int(14*scale) + pad_sz, y0 + h - int(14*scale) + pad_sz], fill=(212, 175, 55, 220))

def create_battery_cutaway(base, model):
    """Reveals the internal battery pack seamlessly with realistic hardware texture and NO text."""
    from render_custom_batteries import BATTERY_SPECS, render_battery_layer
    w, h = base.size
    scale = w / 2048.0
    if model in BATTERY_SPECS:
        bat_layer, mask = render_battery_layer(BATTERY_SPECS[model], w, h)
        comp = add_ambient_shadow(base, mask, 0, 0, blur=max(4, int(6*scale)), opacity=150)
        return Image.alpha_composite(comp, bat_layer)
    return base

def create_circuit_boards_cutaway(base, model):
    """Reveals the logic board PCB and Apple Silicon processor package with NO text."""
    w, h = base.size
    comp = base.copy()
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    
    rx0, ry0, rx1, ry1 = geo['back']
    rw = rx1 - rx0
    cx0 = rx0 + int(14 * scale)
    cx1 = rx0 + int(rw * 0.44)
    cy0 = ry0 + int(14 * scale)
    cy1 = ry0 + int((ry1 - ry0) * 0.28)
    px0 = cx1 + int(4 * scale)
    px1 = rx1 - int(18 * scale)
    py0 = ry0 + int(14 * scale)
    py1 = ry0 + int((ry1 - ry0) * 0.35)
    pw, ph = px1 - px0, py1 - py0

    pcb_scaled = pcb_badge.resize((pw, ph), Image.Resampling.LANCZOS)
    comp = add_ambient_shadow(comp, pcb_scaled.split()[3], px0, py0, blur=max(3, int(4*scale)), opacity=130)
    comp.paste(pcb_scaled, (px0, py0), pcb_scaled)

    # Apple Silicon Chip package (pristine BGA lid with NO text)
    chip_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    dchip = ImageDraw.Draw(chip_layer)
    draw_chip_label(dchip, (px0 + px1)//2, (py0 + py1)//2 - int(6 * scale), scale=scale)
    comp = Image.alpha_composite(comp, chip_layer)
    return comp

def create_display_cutaway(base, model):
    """Reveals the Super Retina XDR OLED display panel by enhancing screen vibrance and contrast."""
    w, h = base.size
    comp = base.copy()
    spec = MODEL_SPECS.get(model, MODEL_SPECS['xs'])
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    
    fx0, fy0, fx1, fy1 = geo['front']
    o = int(8 * scale)
    dx0, dy0, dx1, dy1 = fx0 + o, fy0 + o, fx1 - o, fy1 - o
    radius = int(34 * scale) if 'flat' in spec['frame_type'] or 'titanium' in spec['frame_type'] else int(38 * scale)

    screen_mask = Image.new('L', (w, h), 0)
    ds = ImageDraw.Draw(screen_mask)
    ds.rounded_rectangle([dx0, dy0, dx1, dy1], radius=radius, fill=255)
    screen_mask = screen_mask.filter(ImageFilter.GaussianBlur(max(2, int(2 * scale))))

    # Brighten and enrich the active OLED panel
    enhancer = ImageEnhance.Color(base)
    vibrant_base = enhancer.enhance(1.35)
    enhancer_b = ImageEnhance.Brightness(vibrant_base)
    vibrant_base = enhancer_b.enhance(1.15)
    comp = Image.composite(vibrant_base, comp, screen_mask)
    return comp

def create_frame_cutaway(base, model):
    """Enhances the physical precision-machined metallic chassis bevel with natural studio luster."""
    w, h = base.size
    comp = base.copy()
    spec = MODEL_SPECS.get(model, MODEL_SPECS['xs'])
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    
    fx0, fy0, fx1, fy1 = geo['front']
    rx0, ry0, rx1, ry1 = geo['back']
    radius = int(34 * scale) if 'flat' in spec['frame_type'] or 'titanium' in spec['frame_type'] else int(40 * scale)

    # Natural metallic edge highlight along physical perimeter bevel
    edge_mask = Image.new('L', (w, h), 0)
    dedge = ImageDraw.Draw(edge_mask)
    border_w = max(3, int(5 * scale))
    dedge.rounded_rectangle([fx0, fy0, fx1, fy1], radius=radius, outline=200, width=border_w)
    dedge.rounded_rectangle([rx0, ry0, rx1, ry1], radius=radius, outline=200, width=border_w)
    edge_mask = edge_mask.filter(ImageFilter.GaussianBlur(max(2, int(3 * scale))))

    enhancer = ImageEnhance.Brightness(base)
    bright_base = enhancer.enhance(1.28)
    comp = Image.composite(bright_base, comp, edge_mask)
    return comp

def create_wireless_cutaway(base, model):
    """Reveals the internal copper wireless charging coil and MagSafe neodymium alignment magnets. NO text."""
    w, h = base.size
    comp = base.copy()
    spec = MODEL_SPECS.get(model, MODEL_SPECS['xs'])
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    
    cx, cy = geo['cx_back'], geo['cy_back']
    rw = geo['back'][2] - geo['back'][0]
    r = int(64 * scale) if model == 'xs' else int(rw * 0.28)
    x0, y0 = cx - r, cy - r

    coil_scaled = coil_badge.resize((r * 2, r * 2), Image.Resampling.LANCZOS)
    comp = add_ambient_shadow(comp, coil_scaled.split()[3], x0, y0, blur=max(3, int(5 * scale)), opacity=140)
    comp.paste(coil_scaled, (x0, y0), coil_scaled)

    if spec['has_magsafe']:
        dmag = ImageDraw.Draw(comp)
        mw = max(3, int(4 * scale))
        my_start = cy + r - int(2 * scale)
        my_end = cy + r + int(16 * scale)
        dmag.rounded_rectangle([cx - mw, my_start, cx + mw, my_end],
                               radius=max(2, int(3 * scale)),
                               fill=(215, 220, 228, 245), outline=(150, 155, 165, 230), width=max(1, int(scale)))
    return comp

def create_glass_cutaway(base, model):
    """Reveals the precision rear glass with a clean optical light reflection."""
    w, h = base.size
    comp = base.copy()
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    rx0, ry0, rx1, ry1 = geo['back']
    radius = int(36 * scale)

    # Pure neutral white optical glass reflection beam (zero green tint, zero outline)
    glass_mask = Image.new('L', (w, h), 0)
    dmask = ImageDraw.Draw(glass_mask)
    o = max(1, int(2 * scale))
    dmask.rounded_rectangle([rx0 + o, ry0 + o, rx1 - o, ry1 - o], radius=radius, fill=255)

    sheen = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    dsheen = ImageDraw.Draw(sheen)
    # Soft diagonal light beam at 45 degrees across rear glass
    beam_w = (rx1 - rx0) * 0.4
    center_beam = rx0 + (rx1 - rx0) * 0.55
    shift = int(90 * scale)
    dsheen.polygon([
        (center_beam - beam_w, ry0),
        (center_beam + beam_w, ry0),
        (center_beam + beam_w - shift, ry1),
        (center_beam - beam_w - shift, ry1)
    ], fill=(255, 255, 255, 38))
    sheen = sheen.filter(ImageFilter.GaussianBlur(max(6, int(14 * scale))))

    sheen_clipped = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sheen_clipped = Image.composite(sheen, sheen_clipped, glass_mask)
    comp = Image.alpha_composite(comp, sheen_clipped)
    return comp

def create_plastics_cutaway(base, model):
    """Reveals the internal bottom acoustic module, speaker chamber, and Taptic Engine. NO text."""
    w, h = base.size
    comp = base.copy()
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    rx0, ry0, rx1, ry1 = geo['back']
    
    px0 = rx0 + int(16 * scale)
    px1 = rx1 - int(16 * scale)
    py0 = ry1 - int((ry1 - ry0) * 0.16)
    py1 = ry1 - int(12 * scale)
    pw, ph = px1 - px0, py1 - py0

    # Realistic internal acoustic module hardware
    module = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
    dmod = ImageDraw.Draw(module)
    dmod.rounded_rectangle([0, 0, pw, ph], radius=max(3, int(8 * scale)),
                           fill=(28, 30, 34, 245), outline=(55, 58, 65, 255), width=max(1, int(scale)))
    # Speaker grille ports (hardware vents)
    step = max(4, int(8 * scale))
    hole_w = max(2, int(4 * scale))
    hole_h = max(3, int(6 * scale))
    pad = int(16 * scale)
    for x in range(pad, pw - pad, step):
        dmod.rounded_rectangle([x, ph//2 - hole_h, x + hole_w, ph//2 + hole_h],
                               radius=max(1, int(2 * scale)), fill=(15, 16, 18, 255))
    # NO text drawn

    comp = add_ambient_shadow(comp, module.split()[3], px0, py0, blur=max(3, int(4 * scale)), opacity=130)
    comp.paste(module, (px0, py0), module)
    return comp

def create_aluminum_cutaway(base, model):
    """Reveals the brushed internal aluminum thermal dissipation matrix. NO text."""
    w, h = base.size
    comp = base.copy()
    geo = get_scaled_geo(model, w)
    scale = geo['scale']
    cx, cy = geo['cx_back'], geo['cy_back']
    rw = geo['back'][2] - geo['back'][0]
    
    ax0 = cx - int(rw * 0.24)
    ax1 = cx + int(rw * 0.24)
    ay0 = cy - int(65 * scale)
    ay1 = cy + int(65 * scale)
    aw, ah = ax1 - ax0, ay1 - ay0

    # Realistic brushed aluminum thermal dissipation shield
    shield = Image.new('RGBA', (aw, ah), (0, 0, 0, 0))
    dshield = ImageDraw.Draw(shield)
    dshield.rounded_rectangle([0, 0, aw, ah], radius=max(4, int(10 * scale)),
                             fill=(160, 165, 175, 235), outline=(200, 205, 215, 255), width=max(1, int(scale)))
    
    # Brushed aluminum horizontal surface grain
    for y in range(int(6 * scale), ah - int(6 * scale), max(2, int(3 * scale))):
        lum = 150 + ((y * 13) % 25)
        dshield.line([(int(8 * scale), y), (aw - int(8 * scale), y)], fill=(lum, lum + 2, lum + 5, 100))
        
    # Precision corner screw mounting holes
    screw_rad = max(2, int(3.5 * scale))
    screw_inset = int(12 * scale)
    for (sx, sy) in [(screw_inset, screw_inset),
                     (aw - screw_inset, screw_inset),
                     (screw_inset, ah - screw_inset),
                     (aw - screw_inset, ah - screw_inset)]:
        dshield.ellipse([sx - screw_rad, sy - screw_rad, sx + screw_rad, sy + screw_rad],
                        fill=(110, 115, 125, 255), outline=(220, 225, 235, 255), width=1)
        # Screw cross groove
        dshield.line([(sx - screw_rad + 1, sy), (sx + screw_rad - 1, sy)], fill=(50, 55, 60, 255))
    # NO text drawn

    comp = add_ambient_shadow(comp, shield.split()[3], ax0, ay0, blur=max(3, int(4 * scale)), opacity=130)
    comp.paste(shield, (ax0, ay0), shield)
    return comp

def build_all():
    print("Generating model-aligned 4096x2304 4K clean text-free component cutaways...")
    for model in TARGET_MODELS:
        base_path = f"assets/phone_{model}.png"
        if not os.path.exists(base_path):
            print(f"Skipping {model} (base file missing)")
            continue
        base = Image.open(base_path).convert('RGBA')
        w, h = base.size

        # 1. Battery (text-free)
        bat_img = create_battery_cutaway(base, model)
        bat_img.save(f"assets/comp_{model}_battery.png", "PNG", compress_level=2)

        # 2. Circuit Boards & Logic Chip (text-free)
        pcb_img = create_circuit_boards_cutaway(base, model)
        pcb_img.save(f"assets/comp_{model}_circuit_boards.png", "PNG", compress_level=2)

        # 3. Display
        disp_img = create_display_cutaway(base, model)
        disp_img.save(f"assets/comp_{model}_display.png", "PNG", compress_level=2)

        # 4. Stainless Steel / Titanium Frame
        frame_img = create_frame_cutaway(base, model)
        frame_img.save(f"assets/comp_{model}_stainless_steel.png", "PNG", compress_level=2)

        # 5. Other (Wireless Charging Coil & MagSafe - text-free)
        coil_img = create_wireless_cutaway(base, model)
        coil_img.save(f"assets/comp_{model}_other.png", "PNG", compress_level=2)

        # 6. Glass
        glass_img = create_glass_cutaway(base, model)
        glass_img.save(f"assets/comp_{model}_glass.png", "PNG", compress_level=2)

        # 7. Plastics (Acoustic Chamber & Taptic - text-free)
        plastics_img = create_plastics_cutaway(base, model)
        plastics_img.save(f"assets/comp_{model}_plastics.png", "PNG", compress_level=2)

        # 8. Aluminum (Thermal Matrix Shield - text-free)
        alum_img = create_aluminum_cutaway(base, model)
        alum_img.save(f"assets/comp_{model}_aluminum.png", "PNG", compress_level=2)

        print(f"✓ Generated 8 clean text-free 4K cutaways for {model} ({w}x{h})", flush=True)

if __name__ == '__main__':
    build_all()
