import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import './ColorTokens.css';
import tokens from '../../../tokens/color/tokens.json';

interface DeprecationInfo {
  version: string;
  replacedBy?: string;
  reason?: string;
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
  deprecation?: DeprecationInfo;
}

const DeprecationBadge = () => (
  <div className="deprecation-badge">
    Deprecated
  </div>
);

const DeprecationInfo = ({ deprecation }: { deprecation: DeprecationInfo }) => (
  <div className="deprecation-info">
    <div>Deprecated in version: {deprecation.version}</div>
    {deprecation.replacedBy && (
      <div>Replaced by: {deprecation.replacedBy}</div>
    )}
    {deprecation.reason && (
      <div>Reason: {deprecation.reason}</div>
    )}
  </div>
);

const ColorToken = ({ name, token }: { name: string; token: Token }) => {
  const cssVarName = `--${name.replace(/\./g, '-')}`;
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const currentValue = token.value[currentTheme as keyof typeof token.value];
  
  return (
    <div className={`token-card ${token.status === 'deprecated' ? 'deprecated' : ''}`}>
      <div className="token-preview" style={{ backgroundColor: currentValue }} />
      <div className="token-content">
        <div className="token-header">
          <h3>{name}</h3>
          <div className="token-values">
            <span className="token-value">Light: {token.value.light}</span>
            <span className="token-value">Dark: {token.value.dark}</span>
          </div>
        </div>
        {token.status === 'deprecated' && <DeprecationBadge />}
        <div className="token-description">{token.description}</div>
        <div className="token-metadata">
          <div>Type: {token.type}</div>
          <div className="token-usage">Usage: {token.usage}</div>
          <div>CSS Variable: {cssVarName}</div>
        </div>
        {token.status === 'deprecated' && token.deprecation && (
          <DeprecationInfo deprecation={token.deprecation} />
        )}
      </div>
    </div>
  );
};

const ColorTokensDisplay = () => {
  // Group tokens by category
  const tokensByType = Object.entries(tokens).reduce((acc: Record<string, Array<{ name: string; token: Token }>>, [category, categoryTokens]) => {
    Object.entries(categoryTokens as Record<string, any>).forEach(([subcategory, subcategoryTokens]) => {
      Object.entries(subcategoryTokens as Record<string, any>).forEach(([name, token]) => {
        const type = token.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push({ 
          name: `${category}-${subcategory}-${name}`, 
          token: token as Token 
        });
      });
    });
    return acc;
  }, {});

  return (
    <div className="tokens-container">
      {Object.entries(tokensByType).map(([type, tokens]) => (
        <div key={type} className="token-section">
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="token-grid">
            {tokens.map(({ name, token }) => (
              <ColorToken
                key={name}
                name={name}
                token={token}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const meta: Meta<typeof ColorTokensDisplay> = {
  title: 'Design System/Color Tokens',
  component: ColorTokensDisplay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ColorTokensDisplay>;

export const AllTokens: Story = {};
