const StyleDictionary = require('style-dictionary');

const transforms = {
  'name/cti/kebab': {
    type: 'name',
    transformer: function(prop) {
      const path = prop.path;
      const category = path[0];
      const type = path[1];
      
      // Handle typography tokens
      if (category === 'typography') {
        return `text-${path.slice(2).join('-')}`;
      }
      
      // Handle brand tokens
      if (category === 'brand') {
        return `color-brand-${path.slice(2).join('-')}`;
      }
      
      // Handle other color-related categories
      if (['surface', 'text', 'interactive', 'border', 'status', 'background', 'overlay', 'shadow', 'gradient', 'chart', 'feedback', 'a11y'].includes(category)) {
        return `color-${path.join('-')}`;
      }
      
      // Default case
      return path.join('-');
    }
  },
  'typography/css': {
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

      // Return an object with individual properties
      return {
        fontFamily: value.fontFamily,
        fontSize: value.fontSize,
        fontWeight: value.fontWeight,
        lineHeight: value.lineHeight,
        letterSpacing: value.letterSpacing || '0',
        textDecoration: value.textDecoration || 'none',
        textTransform: value.textTransform || 'none'
      };
    }
  },
  'color/css': {
    type: 'value',
    matcher: function(prop) {
      return prop.attributes.category === 'color' || prop.type === 'color';
    },
    transformer: function(prop) {
      if (typeof prop.original.value === 'string') {
        return prop.original.value;
      }

      const value = prop.original.value;
      if (!value) return '';

      // Handle both direct values and nested theme values
      const colorValue = value.light || value;

      if (typeof colorValue === 'string') {
        return colorValue;
      }

      // Handle rgba values
      if (colorValue.r !== undefined && colorValue.g !== undefined && colorValue.b !== undefined) {
        const alpha = colorValue.a !== undefined ? colorValue.a : 1;
        return `rgba(${colorValue.r}, ${colorValue.g}, ${colorValue.b}, ${alpha})`;
      }

      return colorValue;
    }
  },
  'value/css': {
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
  }
};

function registerTransforms(dictionary) {
  Object.entries(transforms).forEach(([name, transform]) => {
    dictionary.registerTransform({
      name,
      ...transform
    });
  });
}

module.exports = {
  registerTransforms
}; 