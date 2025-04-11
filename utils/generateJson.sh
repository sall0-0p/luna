#!/bin/bash

# Define the output JSON file
OUTPUT_FILE="stickers.json"

# Start the JSON structure
echo "{" > $OUTPUT_FILE

# Get a list of all .png files in the folder
files=(*.png)
file_count=${#files[@]}
counter=1

for file in "${files[@]}"; do
  # Remove the .png extension to get the sticker name
  sticker_name="${file%.png}"

  # Add the sticker entry with a placeholder emoji
  echo -n "  \"$sticker_name\": { \"emoji\": \"👻\" }" >> $OUTPUT_FILE

  # Add a comma unless it's the last item
  if [[ $counter -lt $file_count ]]; then
    echo "," >> $OUTPUT_FILE
  else
    echo "" >> $OUTPUT_FILE
  fi

  ((counter++))
done

# End the JSON structure
echo "}" >> $OUTPUT_FILE

echo "✅ stickers.json generated successfully!"
