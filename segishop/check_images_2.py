from PIL import Image
import os

files = ['favicon.jpeg', 'segi-logo.svg']
base_path = r'c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public'

print("Image Analysis 2:")
for f in files:
    path = os.path.join(base_path, f)
    if os.path.exists(path):
        try:
            img = Image.open(path)
            print(f"{f}: Size={img.size}, Mode={img.mode}, Format={img.format}")
        except Exception as e:
            # SVGs won't open with PIL directly usually, but let's see
            print(f"{f}: Error (might be SVG) {e}")
    else:
        print(f"{f}: Not found")
