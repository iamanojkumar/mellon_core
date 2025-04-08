/**
 * Do not edit directly
 * Generated on Tue, 08 Apr 2025 14:08:05 GMT
 */

const StyleDictionary = require('style-dictionary');

function removeDuplicates(parts) {
  return parts.filter((part, index) => {
    // Skip duplicates
    const prevParts = parts.slice(0, index);
    return !prevParts.some(prevPart => 
      prevPart.toLowerCase() === part.toLowerCase() ||
      prevPart.replace(/-/g, '') === part.replace(/-/g, '')
    );
  });
}

function cleanName(path, category) {
  // Remove category from path parts
  const parts = path.filter(part => part !== category);
  
  // Remove duplicates
  const cleanParts = parts.map(part => {
    // Remove category name from part if it exists
    if (part.toLowerCase().startsWith(category.toLowerCase())) {
      return part.slice(category.length);
    }
    return part;
  });
  
  return removeDuplicates(cleanParts).join('-');
}

function registerFormats() {
  StyleDictionary.registerFormat({
    name: 'css/variables',
    formatter: function({ dictionary, options }) {
      const { fileHeader } = StyleDictionary.formatHelpers;
      const header = options.showFileHeader ? fileHeader({ file }) : '';
      
      return `${header}:root {
${dictionary.allProperties.map(prop => {
  const { name, value, type } = prop;
  let formattedValue = value;
  
  if (type === 'typography') {
    const typographyProps = [];
    if (value.fontFamily) typographyProps.push(`font-family: ${value.fontFamily}`);
    if (value.fontSize) typographyProps.push(`font-size: ${value.fontSize}`);
    if (value.fontWeight) typographyProps.push(`font-weight: ${value.fontWeight}`);
    if (value.lineHeight) typographyProps.push(`line-height: ${value.lineHeight}`);
    if (value.letterSpacing) typographyProps.push(`letter-spacing: ${value.letterSpacing}`);
    if (value.textDecoration) typographyProps.push(`text-decoration: ${value.textDecoration}`);
    if (value.textTransform) typographyProps.push(`text-transform: ${value.textTransform}`);
    formattedValue = typographyProps.join('; ');
  } else if (typeof value === 'object') {
    if (value.value && value.value.light) {
      formattedValue = value.value.light;
    } else if (value.light) {
      formattedValue = value.light;
    } else if (value.value) {
      formattedValue = value.value;
    }
  }
  
  return `  --${name}: ${formattedValue};`;
}).join('\n')}
}`;
    }
  });
}

module.exports = {
  registerFormats
}; 