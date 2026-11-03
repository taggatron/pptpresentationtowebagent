import zlib
import struct
import subprocess
import os

new_models = {
    '17pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/iphone_17_pro_hd_1790437172921.jpg',
    '18pro': '/Users/danieltagg/.gemini/antigravity-ide/brain/654915ab-10fc-4ed6-b6a0-dd17bfe3cc37/iphone_18_pro_hd_1790437198297.jpg'
}

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

for model, src_path in new_models.items():
    temp_png = f'assets/temp_{model}.png'
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

    cw = max_x - min_x + 1
    ch = max_y - min_y + 1
    print(f'Model {model}: cropped bbox [{min_x}, {min_y}, {max_x}, {max_y}] -> {cw}x{ch}')

    crop_grid = []
    for y in range(min_y, max_y + 1):
        row, bpp = grid[y]
        crop_row = bytearray(cw * 4)
        for x in range(min_x, max_x + 1):
            r, g, b = row[x*bpp : x*bpp+3]
            min_c = min(r, g, b)
            spread = max(r, g, b) - min_c

            if min_c >= 244 and spread < 10:
                alpha = 0
            elif min_c >= 222 and spread < 14:
                alpha = max(0, min(255, int(255 * (1.0 - (min_c - 222) / 22.0))))
            else:
                alpha = 255

            idx = (x - min_x) * 4
            crop_row[idx : idx + 4] = bytearray([r, g, b, alpha])
        crop_grid.append(crop_row)

    cutout_path = f'assets/cutout_{model}.png'
    encode_rgba_png(cw, ch, crop_grid, cutout_path)
    print(f'✓ Generated {cutout_path}')

    thumb_path = f'assets/thumb_{model}.png'
    subprocess.run(['sips', '--resampleHeight', '72', cutout_path, '--out', thumb_path], check=True, stdout=subprocess.DEVNULL)
    print(f'✓ Generated thumbnail {thumb_path}')

    # Composite 2048x1152 2x Retina transparent presentation image with FFmpeg Lanczos
    phone_stage_path = f'assets/phone_{model}.png'
    cmd = [
        'ffmpeg', '-y',
        '-f', 'lavfi', '-i', 'color=c=black@0.0:s=2048x1152:r=1,format=rgba',
        '-i', cutout_path,
        '-filter_complex', '[1:v]scale=-1:608:flags=lanczos[scaled];[0:v][scaled]overlay=x=828-w/2:y=540:format=auto[out]',
        '-map', '[out]',
        '-pix_fmt', 'rgba',
        '-update', '1',
        '-vframes', '1',
        phone_stage_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f'✓ Generated 2x Retina presentation image {phone_stage_path}')

    if os.path.exists(temp_png):
        os.remove(temp_png)

print('All 17 Pro and 18 Pro assets processed successfully!')
