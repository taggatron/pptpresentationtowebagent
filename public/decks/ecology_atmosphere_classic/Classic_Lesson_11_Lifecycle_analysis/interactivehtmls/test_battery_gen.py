import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont
import numpy as np

def create_l_mask(w, h, p_stalk, p_foot, radius=12):
    """
    Creates an L-shaped mask with rounded corners.
    p_stalk: (x0, y0, x1, y1) for vertical stalk
    p_foot:  (x0, y0, x1, y1) for horizontal foot
    """
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(p_stalk, radius=radius, fill=255)
    d.rounded_rectangle(p_foot, radius=radius, fill=255)
    return mask

def create_rect_mask(w, h, box, radius=12):
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(box, radius=radius, fill=255)
    return mask

print("Test battery helper ready.")
