import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import './TypographyTokens.css';
import tokens from '../../../tokens/typography/tokens.json';

interface DeprecationInfo {
  version: string;
  replacedBy?: string;
  reason?: string;
}

interface Token {
  value: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textDecoration: string;
    textTransform: string;
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

const TypographyToken = ({ name, token }: { name: string; token: Token }) => {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textTransform,
    textDecoration
  } = token.value;

  return (
    <div className={`token-card ${token.status === 'deprecated' ? 'deprecated' : ''}`}>
      <div className="token-preview" style={{
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        textTransform: textTransform as 'none' | 'capitalize' | 'uppercase' | 'lowercase',
        textDecoration: textDecoration === 'normal' ? 'none' : textDecoration as 'none' | 'underline' | 'line-through'
      }}>
        The quick brown fox jumps over the lazy dog
      </div>
      <div className="token-content">
        <div className="token-header">
          <h3>{name}</h3>
          <div className="token-values">
            <div className="token-value">Font: {fontFamily}</div>
            <div className="token-value">Size: {fontSize}</div>
            <div className="token-value">Weight: {fontWeight}</div>
            <div className="token-value">Line Height: {lineHeight}</div>
            <div className="token-value">Letter Spacing: {letterSpacing}</div>
            <div className="token-value">Transform: {textTransform}</div>
            <div className="token-value">Decoration: {textDecoration}</div>
          </div>
        </div>
        {token.status === 'deprecated' && <DeprecationBadge />}
        <div className="token-description">{token.description}</div>
        <div className="token-metadata">
          <div>Type: {token.type}</div>
          <div className="token-usage">Usage: {token.usage}</div>
        </div>
        {token.status === 'deprecated' && token.deprecation && (
          <DeprecationInfo deprecation={token.deprecation} />
        )}
      </div>
    </div>
  );
};

const flattenTokens = (obj: any, prefix: string = ''): Array<{ name: string; token: Token }> => {
  return Object.entries(obj).reduce((acc: Array<{ name: string; token: Token }>, [key, value]) => {
    if (value && typeof value === 'object') {
      if ('value' in value && 'type' in value) {
        // This is a token
        return [...acc, { name: prefix ? `${prefix}-${key}` : key, token: value as Token }];
      } else {
        // This is a nested object
        return [...acc, ...flattenTokens(value, prefix ? `${prefix}-${key}` : key)];
      }
    }
    return acc;
  }, []);
};

const TypographyTokensDisplay = () => {
  const flatTokens = flattenTokens(tokens);
  
  // Group tokens by type
  const tokensByType = flatTokens.reduce((acc: Record<string, Array<{ name: string; token: Token }>>, item) => {
    const type = item.token.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="tokens-container">
      {Object.entries(tokensByType).map(([type, tokens]) => (
        <div key={type} className="token-section">
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="token-grid">
            {tokens.map(({ name, token }) => (
              <TypographyToken
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

const meta: Meta<typeof TypographyTokensDisplay> = {
  title: 'Design System/Typography Tokens',
  component: TypographyTokensDisplay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TypographyTokensDisplay>;

export const AllTokens: Story = {};
