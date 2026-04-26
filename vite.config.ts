import { defineConfig } from "vite-plus";
import { RSSOptions, RssPlugin } from "vitepress-plugin-rss";

const RSS: RSSOptions = {
  title: "冰冻大西瓜",
  baseUrl: "https://bddxg.top",
  copyright: "Copyright (c) 2018-present, 粥里有勺糖",
};

export default defineConfig({
  lint: {
    ignorePatterns: [".vitepress/cache/**", ".vitepress/dist/**", "Article/**/*.md"],
    options: { typeAware: true, typeCheck: true },
    plugins: ["typescript", "unicorn", "import", "vue"],
  },
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: "as-needed",
    bracketSpacing: true,
    arrowParens: "avoid",
    htmlWhitespaceSensitivity: "ignore",
    bracketSameLine: true,
    sortPackageJson: false,
    embeddedLanguageFormatting: "auto",
    ignorePatterns: [
      ".vitepress/cache",
      ".vitepress/dist",
      "node_modules",
      "package-lock.json",
      "pnpm-lock.yaml",
      "bun.lockb",
      ".env",
    ],
  },

  plugins: [RssPlugin(RSS)],
});
