from PIL import Image
img = Image.open(r'c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.png')
print(f"New Size: {img.size}")
print(f"Mode: {img.mode}")
# Check a corner pixel for transparency
print(f"Corner Pixel: {img.getpixel((0,0))}")
