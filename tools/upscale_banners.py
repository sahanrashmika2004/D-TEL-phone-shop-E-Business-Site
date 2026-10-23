import os
from PIL import Image, ImageFilter, ImageEnhance

# Input uploaded files mapped to slides 1 to 7
base_upload = r"C:\Users\msi\.gemini\antigravity-ide\brain\7b0b2fbf-c68d-46fd-aacb-949f4f88a34b\.user_uploaded"
dest_dir = r"c:\xampp\htdocs\D-TEL-Mobile-Shop-PayHere-FIXED-v2\DTEL MOBILE SHOP NEW\images"

slide_map = [
    ("hero_slide_1.png", os.path.join(base_upload, "media_1792644298790.png")),
    ("hero_slide_2.png", os.path.join(base_upload, "media_1792644361023.png")),
    ("hero_slide_3.png", os.path.join(base_upload, "media_1792644308642.png")),
    ("hero_slide_4.png", os.path.join(base_upload, "media_1792644315203.png")),
    ("hero_slide_5.png", os.path.join(base_upload, "media_1792644324753.png")),
    ("hero_slide_6.png", os.path.join(base_upload, "media_1792644330134.png")),
    ("hero_slide_7.png", os.path.join(base_upload, "media_1792644366136.png")),
]

# Target 2.5K Ultra-HD resolution (2560 x 853)
TARGET_WIDTH = 2560
TARGET_HEIGHT = 853

for slide_name, src_path in slide_map:
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        continue
    
    with Image.open(src_path) as img:
        img = img.convert("RGBA")
        orig_w, orig_h = img.size
        print(f"Processing {slide_name} from {os.path.basename(src_path)} ({orig_w}x{orig_h})...")
        
        # High quality Lanczos resampling
        upscaled = img.resize((TARGET_WIDTH, TARGET_HEIGHT), resample=Image.Resampling.LANCZOS)
        
        # Subtle unsharp mask to restore crisp edges and text sharpness
        sharpened = upscaled.filter(ImageFilter.UnsharpMask(radius=1.6, percent=125, threshold=3))
        
        # Micro contrast enhance for punchy neon colors and deep blacks
        enhancer = ImageEnhance.Contrast(sharpened)
        crisp_img = enhancer.enhance(1.05)
        
        out_path = os.path.join(dest_dir, slide_name)
        # Save as PNG with optimization
        crisp_img.save(out_path, format="PNG", optimize=True)
        print(f"Saved {slide_name} -> {TARGET_WIDTH}x{TARGET_HEIGHT} ({os.path.getsize(out_path)} bytes)")

print("ALL SLIDES ENHANCED SUCCESSFULLY!")
