# eslint配置插件指南 － Vue3+TS 项目

之前的文章:

- [eslint配置插件指南 - JS项目](./EslintJs)
- [eslint配置插件指南 - TS项目](./EslintTs)

---

![3.webp](https://images.bddxg.top/blog/1765181281375.webp)

**配置好 Eslint 显著提高AI代码生成质量, 有图有真相, 令人信服!**

AI相关配置:

![4.webp](https://images.bddxg.top/blog/1765181292293.webp)
项目级别配置即可

---

言归正传, 今天分享Vue3+TS相关的eslint配置

## 现代插件介绍

| 包名              | 主要作用                    |
| ----------------- | --------------------------- |
| eslint-plugin-vue | vue官方团队维护的eslint规则 |
| vue-eslint-parser | 让eslint可以解析vue文件     |

TS插件我就不重复了,引用一下:

> | 包名                              | 主要作用                                                                                  |
> | --------------------------------- | ----------------------------------------------------------------------------------------- |
> | typescript-eslint                 | 取代了旧的 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`,统一为一个包 |
> | eslint-import-resolver-typescript | 正确解析 TypeScript 中 paths 和 .ts 文件                                                  |
> | @types/node                       | 让 Node 支持 TypeScript 类型和语法                                                        |
> | globals                           | 提供预定义的全局变量集合,如:`process`,`__dirname`等                                       |
>
> JS项目中的包都支持TS:
>
> | 包名                         | 主要作用                                                                                             |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
> | eslint-plugin-import         | 检查 import/export 语法是否正确                                                                      |
> | eslint-plugin-unicorn        | 由社区大神 sindresorhus 维护的「现代最佳实践」合集,目前 290+ 条规则，基本全是 2020~2025 年新推荐写法 |
> | eslint-plugin-unused-imports | 目前最好用的「检测 + 自动删除」未使用 import 的插件,比 ESLint 内置 no-unused-vars 快 10 倍、准 100%  |
> | eslint-plugin-perfectionist  | 超级强大的 import、export、对象属性、class、member 排序插件, 支持自然排序、分组、自定义顺序          |
> | @eslint/js                   | ESLint 官方自己出的规则集合(相当于内置规则的精选版),包含所有 recommended 规则                        |

## 安装

如果你已经安装了 TS 的 eslint 规则插件,执行以下命令:

```shell
pnpm add -D eslint-plugin-vue vue-eslint-parser
```

如果是项目初始化, 先用vite创建好项目后(vite会自动在package.json中写入基本的vue相关的插件), 执行以下命令:

```shell
pnpm add -D eslint eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-perfectionist eslint-plugin-unicorn eslint-plugin-unused-imports eslint-plugin-vue globals prettier typescript typescript-eslint vue-eslint-parser  @eslint/js @types/node jiti
```

> [!tip]提示
> 看着是有点多,但都是**开发依赖**,不会打包进最终构建项目

## 配置

项目根目录创建 `eslint.config.ts`

```ts
import js from '@eslint/js'
import imports from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
export default [
  // 0. 忽略配置文件(这些文件不需要 TypeScript 项目服务)
  {
    ignores: ['postcss.config.js', 'tailwind.config.js', '*.config.js'],
  },
  // 1. 基础 + TS 专用 parser
  { files: ['**/*.{js,ts,mjs,cjs}'] },
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true, // 使用 projectService 支持 project references
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
  unicorn.configs.recommended,

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

  // 8. Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // 用于 <script> 部分的 TypeScript 解析
        projectService: true,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
      globals: {
        ...globals.browser, // Vue 运行在浏览器环境
      },
    },
  },

  // 9. Vue 推荐规则
  ...vue.configs['flat/recommended'],

  // 10. Vue 自定义规则
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'warn', // 组件名建议使用多个单词 eslintunicorn/filename-case
      'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 模板中组件名使用 PascalCase
      'vue/singleline-html-element-content-newline': 'off', // 关闭单行 HTML 元素内容换行规则
      'vue/max-attributes-per-line': 'off', // 关闭单行 HTML 元素内容换行规则
      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' }, // 强制 <script lang="ts">
        },
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'], // 宏定义顺序
        },
      ],
      'vue/no-unused-refs': 'warn', // 警告未使用的 ref
      'vue/no-v-html': 'off', // 允许 v-html（根据项目需求调整）
    },
  },

  // 11. 个人最常用的微调（可以直接复制）
  {
    rules: {
      // 关闭与 @typescript-eslint 重叠的原生规则
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // 后端常见放宽
      'no-console': 'off', // 方便调试
      'no-underscore-dangle': 'off', // 允许下划线命名 如 __dirname

      // TS 项目常见放宽
      'unicorn/filename-case': 'off', // 关闭组件名风格检查
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

> [!tip] 提示
> 在这套配置中,一些影响编写代码的规则我已经手动优化过一遍了, 如果有自己不习惯的规则,可以在**第10点**中自行关闭

在 `tsconfig.node.json` 中,配置如下:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts", "eslint.config.ts", "prettier.config.ts"]
}
```

`target` 可以按需求自行修改,**关键点是 `include` 要把这些包含进去**, 不然配置文件会遇到ts警告

## 插件周下载量

- [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser):5,995,435
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue): 4,515,034
