import os
import zlib
import struct

def make_png(width, height, get_pixel_rgba):
    # PNG signature
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Image data
    raw_scanlines = bytearray()
    for y in range(height):
        raw_scanlines.append(0) # filter type 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel_rgba(x, y, width, height)
            raw_scanlines.extend((r, g, b, a))
            
    compressed = zlib.compress(bytes(raw_scanlines), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    return bytes(png)

def mobywatel_icon_pixel(x, y, w, h):
    # Normalized coordinates (-1 to 1)
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    
    # Rounded rectangle background
    corner_radius = 0.35
    ax = max(0, abs(nx) - (1 - corner_radius))
    ay = max(0, abs(ny) - (1 - corner_radius))
    dist = (ax*ax + ay*ay)**0.5
    
    if dist > corner_radius:
        return (0, 0, 0, 0) # transparent outside rounded rect
    
    # Polish red background (#dc143c / #d6001c / #e0112c)
    bg_r, bg_g, bg_b = 224, 17, 44
    
    # Stylized Polish Eagle (white shape in center)
    dist_center = (nx*nx + ny*ny)**0.5
    # Crown area (top center)
    is_crown = (-0.18 <= nx <= 0.18) and (-0.68 <= ny <= -0.52)
    # Head & beak
    is_head = (-0.15 <= nx <= 0.15) and (-0.55 <= ny <= -0.35)
    is_beak = (0.12 <= nx <= 0.25) and (-0.48 <= ny <= -0.40)
    # Wings
    wing_left = (-0.68 <= nx <= -0.1) and (-0.38 <= ny <= 0.25) and (nx * 0.7 - ny < 0.2)
    wing_right = (0.1 <= nx <= 0.68) and (-0.38 <= ny <= 0.25) and (-nx * 0.7 - ny < 0.2)
    # Body
    body = (-0.22 <= nx <= 0.22) and (-0.35 <= ny <= 0.38)
    # Tail
    tail = (-0.35 <= nx <= 0.35) and (0.35 <= ny <= 0.68) and (abs(nx) * 1.5 + ny < 1.05)
    
    if is_crown:
        return (255, 215, 0, 255) # Gold crown
    elif is_beak:
        return (255, 215, 0, 255) # Gold beak
    elif is_head or wing_left or wing_right or body or tail:
        return (255, 255, 255, 255) # White eagle
    else:
        # Subtle gradient inside red badge
        shade = int(224 - ny * 20)
        return (max(160, min(240, shade)), 17, 44, 255)

os.makedirs('icons', exist_ok=True)
with open('icons/icon-192.png', 'wb') as f:
    f.write(make_png(192, 192, mobywatel_icon_pixel))

with open('icons/icon-512.png', 'wb') as f:
    f.write(make_png(512, 512, mobywatel_icon_pixel))

print("Icons generated successfully!")
