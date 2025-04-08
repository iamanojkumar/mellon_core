import React from 'react';
import './TokenDisplay.css';

interface TokenDisplayProps {
  name: string;
  value: string;
  description?: string;
  category?: string;
  usage?: string;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  name,
  value,
  description,
  category,
  usage
}) => {
  return (
    <div className="token-display">
      <div className="token-preview" style={{ backgroundColor: value }} />
      <div className="token-info">
        <h3>{name}</h3>
        <p className="token-value">{value}</p>
        {description && <p className="token-description">{description}</p>}
        {category && <p className="token-category">Category: {category}</p>}
        {usage && <p className="token-usage">Usage: {usage}</p>}
      </div>
    </div>
  );
}; 