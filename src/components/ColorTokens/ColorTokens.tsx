import React, { useEffect, useState } from 'react';
import './ColorTokens.css';
import { themeValues, ThemeValue } from './theme';

interface TokenValue {
  light: string;
  dark: string;
}

interface ColorToken {
  tokenName: string;
  value: TokenValue;
  description: string;
  category: string;
  type: string;
  version: string;
  tags: string;
  platform: string;
  usage: string;
  status?: 'active' | 'deprecated';
  deprecation?: {
    version: string;
    replacedBy?: string;
    reason?: string;
  };
}

interface ColorTokensProps {
  tokens?: ColorToken[];
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

interface TokensByCategory {
  [key: string]: ColorToken[];
}

const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if window.matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    updateTheme(query);

    // Listen for theme changes
    query.addEventListener('change', updateTheme);

    return () => {
      query.removeEventListener('change', updateTheme);
    };
  }, []);

  return systemTheme;
};

const groupTokensByCategory = (tokens: ColorToken[]): TokensByCategory => {
  return tokens.reduce((acc, token) => {
    const type = token.type.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(token);
    return acc;
  }, {} as TokensByCategory);
};

const mapTokensToCategories = (tokens: { [key: string]: ThemeValue }): TokensByCategory => {
  const result: TokensByCategory = {};
  
  Object.entries(tokens).forEach(([key, value]) => {
    // Extract category from token name (e.g., 'color-interactive-primary-hover' -> 'interactive')
    const parts = key.split('-');
    if (parts.length >= 2) {
      const category = parts[1]; // 'interactive', 'text', etc.
      
      if (!result[category]) {
        result[category] = [];
      }
      
      // Create a ColorToken object from the token data
      const token: ColorToken = {
        tokenName: key,
        value: value,
        description: `${category} color token`,
        category: 'color',
        type: category,
        version: '1.0.0',
        tags: category,
        platform: 'web',
        usage: `Used for ${category} elements`,
      };
      
      result[category].push(token);
    }
  });
  
  // Sort tokens within each category
  Object.keys(result).forEach(category => {
    result[category].sort((a, b) => {
      // Sort by base token first, then states
      const aParts = a.tokenName.split('-');
      const bParts = b.tokenName.split('-');
      
      // Compare base tokens (e.g., 'interactive-primary' vs 'interactive-secondary')
      const aBase = aParts.slice(0, -1).join('-');
      const bBase = bParts.slice(0, -1).join('-');
      
      if (aBase === bBase) {
        // If same base, sort by state (base first, then hover, focus)
        const aState = aParts[aParts.length - 1];
        const bState = bParts[bParts.length - 1];
        
        if (aState === bState) return 0;
        if (aState === 'hover') return 1;
        if (bState === 'hover') return -1;
        if (aState === 'focus') return 2;
        if (bState === 'focus') return -2;
        return aState.localeCompare(bState);
      }
      
      return aBase.localeCompare(bBase);
    });
  });
  
  return result;
};

const CategoryCard: React.FC<{
  category: string;
  tokens: ColorToken[];
  activeTheme: 'light' | 'dark';
}> = ({ category, tokens, activeTheme }) => {
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Group tokens by base name
  const groupedTokens: { [key: string]: ColorToken[] } = tokens.reduce((acc, token) => {
    const baseName = token.tokenName.split('-').slice(0, -1).join('-');
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(token);
    return acc;
  }, {} as { [key: string]: ColorToken[] });
  
  return (
    <div className="category-card">
      <h2 className="category-title">{capitalizedCategory}</h2>
      <div className="category-content">
        <div className="category-info">
          <div className="info-row">
            <span className="info-label">Type:</span>
            <span className="info-value">{tokens[0]?.type || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Usage:</span>
            <span className="info-value">{tokens[0]?.usage || '-'}</span>
          </div>
        </div>
        <div className="token-list">
          {Object.entries(groupedTokens).map(([baseName, tokenGroup]) => (
            <div key={baseName} className="token-group">
              {tokenGroup.map((token) => (
                <div key={token.tokenName} className="token-item">
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: token.value[activeTheme] }}
                    title={token.value[activeTheme]}
                  />
                  <div className="token-details">
                    <span className="token-name">{token.tokenName}</span>
                    <span className="token-value">{token.value[activeTheme]}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ColorTokens: React.FC<ColorTokensProps> = ({ 
  tokens, 
  theme = 'system',
  onThemeChange 
}) => {
  const systemTheme = useSystemTheme();
  const activeTheme = theme === 'system' ? systemTheme : theme;
  
  // Use provided tokens or map from themeValues
  const tokensByCategory = tokens 
    ? groupTokensByCategory(tokens)
    : mapTokensToCategories(themeValues);

  return (
    <div className={`color-tokens-container theme-${activeTheme}`}>
      <div className="theme-switcher">
        <select 
          value={theme} 
          onChange={(e) => onThemeChange?.(e.target.value as 'light' | 'dark' | 'system')}
        >
          <option value="system">System Theme</option>
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
      </div>
      <div className="categories-grid">
        {Object.entries(tokensByCategory).map(([category, categoryTokens]) => (
          <CategoryCard
            key={category}
            category={category}
            tokens={categoryTokens}
            activeTheme={activeTheme}
          />
        ))}
      </div>
    </div>
  );
}; 