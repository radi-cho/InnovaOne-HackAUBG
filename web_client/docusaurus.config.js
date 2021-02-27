module.exports = {
  title: 'GeoShare',
  tagline: 'City traffic management and Crowd dynamics with Privacy in mind',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon.png',
  organizationName: 'radi-cho',
  projectName: 'geoshare',
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
        srcDark: 'img/logo_light.png',
      },
      items: [
        {
          href: '/app',
          label: 'Try it out',
          position: 'left',
        },
        {
          href: 'https://github.com/radi-cho/InnovaOne-HackAUBG',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Built with ❤️ by <a href="https://www.linkedin.com/in/radostin-cholakov-bb4422146/" target="_blank">Radi Cho</a>.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
