import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

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
    
    out = np.zeros((1024, 1024, 4), dtype=np.uint8)
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
    
    # Left phone
    l_mask = mask[:, :512]
    l_cols = np.where(l_mask.sum(axis=0) > 40)[0]
    l_rows = np.where(l_mask.sum(axis=1) > 40)[0]
    left_crop = rgba.crop((l_cols[0], l_rows[0], l_cols[-1] + 1, l_rows[-1] + 1))
    
    # Right phone
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

base, left_box, right_box = build_open_base('xs')
base.save('/Users/danieltagg/.gemini/antigravity-ide/brain/c32477f3-9029-492d-8b17-31f00ac6f924/test_open_base_xs.png')
print('test_open_base_xs.png saved. Left:', left_box, 'Right:', right_box)
