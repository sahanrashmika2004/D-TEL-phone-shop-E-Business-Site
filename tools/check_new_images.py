import os
from PIL import Image

p1 = r'C:\Users\msi\.gemini\antigravity-ide\brain\7b0b2fbf-c68d-46fd-aacb-949f4f88a34b\.user_uploaded\media_1792665192404.png'
p2 = r'C:\Users\msi\.gemini\antigravity-ide\brain\7b0b2fbf-c68d-46fd-aacb-949f4f88a34b\.user_uploaded\media_1792665192418.png'

im1 = Image.open(p1)
im2 = Image.open(p2)
print("media_1792665192404.png size:", im1.size)
print("media_1792665192418.png size:", im2.size)
