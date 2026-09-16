import os
from PIL import Image

img_path = r"c:\Users\ASUS\OneDrive\Desktop\MharooMedia_Final\public\LOGO3.png"

if os.path.exists(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        data = img.getdata()
        
        new_data = []
        for item in data:
            r, g, b, a = item
            # The previous script set the white text exactly to (0, 0, 0, a)
            if r == 0 and g == 0 and b == 0 and a > 0:
                new_data.append((255, 255, 255, a)) # Change it back to white
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(img_path)
        print("Successfully reverted LOGO3.png to white text.")
    except Exception as e:
        print(f"Error processing image: {e}")
else:
    print("LOGO3.png not found")
