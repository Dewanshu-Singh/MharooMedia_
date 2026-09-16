import os
from PIL import Image

public_dir = r"c:\Users\ASUS\OneDrive\Desktop\MharooMedia_Final\public"

for filename in os.listdir(public_dir):
    if filename.lower().startswith("logo") and filename.lower().endswith(".png"):
        img_path = os.path.join(public_dir, filename)
        try:
            img = Image.open(img_path).convert("RGBA")
            data = img.getdata()
            
            new_data = []
            modified = False
            for item in data:
                r, g, b, a = item
                # Detect near-white/light-grey pixels
                if a > 10 and r > 180 and g > 180 and b > 180:
                    # Ensure it's roughly grayscale (not a bright color like yellow/cyan)
                    if abs(r-g) < 40 and abs(g-b) < 40 and abs(r-b) < 40:
                        new_data.append((0, 0, 0, a)) # Change to black
                        modified = True
                    else:
                        new_data.append(item)
                else:
                    new_data.append(item)
                    
            if modified:
                img.putdata(new_data)
                img.save(img_path)
                print(f"Processed {filename}")
        except Exception as e:
            print(f"Failed {filename}: {e}")
