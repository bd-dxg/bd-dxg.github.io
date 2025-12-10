---
title: 自动导入后不能跳转组件的解决办法
description: 解决 Vue 3 + Vite 项目中使用 unplugin-vue-components 自动导入组件后无法跳转定义的问题
---

# 自动导入后不能跳转组件的解决办法

## 环境背景

- VSCode
- Vite
- Vue 3
- TypeScript
- unplugin-vue-components

## 现象

组件成功自动导入, 也生成了component.d.ts文件, 但在自动导入后不能跳转到组件的定义位置

![1.jpeg](https://images.bddxg.top/blog/1765370315873.jpeg)

如图所示，使用 vscode 编辑器，如果显示导入组件的话，ctrl + 左键 是可以跳转组件的

但如果是使用自动导入`unplugin-vue-components`的话，点击就没有反应了，

## 问题分析

默认生成的 d.ts 文件在根目录，不在 src 目录下，

而我的 tsconfig.app.json 的 inclaude 文件配置如下

```json
"include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
```

导致了跳转失败，

## 解决方案

通过配置项，将生成的 `d.ts` 文件放在 `src/types/` 目录下就可以了

![2.jpeg](https://images.bddxg.top/blog/1765370485127.jpeg)
