# 首屏优化

> [!tip] 提醒
> 很多同学其实都陷入了一个误区，面试问你性能优化，其实并不是要你背性能优化八股文的！

## 一、性能指标

| 简称 | 全称                     | 翻译           | 解释                                                       |
| :--: | :----------------------- | :------------- | :--------------------------------------------------------- |
|  FP  | First Paint              | 首次绘制       | 从网页开始加载到浏览器首次渲染任何像素到屏幕上所用的时间   |
| FCP  | First Contentful Paint   | 首次内容绘制   | 从网页开始加载到网页任何部分的内容呈现在屏幕上所用的时间   |
| FMP  | First Meaningful Paint   | 首次有意义绘制 | 从网页开始加载到页面主要内容对用户可见所用的时间           |
| LCP  | Largest Contentful Paint | 最大内容绘制   | 从网页开始加载到屏幕上呈现最大的文本块或图片元素所用的时间 |

其中 FP、FCP 都可以用 `Performance` 工具检测 ​,FMP 我们可以自己使用 `MutationObserver` 来实现

> [!important] 实际意义
> **FP**: 告诉用户"页面开始响应了"
>
> **FCP**: 告诉用户"页面开始有内容了"
>
> **FMP**: 告诉用户"页面主要内容出来了"

## 二、优化策略

### 1. 减少首屏加载文件资源体积

1. **优化图片**：使用合适的图片格式（如 WebP），并对图片进行压缩。确保图片尺寸适合其显示区域，不要使用过大的图片。​
2. **延迟加载**：使用懒加载（lazy loading）技术，只有在用户滚动到特定区域时才加载相关资源。​
3. **精简 CSS 和 JavaScript**：​

   - **代码压缩**：移除代码中的空格、注释和多余字符，减少文件大小。​

   - **合并文件**：将多个 CSS 和 JavaScript 文件合并为一个文件，减少 HTTP 请求次数。​

   - **树摇(Tree Shaking)**：移除未使用的代码，减少打包文件的体积。​
     ​

4. **使用 CDN**：将静态资源托管在内容分发网络（CDN）上，缩短资源加载的时间。​
5. **减少第三方库**：评估和移除不必要的第三方库，使用更轻量级的替代方案。​
6. **启用浏览器缓存**：设置适当的缓存策略，使浏览器能够缓存常用的文件，减少重复加载。​
7. **压缩文本资源**：启用 Gzip 或 Brotli 压缩，减少 HTML、CSS 和 JavaScript 文件的体积。​
8. **服务端渲染和静态生成**：使用服务端渲染或静态生成技术，减少客户端渲染的压力。

### 2. 预加载主要内容

#### 2.1 使用 `<link rel="preload">` 标签

- 预加载关键资源如字体、图片、CSS 和 JavaScript 文件
- 示例:

  ```html
  <link rel="preload" href="styles/main.css" as="style" />​

  <link rel="preload" href="scripts/main.js" as="script" />​
  <link rel="preload" href="fonts/myfont.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  ```

#### 2.2 优先加载关键 CSS

- 将关键 CSS 直接嵌入到 HTML 文件的头部，减少首次渲染的阻塞
- 示例:

  ```html
  <style>
    /* Critical CSS */​
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }​
  </style>
  ```

#### 2.3 异步加载和延迟加载 JavaScript

- 使用 `async` 或 `defer` 属性来加载非关键的 JavaScript 文件，避免阻塞 HTML 解析
- 示例:

  ```html
  <script src="scripts/main.js" defer></script>
  ```

#### 2.4 预加载字体

- 通过预加载字体资源，避免首次渲染时的字体闪烁（FOIT）
- 示例:

  ```html
  <link rel="preload" href="fonts/myfont.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  ```

#### 2.5 预加载关键图片

- 对于首屏关键图片，可以使用预加载标签提前加载，确保它们尽快显示
- 示例:

  ```html
  <link rel="preload" href="images/main-image.jpg" as="image" />
  ```

#### 2.6 使用 HTTP/2

- 如果服务器支持 HTTP/2，可以配置服务器在客户端请求 HTML 时推送关键资源
- 示例:

  ```nginx
  location / {​
    http2_push /styles/main.css;​
    http2_push /scripts/main.js;​
  }
  ```

### 3. 预渲染(SSG)

可参考 2 个预渲染库

1. [vite-prerender-plugin](https://github.com/preactjs/vite-prerender-plugin)
2. [Vite SSG](https://github.com/antfu-collective/vite-ssg)

### 4. 服务端渲染(SSR)

SSR 的优势
性能优化:

更快的首屏渲染(FCP/FMP)
减少客户端 JavaScript 执行时间
更好的感知性能

SEO 友好:

搜索引擎可直接获取完整内容
更好的社交媒体分享预览

用户体验:

在慢网络环境下表现更好
即使 JavaScript 失效也能显示内容

## SSG 和 SSR 的区别

1. SSG 示例场景：
   > 博客网站 → 构建时生成所有文章页面 → 部署到 CDN
   >
   > 用户访问 → 直接返回静态 HTML 文件
2. SSR 示例场景：
   > 电商网站 → 用户请求商品页面 → 服务器查询数据库 → 生成 HTML 返回
   >
   > 每次请求都是最新数据

**详细对比**

| 特性           | SSG(预渲染)             | SSR(服务端渲染)        |
| :------------- | :---------------------- | :--------------------- |
| **生成时机**   | 构建时                  | 请求时                 |
| **服务器需求** | 静态文件服务器          | Node.js 服务器         |
| **响应速度**   | 极快 (直接返回静态文件) | 快 (需要服务端处理)    |
| **动态内容**   | 有限 (需要客户端更新)   | 完全支持               |
| **扩展性**     | 优秀 (CDN 缓存)         | 依赖服务器性能         |
| **构建时间**   | 较长 (预渲染所有页面)   | 较短                   |
| **适用场景**   | 博客、文档、营销页面    | 电商、仪表板、用户系统 |
