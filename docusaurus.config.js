// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Spug',
  tagline: '灵活、强大、易用的开源运维平台',
  url: 'https://spug.cc',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'OpenSpug', // Usually your GitHub org/user name.
  projectName: 'Spug', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          lastVersion: 'current',
          versions: {
            current: {
              label: '3.x'
            }
          },
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/openspug/spug.dev/edit/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl: 'https://github.com/openspug/spug.dev/tree/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true
      },
      navbar: {
        logo: {
          alt: 'Spug Logo',
          src: 'img/logo-spug-txt.png',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left'
          },
          {
            type: 'doc',
            docId: 'about/about-spug',
            position: 'left',
            label: '文档',
          },
          {
            type: 'dropdown',
            label: '教程',
            position: 'left',
            items: [
              {
                type: 'doc',
                label: 'Java发布配置',
                docId: 'example/example-java'
              },
              {
                type: 'doc',
                label: 'Node发布配置',
                docId: 'example/example-node'
              },
            ],
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            label: '问题反馈',
            position: 'left',
            href: 'https://github.com/openspug/spug/issues',
          },
          {to: '/about', label: '关于', position: 'right'},
          {to: '/sponsorship', label: '赞助', position: 'right'},
          {
            href: 'https://gitee.com/openspug/spug',
            label: 'Gitee',
            position: 'right',
          },
          {
            href: 'https://github.com/openspug/spug',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '快速开始',
                to: '/docs/install-docker',
              },
              {
                label: '使用手册',
                to: '/docs/host-manage'
              }
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'Spug 公众号',
                to: '/about',
              }
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'Gitee',
                href: 'https://gitee.com/openspug/spug',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/openspug/spug',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Spug Team`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
