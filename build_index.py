import json
import os

# CONFIGURATION
GEO_DIR = 'public/data/geo'
OUTPUT_FILE = 'public/data/zip_index.json'

def build_index():
    print("🔎 Building Search Index...")
    
    master_index = {}
    
    # Loop through all state files
    files = [f for f in os.listdir(GEO_DIR) if f.endswith('.json')]
    
    for filename in files:
        state_slug = filename.replace('.json', '')
        filepath = os.path.join(GEO_DIR, filename)
        
        with open(filepath, 'r') as f:
            data = json.load(f)
            
        # Extract Zip Codes
        for slug, info in data.items():
            zip_code = info.get('zip')
            rent = info.get('rent')
            city = info.get('city')
            
            if zip_code and rent:
                # Save purely the essential data to keep file size small
                master_index[zip_code] = {
                    "r": rent,        # Rent
                    "s": state_slug,  # State (for linking)
                    "c": city         # City Name
                }

    # Save the Master Index
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(master_index, f)
        
    print(f"✅ Index created with {len(master_index)} zip codes.")
    print(f"📁 Saved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    build_index()