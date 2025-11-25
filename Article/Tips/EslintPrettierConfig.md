---
title: eslint 与 prettier 配置
description: ESLint 9.x 和 Prettier 3.x 的完整配置指南，涵盖 Vue 和 React 项目
---

# eslint 与 prettier 配置

今天在群里又看到群友讨论 eslint 和 prettier 的配置, 感觉有必要写一篇博客记录一下, 顺便加深一下印象.

## Eslint <Badge type="tip" text="^9.0.0" />

> [!tip] 提示
> 文档介绍的 eslint 版本为 `^9.0.0`, **请注意教程的时效性**, 以官方文档为准.

### Vue 系列

::: code-group

```shell [npm]
npm install -D eslint@^9.0.0 @vue/eslint-config-typescript eslint-plugin-vue typescript
```

```shell [pnpm]
pnpm add -D eslint@^9.0.0 @vue/eslint-config-typescript eslint-plugin-vue typescript
```

:::

::: code-group

```ts [eslint.config.mts - Vue3+TS]
// eslint.config.mjs - ESLint 9.x 新格式配置
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'

// 配置Vue项目特定设置
configureVueProject({
  // 是否在Vue模板中解析TypeScript语法
  tsSyntaxInTemplates: true,
  // 指定.vue文件中的脚本语言
  scriptLangs: ['ts'], // 推荐只使用TypeScript
  // 项目根目录
  rootDir: import.meta.dirname,
})

export default defineConfigWithVueTs(
  // Vue 3 基础规则
  // pluginVue.configs['flat/essential'],

  // Vue 3 强烈推荐规则
  pluginVue.configs['flat/strongly-recommended'],

  // TypeScript推荐规则（包含类型检查）
  vueTsConfigs.recommendedTypeChecked,

  // 自定义规则
  {
    rules: {
      // Vue特定规则
      // 组件名称必须使用多个单词（避免与HTML元素冲突）
      // 例如：UserProfile ✓，User ✗
      'vue/multi-word-component-names': 'warn',

      // 禁止未使用的变量（包括props、data、computed等）
      // 帮助清理无用代码，保持代码整洁
      'vue/no-unused-vars': 'error',

      // 模板中的组件名必须使用PascalCase格式
      // 例如：<UserProfile /> ✓，<user-profile /> ✗
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // 组件定义时的name属性必须使用PascalCase格式
      // 例如：name: 'UserProfile' ✓，name: 'userProfile' ✗
      'vue/component-definition-name-casing': ['error', 'PascalCase'],

      // 警告使用v-html指令（可能存在XSS安全风险）
      // 提醒开发者注意潜在的安全问题
      'vue/no-v-html': 'warn',

      // v-for循环必须提供key属性
      // 确保Vue能正确跟踪列表项的变化，提高渲染性能
      'vue/require-v-for-key': 'error',

      // 组件的props必须定义类型
      // 例如：props: { name: String } ✓，props: ['name'] ✗
      'vue/require-prop-types': 'error',

      // props必须提供默认值（除了required为true的props）
      // 确保组件的健壮性和可预测性
      'vue/require-default-prop': 'error',

      // TypeScript规则
      // 禁止未使用的变量、函数、参数等
      // 保持代码整洁，避免冗余代码
      '@typescript-eslint/no-unused-vars': 'error',

      // 警告使用any类型（削弱TypeScript类型检查优势）
      // 鼓励使用具体类型，提高代码类型安全性
      // 例如：let data: any = {} ⚠️，let data: User = {} ✓
      '@typescript-eslint/no-explicit-any': 'warn',

      // 对于不会重新赋值的变量，强制使用const而不是let
      // 提高代码可读性和意图表达
      // 例如：const name = 'John' ✓，let name = 'John' ✗
      '@typescript-eslint/prefer-const': 'error',

      // 禁止使用require()导入模块
      // 强制使用ES6的import语句，保持代码现代化
      // 例如：import fs from 'fs' ✓，const fs = require('fs') ✗
      '@typescript-eslint/no-var-requires': 'error',

      // 通用规则
      // 根据环境控制console语句
      // 生产环境警告console使用，开发环境允许
      // 避免生产代码中遗留调试信息
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // 根据环境控制debugger语句
      // 生产环境警告debugger使用，开发环境允许
      // 防止debugger语句进入生产代码
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // 对于不会重新赋值的变量，强制使用const
      // 与TypeScript规则重复，但作为JavaScript基础规则保留
      'prefer-const': 'error',

      // 禁止使用var声明变量
      // 强制使用let/const，避免var的作用域问题
      // 例如：let count = 0 ✓，var count = 0 ✗
      'no-var': 'error',
    },
  },
)
```

```ts [eslint.config.cjs - Vue2]
//TODO 待更新
```

:::

### React 系列

::: code-group

```ts [eslint.config.ts - React+TS]
// TODO 待更新
```

```ts [eslint.config.ts - React]
// TODO 待更新
```

:::

## Prettier <Badge type="tip" text="^3.6.2" />

> [!tip] 提示
> 文档介绍的 prettier 版本为 `^3.6.2`, **请注意教程的时效性**, 以官方文档为准.

::: code-group

```shell [npm]
npm install -D prettier
```

```shell [pnpm]
pnpm add -D prettier
```

:::

```js [prettier.config.mjs]
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  arrowParens: 'avoid',
  htmlWhitespaceSensitivity: 'ignore',
  bracketSameLine: true,
}

export default config
```

## 编辑器设置

### VSCode

需要安装的插件:

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
3. [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

需要做的配置:

1. 在 vscode 的设置中配置自动保存->推荐选择失去窗口焦点自动保存
2. 配置保存时自动格式化->在 settings.json 中添加 `"editor.formatOnSave": true`
