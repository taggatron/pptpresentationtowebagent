import zlib
import struct
import subprocess
import os

def decode_png(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    idx = 8
    idat = bytearray()
    w, h, color_type = 0, 0, 6
    while idx < len(data):
        l, = struct.unpack('>I', data[idx:idx+4])
        t, c = data[idx+4:idx+8], data[idx+8:idx+8+l]
        idx += 8 + l + 4
        if t == b'IHDR':
            w, h, bit_depth, color_type = struct.unpack('>IIBB', c[:10])
        elif t == b'IDAT':
            idat.extend(c)
        elif t == b'IEND':
            break

    raw = zlib.decompress(idat)
    bpp = 3 if color_type == 2 else 4
    stride = 1 + w * bpp
    grid = []
    prev_row = bytearray(w * bpp)
    for y in range(h):
        row_data = raw[y*stride:(y+1)*stride]
        filter_type = row_data[0]
        row = bytearray(row_data[1:])
        if filter_type == 1:
            for i in range(bpp, len(row)):
                row[i] = (row[i] + row[i-bpp]) & 0xff
        elif filter_type == 2:
            for i in range(len(row)):
                row[i] = (row[i] + prev_row[i]) & 0xff
        elif filter_type == 3:
            for i in range(len(row)):
                left = row[i-bpp] if i >= bpp else 0
                up = prev_row[i]
                row[i] = (row[i] + ((left + up) >> 1)) & 0xff
        elif filter_type == 4:
            for i in range(len(row)):
                left = row[i-bpp] if i >= bpp else 0
                up = prev_row[i]
                up_left = prev_row[i-bpp] if i >= bpp else 0
                p = left + up - up_left
                pa, pb, pc = abs(p - left), abs(p - up), abs(p - up_left)
                pr = left if pa <= pb and pa <= pc else (up if pb <= pc else up_left)
                row[i] = (row[i] + pr) & 0xff
        prev_row = row
        grid.append((row, bpp))
    return w, h, grid

def encode_rgba_png(w, h, grid, outfile):
    raw = bytearray()
    for row in grid:
        raw.append(0)
        raw.extend(row)
    compressed = zlib.compress(bytes(raw), 6)
    out = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    out.extend(struct.pack('>I', 13) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
    out.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    out.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND')))
    with open(outfile, 'wb') as f:
        f.write(out)

TARGET_W, TARGET_H = 1024, 576
PHONE_HEIGHT = 304
CENTER_X = 414
BOTTOM_Y = 574

cutaways = {
    'comp_xs_battery.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_battery_1790438621047.jpg',
    'comp_xs_circuit_boards.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_logicboard_1790438638058.jpg',
    'comp_xs_display.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_display_1790438653798.jpg',
    'comp_xs_stainless_steel.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_steel_1790438670338.jpg',
    'comp_xs_other.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_coil_1790438686693.jpg',
    'comp_xs_glass.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/xs_cutaway_glass_1790438701818.jpg',
    
    'comp_15pro_battery.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/p15_cutaway_battery_1790438721868.jpg',
    'comp_15pro_circuit_boards.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/p15_cutaway_logicboard_1790438736803.jpg',
    'comp_15pro_stainless_steel.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/p15_cutaway_titanium_1790438758537.jpg',
    'comp_15pro_other.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/p15_cutaway_magsafe_1790438777145.jpg',
}

badges = {
    'badge_battery.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/test_xs_battery_1790438491058.jpg',
    'badge_circuit_boards.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/badge_circuit_boards_1790438794978.jpg',
    'badge_display.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/badge_display_1790438811771.jpg',
    'badge_stainless_steel.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/badge_enclosure_1790438844660.jpg',
    'badge_other.png': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/badge_wireless_coil_1790438864979.jpg',
}

for out_name, src_path in cutaways.items():
    temp_png = f'assets/temp_{out_name}.png'
    subprocess.run(['sips', '-s', 'format', 'png', src_path, '--out', temp_png], check=True, stdout=subprocess.DEVNULL)
    w, h, grid = decode_png(temp_png)

    # Detect bounding box
    min_x, max_x, min_y, max_y = w, 0, h, 0
    for y in range(h):
        row, bpp = grid[y]
        for x in range(w):
            r, g, b = row[x*bpp:x*bpp+3]
            min_c = min(r, g, b)
            spread = max(r, g, b) - min_c
            if min_c < 220 or spread > 12:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    min_x = max(0, min_x - 1)
    max_x = min(w - 1, max_x + 1)
    min_y = max(0, min_y - 1)
    max_y = min(h - 1, max_y + 1)

    phone_src_w = max_x - min_x + 1
    phone_src_h = max_y - min_y + 1

    scale = PHONE_HEIGHT / phone_src_h
    dst_w = int(phone_src_w * scale)
    dst_h = PHONE_HEIGHT
    off_x = int(CENTER_X - dst_w / 2)
    off_y = BOTTOM_Y - dst_h

    canvas = [bytearray(TARGET_W * 4) for _ in range(TARGET_H)]

    for dy in range(dst_h):
        sy = min_y + dy / scale
        isy = min(int(sy), h - 1)
        cy = off_y + dy
        if cy < 0 or cy >= TARGET_H:
            continue
        row, bpp = grid[isy]
        for dx in range(dst_w):
            sx = min_x + dx / scale
            isx = min(int(sx), w - 1)
            cx = off_x + dx
            if cx < 0 or cx >= TARGET_W:
                continue

            r, g, b = row[isx*bpp:isx*bpp+3]
            min_c = min(r, g, b)
            max_c = max(r, g, b)
            spread = max_c - min_c

            if min_c >= 240 and spread < 18:
                alpha = 0
            elif min_c >= 215 and spread < 20:
                alpha = int(255 * (1.0 - (min_c - 215) / 25.0))
            else:
                alpha = 255

            if alpha > 0:
                canvas[cy][cx*4:cx*4+4] = bytearray([r, g, b, alpha])

    out_file = f'assets/{out_name}'
    encode_rgba_png(TARGET_W, TARGET_H, canvas, out_file)
    print(f'✓ Generated cutaway asset: {out_file}')
    if os.path.exists(temp_png):
        os.remove(temp_png)

# Process badges
BADGE_SIZE = 160
for out_name, src_path in badges.items():
    temp_png = f'assets/temp_{out_name}.png'
    subprocess.run(['sips', '-s', 'format', 'png', src_path, '--out', temp_png], check=True, stdout=subprocess.DEVNULL)
    w, h, grid = decode_png(temp_png)

    # Detect bounding box
    min_x, max_x, min_y, max_y = w, 0, h, 0
    for y in range(h):
        row, bpp = grid[y]
        for x in range(w):
            r, g, b = row[x*bpp:x*bpp+3]
            min_c = min(r, g, b)
            spread = max(r, g, b) - min_c
            if min_c < 220 or spread > 12:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    src_w = max_x - min_x + 1
    src_h = max_y - min_y + 1
    scale = (BADGE_SIZE - 20) / max(src_w, src_h)
    dst_w = int(src_w * scale)
    dst_h = int(src_h * scale)
    off_x = int((BADGE_SIZE - dst_w) / 2)
    off_y = int((BADGE_SIZE - dst_h) / 2)

    canvas = [bytearray(BADGE_SIZE * 4) for _ in range(BADGE_SIZE)]

    for dy in range(dst_h):
        sy = min_y + dy / scale
        isy = min(int(sy), h - 1)
        cy = off_y + dy
        if cy < 0 or cy >= BADGE_SIZE:
            continue
        row, bpp = grid[isy]
        for dx in range(dst_w):
            sx = min_x + dx / scale
            isx = min(int(sx), w - 1)
            cx = off_x + dx
            if cx < 0 or cx >= BADGE_SIZE:
                continue

            r, g, b = row[isx*bpp:isx*bpp+3]
            min_c = min(r, g, b)
            max_c = max(r, g, b)
            spread = max_c - min_c

            if min_c >= 242 and spread < 16:
                alpha = 0
            elif min_c >= 220 and spread < 18:
                alpha = int(255 * (1.0 - (min_c - 220) / 22.0))
            else:
                alpha = 255

            if alpha > 0:
                canvas[cy][cx*4:cx*4+4] = bytearray([r, g, b, alpha])

    out_file = f'assets/{out_name}'
    encode_rgba_png(BADGE_SIZE, BADGE_SIZE, canvas, out_file)
    print(f'✓ Generated badge asset: {out_file}')
    if os.path.exists(temp_png):
        os.remove(temp_png)

print('All component and badge assets processed successfully!')
