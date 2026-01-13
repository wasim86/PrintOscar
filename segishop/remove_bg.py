from PIL import Image
import os

def remove_black_background(input_path, output_path, threshold=50):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (r,g,b,a)
            # Check if pixel is black or near black
            if item[0] < threshold and item[1] < threshold and item[2] < threshold:
                newData.append((0, 0, 0, 0)) # Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

input_file = r"c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.jpeg"
output_file = r"c:\Users\sayedshaad\OneDrive\segishopapp-main\segishop\public\favicon.png"

if os.path.exists(input_file):
    remove_black_background(input_file, output_file)
else:
    print(f"Input file not found: {input_file}")
