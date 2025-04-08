const fs = require('fs');
const path = require('path');

// Read the tokens file
const tokensPath = path.join(__dirname, '../tokens/color/tokens.json');
const tokens = require(tokensPath);

// Story template
const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import './ColorTokens.css';
import tokens from '../../../tokens/color/tokens.json';

interface DeprecationInfo {
  version: string;
  replacedBy?: string;
  reason?: string;
}

interface Token {
  value: string;
  type: string;
  description: string;
  category: string;
  usage: string;
  theme: string;
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

const ColorToken = ({ name, token }: { name: string; token: Token }) => (
  <div className={\`token-card \${token.status === 'deprecated' ? 'deprecated' : ''}\`}>
    <div className="token-preview" style={{ backgroundColor: token.value }} />
    <div className="token-content">
      <div className="token-header">
        <h3>{name}</h3>
        <span className="token-value">{token.value}</span>
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

const ColorTokensDisplay = () => {
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
`;

// CSS template
const cssTemplate = `.tokens-container {
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.token-section {
  margin-bottom: 3rem;
}

.token-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
}

.token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.token-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.token-card.deprecated {
  background: #fafafa;
  border: 1px solid #e0e0e0;
}

.token-card.deprecated .token-preview {
  opacity: 0.5;
}

.token-card.deprecated .token-content {
  opacity: 0.8;
}

.deprecation-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.deprecation-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85rem;
  color: #dc3545;
}

.deprecation-info > div {
  margin-bottom: 0.25rem;
}

.token-preview {
  height: 120px;
  width: 100%;
}

.token-content {
  padding: 1rem;
}

.token-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.token-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.token-value {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}

.token-description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.4;
  white-space: pre-line;
}

.token-metadata {
  font-size: 0.85rem;
  color: #666;
  display: grid;
  gap: 0.25rem;
}

.token-usage {
  white-space: pre-line;
}`;

// Create directories if they don't exist
const storiesDir = path.join(__dirname, '../stories/tokens/color');
if (!fs.existsSync(storiesDir)) {
  fs.mkdirSync(storiesDir, { recursive: true });
}

// Write the story file
const storyPath = path.join(storiesDir, 'ColorTokens.stories.tsx');
fs.writeFileSync(storyPath, storyTemplate, 'utf8');

// Write the CSS file
const cssPath = path.join(storiesDir, 'ColorTokens.css');
fs.writeFileSync(cssPath, cssTemplate, 'utf8');

console.log('Generated color token stories at:', storyPath);
console.log('Generated CSS file at:', cssPath); 