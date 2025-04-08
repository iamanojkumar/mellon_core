const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');

// Color transformer
const colorTransformer = {
  validateCSV: (record) => {
    const requiredFields = [
      'token-name',
      'value-light',
      'type',
      'description',
      'category',
      'version',
      'platform',
      'usage'
    ];

    const missingFields = requiredFields.filter(field => !record[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  },

  transformToJSON: (record) => {
    return {
      name: record['token-name'],
      value: {
        light: record['value-light'],
        dark: record['value-dark'] || record['value-light'],
      },
      type: record.type,
      description: record.description,
      category: record.category,
      status: record.status || 'stable',
      version: record.version,
      tags: record.tags || [],
      platform: record.platform,
      usage: record.usage,
    };
  },

  groupTokens: (tokens) => {
    return tokens.reduce((acc, token) => {
      // Get the category from the type field
      const category = token.type;
      const tokenName = token.name;
      
      // Skip invalid tokens
      if (!category || !tokenName) {
        console.warn('Skipping invalid token:', token);
        return acc;
      }
      
      // Initialize category if it doesn't exist
      if (!acc[category]) {
        acc[category] = {};
      }

      // Extract token name parts
      const nameParts = tokenName.split('.');
      
      // Navigate to the correct nested location
      let current = acc[category];
      for (let i = 0; i < nameParts.length; i++) {
        const part = nameParts[i];
        if (i === nameParts.length - 1) {
          // Set the token at the final location
          current[part] = token;
        } else {
          // Create nested object if it doesn't exist
          current[part] = current[part] || {};
          current = current[part];
        }
      }
      
      return acc;
    }, {});
  }
};

// Typography transformer
const typographyTransformer = {
  validateCSV: (record) => {
    const requiredFields = [
      'token-name',
      'font_family',
      'font_size',
      'font_weight',
      'line_height',
      'type',
      'description',
      'category',
      'version',
      'platform',
      'usage'
    ];

    const missingFields = requiredFields.filter(field => !record[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate font size format (px, rem, em)
    const fontSizeRegex = /^(\d*\.?\d+)(px|rem|em)$/;
    if (!fontSizeRegex.test(record.font_size)) {
      throw new Error(`Invalid font size value: ${record.font_size}`);
    }

    // Validate line height (number or unit)
    const lineHeightRegex = /^(\d+\.?\d*)$/;
    if (!lineHeightRegex.test(record.line_height)) {
      throw new Error(`Invalid line height value: ${record.line_height}`);
    }

    // Validate font weight (number or keyword)
    const fontWeightRegex = /^([1-9][0-9]{2}|normal|bold)$/;
    if (!fontWeightRegex.test(record.font_weight)) {
      throw new Error(`Invalid font weight value: ${record.font_weight}`);
    }

    // Validate letter spacing (em or px)
    if (record.letter_spacing && !/^-?\d*\.?\d+(px|em)?$/.test(record.letter_spacing)) {
      throw new Error(`Invalid letter spacing value: ${record.letter_spacing}`);
    }
  },

  transformToJSON: (record) => {
    // Prefix typography token names with 'text' to avoid collisions
    const tokenName = `text.${record['token-name']}`;
    
    return {
      name: tokenName,
      value: {
        fontFamily: record.font_family,
        fontSize: record.font_size,
        fontWeight: record.font_weight,
        lineHeight: record.line_height,
        letterSpacing: record.letter_spacing || undefined,
        textDecoration: record.text_decoration || undefined,
        textTransform: record.text_transform || undefined,
      },
      type: 'typography',
      description: record.description,
      category: record.category,
      status: record.status || 'stable',
      version: record.version,
      tags: record.tags || [],
      platform: record.platform,
      usage: record.usage,
    };
  },

  groupTokens: (tokens) => {
    return tokens.reduce((acc, token) => {
      // Get the category from the type field
      const category = 'typography';
      const tokenName = token.name;
      
      // Skip invalid tokens
      if (!category || !tokenName) {
        console.warn('Skipping invalid token:', token);
        return acc;
      }
      
      // Initialize category if it doesn't exist
      if (!acc[category]) {
        acc[category] = {};
      }

      // Extract token name parts
      const nameParts = tokenName.split('.');
      
      // Navigate to the correct nested location
      let current = acc[category];
      for (let i = 0; i < nameParts.length; i++) {
        const part = nameParts[i];
        if (i === nameParts.length - 1) {
          // Set the token at the final location
          current[part] = token;
        } else {
          // Create nested object if it doesn't exist
          current[part] = current[part] || {};
          current = current[part];
        }
      }
      
      return acc;
    }, {});
  }
};

const transformers = {
  color: colorTransformer,
  typography: typographyTransformer
};

const validateAndTransform = async (csvPath, tokenType) => {
  return new Promise((resolve, reject) => {
    const records = [];
    const transformer = transformers[tokenType];

    if (!transformer) {
      reject(new Error(`Unknown token type: ${tokenType}`));
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv.parse({ columns: true, trim: true }))
      .on('data', (record) => {
        try {
          transformer.validateCSV(record);
          records.push(transformer.transformToJSON(record));
        } catch (error) {
          console.error(`Error processing record: ${error.message}`);
          console.error('Record:', record);
        }
      })
      .on('end', () => {
        const groupedTokens = transformer.groupTokens(records);
        resolve(groupedTokens);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const processCSV = async () => {
  try {
    console.log('Starting CSV validation and transformation...');

    // Process color tokens
    console.log('Processing color tokens...');
    const colorTokens = await validateAndTransform('tokens/csv/color.csv', 'color');
    const colorTokensPath = 'tokens/color/tokens.json';
    fs.mkdirSync(path.dirname(colorTokensPath), { recursive: true });
    fs.writeFileSync(colorTokensPath, JSON.stringify(colorTokens, null, 2));
    console.log(`Generated color tokens at ${path.resolve(colorTokensPath)}`);

    // Process typography tokens
    console.log('Processing typography tokens...');
    const typographyTokens = await validateAndTransform('tokens/csv/typography.csv', 'typography');
    const typographyTokensPath = 'tokens/typography/tokens.json';
    fs.mkdirSync(path.dirname(typographyTokensPath), { recursive: true });
    fs.writeFileSync(typographyTokensPath, JSON.stringify(typographyTokens, null, 2));
    console.log(`Generated typography tokens at ${path.resolve(typographyTokensPath)}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

processCSV(); 