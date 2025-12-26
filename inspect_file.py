import pandas as pd

INPUT_FILE = 'hud_2025.xlsx'

print(f"🕵️  Inspecting {INPUT_FILE}...")

# 1. Check Sheet Names
xl = pd.ExcelFile(INPUT_FILE)
print(f"\n📄 Found Sheets: {xl.sheet_names}")

# 2. Check Columns of the likely data sheet
# We try to find a sheet with 'FY' or 'SAFMR' in the name, otherwise pick the last one
data_sheet = xl.sheet_names[-1] 
print(f"👉 Reading sheet: '{data_sheet}'")

df = pd.read_excel(INPUT_FILE, sheet_name=data_sheet)
print(f"\n📊 Columns found in '{data_sheet}':")
print(list(df.columns))

print("\n------------------------------------------------")
print("✅ PASTE THIS OUTPUT IN THE CHAT")
print("------------------------------------------------")