// Theme types and values
export interface ThemeValue {
  light: string;
  dark: string;
}

// Import tokens from JSON
import tokens from '../../../tokens/color/tokens.json';

// Helper function to flatten nested tokens
const flattenTokens = (obj: any, parentKey = ''): { [key: string]: any } => {
  return Object.entries(obj).reduce((acc, [key, value]: [string, any]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    
    if (value && typeof value === 'object') {
      // If it's a token with a value property
      if (value.value) {
        acc[newKey] = value;
      } 
      // If it's a nested object with states (hover, focus, etc.)
      else {
        Object.entries(value).forEach(([stateKey, stateValue]: [string, any]) => {
          if (stateValue && typeof stateValue === 'object') {
            if (stateValue.value) {
              // Handle states like hover, focus, etc.
              acc[`${newKey}.${stateKey}`] = stateValue;
            } else {
              Object.assign(acc, flattenTokens(stateValue, `${newKey}.${stateKey}`));
            }
          }
        });
      }
    }
    
    return acc;
  }, {} as { [key: string]: any });
};

// Convert tokens to theme values
export const themeValues: { [key: string]: ThemeValue } = Object.entries(flattenTokens(tokens))
  .reduce((acc, [key, token]) => {
    // Convert token name to match our format (e.g., "interactive.primary.hover" -> "color-interactive-primary-hover")
    const formattedKey = `color-${key.replace(/\./g, '-')}`;
    
    if (token.value && (token.value.light || token.value.dark)) {
      acc[formattedKey] = {
        light: token.value.light || '#000000',
        dark: token.value.dark || token.value.light || '#000000',
      };
    }
    
    return acc;
  }, {} as { [key: string]: ThemeValue }); 