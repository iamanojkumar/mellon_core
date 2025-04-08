import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    // Add SCSS support
    config.css = {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "../dist/scss/_variables.scss";`,
        },
      },
    };

    // Enable JSON imports
    if (!config.optimizeDeps) {
      config.optimizeDeps = {};
    }
    if (!config.optimizeDeps.include) {
      config.optimizeDeps.include = [];
    }
    config.optimizeDeps.include.push('tokens/color/tokens.json');

    return config;
  },
};
export default config;