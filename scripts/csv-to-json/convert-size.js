const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvFilePath = path.join(__dirname, '../../tokens/csv/size.csv');
const jsonFilePath = path.join(__dirname, '../../tokens/size/tokens.json');

// Ensure the directory exists
const dir = path.dirname(jsonFilePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

try {
  // Read and parse the CSV file
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter(line => line.trim());

  // Get headers from the first line
  const headers = csvContent[0].split(',').map(h => h.trim());

  // Parse records
  const records = csvContent.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });

  // Transform the records into a nested object structure
  const tokens = {
    size: {}
  };

  records.forEach(record => {
    const name = record.name;
    if (!name) return;

    const pathParts = name.split('.');
    if (pathParts[0] !== 'size') return;

    let current = tokens.size;
    for (let i = 1; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      current[part] = current[part] || {};
      current = current[part];
    }

    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = {
      name: name,
      value: record.value,
      type: record.type || 'size',
      description: record.description,
      category: record.category || 'size',
      status: record.status || 'stable',
      version: record.version || '1.0.0',
      tags: record.tags,
      platform: record.platform || 'web',
      usage: record.usage
    };
  });

  // Write the JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(tokens, null, 2));
  console.log(`✔ Generated ${jsonFilePath}`);
} catch (error) {
  console.error('Error processing size tokens:', error);
  process.exit(1);
} 