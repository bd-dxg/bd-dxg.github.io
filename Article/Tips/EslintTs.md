---
title: TS ESLint 配置指南
description: TypeScript 项目 ESLint 完整配置指南，包含类型检查、路径解析等现代化规则
---

# TS ESLint 配置指南

JS项目配置指南:
https://linux.do/t/topic/1183320

> [!tip]
> 文档适用于Typescript版本>=5.0以上,最好是最新版

## 现代插件介绍

| 包名                              | 主要作用                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| typescript-eslint                 | 取代了旧的 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`,统一为一个包 |
| eslint-import-resolver-typescript | 正确解析 TypeScript 中 paths 和 .ts 文件                                                  |
| @types/node                       | 让 Node 支持 TypeScript 类型和语法                                                        |
| globals                           | 提供预定义的全局变量集合,如:`process`,`__dirname`等                                       |

JS项目中的包都支持TS:

| 包名                         | 主要作用                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| eslint-plugin-import         | 检查 import/export 语法是否正确                                                                      |
| eslint-plugin-unicorn        | 由社区大神 sindresorhus 维护的「现代最佳实践」合集,目前 290+ 条规则，基本全是 2020~2025 年新推荐写法 |
| eslint-plugin-unused-imports | 目前最好用的「检测 + 自动删除」未使用 import 的插件,比 ESLint 内置 no-unused-vars 快 10 倍、准 100%  |
| eslint-plugin-perfectionist  | 超级强大的 import、export、对象属性、class、member 排序插件, 支持自然排序、分组、自定义顺序          |
| @eslint/js                   | ESLint 官方自己出的规则集合(相当于内置规则的精选版),包含所有 recommended 规则                        |

## 安装

```shell
pnpm add -D eslint-plugin-unused-imports eslint-plugin-import eslint-plugin-unicorn eslint-plugin-perfectionist @eslint/js typescript @types/node  eslint-import-resolver-typescript typescript-eslint globals
```

> [!warning]
> 如果你的项目是 monorepo 项目, 安装库不要忘记 `-w` 也就是 `pnpm add -Dw`

我知晓还有部分有关风格指南的 lint 规则,

这些库我想不应该出现在通用文档指南中,如果需要可以自行在项目中添加,

说实话,看到要安装这么多的包, 我已经感觉蛮臃肿的了,

好在都是装在开发依赖中,不会对实际项目体积产生影响 :joy:

[details="为什么还有 `@eslint/js` 包安装在ts项目中?"]
![2.webp](/imgs/1765181090212.avif)
[/details]

同时需要安装插件 [**Eslint 点我安装**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
![](https://linux.do/uploads/default/original/4X/3/8/0/380d79493e10c59977d5292adabca15e2d12b1bc.jpeg)

## 配置

```js
// eslint.config.js
import js from '@eslint/js'
import imports from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // 1. 基础 + TS 专用 parser
  { files: ['**/*.{js,ts,mjs,cjs}'] },
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        project: true, // 开启 project 模式，能检查类型（神器）
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 2. 官方 + TS 官方推荐规则（必须最先）
  js.configs.recommended,
  ...tseslint.configs.recommended, // 基础 TS 检查
  ...tseslint.configs.recommendedTypeChecked, // 开启类型检查（强烈推荐）
  ...tseslint.configs.stylisticTypeChecked, // 可选：TS 风格建议

  // 3. unicorn（大部分规则对 TS 也适用）
  unicorn.configs['recommended'],

  // 4. import 插件（支持 .ts/.tsx 路径解析）
  {
    plugins: { import: imports },
    rules: {
      ...imports.configs.recommended.rules,
      'import/order': 'off', // 我们用 perfectionist 排序，关闭内置
    },
    settings: {
      'import/resolver': {
        typescript: {}, // eslint-import-resolver-typescript在这里调用 自动读取 tsconfig.json 的 paths、baseUrl
        node: true, // 同时保留 node 解析（防止 .json、.node 等文件报错）
      },
    },
  },

  // 6. perfectionist（完美支持 TS）
  {
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          groups: [
            // type import 自动放最上面
            'type',
            ['builtin', 'external'],
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-exports': 'warn',
    },
  },

  // 7. unused-imports（TS 下表现更好）
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      // @typescript-eslint/no-unused-vars 会被自动关闭
    },
  },

  // 8. 个人最常用的微调（可以直接复制）
  {
    rules: {
      // 关闭与 @typescript-eslint 重叠的原生规则
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // 后端常见放宽
      'no-console': 'off', // 方便调试
      'no-underscore-dangle': 'off', // 允许下划线命名 如 __dirname

      // TS 项目常见放宽
      '@typescript-eslint/no-explicit-any': 'warn', // 禁止使用 any 类型, 不是 off，只是 warn
      '@typescript-eslint/no-non-null-assertion': 'warn', // 禁止使用 ! 非空断言操作符
      '@typescript-eslint/no-empty-object-type': 'off', // 禁止空对象类型定义,关闭 interface {} 很常用
      '@typescript-eslint/consistent-type-imports': [
        // 强制 type import（推荐）强制 import { type User } from './types'
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
]
```

大家可能留意到我并未导入`eslint-import-resolver-typescript`这个库,

但又在`package.json`中安装了这个库

原因是这个包是由其他依赖包自动调用的, 配置项中也做了额外注释

```js
    settings: {
      'import/resolver': {
        typescript: {}, // eslint-import-resolver-typescript在这里调用 自动读取 tsconfig.json 的 paths、baseUrl
        node: true,     // 同时保留 node 解析（防止 .json、.node 等文件报错）
      },
```

## 插件周下载量(2025年11月19日)

- [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports): 4,967,752
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import): 32,590,009
- [eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn): 4,752,987
- [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise): 5,303,551
- [eslint-plugin-perfectionist](https://www.npmjs.com/package/eslint-plugin-perfectionist): 1,169,778
- [@eslint/js](https://www.npmjs.com/package/@eslint/js): 55,530,414

---

- [typescript-eslint](https://www.npmjs.com/package/typescript-eslint): 15,320,324
- [@types/node](https://www.npmjs.com/package/@types/node): 145,730,231
- [globals](https://www.npmjs.com/package/globals):115,151,028

> [!tip]
> 这里只是列举了通用插件, 如果有使用到第三方库 如 express, react, jest lodash, mongodb等等,需自行安装额外的ts支持库.

## 更新内容

### 2025年12月6日

1. 移除了`eslint-plugin-promise`规则,并且移除了相关配置项,因为不支持ts声明,后续是否补回待定(佬友有建设性观点可以发布在评论区)
2. 添加了`globals`库, **提供预定义的全局变量集合**，用于 ESLint 配置中声明不同环境下的全局变量。
3. 更新了安装脚本:移除`eslint-plugin-promise`,`@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser`,添加`globals`

### 2025年11月19日

替换 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser` 为 `typescript-eslint` ts官方已将2个包合并为一个包,降低配置负担和心智负担
