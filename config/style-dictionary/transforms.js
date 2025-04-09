const StyleDictionary = require('style-dictionary');

// Helper functions
function isRgba(value) {
  return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(value);
}

function isHex(value) {
  return /^#[0-9A-Fa-f]{3,8}$/.test(value);
}

function normalizeColor(value) {
  return value;
}

function normalizeTokenName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function formatTypographyCSS(value) {
  const properties = [];
  if (value.fontFamily) properties.push(`font-family: ${value.fontFamily}`);
  if (value.fontSize) properties.push(`font-size: ${value.fontSize}`);
  if (value.fontWeight) properties.push(`font-weight: ${value.fontWeight}`);
  if (value.lineHeight) properties.push(`line-height: ${value.lineHeight}`);
  if (value.letterSpacing) properties.push(`letter-spacing: ${value.letterSpacing}`);
  if (value.textDecoration) properties.push(`text-decoration: ${value.textDecoration}`);
  if (value.textTransform) properties.push(`text-transform: ${value.textTransform}`);
  return properties.join('; ');
}

function registerTransforms(StyleDictionary) {
  // Name transform - ensures unique names by including the full path
  StyleDictionary.registerTransform({
    name: 'name/custom',
    type: 'name',
    transformer: function(prop) {
      const type = prop.path[0]; // Use the first path segment as the type
      const path = prop.path.slice(1); // Remove the first segment (type)
      return `${type}-${path.join('-')}`;
    }
  });

  // Typography transform
  StyleDictionary.registerTransform({
    name: 'typography/css',
    type: 'value',
    matcher: (prop) => prop.type === 'typography',
    transformer: (prop) => formatTypographyCSS(prop.original.value)
  });

  // Color transform
  StyleDictionary.registerTransform({
    name: 'color/css',
    type: 'value',
    matcher: (prop) => prop.type === 'color' || prop.type === 'brand' || prop.type === 'surface' || prop.type === 'text' || prop.type === 'interactive' || prop.type === 'border' || prop.type === 'status' || prop.type === 'background' || prop.type === 'overlay' || prop.type === 'shadow' || prop.type === 'gradient' || prop.type === 'chart' || prop.type === 'feedback' || prop.type === 'a11y',
    transformer: (prop) => {
      const value = prop.original.value;
      if (typeof value === 'object' && value.light) {
        return value.light;
      }
      return value;
    }
  });

  // Value transform
  StyleDictionary.registerTransform({
    name: 'value/css',
    type: 'value',
    matcher: function(prop) {
      return true; // This will be the fallback transform
    },
    transformer: function(prop) {
      if (typeof prop.original.value === 'string') {
        return prop.original.value;
      }

      const value = prop.original.value;
      if (!value) return '';

      // Handle both direct values and nested theme values
      const propValue = value.light || value;

      if (typeof propValue === 'string') {
        return propValue;
      }

      // Handle objects with specific properties
      if (propValue.value) {
        return propValue.value;
      }

      // Handle arrays
      if (Array.isArray(propValue)) {
        return propValue.join(', ');
      }

      // Handle other objects
      if (typeof propValue === 'object') {
        return Object.values(propValue).join(', ');
      }

      return propValue;
    }
  });

  // Transform groups
  StyleDictionary.registerTransformGroup({
    name: 'custom/css',
    transforms: [
      'name/custom',
      'typography/css',
      'color/css',
      'value/css'
    ]
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/scss',
    transforms: [
      'name/custom',
      'typography/css',
      'color/css',
      'value/css'
    ]
  });

  StyleDictionary.registerTransformGroup({
    name: 'custom/ts',
    transforms: [
      'name/custom',
      'typography/css',
      'color/css',
      'value/css'
    ]
  });
}

module.exports = {
  registerTransforms
}; 