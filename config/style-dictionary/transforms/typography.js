const StyleDictionary = require('style-dictionary');

const typographyTransform = {
  name: 'typography/css',
  type: 'value',
  matcher: function(prop) {
    return prop.type === 'typography';
  },
  transformer: function(prop) {
    if (typeof prop.original.value === 'string') {
      return prop.original.value;
    }

    const value = prop.original.value;
    if (!value) return '';

    const props = [];
    
    // Handle the typography token structure
    if (value.fontFamily) props.push(`font-family: ${value.fontFamily}`);
    if (value.fontSize) props.push(`font-size: ${value.fontSize}`);
    if (value.fontWeight) props.push(`font-weight: ${value.fontWeight}`);
    if (value.lineHeight) props.push(`line-height: ${value.lineHeight}`);
    if (value.letterSpacing) props.push(`letter-spacing: ${value.letterSpacing}`);
    if (value.textDecoration) props.push(`text-decoration: ${value.textDecoration}`);
    if (value.textTransform) props.push(`text-transform: ${value.textTransform}`);

    return props.join(';');
  }
};

// Register the transform
StyleDictionary.registerTransform(typographyTransform);

module.exports = {
  typographyTransform
}; 