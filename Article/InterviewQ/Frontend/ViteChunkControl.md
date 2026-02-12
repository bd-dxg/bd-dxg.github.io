---
title: vite打包结构控制
description: 介绍 Vite 8 使用 Rolldown 引擎时的打包结构控制方法，包括入口、动态分包和静态资源的分类配置，以及优化部署流程的最佳实践。
---

# vite打包结构控制 <Badge type="tip" text="Vite 8" />

如果你还在忍受 `dist/assets` 那堆乱七八糟的输出，或者甚至不知道 Vite 的底层已经从 Rollup 进化到了 **Rolldown**，

那你的工程化知识需要更新了。虽然底层引擎换成了 Rust 驱动，速度提升了 30 倍，

但**对产物结构的掌控力**依然是区分"码农"与"工程师"的关键指标。

今天我就教你如何通过配置 Rollup 插件，像控制代码逻辑一样控制你的打包产物结构。

## 1. 现状：Rolldown 时代的“换芯不换壳”

在 Vite 8 中，生产环境的打包引擎由 Rolldown 接管。好消息是，为了兼容生态，

Vite 依然保留了 `build.rollupOptions` 接口。这意味着你以前积攒的配置经验依然奏效，但执行效率已经不可同日而语。

## 2. 核心配置：如何接管命名权？

不要指望默认配置能满足复杂的部署需求。我们需要在 `vite.config.ts` 中通过函数式配置，实现资源的高级分流。

### 2.1 精准控制代码：

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // 强制接管 Rolldown 的输出逻辑
    rollupOptions: {
      output: {
        // 1. 入口 JS：必须进 js 目录，方便做版本管理
        entryFileNames: 'static/js/[name]-[hash].js',

        // 2. 动态分包 Chunk：统一归类
        chunkFileNames: 'static/js/chunks/[name]-[hash].js',

        // 3. 静态资源：利用 Rolldown 高效的资产处理能力进行分流
        assetFileNames: assetInfo => {
          const name = assetInfo.name || ''

          // CSS 独立存放，便于 Nginx 开启高速缓存
          if (name.endsWith('.css')) {
            return 'static/css/[name]-[hash][extname]'
          }

          // 图像资源：按类型分流
          const imgReg = /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i
          if (imgReg.test(name)) {
            return 'static/img/[name]-[hash][extname]'
          }

          // 字体/媒体文件
          const fontReg = /\.(woff2?|eot|ttf|otf)$/i
          if (fontReg.test(name)) {
            return 'static/fonts/[name]-[hash][extname]'
          }

          // 兜底进入 assets
          return 'static/assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
```

## 3. 为什么在 2026 年你必须掌握这个？

### 3.1 Rolldown 的性能红利

Rolldown 处理 assetFileNames 回调的速度远超 Rollup。在拥有数千个静态资源的大型项目中，这种分类配置不会再像以前那样拖慢打包速度。

### 3.2 运维安全的深度考量

现代化的部署流程通常涉及 CDN 边缘计算。将资源分类后：

- 你可以针对 `static/img/` 设置永久缓存。

- 针对 `static/css/` 设置较短的有效期。

- 针对 `static/js/` 配合监控系统进行精准的 SourceMap 映射。

### 3.3 零歧义的目录结构

一个整洁的 `dist` 目录：

```Plaintext
dist/
├── index.html
└── static/
    ├── js/
    ├── css/
    ├── img/
    └── fonts/
```

这种结构是专业前端团队的标配。

作为工程师，我们要做的不仅仅是写出能运行的代码，更是要掌控代码从构建到部署的每一个细节。
