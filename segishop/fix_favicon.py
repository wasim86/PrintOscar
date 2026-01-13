from PIL import Image
import os

path = r'c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.png'
try:
    img = Image.open(path)
    bbox = img.getbbox()
    print(f"Original Size: {img.size}")
    print(f"Bounding Box (non-zero alpha): {bbox}")
    
    if bbox:
        # Crop to content
        cropped = img.crop(bbox)
        print(f"Cropped Size: {cropped.size}")
        
        # Now make it square
        w, h = cropped.size
        size = max(w, h)
        
        # Create new square image with transparent background
        new_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Paste centered
        x = (size - w) // 2
        y = (size - h) // 2
        new_img.paste(cropped, (x, y))
        
        # Resize to standard favicon sizes
        sizes = [(32, 32), (192, 192)]
        for s in sizes:
            resized = new_img.resize(s, Image.Resampling.LANCZOS)
            resized.save(f'c:\\Users\\sayedshaad\\OneDrive\\segishopapp-main\\segishop\\public\\favicon_generated_{s[0]}.png')
            print(f"Saved favicon_generated_{s[0]}.png")
            
except Exception as e:
    print(f"Error: {e}")
