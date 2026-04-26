---
title: OXC —— 下一代 JS 工具链：oxlint + oxfmt 配置指南
description: 用 Rust 编写的超高速 JS 工具链，oxlint 比 ESLint 快 50-100 倍，oxfmt 比 Prettier 快 30 倍。零依赖、700+ 规则开箱即用
---

# OXC —— 下一代 JS 工具链：oxlint + oxfmt 配置指南

## 为什么你需要了解 OXC

如果你已经被 ESLint 的扁平化配置搞得头昏脑涨，或者受够了 Prettier 在大项目中的龟速格式化，那 OXC 就是为你准备的。

> 简单一句话：**oxlint 替换 ESLint、oxfmt 替换 Prettier**，速度提升几十倍，配置简洁到令人感动。

更重要的是，**oxlint 开箱即用**——装好直接运行，零配置就有 700+ 条规则，TypeScript 支持也是原生内置，不需要什么 `@typescript-eslint/parser`、`typescript-eslint` 那一大堆依赖。

---

## OXC 是什么

OXC（Oxidation Compiler）是一个用 **Rust** 编写的 JavaScript 工具集合，由 Boshen（前阿里巴巴工程师）创建，目前已积累 **21K+ GitHub Stars**。

| 组件             | 状态          | 作用                       | 速度提升                   |
| ---------------- | ------------- | -------------------------- | -------------------------- |
| **oxlint**       | 正式版 v1.61+ | 替代 ESLint 的 linter      | 比 ESLint 快 50-100x       |
| **oxfmt**        | Beta v0.46+   | 替代 Prettier 的 formatter | 比 Prettier 快 30x         |
| **oxc-parser**   | 稳定          | JS/TS 解析器               | 比 SWC 快 3x               |
| **oxc-resolver** | 稳定          | 模块解析器                 | 比 enhanced-resolve 快 28x |
| **oxc-minify**   | Alpha         | 代码压缩                   | —                          |

> [!tip]
> 本文只聚焦 **oxlint** 和 **oxfmt**，这两个是日常开发使用频率最高的工具。

---

## oxlint —— 比 ESLint 快两个数量级的 Linter

### 核心优势

| 对比项         | oxlint                                 | ESLint                          |
| -------------- | -------------------------------------- | ------------------------------- |
| **速度**       | 50-100x 更快                           | 基线                            |
| **规则数量**   | 700+（开箱即用）                       | ~300 核心（需安装插件扩展）     |
| **TypeScript** | 原生内置，无需额外依赖                 | 需 `typescript-eslint` + parser |
| **React/Next** | 可选启用，内置规则                     | 需安装对应插件                  |
| **依赖数**     | **0**（单一二进制文件）                | 十几到几十个包                  |
| **配置格式**   | `.oxlintrc.json` 或 `oxlint.config.ts` | `eslint.config.js`（扁平化）    |

### 内置插件一览

oxlint 的内置插件不需要安装，直接在配置中开即可：

| 插件          | 默认启用 | 来源                                              |
| ------------- | -------- | ------------------------------------------------- |
| `eslint`      | ✅       | ESLint 核心规则                                   |
| `typescript`  | ✅       | typescript-eslint 规则（含类型感知）              |
| `unicorn`     | ✅       | eslint-plugin-unicorn                             |
| `oxc`         | ✅       | OXC 专有规则 + deepscan 精选                      |
| `react`       | ❌       | eslint-plugin-react / react-hooks / react-refresh |
| `import`      | ❌       | eslint-plugin-import                              |
| `promise`     | ❌       | eslint-plugin-promise                             |
| `jest/vitest` | ❌       | eslint-plugin-jest / @vitest/eslint-plugin        |
| `vue`         | ❌       | eslint-plugin-vue（作用于 script 标签）           |
| `jsx-a11y`    | ❌       | eslint-plugin-jsx-a11y                            |
| `nextjs`      | ❌       | @next/eslint-plugin-next                          |

> [!tip]
> **和 ESLint 不同的是**：oxlint 无需安装任何 npm 包来扩展规则——所有插件的规则都编译进了二进制文件，启用插件只是在配置里写个名字的事。

### 安装

```shell
pnpm add -D oxlint
```

> 就这么一个包，没有 `-w`、没有 monorepo 特殊处理、没有 `@typescript-eslint/*` 那一串。

### 配置

在项目根目录创建 `.oxlintrc.json`：

```jsonc
// .oxlintrc.json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["unicorn", "typescript", "import", "promise"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "pedantic": "off",
    "style": "warn",
  },
  "rules": {
    // 关掉 unicorn 里对后端太严格的规则
    "unicorn/filename-case": "off",

    // 允许 console
    "no-console": "off",

    // TypeScript 相关
    "typescript/no-explicit-any": "warn",
    "typescript/no-non-null-assertion": "warn",
    "typescript/consistent-type-imports": [
      "error",
      { "prefer": "type-imports", "fixStyle": "inline-type-imports" },
    ],

    // import 规则
    "import/order": "off",
  },
  "env": {
    "node": true,
    "es2024": true,
  },
  "options": {
    "maxWarnings": 50,
  },
}
```

也支持 **TypeScript 格式**的配置（需要安装 `oxlint` 后使用）：

```ts
// oxlint.config.ts
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["unicorn", "typescript", "import"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    style: "warn",
  },
  rules: {
    "no-console": "off",
    "typescript/no-explicit-any": "warn",
  },
  env: {
    node: true,
    es2024: true,
  },
});
```

### CLI 使用

```shell
# 直接运行（零配置，默认就有效果）
npx oxlint

# 指定配置文件
npx oxlint -c .oxlintrc.json

# 启用插件（CLI 标志）
npx oxlint --import-plugin --react-plugin

# 类型感知检查（需要 tsconfig.json）
npx oxlint --type-aware

# 自动修复
npx oxlint --fix

# 列出所有规则
npx oxlint --rules

# 初始化配置文件
npx oxlint --init
```

---

## oxfmt —— 比 Prettier 快 30 倍的 Formatter

### 核心优势

| 对比项                | oxfmt                            | Prettier |
| --------------------- | -------------------------------- | -------- |
| **速度**              | 30x 更快                         | 基线     |
| **Prettier 一致性**   | 100% 通过 JS/TS 测试             | 100%     |
| **排序功能**          | 内置 import 排序 + Tailwind 排序 | 需插件   |
| **package.json 排序** | 内置                             | 需插件   |
| **printWidth 默认值** | **100**                          | 80       |
| **Prettier 插件**     | 不支持（计划中）                 | 支持     |

### 安装

```shell
pnpm add -D oxfmt
```

### 配置

```jsonc
// .oxfmtrc.json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid",
  "sortImports": {
    "groups": [
      { "type": "builtin" },
      { "type": "external" },
      { "type": "internal" },
      { "type": "parent" },
      { "type": "sibling" },
      { "type": "index" },
    ],
  },
  "sortPackageJson": true,
  "ignorePatterns": ["dist/", "node_modules/", "*.min.js"],
}
```

也支持 TypeScript 格式：

```ts
// oxfmt.config.ts
import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: "all",
  sortImports: true,
});
```

### CLI 使用

```shell
# 格式化所有文件
npx oxfmt

# 只检查（CI 中使用）
npx oxfmt --check

# 指定配置文件
npx oxfmt -c .oxfmtrc.json

# 从 Prettier 配置自动迁移
npx oxfmt --migrate prettier

# 初始化配置
npx oxfmt --init
```

---

## 从 ESLint / Prettier 迁移

### 自动化迁移工具

oxlint 官方提供了迁移工具：

```shell
# 一键迁移 ESLint 配置
npx @oxlint/migrate eslint.config.js

# 包含类型感知规则
npx @oxlint/migrate --type-aware

# 生成迁移报告
npx @oxlint/migrate --details
```

oxfmt 支持从 Prettier 配置直接转换：

```shell
# 自动读取并转换 .prettierrc 配置
npx oxfmt --migrate prettier
```

### 渐进式迁移策略

不放心可以先用着 ESLint，用 `eslint-plugin-oxlint` 在 ESLint 中禁用已被 oxlint 覆盖的规则：

```js
// eslint.config.js
import oxlint from "eslint-plugin-oxlint";

export default [
  // ... 其他配置
  ...oxlint.configs["flat/recommended"],
];
```

等适应后直接删除 ESLint 相关依赖就行。

---

## 添加到 package.json

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check"
  }
}
```

---

## Vite 项目集成（vite-plus）

如果你使用的是 **vite-plus**（基于 Rolldown 的打包工具），OXC 已经深度集成到构建工具链中。本项目 `vite.config.ts` 中的配置即是一例：

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    plugins: ["typescript", "unicorn", "import", "vue"],
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: [".vitepress/cache/**", ".vitepress/dist/**", "Article/**/*.md"],
  },
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    arrowParens: "avoid",
    sortPackageJson: false,
    // ...
  },
});
```

> [!tip]
> 使用 vite-plus 不需要额外安装 oxlint/oxfmt——它们作为 vite-plus 的依赖，已经在构建流程中内置了。

---

## 编辑器设置

### VS Code

安装 **[OXC VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)**（搜索 `oxc`）：

在 `.vscode/settings.json` 中添加：

```json
{
  // Lint
  "oxc_lint.enable": true,
  "oxc_lint.configPath": ".oxlintrc.json",

  // Format
  "oxc_fmt.enable": true,
  "oxc_fmt.configPath": ".oxfmtrc.json",

  // 保存时自动格式化
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "oxc.oxc-vscode",

  // 保存时自动修复 lint
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

> [!warning]
> OXC VS Code 扩展仍在积极开发中，功能可能不如 ESLint 扩展完善。如果遇到问题，可以继续使用 ESLint 扩展配合命令行 oxlint。

---

## 插件周下载量（2026年4月）

- [oxlint](https://www.npmjs.com/package/oxlint): 5,300,000+
- [oxfmt](https://www.npmjs.com/package/oxfmt): 4,100,000+

---

## 总结

**什么时候该用 OXC？**

| 场景                         | 推荐                                                     |
| ---------------------------- | -------------------------------------------------------- |
| **新项目**                   | 直接上 `oxlint + oxfmt`，省去 ESLint/Prettier 的繁琐配置 |
| **老项目迁移**               | 先用迁移工具生成配置，并行运行过渡，熟悉后删除旧依赖     |
| **性能敏感的大项目**         | 强烈推荐，特别是 monorepo，速度提升体验极佳              |
| **对 Prettier 插件有强依赖** | 暂时保留 Prettier，等待 oxfmt 支持插件系统               |
| **Vite+ 项目**               | 自动获得 OXC 集成，无需额外配置                          |

---

## 参考链接

- [OXC 官网](https://oxc.rs/)
- [oxlint 配置文档](https://oxc.rs/docs/guide/usage/linter/config.html)
- [oxfmt 配置文档](https://oxc.rs/docs/guide/usage/formatter/config.html)
- [从 ESLint 迁移指南](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint)
- [从 Prettier 迁移指南](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier)
- [OXC VS Code 扩展](https://github.com/oxc-project/oxc-vscode)
- [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint)
- [@oxlint/migrate 迁移工具](https://github.com/oxc-project/oxlint-migrate)

---

## 更新内容

- **2026年4月26日**：初版发布，基于 oxlint v1.61+ / oxfmt v0.46+
