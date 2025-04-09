const StyleDictionary = require('style-dictionary');

// Helper function to check if a value is a valid RGBA string
const isRgba = (value) => {
  return typeof value === 'string' && value.startsWith('rgba(');
};

// Helper function to check if a value is a valid hex color
const isHex = (value) => {
  return typeof value === 'string' && value.startsWith('#');
};

// Helper function to normalize color values
const normalizeColor = (value) => {
  if (isRgba(value)) {
    return value.trim();
  }
  if (isHex(value)) {
    return value;
  }
  return value;
};

// Helper function to normalize token name
const normalizeTokenName = (path) => {
  // Remove any 'typography.' or 'color.' prefix from the path
  const cleanPath = path.map(part => part.replace(/^(typography\.|color\.)/, ''));
  // Flatten nested paths by joining all components with hyphens
  return cleanPath.join('-');
};

// Helper function to format typography value as CSS
const formatTypographyCSS = (token) => {
  const properties = [];
  const value = token.value || token;

  if (value.fontFamily) properties.push(`font-family: ${value.fontFamily}`);
  if (value.fontSize) properties.push(`font-size: ${value.fontSize}`);
  if (value.fontWeight) properties.push(`font-weight: ${value.fontWeight}`);
  if (value.lineHeight) properties.push(`line-height: ${value.lineHeight}`);
  if (value.letterSpacing) properties.push(`letter-spacing: ${value.letterSpacing}`);
  if (value.textDecoration) properties.push(`text-decoration: ${value.textDecoration}`);
  if (value.textTransform) properties.push(`text-transform: ${value.textTransform}`);
  return properties.join('; ');
};

const registerTransforms = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'name/custom',
    type: 'name',
    transformer: (token, options) => {
      const prefix = options?.prefix || '';
      const name = token.name || normalizeTokenName(token.path);
      return prefix ? `${prefix}-${name}` : name;
    }
  });

  StyleDictionary.registerTransform({
    name: 'color/css',
    type: 'value',
    matcher: (token) => {
      return token.category === 'color' && token.value && (token.value.light || token.value.dark);
    },
    transformer: (token) => {
      const light = normalizeColor(token.value.light);
      const dark = normalizeColor(token.value.dark || token.value.light);
      return { light, dark };
    }
  });

  StyleDictionary.registerTransform({
    name: 'typography/css',
    type: 'value',
    matcher: (token) => {
      return token.type === 'typography' && token.value && token.value.fontFamily;
    },
    transformer: (token) => {
      return formatTypographyCSS(token);
    }
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/css',
    transforms: [
      'name/custom',
      'color/css',
      'typography/css'
    ]
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/scss',
    transforms: [
      'name/custom',
      'color/css',
      'typography/css'
    ]
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/ts',
    transforms: [
      'name/custom',
      'color/css',
      'typography/css'
    ]
  });
};

module.exports = {
  registerTransforms
}; 