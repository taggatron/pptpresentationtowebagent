import os
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, 'assets')

CUTOFFS = {
    'xs':    (105, 898),
    '11pro': (108, 946),
    '12pro': (111, 930),
    '13pro': (92, 915),
    '14pro': (134, 912),
    '15pro': (104, 902),
    '16pro': (122, 918),
    '17pro': (85, 930),
    '18pro': (121, 935)
}

TEARDOWN_PATHS = {
    'xs': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_xs_teardown_1790663403616.jpg',
    '11pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_11pro_teardown_1790663382889.jpg',
    '12pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_12pro_teardown_1790663422223.jpg',
    '13pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_13pro_teardown_1790663441687.jpg',
    '14pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_14pro_teardown_1790663459673.jpg',
    '15pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_15pro_teardown_1790663475766.jpg',
    '16pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_16pro_teardown_1790663493221.jpg',
    '17pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_17pro_teardown_1790663510300.jpg',
    '18pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_18pro_teardown_1790663530208.jpg'
}

MODEL_HOTSPOT_BOUNDS = {
  'xs':      {'front': [244, 270.5, 398.5, 573.5], 'back': [430, 270.5, 584, 573.5]},
  '11pro': {'front': [255.5, 270, 405.5, 573.5], 'back': [450, 277.5, 572.5, 573.5]},
  '12pro': {'front': [297.5, 277, 410, 573], 'back': [420.5, 277, 530, 572.5]},
  '13pro': {'front': [266.5, 271, 413.5, 573.5], 'back': [436, 273, 562, 573.5]},
  '14pro': {'front': [276, 273.5, 418.5, 573.5], 'back': [432.5, 277, 553.5, 573.5]},
  '15pro': {'front': [293.5, 277.5, 412.5, 570.5], 'back': [423, 277.5, 534, 572]},
  '16pro': {'front': [289, 276.5, 405, 573.5], 'back': [422.5, 276.5, 538.5, 573.5]},
  '17pro': {'front': [290.5, 276, 407.5, 573.5], 'back': [420.5, 276.5, 537.5, 573.5]},
  '18pro': {'front': [291.5, 275.5, 405, 571], 'back': [423, 275.5, 536.5, 571]}
}

def remove_bg(img):
    arr = np.array(img, dtype=np.float32)
    top_bar = arr[:20, :]
    bot_bar = arr[-20:, :]
    left_bar = arr[:, :20]
    right_bar = arr[:, -20:]
    bg_samples = np.concatenate([top_bar.reshape(-1, 3), bot_bar.reshape(-1, 3), left_bar.reshape(-1, 3), right_bar.reshape(-1, 3)])
    bg_color = np.median(bg_samples, axis=0)
    
    diff = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    alpha = np.clip((diff - 14.0) / 12.0 * 255.0, 0, 255).astype(np.uint8)
    
    out = np.zeros((img.height, img.width, 4), dtype=np.uint8)
    out[:, :, :3] = np.array(img)[:, :, :3]
    out[:, :, 3] = alpha
    return Image.fromarray(out, 'RGBA')

def extract_clean_phones(model):
    path = TEARDOWN_PATHS[model]
    raw = Image.open(path)
    rgba = remove_bg(raw)
    arr = np.array(rgba)
    
    top_y, bot_y = CUTOFFS[model]
    arr[:top_y, :, 3] = 0
    arr[bot_y:, :, 3] = 0
    alpha = arr[:, :, 3]
    mask = alpha > 40
    
    # Left phone (front)
    l_mask = mask[:, :512]
    l_cols = np.where(l_mask.sum(axis=0) > 40)[0]
    l_rows = np.where(l_mask.sum(axis=1) > 40)[0]
    left_crop = rgba.crop((l_cols[0], l_rows[0], l_cols[-1] + 1, l_rows[-1] + 1))
    
    # Right phone (teardown open chassis)
    r_mask = mask[:, 512:]
    r_cols = np.where(r_mask.sum(axis=0) > 40)[0]
    r_rows = np.where(r_mask.sum(axis=1) > 40)[0]
    right_crop = rgba.crop((512 + r_cols[0], r_rows[0], 512 + r_cols[-1] + 1, r_rows[-1] + 1))
    
    return left_crop, right_crop

def build_open_base(model):
    left_phone, right_phone = extract_clean_phones(model)
    b = MODEL_HOTSPOT_BOUNDS[model]
    
    lx0, ly0, lx1, ly1 = [int(v * 4) for v in b['front']]
    rx0, ry0, rx1, ry1 = [int(v * 4) for v in b['back']]
    
    lw, lh = lx1 - lx0, ly1 - ly0
    rw, rh = rx1 - rx0, ry1 - ry0
    
    left_scaled = left_phone.resize((lw, lh), Image.Resampling.LANCZOS)
    right_scaled = right_phone.resize((rw, rh), Image.Resampling.LANCZOS)
    
    base = Image.new('RGBA', (4096, 2304), (0, 0, 0, 0))
    base.paste(left_scaled, (lx0, ly0), left_scaled)
    base.paste(right_scaled, (rx0, ry0), right_scaled)
    
    return base, (lx0, ly0, lx1, ly1), (rx0, ry0, rx1, ry1)

def make_glow(mask, color, radius=18, opacity=1.0):
    edge = mask.filter(ImageFilter.FIND_EDGES)
    glow = edge.filter(ImageFilter.GaussianBlur(radius))
    rgb = color[:3]
    glow_rgba = Image.new('RGBA', mask.size, rgb + (255,))
    glow_alpha = ImageEnhance.Brightness(glow).enhance(2.8 * opacity)
    glow_rgba.putalpha(glow_alpha)
    return glow_rgba

def make_tint(mask, color, opacity=0.16):
    rgb = color[:3]
    tint = Image.new('RGBA', mask.size, rgb + (int(255 * opacity),))
    tint_masked = Image.new('RGBA', mask.size, (0, 0, 0, 0))
    tint_masked.paste(tint, (0, 0), mask)
    return tint_masked

def generate_cutaways_for_model(model):
    print(f'Generating 8 in-situ cutaways for {model}...')
    base, l_box, r_box = build_open_base(model)
    w, h = base.size
    
    # Save the base open-chassis phone image so base and cutaways match 100%
    base.save(os.path.join(ASSETS_DIR, f'phone_{model}.png'))
    
    lx0, ly0, lx1, ly1 = l_box
    rx0, ry0, rx1, ry1 = r_box
    rw = rx1 - rx0
    rh = ry1 - ry0
    
    # Contextual dimmed background base
    dimmed_rgb = ImageEnhance.Brightness(base.convert('RGB')).enhance(0.40)
    dimmed_rgb = ImageEnhance.Color(dimmed_rgb).enhance(0.65)
    dimmed = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    dimmed.paste(dimmed_rgb, (0, 0), base.split()[3])
    
    # ---------------- 1. BATTERY ----------------
    m_bat = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_bat)
    if model == 'xs':
        # Battery on left side
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.14), rx0 + int(rw * 0.54), ry0 + int(rh * 0.58)], radius=14, fill=255)
    elif model == '11pro':
        # True L-shaped battery wrapping around the left-center coil
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.26), rx0 + int(rw * 0.50), ry0 + int(rh * 0.34)], radius=12, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.26), rx0 + int(rw * 0.20), ry0 + int(rh * 0.60)], radius=12, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.60), rx0 + int(rw * 0.80), ry0 + int(rh * 0.81)], radius=12, fill=255)
    elif model == '13pro':
        # Contoured L-shaped battery
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.28), rx0 + int(rw * 0.52), ry0 + int(rh * 0.86)], radius=14, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.52), ry0 + int(rh * 0.68), rx0 + int(rw * 0.84), ry0 + int(rh * 0.86)], radius=14, fill=255)
    elif model == '17pro':
        # Lower horizontal cell
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.66), rx0 + int(rw * 0.88), ry0 + int(rh * 0.84)], radius=14, fill=255)
    elif model == '18pro':
        # Solid-state cell
        d.rounded_rectangle([rx0 + int(rw * 0.10), ry0 + int(rh * 0.48), rx0 + int(rw * 0.90), ry0 + int(rh * 0.65)], radius=14, fill=255)
    else: # 12pro, 14pro, 15pro, 16pro
        # Rectangular battery on left side
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.28), rx0 + int(rw * 0.52), ry0 + int(rh * 0.81)], radius=14, fill=255)
    
    m_bat = m_bat.filter(ImageFilter.GaussianBlur(3))
    comp_bat = dimmed.copy()
    comp_bat.paste(ImageEnhance.Brightness(ImageEnhance.Contrast(base).enhance(1.20)).enhance(1.08), (0, 0), m_bat)
    glow_bat_color = (200, 220, 240) if model == '16pro' else (255, 175, 40)
    comp_bat.paste(make_tint(m_bat, glow_bat_color, 0.14), (0, 0), make_tint(m_bat, glow_bat_color, 0.14))
    glow_bat = make_glow(m_bat, glow_bat_color, radius=18, opacity=1.0)
    comp_bat.paste(glow_bat, (0, 0), glow_bat)
    comp_bat.save(os.path.join(ASSETS_DIR, f'comp_{model}_battery.png'))
    
    # ---------------- 2. CIRCUIT BOARDS ----------------
    m_cb = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_cb)
    if model == 'xs':
        # Camera top-right + vertical logic board
        d.rounded_rectangle([rx0 + int(rw * 0.58), ry0 + int(rh * 0.04), rx0 + int(rw * 0.90), ry0 + int(rh * 0.22)], radius=14, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.54), ry0 + int(rh * 0.22), rx0 + int(rw * 0.91), ry0 + int(rh * 0.60)], radius=12, fill=255)
    elif model == '18pro':
        # Camera top-left + center A20 SoC motherboard
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.04), rx0 + int(rw * 0.48), ry0 + int(rh * 0.26)], radius=14, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.10), ry0 + int(rh * 0.26), rx0 + int(rw * 0.90), ry0 + int(rh * 0.48)], radius=14, fill=255)
    else:
        # Camera cluster on top-left, logic board on right
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.04), rx0 + int(rw * 0.52), ry0 + int(rh * 0.27)], radius=14, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.54), ry0 + int(rh * 0.04), rx0 + int(rw * 0.91), ry0 + int(rh * 0.66)], radius=12, fill=255)
    
    m_cb = m_cb.filter(ImageFilter.GaussianBlur(3))
    comp_cb = dimmed.copy()
    comp_cb.paste(ImageEnhance.Brightness(ImageEnhance.Sharpness(ImageEnhance.Contrast(base).enhance(1.22)).enhance(1.3)).enhance(1.10), (0, 0), m_cb)
    cb_color = (30, 215, 180)
    comp_cb.paste(make_tint(m_cb, cb_color, 0.15), (0, 0), make_tint(m_cb, cb_color, 0.15))
    glow_cb = make_glow(m_cb, cb_color, radius=18, opacity=1.0)
    comp_cb.paste(glow_cb, (0, 0), glow_cb)
    comp_cb.save(os.path.join(ASSETS_DIR, f'comp_{model}_circuit_boards.png'))
    
    # ---------------- 3. OTHER (COIL / MAGSAFE & TAPTIC ENGINE) ----------------
    m_other = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_other)
    
    # Precise physical Taptic Engine box for each model
    ty0, ty1 = (0.86, 0.94) if model == '13pro' else (0.83, 0.90) if model == '16pro' else (0.85, 0.91) if model in ['17pro', '18pro'] else (0.81, 0.89)
    d.rounded_rectangle([rx0 + int(rw * 0.12), ry0 + int(rh * ty0), rx0 + int(rw * 0.52), ry0 + int(rh * ty1)], radius=8, fill=255)
    
    # Inductive Wireless Charging Coil / MagSafe Array
    if model == 'xs':
        # Lower Qi coil
        d.rounded_rectangle([rx0 + int(rw * 0.17), ry0 + int(rh * 0.58), rx0 + int(rw * 0.75), ry0 + int(rh * 0.78)], radius=20, fill=255)
    elif model == '11pro':
        # Qi coil on left-center
        d.ellipse([rx0 + int(rw * 0.17), ry0 + int(rh * 0.34), rx0 + int(rw * 0.54), ry0 + int(rh * 0.60)], fill=255)
    elif model == '18pro':
        # MagSafe coil in lower section
        d.ellipse([rx0 + int(rw * 0.24), ry0 + int(rh * 0.65), rx0 + int(rw * 0.76), ry0 + int(rh * 0.85)], fill=255)
    else: # 12, 13, 14, 15, 16, 17
        # Full circular MagSafe ring + alignment tail
        d.ellipse([rx0 + int(rw * 0.16), ry0 + int(rh * 0.31), rx0 + int(rw * 0.84), ry0 + int(rh * 0.68)], fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.45), ry0 + int(rh * 0.68), rx0 + int(rw * 0.55), ry0 + int(rh * 0.80)], radius=4, fill=255)
    
    m_other = m_other.filter(ImageFilter.GaussianBlur(3))
    comp_other = dimmed.copy()
    comp_other.paste(ImageEnhance.Brightness(ImageEnhance.Color(ImageEnhance.Contrast(base).enhance(1.20)).enhance(1.25)).enhance(1.10), (0, 0), m_other)
    other_color = (255, 140, 50)
    comp_other.paste(make_tint(m_other, other_color, 0.16), (0, 0), make_tint(m_other, other_color, 0.16))
    glow_other = make_glow(m_other, other_color, radius=18, opacity=1.0)
    comp_other.paste(glow_other, (0, 0), glow_other)
    comp_other.save(os.path.join(ASSETS_DIR, f'comp_{model}_other.png'))
    
    # ---------------- 4. PLASTICS (ACOUSTICS & TAPTIC HOUSING) ----------------
    m_pl = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_pl)
    sy0 = 0.86 if model == '13pro' else 0.83 if model == '16pro' else 0.85 if model in ['17pro', '18pro'] else 0.81
    d.rounded_rectangle([rx0 + int(rw * 0.58), ry0 + int(rh * sy0), rx0 + int(rw * 0.88), ry0 + int(rh * 0.94)], radius=10, fill=255)
    d.rounded_rectangle([rx0 + int(rw * 0.10), ry0 + int(rh * 0.91), rx0 + int(rw * 0.90), ry0 + int(rh * 0.97)], radius=8, fill=255)
    m_pl = m_pl.filter(ImageFilter.GaussianBlur(3))
    comp_pl = dimmed.copy()
    comp_pl.paste(ImageEnhance.Brightness(ImageEnhance.Contrast(base).enhance(1.20)).enhance(1.10), (0, 0), m_pl)
    pl_color = (180, 140, 255)
    comp_pl.paste(make_tint(m_pl, pl_color, 0.15), (0, 0), make_tint(m_pl, pl_color, 0.15))
    glow_pl = make_glow(m_pl, pl_color, radius=18, opacity=1.0)
    comp_pl.paste(glow_pl, (0, 0), glow_pl)
    comp_pl.save(os.path.join(ASSETS_DIR, f'comp_{model}_plastics.png'))
    
    # ---------------- 5. ALUMINUM (INTERNAL CHASSIS / THERMAL SHIELD) ----------------
    m_al = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_al)
    if model == 'xs':
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.04), rx0 + int(rw * 0.55), ry0 + int(rh * 0.14)], radius=8, fill=255)
    elif model == '11pro':
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.04), rx0 + int(rw * 0.54), ry0 + int(rh * 0.14)], radius=8, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.46), ry0 + int(rh * 0.14), rx0 + int(rw * 0.54), ry0 + int(rh * 0.34)], radius=6, fill=255)
    elif model == '17pro':
        # Copper vapor chamber layer
        d.rounded_rectangle([rx0 + int(rw * 0.10), ry0 + int(rh * 0.28), rx0 + int(rw * 0.54), ry0 + int(rh * 0.65)], radius=12, fill=255)
    elif model == '18pro':
        # Graphene thermal dissipator plate
        d.rounded_rectangle([rx0 + int(rw * 0.48), ry0 + int(rh * 0.04), rx0 + int(rw * 0.90), ry0 + int(rh * 0.26)], radius=10, fill=255)
    else:
        # Structural midframe pillars & internal brackets
        d.rounded_rectangle([rx0 + int(rw * 0.08), ry0 + int(rh * 0.04), rx0 + int(rw * 0.92), ry0 + int(rh * 0.12)], radius=10, fill=255)
        d.rounded_rectangle([rx0 + int(rw * 0.48), ry0 + int(rh * 0.12), rx0 + int(rw * 0.55), ry0 + int(rh * 0.75)], radius=8, fill=255)
    
    m_al = m_al.filter(ImageFilter.GaussianBlur(3))
    comp_al = dimmed.copy()
    comp_al.paste(ImageEnhance.Brightness(ImageEnhance.Contrast(base).enhance(1.22)).enhance(1.15), (0, 0), m_al)
    al_color = (170, 215, 245)
    comp_al.paste(make_tint(m_al, al_color, 0.15), (0, 0), make_tint(m_al, al_color, 0.15))
    glow_al = make_glow(m_al, al_color, radius=18, opacity=1.0)
    comp_al.paste(glow_al, (0, 0), glow_al)
    comp_al.save(os.path.join(ASSETS_DIR, f'comp_{model}_aluminum.png'))
    
    # ---------------- 6. STAINLESS STEEL / TITANIUM FRAME ----------------
    m_frame = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_frame)
    # Perimeter unibody frame for both front and rear phone
    d.rounded_rectangle([lx0 + 2, ly0 + 2, lx1 - 2, ly1 - 2], radius=44, fill=255)
    d.rounded_rectangle([lx0 + 26, ly0 + 26, lx1 - 26, ly1 - 26], radius=32, fill=0)
    d.rounded_rectangle([rx0 + 2, ry0 + 2, rx1 - 2, ry1 - 2], radius=44, fill=255)
    d.rounded_rectangle([rx0 + 26, ry0 + 26, rx1 - 26, ry1 - 26], radius=32, fill=0)
    m_frame = m_frame.filter(ImageFilter.GaussianBlur(2))
    comp_frame = dimmed.copy()
    comp_frame.paste(ImageEnhance.Brightness(ImageEnhance.Contrast(base).enhance(1.25)).enhance(1.15), (0, 0), m_frame)
    frame_color = (235, 225, 205) if model in ['15pro', '16pro', '17pro', '18pro'] else (215, 230, 255)
    comp_frame.paste(make_tint(m_frame, frame_color, 0.16), (0, 0), make_tint(m_frame, frame_color, 0.16))
    glow_frame = make_glow(m_frame, frame_color, radius=16, opacity=1.0)
    comp_frame.paste(glow_frame, (0, 0), glow_frame)
    comp_frame.save(os.path.join(ASSETS_DIR, f'comp_{model}_stainless_steel.png'))
    
    # ---------------- 7. DISPLAY ----------------
    m_dp = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_dp)
    d.rounded_rectangle([lx0 + 24, ly0 + 28, lx1 - 24, ly1 - 32], radius=36, fill=255)
    m_dp = m_dp.filter(ImageFilter.GaussianBlur(3))
    comp_dp = dimmed.copy()
    comp_dp.paste(ImageEnhance.Brightness(ImageEnhance.Color(base).enhance(1.20)).enhance(1.08), (0, 0), m_dp)
    dp_color = (60, 165, 255)
    comp_dp.paste(make_tint(m_dp, dp_color, 0.12), (0, 0), make_tint(m_dp, dp_color, 0.12))
    glow_dp = make_glow(m_dp, dp_color, radius=18, opacity=1.0)
    comp_dp.paste(glow_dp, (0, 0), glow_dp)
    comp_dp.save(os.path.join(ASSETS_DIR, f'comp_{model}_display.png'))
    
    # ---------------- 8. GLASS ----------------
    m_gl = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m_gl)
    d.rounded_rectangle([rx0 + 20, ry0 + 20, rx1 - 20, ry1 - 20], radius=40, fill=255)
    m_gl = m_gl.filter(ImageFilter.GaussianBlur(4))
    comp_gl = dimmed.copy()
    comp_gl.paste(ImageEnhance.Brightness(base).enhance(1.15), (0, 0), m_gl)
    gl_color = (200, 240, 255)
    comp_gl.paste(make_tint(m_gl, gl_color, 0.14), (0, 0), make_tint(m_gl, gl_color, 0.14))
    glow_gl = make_glow(m_gl, gl_color, radius=20, opacity=0.9)
    comp_gl.paste(glow_gl, (0, 0), glow_gl)
    comp_gl.save(os.path.join(ASSETS_DIR, f'comp_{model}_glass.png'))
    
    print(f'Done: 8 in-situ cutaways for {model} completed.')

def update_hd_phone_xs():
    print('Updating assets/phone_xs.png to ultra-high resolution (uncropped)...')
    hd_path = '/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/iphone_xs_hd_1790662135808.jpg'
    raw = Image.open(hd_path)
    arr = np.array(raw, dtype=np.float32)

    # Sample white background accurately from image corners
    corners = np.concatenate([arr[:15, :15], arr[:15, -15:], arr[-15:, :15], arr[-15:, -15:]]).reshape(-1, 3)
    bg_color = np.median(corners, axis=0)
    diff = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    alpha = np.clip((diff - 8.0) / 10.0 * 255.0, 0, 255).astype(np.uint8)

    # Clean off table contact shadow underneath phone (row 1017 onwards)
    alpha[1017:, :] = 0

    out_raw = np.zeros((raw.height, raw.width, 4), dtype=np.uint8)
    out_raw[:, :, :3] = np.array(raw)[:, :, :3]
    out_raw[:, :, 3] = alpha
    rgba = Image.fromarray(out_raw, 'RGBA')
    
    mask = alpha > 30
    
    # Left phone (front screen)
    l_mask = mask[:, :512]
    l_cols = np.where(l_mask.sum(axis=0) > 10)[0]
    l_rows = np.where(l_mask.sum(axis=1) > 10)[0]
    left_crop = rgba.crop((l_cols[0], l_rows[0], l_cols[-1] + 1, l_rows[-1] + 1))
    
    # Right phone (back glass)
    r_mask = mask[:, 512:]
    r_cols = np.where(r_mask.sum(axis=0) > 10)[0]
    r_rows = np.where(r_mask.sum(axis=1) > 10)[0]
    right_crop = rgba.crop((512 + r_cols[0], r_rows[0], 512 + r_cols[-1] + 1, r_rows[-1] + 1))
    
    b = MODEL_HOTSPOT_BOUNDS['xs']
    lx0, ly0, lx1, ly1 = [int(v * 4) for v in b['front']]
    rx0, ry0, rx1, ry1 = [int(v * 4) for v in b['back']]
    
    lw, lh = lx1 - lx0, ly1 - ly0
    rw, rh = rx1 - rx0, ry1 - ry0
    
    left_scaled = left_crop.resize((lw, lh), Image.Resampling.LANCZOS)
    right_scaled = right_crop.resize((rw, rh), Image.Resampling.LANCZOS)
    
    out = Image.new('RGBA', (4096, 2304), (0, 0, 0, 0))
    out.paste(left_scaled, (lx0, ly0), left_scaled)
    out.paste(right_scaled, (rx0, ry0), right_scaled)
    
    out.save(os.path.join(ASSETS_DIR, 'phone_xs.png'))
    print('Updated assets/phone_xs.png with complete uncropped chassis.')

if __name__ == '__main__':
    models = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro']
    for m in models:
        generate_cutaways_for_model(m)
    update_hd_phone_xs()
    print('ALL 72 IN-SITU ASSETS SUCCESSFULLY GENERATED!')
