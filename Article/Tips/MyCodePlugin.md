---
title: 常用插件
description: VSCode 常用插件推荐及配置说明，提升开发效率的必备工具
---

# 常用插件

| 插件名称                  | 插件描述                                             | 链接                                                                                         |
| ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Chinese (Simplified)      | 用于汉化 Vscode                                      | [点我跳转](https://open-vsx.org/vscode/item?itemName=MS-CEINTL.vscode-language-pack-zh-hans) |
| Color Highlight           | 颜色高亮,更好的一种展示方案                          | [点我跳转](https://open-vsx.org/vscode/item?itemName=naumovs.color-highlight)                |
| Error Lens                | 将 eslint/prettier 或 ts 错误显示在行内,更醒目更高效 | [点我跳转](https://open-vsx.org/vscode/item?itemName=usernamehw.errorlens)                   |
| ESLint                    | 检查 Js/Ts 代码，发现并修复问题。                    | [点我跳转](https://open-vsx.org/vscode/item?itemName=dbaeumer.vscode-eslint)                 |
| Prettier - Code formatter | 格式化代码,有丰富的条件限制                          | [点我跳转](https://open-vsx.org/vscode/item?itemName=esbenp.prettier-vscode)                 |
| Vue (Official)            | Vue 官方插件,写 vue 必备                             | [点我跳转](https://open-vsx.org/vscode/item?itemName=Vue.volar)                              |
| Eva Theme                 | 我喜欢的编辑器主题,支持深浅色主题切换                | [点我跳转](https://open-vsx.org/vscode/item?itemName=fisheva.eva-theme)                      |
| Material Icon Theme       | 我习惯使用的图标主题                                 | [点我跳转](https://open-vsx.org/vscode/item?itemName=fowind.material-icon-theme-with-jb-nf)  |
| Path Intellisense         | 路径提示插件(比 VsCode 自带的强)                     | [点我跳转](https://open-vsx.org/vscode/item?itemName=christian-kohler.path-intellisense)     |
| scriptcat-vscode          | 脚本猫-编写油猴脚本必备                              | [点我跳转](https://open-vsx.org/vscode/item?itemName=CodFrm.scriptcat-vscode)                |

---

## 注意事项

- **Color Highlight**: 这里推荐在 VsCode 设置搜索 `Color Decorators` 并取消打勾, 这样可以关闭颜色代码前方的小方块.
- **Eslint/Prettier**: 关于他们的配置可以参考文章[eslint 与 prettier 配置](./EslintPrettierConfig).
- **Vue (Official)**: 建议在设置里搜索`Dot Value`并勾选,这样可以自动在 ref 数据自动使用`.value`.
- **Eva Theme**: 其实 VsCode 一直支持跟随系统主题切换自身主题颜色,在设置里配置好`Preferred Dark Color Theme`和`Preferred Light Color Theme`的 eva 主题即可
- **Error Lens**: 这个插件的可玩性很高,具体可以看这里的[配置](https://github.com/usernamehw/vscode-error-lens/blob/master/docs/docs.md)
