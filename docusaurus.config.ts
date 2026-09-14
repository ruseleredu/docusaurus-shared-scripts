import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

/* Enabling math equations */
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from 'remark-emoji'; // enable emoji shortcodes (like :rocket:)

import footer from "./footer";
import navbarItems from "./navbar"; // Import your new navbar file

const config: Config = {
  title: "ELT73A - Sistemas Microcontrolados",
  tagline: 'Desenvolver e implementar soluções para problemas de controle e automação utilizando microcontroladores.',
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: true, // Enable experimental features that can improve build performance
  },

  // Set the production url of your site here
  url: "https://github.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/mic-docs/",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ruseleredu", // Usually your GitHub org/user name.
  projectName: "mic-docs", // Usually your repo name.
  deploymentBranch: "gh-pages",
  onBrokenLinks: "warn",

  staticDirectories: ['static'],
  markdown: {
    mermaid: true, // Diagrams can be rendered using Mermaid in a code block.
    hooks: {
      onBrokenMarkdownLinks: "warn", // or 'throw'
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "pt-BR",
    locales: ["pt-BR"],
  },

  themes: ["@docusaurus/theme-mermaid"],

  // Include the KaTeX CSS in your config under stylesheets:
  stylesheets: [
    {
      href: "/katex/katex.min.css",
      type: "text/css",
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // 👇 Add this line for the last update time on docs
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/ruseleredu/mic-docs/edit/main/",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          beforeDefaultRemarkPlugins: [remarkEmoji], // enable emoji shortcodes (like :rocket:)
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/ruseleredu/mic-docs/edit/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "labs", // Unique ID for this docs instance
        path: "labs", // Path to your API docs folder
        routeBasePath: "labs", // Base URL for these docs (e.g., yoursite.com/api/...)
        sidebarPath: require.resolve("./sidebarslabs.js"), // Separate sidebar for LAB docs
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        beforeDefaultRemarkPlugins: [remarkEmoji], // enable emoji shortcodes (like :rocket:)
        // ... other options specific to your API docs
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "quiz", // Unique ID for this docs instance
        path: "quiz", // Path to your API docs folder
        routeBasePath: "quiz", // Base URL for these docs (e.g., yoursite.com/api/...)
        sidebarPath: require.resolve("./sidebarsquiz.js"), // Separate sidebar for Quiz docs
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        beforeDefaultRemarkPlugins: [remarkEmoji], // enable emoji shortcodes (like :rocket:)
        // ... other options specific to your API docs
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "projects", // Unique ID for this docs instance
        path: "projects", // Path to your API docs folder
        routeBasePath: "projects", // Base URL for these docs (e.g., yoursite.com/api/...)
        sidebarPath: require.resolve("./sidebarsproj.js"), // Separate sidebar for Quiz docs
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        beforeDefaultRemarkPlugins: [remarkEmoji], // enable emoji shortcodes (like :rocket:)
        // ... other options specific to your API docs
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "tpls", // Unique ID for this docs instance
        path: "tpls", // Path to your API docs folder
        routeBasePath: "tpls", // Base URL for these docs (e.g., yoursite.com/api/...)
        sidebarPath: require.resolve("./sidebarstpls.js"), // Separate sidebar for Quiz docs
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        beforeDefaultRemarkPlugins: [remarkEmoji], // enable emoji shortcodes (like :rocket:)
        // ... other options specific to your API docs
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "infra", // Unique ID for this docs instance
        path: "infra-docs", // Path to your infra docs folder
        routeBasePath: "infra", // Base URL for these docs (e.g., yoursite.com/infra/...)
        sidebarPath: require.resolve("./sidebarsinfra.ts"), // Separate sidebar for infra docs
        // 👇 Add this line for the last update time
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        // ... other options specific to your API docs
      },
    ],
    [
      "@cmfcmf/docusaurus-search-local",
      {
        // Options here
      },
    ],
  ],
  // ... rest of your config

  themeConfig: {
    // Replace with your project's social card
    image: "img/ELT73A-BannerCourse.png",
    navbar: {
      title: "ELT73A",
      logo: {
        alt: "Sistemas Microcontrolados Logo",
        src: "img/logo.svg",
      },
      items: navbarItems,
    },
    footer: footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        // https://prismjs.com/#supported-languages
        "toml",
        "arduino",
        "apacheconf",
        "nginx",
        "bash",
        "matlab",
        "powershell",
        "ini",
        "latex",
        "php",
        "java",
        "wasm",
        "armasm",
        "asmatmel",
        "groovy",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
