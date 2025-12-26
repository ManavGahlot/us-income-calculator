import pandas as pd
import json
import os
import re

# CONFIGURATION
INPUT_FILE = 'hud_2025.xlsx' 
OUTPUT_DIR = 'public/data/geo'

# State Dictionary to convert "TX" -> "texas"
STATE_MAP = {
    'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas', 'CA': 'california',
    'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware', 'FL': 'florida', 'GA': 'georgia',
    'HI': 'hawaii', 'ID': 'idaho', 'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa',
    'KS': 'kansas', 'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
    'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi', 'MO': 'missouri',
    'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada', 'NH': 'new-hampshire', 'NJ': 'new-jersey',
    'NM': 'new-mexico', 'NY': 'new-york', 'NC': 'north-carolina', 'ND': 'north-dakota', 'OH': 'ohio',
    'OK': 'oklahoma', 'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode-island', 'SC': 'south-carolina',
    'SD': 'south-dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah', 'VT': 'vermont',
    'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia', 'WI': 'wisconsin', 'WY': 'wyoming',
    'DC': 'district-of-columbia'
}

def clean_data():
    print("🚀 Starting Smart Data Engine...")

    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: Could not find '{INPUT_FILE}'")
        return

    # 1. Load File
    print("   ... Reading Excel file (ignoring messy headers)")
    # We load strictly the columns we need by position (index) to avoid naming errors
    # Col 0 = Zip, Col 2 = Name, Col 9 = 2BR Rent
    df = pd.read_excel(INPUT_FILE, usecols=[0, 2, 9])
    
    # Rename columns to standard names
    df.columns = ['zip_code', 'area_name', 'rent_2br']

    print(f"   ... Processing {len(df)} locations")
    
    # 2. Prepare Output
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Storage for sorting
    data_by_state = {}

    # 3. Process Rows
    for _, row in df.iterrows():
        raw_name = str(row['area_name'])
        zip_code = str(row['zip_code']).replace('.0', '').zfill(5)
        rent = row['rent_2br']
        
        # SKIP if rent is missing or zero
        if pd.isna(rent) or rent == 0:
            continue

        # PARSE STATE from "Abilene, TX MSA"
        # Regex looks for ", XX " pattern
        match = re.search(r',\s([A-Z]{2})', raw_name)
        
        if match:
            state_code = match.group(1)
            # Clean City Name: Remove ", TX MSA" and " Metro Area"
            city_clean = raw_name.split(',')[0].strip()
        else:
            continue # Skip weird rows with no state

        # Convert TX -> texas
        state_slug = STATE_MAP.get(state_code)
        
        if not state_slug:
            continue

        if state_slug not in data_by_state:
            data_by_state[state_slug] = {}

        # Generate ID
        slug = f"{city_clean.lower().replace(' ', '-')}-{zip_code}"

        data_by_state[state_slug][slug] = {
            "city": city_clean,
            "rent": int(rent),
            "zip": zip_code
        }

    # 4. Save Files
    print("   ... Saving JSON files")
    for state, data in data_by_state.items():
        filename = f"{OUTPUT_DIR}/{state}.json"
        with open(filename, 'w') as f:
            json.dump(data, f)
        print(f"   ✅ Saved {state} ({len(data)} zips)")

    print("\n🎉 DONE! Database built.")

if __name__ == '__main__':
    clean_data()