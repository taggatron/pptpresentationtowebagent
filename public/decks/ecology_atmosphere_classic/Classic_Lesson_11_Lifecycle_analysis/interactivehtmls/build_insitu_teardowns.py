import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

ASSETS_DIR = 'public/decks/ecology_atmosphere_classic/Classic_Lesson_11_Lifecycle_analysis/interactivehtmls/assets'

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

CANONICAL_TARGETS = {
    'xs':    {'left': (975, 1083, 1596, 2296),  'right': (1719, 1083, 2338, 2296)},
    '11pro': {'left': (1020, 1080, 1640, 2296), 'right': (1798, 1080, 2289, 2296)},
    '12pro': {'left': (1190, 1080, 1643, 2296), 'right': (1678, 1080, 2120, 2296)},
    '13pro': {'left': (1059, 1080, 1649, 2296), 'right': (1650, 1080, 2250, 2296)},
    '14pro': {'left': (1098, 1080, 1649, 2296), 'right': (1650, 1080, 2213, 2296)},
    '15pro': {'left': (1174, 1080, 1649, 2296), 'right': (1650, 1080, 2136, 2296)},
    '16pro': {'left': (1156, 1080, 1620, 2296), 'right': (1688, 1080, 2153, 2296)},
    '17pro': {'left': (1161, 1079, 1649, 2296), 'right': (1650, 1079, 2149, 2296)},
    '18pro': {'left': (1165, 1080, 1619, 2296), 'right': (1688, 1080, 2145, 2296)},
}

def remove_white_bg(img, thresh=244):
    """Clean alpha extraction removing solid white studio background."""
    im = img.convert('RGBA')
    arr = np.array(im, dtype=np.float32)
    rgb = arr[:, :, :3]
    
    # Distance from pure white
    diff = 255.0 - rgb
    # Max difference across channels
    max_diff = np.max(diff, axis=2)
    
    # Smooth antialiased alpha curve
    # 0 at max_diff <= (255 - thresh), 255 at max_diff >= (255 - thresh + 18)
    cutoff = float(255 - thresh)
    alpha = np.clip((max_diff - cutoff) / 16.0 * 255.0, 0, 255).astype(np.uint8)
    
    out_arr = np.array(im)
    out_arr[:, :, 3] = alpha
    return Image.fromarray(out_arr, 'RGBA')

def extract_phones(teardown_path):
    raw = Image.open(teardown_path)
    rgba = remove_white_bg(raw)
    arr = np.array(rgba)
    alpha = arr[:, :, 3]
    
    not_empty = alpha > 15
    col_density = not_empty.sum(axis=0)
    # Search around center for gap
    mid_x = 400 + np.argmin(col_density[400:650])
    
    # Left phone (front)
    left_alpha = alpha.copy()
    left_alpha[:, mid_x:] = 0
    lr = np.where(left_alpha.any(axis=1))[0]
    lc = np.where(left_alpha.any(axis=0))[0]
    left_phone = rgba.crop((lc[0], lr[0], lc[-1] + 1, lr[-1] + 1))
    
    # Right phone (open chassis teardown)
    right_alpha = alpha.copy()
    right_alpha[:, :mid_x] = 0
    rr = np.where(right_alpha.any(axis=1))[0]
    rc = np.where(right_alpha.any(axis=0))[0]
    right_phone = rgba.crop((rc[0], rr[0], rc[-1] + 1, rr[-1] + 1))
    
    return left_phone, right_phone

def compose_teardown_base(model):
    left_phone, right_phone = extract_phones(TEARDOWN_PATHS[model])
    
    tgt = CANONICAL_TARGETS[model]
    lx0, ly0, lx1, ly1 = tgt['left']
    rx0, ry0, rx1, ry1 = tgt['right']
    
    lw, lh = lx1 - lx0, ly1 - ly0
    rw, rh = rx1 - rx0, ry1 - ry0
    
    left_scaled = left_phone.resize((lw, lh), Image.Resampling.LANCZOS)
    right_scaled = right_phone.resize((rw, rh), Image.Resampling.LANCZOS)
    
    base = Image.new('RGBA', (4096, 2304), (0, 0, 0, 0))
    base.paste(left_scaled, (lx0, ly0), left_scaled)
    base.paste(right_scaled, (rx0, ry0), right_scaled)
    
    return base, (rx0, ry0, rx1, ry1), (lx0, ly0, lx1, ly1)

print('Module loaded successfully.')
