const StyleDictionary = require('style-dictionary');

// Helper function to clean token name
const cleanTokenName = (name, prefix) => {
  // Remove 'undefined' prefix if present
  name = name.replace(/^undefined-/, '');
  // Remove any 'typography.' or 'color.' prefix
  name = name.replace(/^(typography\.|color\.)/, '');
  // Replace dots with hyphens
  name = name.replace(/\./g, '-');
  // Convert hyphenated names to camelCase
  name = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  // Add prefix if not already present
  return name.startsWith(prefix) ? name : `${prefix}-${name}`;
};

const formatTypographyValue = (value) => {
  if (!value || !value.fontFamily) return '';
  const props = [];
  if (value.fontFamily) props.push(`font-family: ${value.fontFamily}`);
  if (value.fontSize) props.push(`font-size: ${value.fontSize}`);
  if (value.fontWeight) props.push(`font-weight: ${value.fontWeight}`);
  if (value.lineHeight) props.push(`line-height: ${value.lineHeight}`);
  if (value.letterSpacing) props.push(`letter-spacing: ${value.letterSpacing}`);
  if (value.textDecoration) props.push(`text-decoration: ${value.textDecoration}`);
  if (value.textTransform) props.push(`text-transform: ${value.textTransform}`);
  return props.join('; ');
};

const registerFormats = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'css/theme-variables',
    formatter: function({ dictionary }) {
      const tokens = dictionary.allTokens;
      const lightTheme = {};
      const darkTheme = {};

      tokens.forEach(token => {
        // Remove duplicated category names from the path
        const path = token.path.filter((part, index, arr) => {
          if (index === 0) return true;
          return part !== arr[0];
        }).join('-');

        if (token.type === 'typography') {
          // Handle typography tokens
          if (token.value && token.value.fontFamily) {
            const typographyValue = formatTypographyValue(token.value);
            if (typographyValue) {
              lightTheme[`--typography-${path}`] = typographyValue;
            }
          }
        } else if (token.value && token.value.light) {
          // Handle color tokens with light/dark values
          lightTheme[`--${path}`] = token.value.light;
          if (token.value.dark) {
            darkTheme[`--${path}`] = token.value.dark;
          }
        } else if (token.value && typeof token.value === 'object') {
          // Handle nested typography tokens
          if (token.value.fontFamily) {
            const typographyValue = formatTypographyValue(token.value);
            if (typographyValue) {
              lightTheme[`--typography-${path}`] = typographyValue;
            }
          }
        } else {
          // Handle simple value tokens
          lightTheme[`--${path}`] = token.value;
        }
      });

      return `:root {\n${Object.entries(lightTheme)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n')}\n}\n\n[data-theme="dark"] {\n${Object.entries(darkTheme)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n')}\n}`;
    }
  });

  StyleDictionary.registerFormat({
    name: 'scss/theme-variables',
    formatter: ({ dictionary }) => {
      const tokens = dictionary.allTokens;
      let output = '// Theme variables\n\n';
      
      // Light theme variables
      tokens.forEach(token => {
        const name = cleanTokenName(token.name, '');
        if (token.category === 'color' && token.value && token.value.light) {
          output += `$${name}: ${token.value.light};\n`;
        } else if (token.type === 'typography') {
          output += `$${name}: (\n  ${token.value}\n);\n`;
        }
      });
      
      output += '\n// Dark theme variables\n';
      
      // Dark theme variables
      tokens.forEach(token => {
        const name = cleanTokenName(token.name, '');
        if (token.category === 'color' && token.value && token.value.dark) {
          output += `$${name}-dark: ${token.value.dark};\n`;
        }
      });
      
      // Theme mixin
      output += '\n// Theme mixin\n';
      output += '@mixin apply-theme($theme: "light") {\n';
      output += '  @if $theme == "dark" {\n';
      tokens.forEach(token => {
        const name = cleanTokenName(token.name, '');
        if (token.category === 'color' && token.value && token.value.dark) {
          output += `    --${name}: #{$${name}-dark};\n`;
        }
      });
      output += '  } @else {\n';
      tokens.forEach(token => {
        const name = cleanTokenName(token.name, '');
        if (token.category === 'color' && token.value && token.value.light) {
          output += `    --${name}: #{$${name}};\n`;
        } else if (token.type === 'typography') {
          output += `    --${name}: #{$${name}};\n`;
        }
      });
      output += '  }\n}\n';
      
      return output;
    }
  });

  StyleDictionary.registerFormat({
    name: 'typescript/theme-variables',
    formatter: ({ dictionary }) => {
      const tokens = dictionary.allTokens;
      let output = '// Generated theme variables\n\n';
      
      // Theme value type
      output += 'export interface ThemeValue {\n';
      output += '  light: string;\n';
      output += '  dark: string;\n';
      output += '}\n\n';
      
      // Typography value type
      output += 'export interface TypographyValue {\n';
      output += '  fontFamily: string;\n';
      output += '  fontSize: string;\n';
      output += '  fontWeight: string;\n';
      output += '  lineHeight: string;\n';
      output += '  letterSpacing?: string;\n';
      output += '  textDecoration?: string;\n';
      output += '  textTransform?: string;\n';
      output += '}\n\n';
      
      // Token values
      output += 'export const themeValues: { [key: string]: ThemeValue | TypographyValue } = {\n';
      tokens.forEach(token => {
        const name = cleanTokenName(token.name, '');
        if (token.category === 'color' && token.value && (token.value.light || token.value.dark)) {
          output += `  '${name}': {\n`;
          output += `    light: '${token.value.light}',\n`;
          output += `    dark: '${token.value.dark || token.value.light}',\n`;
          output += '  },\n';
        } else if (token.type === 'typography') {
          const value = token.value || token;
          output += `  '${name}': {\n`;
          output += `    fontFamily: '${value.fontFamily || value.font_family}',\n`;
          output += `    fontSize: '${value.fontSize || value.font_size}',\n`;
          output += `    fontWeight: '${value.fontWeight || value.font_weight}',\n`;
          output += `    lineHeight: '${value.lineHeight || value.line_height}',\n`;
          if (value.letterSpacing || value.letter_spacing) output += `    letterSpacing: '${value.letterSpacing || value.letter_spacing}',\n`;
          if (value.textDecoration || value.text_decoration) output += `    textDecoration: '${value.textDecoration || value.text_decoration}',\n`;
          if (value.textTransform || value.text_transform) output += `    textTransform: '${value.textTransform || value.text_transform}',\n`;
          output += '  },\n';
        }
      });
      output += '};\n\n';
      
      // Theme getter function
      output += 'export function getThemeValue(token: string, theme: "light" | "dark" = "light"): string {\n';
      output += '  const value = themeValues[token];\n';
      output += '  if (!value) return "";\n';
      output += '  if ("light" in value) {\n';
      output += '    return value[theme];\n';
      output += '  }\n';
      output += '  return "";\n';
      output += '}\n\n';
      
      // Typography getter function
      output += 'export function getTypographyValue(token: string): TypographyValue | null {\n';
      output += '  const value = themeValues[token];\n';
      output += '  if (!value || !("fontFamily" in value)) return null;\n';
      output += '  return value as TypographyValue;\n';
      output += '}\n';
      
      return output;
    }
  });
};

module.exports = {
  registerFormats
}; 