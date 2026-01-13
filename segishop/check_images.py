from PIL import Image
import os

files = ['favicon.png', 'segi-logo.png', 'segi-logo-original.png', 'logo.png']
base_path = r'c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public'

print("Image Analysis:")
for f in files:
    path = os.path.join(base_path, f)
    if os.path.exists(path):
        try:
            img = Image.open(path)
            print(f"{f}: Size={img.size}, Mode={img.mode}, Format={img.format}")
        except Exception as e:
            print(f"{f}: Error {e}")
    else:
        print(f"{f}: Not found")
