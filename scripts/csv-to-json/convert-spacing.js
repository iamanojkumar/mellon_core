const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Read the CSV file
const csvFilePath = path.join(__dirname, '../../tokens/csv/spacing.csv');
const jsonFilePath = path.join(__dirname, '../../tokens/spacing/tokens.json');

// Ensure the directory exists
const dir = path.dirname(jsonFilePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Read and parse CSV
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Convert to token format
const tokens = records.reduce((acc, record) => {
  const pathParts = record.name.split('.');
  let current = acc;
  
  // Build nested structure
  pathParts.forEach((part, index) => {
    if (index === pathParts.length - 1) {
      // Leaf node - add the token
      current[part] = {
        value: record.value,
        type: record.type,
        description: record.description,
        category: record.category,
        status: record.status,
        usage: record.usage,
        platform: record.platform,
        version: record.version
      };
    } else {
      // Create nested object if it doesn't exist
      current[part] = current[part] || {};
      current = current[part];
    }
  });
  
  return acc;
}, {});

// Write JSON file
fs.writeFileSync(jsonFilePath, JSON.stringify(tokens, null, 2));
console.log(`✔ Generated ${jsonFilePath}`); 