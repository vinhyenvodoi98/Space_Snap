import { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  // This is required to make use of the React 17+ JSX transform.
  jsxRuntime: 'automatic',

  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-styled-components',
    {
      resolve: "@vercel/gatsby-plugin-vercel-builder",
      options: {
        name: 'Template Snap',
        icon: 'src/assets/logo.svg',
        theme_color: '#20EEA4',
        background_color: '#FFFFFF',
        display: 'standalone',
      },
    },
  ],
};

export default config;
