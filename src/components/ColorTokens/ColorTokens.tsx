import React from 'react';
import './ColorTokens.css';
import tokens from '../../../tokens/color/tokens.json';

interface ColorTokensProps {
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

interface Token {
  value: {
    light: string;
    dark: string;
  };
  type: string;
  description: string;
  category: string;
  usage: string;
  status: 'active' | 'deprecated';
  deprecation?: {
    version: string;
    replacedBy?: string;
    reason?: string;
  };
}

export const ColorTokens: React.FC<ColorTokensProps> = ({
  theme = 'system',
  onThemeChange
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  React.useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    setCurrentTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  // Group tokens by type
  const tokensByType = Object.entries(tokens).reduce((acc: Record<string, Array<{ name: string; token: Token }>>, [name, token]) => {
    const type = token.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ name, token: token as Token });
    return acc;
  }, {});

  return (
    <div className="tokens-container" data-theme={currentTheme}>
      <div className="theme-controls">
        <button
          onClick={() => handleThemeChange('light')}
          className={currentTheme === 'light' ? 'active' : ''}
        >
          Light
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={currentTheme === 'dark' ? 'active' : ''}
        >
          Dark
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={theme === 'system' ? 'active' : ''}
        >
          System
        </button>
      </div>
      {Object.entries(tokensByType).map(([type, tokens]) => (
        <div key={type} className="token-section">
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="token-grid">
            {tokens.map(({ name, token }) => (
              <div
                key={name}
                className={`token-card ${token.status === 'deprecated' ? 'deprecated' : ''}`}
              >
                <div
                  className="token-preview"
                  style={{ backgroundColor: token.value[currentTheme] }}
                />
                <div className="token-content">
                  <div className="token-header">
                    <h3>{name}</h3>
                    <span className="token-value">{token.value[currentTheme]}</span>
                  </div>
                  {token.status === 'deprecated' && (
                    <div className="deprecation-badge">Deprecated</div>
                  )}
                  <div className="token-description">{token.description}</div>
                  <div className="token-metadata">
                    <div>Type: {token.type}</div>
                    <div className="token-usage">Usage: {token.usage}</div>
                  </div>
                  {token.status === 'deprecated' && token.deprecation && (
                    <div className="deprecation-info">
                      <div>Deprecated in version: {token.deprecation.version}</div>
                      {token.deprecation.replacedBy && (
                        <div>Replaced by: {token.deprecation.replacedBy}</div>
                      )}
                      {token.deprecation.reason && (
                        <div>Reason: {token.deprecation.reason}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 