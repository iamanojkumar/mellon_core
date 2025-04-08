import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ColorTokens } from './ColorTokens';

const meta: Meta<typeof ColorTokens> = {
  title: 'Design System/Color Tokens',
  component: ColorTokens,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      defaultValue: 'system',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorTokens>;

// Stories
export const AllTokens: Story = {
  args: {
    theme: 'system',
  },
  render: (args) => {
    const [theme, setTheme] = React.useState(args.theme);
    return (
      <ColorTokens
        {...args}
        theme={theme}
        onThemeChange={setTheme}
      />
    );
  },
};

export const BrandTokens: Story = {
  args: {
    theme: 'system',
  },
}; 