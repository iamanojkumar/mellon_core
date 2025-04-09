const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvFilePath = path.join(__dirname, '../../tokens/csv/radius.csv');
const jsonFilePath = path.join(__dirname, '../../tokens/radius/tokens.json');

// Read and parse the CSV file
const csvContent = fs.readFileSync(csvFilePath, 'utf8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Convert to the required JSON structure
const jsonOutput = {
  radius: records.reduce((acc, record) => {
    const parts = record.name.split('.');
    let current = acc;
    
    // Build nested structure (skip the first 'radius' part)
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    // Add the token
    const lastPart = parts[parts.length - 1];
    current[lastPart] = {
      value: record.value,
      type: record.type,
      description: record.description,
      category: record.category,
      status: record.status,
      version: record.version,
      tags: record.tags,
      platform: record.platform,
      usage: record.usage
    };
    
    return acc;
  }, {})
};

// Create directory if it doesn't exist
const dir = path.dirname(jsonFilePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write the JSON file
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonOutput, null, 2));

console.log(`✔ Generated ${jsonFilePath}`); 