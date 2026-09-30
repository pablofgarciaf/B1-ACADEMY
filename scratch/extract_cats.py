import json
import re

with open("src/lib/manuals-120-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

categories = re.findall(r'"category":\s*"([^"]+)"', content)
unique_categories = []
for c in categories:
    if c not in unique_categories:
        unique_categories.append(c)

print("--- CATEGORIES ---")
for i, c in enumerate(unique_categories):
    print(f"{i+1}. {c}")
