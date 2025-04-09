const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Read the CSV file
const csvFilePath = path.join(__dirname, '../../tokens/csv/breakpoints.csv');
const jsonFilePath = path.join(__dirname, '../../tokens/breakpoints/tokens.json');

// Ensure the breakpoints directory exists
const breakpointsDir = path.join(__dirname, '../../tokens/breakpoints');
if (!fs.existsSync(breakpointsDir)) {
  fs.mkdirSync(breakpointsDir, { recursive: true });
}

try {
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Transform CSV records into token structure
  const tokens = {};
  records.forEach(record => {
    const nameParts = record.name.split('.');
    let current = tokens;
    
    // Build nested structure
    nameParts.forEach((part, index) => {
      if (index === nameParts.length - 1) {
        // Leaf node - add the token value and metadata
        current[part] = {
          value: record.value,
          type: record.type,
          description: record.description,
          category: record.category,
          status: record.status,
          version: record.version,
          tags: record.tags.split(' '),
          platform: record.platform.split(' '),
          usage: record.usage
        };
      } else {
        // Create nested object if it doesn't exist
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });

  // Write the JSON file
  fs.writeFileSync(
    jsonFilePath,
    JSON.stringify({ breakpoint: tokens.breakpoint }, null, 2)
  );

  console.log('✔ Generated ' + jsonFilePath);
} catch (error) {
  console.error('Error converting breakpoints CSV to JSON:', error);
  process.exit(1);
} 