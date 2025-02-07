import json

def sort_mushrooms(input_file, output_file):
    # Read the JSON data
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Sort mushrooms by commonName
    if 'mushrooms' in data:
        data['mushrooms'] = sorted(data['mushrooms'], key=lambda x: x['commonName'].lower())
    
    # Write the sorted data back to file
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully sorted mushrooms and saved to {output_file}")

# Usage - replace with your actual filenames if different
input_filename = 'mushrooms.json'
output_filename = 'mushrooms_sorted.json'

sort_mushrooms(input_filename, output_filename)