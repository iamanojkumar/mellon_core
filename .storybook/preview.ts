import type { Preview } from '@storybook/react'
import '../dist/css/variables.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true
      }
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#ffffff' },
        { name: 'dark', class: 'dark', color: '#1a1a1a' },
      ],
    },
  },
  decorators: [
    (Story) => {
      // Get the current theme
      const theme = document.body.getAttribute('data-theme') || 'light';
      
      // Apply theme to the root element
      document.documentElement.setAttribute('data-theme', theme);
      
      return Story();
    },
  ],
};

export default preview;