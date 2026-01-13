import cv2
import numpy as np
from PIL import Image
import os

def remove_background_and_process(input_path, output_png_path, output_ico_path):
    # Load image using OpenCV
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: Could not read image at {input_path}")
        return

    # Convert to RGBA
    img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # Assume background is white-ish. 
    # Create a mask for white pixels (adjustment might be needed based on actual image)
    # Define range of white
    lower_white = np.array([200, 200, 200, 255])
    upper_white = np.array([255, 255, 255, 255])
    
    # Threshold the image to get only white colors
    mask = cv2.inRange(img, lower_white, upper_white)
    
    # Invert mask: we want to keep non-white parts
    mask_inv = cv2.bitwise_not(mask)
    
    # Set alpha channel: 0 for white background, 255 for foreground
    img[:, :, 3] = mask_inv

    # Find bounding box of the foreground
    coords = cv2.findNonZero(mask_inv)
    x, y, w, h = cv2.boundingRect(coords)
    
    # Crop the image to the bounding box with some padding
    padding = 10
    x = max(0, x - padding)
    y = max(0, y - padding)
    w = min(img.shape[1] - x, w + 2*padding)
    h = min(img.shape[0] - y, h + 2*padding)
    
    cropped = img[y:y+h, x:x+w]

    # Make it square
    height, width = cropped.shape[:2]
    size = max(height, width)
    square_img = np.zeros((size, size, 4), dtype=np.uint8)
    
    # Center the cropped image on the square canvas
    y_offset = (size - height) // 2
    x_offset = (size - width) // 2
    square_img[y_offset:y_offset+height, x_offset:x_offset+width] = cropped

    # Convert back to PIL Image for saving
    pil_img = Image.fromarray(cv2.cvtColor(square_img, cv2.COLOR_BGRA2RGBA))
    
    # Resize to standard icon size (e.g., 512x512 for high quality)
    pil_img = pil_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Save as PNG
    pil_img.save(output_png_path, "PNG")
    print(f"Saved PNG to {output_png_path}")

    # Save as ICO (containing multiple sizes)
    pil_img.save(output_ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Saved ICO to {output_ico_path}")

if __name__ == "__main__":
    input_file = r"c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.jpeg"
    output_png = r"c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.png"
    output_ico = r"c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.ico"
    
    if os.path.exists(input_file):
        remove_background_and_process(input_file, output_png, output_ico)
    else:
        print("Input file not found!")
