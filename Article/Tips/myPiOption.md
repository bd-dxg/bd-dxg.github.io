---
title: 我的 Pi 扩展与 Skills 集合笔记
description: 介绍 Pi 终端 AI 助手的扩展、Skills 配置与美化方案
---

# 我的 Pi 扩展与 Skills 集合笔记 {#pi-extensions-and-skills}

## Pi 简介 {#pi-introduction}

Pi 是一个极小内核的终端 AI 编程助手，核心理念是 **"Adapt pi to your workflows, not the other way around"**——让工具适应你的工作流，而不是反过来。

### 核心特性 {#core-features}

| 特性                     | 说明                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **极小内核**             | 内置仅 4 个基础工具（read/write/edit/bash），功能通过扩展按需组装，不强制你接受它的设计                                          |
| **Token 开销极低**       | 默认系统提示精简，无内置海量 prompt；实测同一问题 Claude Code 消费 0.5 元，Pi 仅 0.03 元（都是接入 DeepSeek 模型），相差约 16 倍 |
| **TypeScript 扩展**      | 用 TS 写扩展，注册工具/命令/事件/自定义 UI，甚至可以玩游戏（示例代码有贪吃蛇）                                                   |
| **Skills 技能系统**      | 基于 Agent Skills 标准，用 Markdown 描述工作流，按需自动加载或 `/skill:name` 手动调用                                            |
| **会话分支**             | JSONL 树状结构存储，`/tree` 在任意历史节点间跳转、分支、对比                                                                     |
| **上下文压缩**           | 上下文溢出时自动摘要，手动 `/compact` 也可自定义压缩策略                                                                         |
| **多模式运行**           | 交互式、print 模式、JSON 模式、RPC 模式、SDK 嵌入，适合人用也适合机器调用                                                        |
| **多供应商支持**         | 内置 Anthropic/OpenAI/Google/DeepSeek 等 20+ 供应商，支持 API Key 和订阅登录                                                     |
| **主题热重载**           | 修改主题文件即时生效，内置 dark/light 主题                                                                                       |
| **无子代理、无计划模式** | 如果你需要,那可以有(插件市场有成熟的),但实际体验下来,没有必要,1M上下文长度的大模型不在需要节省上下文                             |

### 适用人群 {#target-audience}

- **终端优先的开发者**——习惯在终端中工作，不依赖 GUI IDE 的开发者
- **重度 AI 编程用户**——每天用 AI 助手编码，需要高度定制化工具链的工程师
- **追求极客感的程序员**——喜欢用 TypeScript 写扩展、折腾个性化配置、不满足于开箱即用
- **大项目维护者**——项目大、文件多，需要 1M 上下文和会话分支来管理复杂上下文
- **不想被工具绑架的人**——反感 Claude Code/Cursor 等闭源方案，想要开源、可掌控的工具

> **一句话**：如果你想要一个可以完全按自己喜好改造的终端 AI 编程助手，Pi 就是它。

## 配置 {#configuration}

我发现贴扩展代码很容易占据篇幅, 我直接创建个pi的配置仓库吧

pi 并不是一个开箱即用的工具, 而是**需要手动去配置**合适的extensions,skill等,

我知道有个 oh-my-pi 的分支,我之前阅读文章,感觉它完全违背了pi的设计思想,做成了一个懒人包,

但我不否认它的开箱即用的价值, 总的来说, **智者欣赏,愚者比较**,在此不做太多评价.

### 登录 {#login}

如果你使用的是官方订阅,在安装好`pi`后,启动`pi` 直接输入`/login` 登录即可, `pi`内置了很多的渠道商登录:

国外御三家,国内智谱,小米,deepseek,kimi,miniMax都支持,还有更多就不一一列举了

如果你使用中转站,则需要配置自定义提供商

## 功能插件 {#plugins}

### 通知插件 {#notify-plugin}

**安装**: `pi install npm:@pi-lab/notify`

**用途**: 像配置了Claude code 的hooks一样, 在pi回答完成后,调用系统通知提醒

仓库地址:

https://github.com/anthod0/pi-lab/tree/main/packages/notify

### MCP桥 {#mcp-bridge}

不得不说, MCP还是很好用的, pi默认没有支持mcp, 需要安装插件来实现功能.

**安装**: `pi install npm:pi-mcp-adapter`
**用途**: 实现网络搜索,代码仓库搜索,chrome-dev-tools页面级调试

仓库地址:https://github.com/nicobailon/pi-mcp-adapter

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "chrome-devtools-mcp@latest", "--slim", "--autoConnect", "--no-usage-statistics"]
    },
    "searchcode": {
      "url": "https://api.searchcode.com/v1/mcp"
    },
    "tavily-remote-mcp": {
      "type": "http",
      "url": "https://mcp.tavily.com/mcp/"
    }
  }
}
```

### 扩展（Extensions） {#extensions}

扩展是 TypeScript 模块，放在 `~/.pi/agent/extensions/`（全局）或 `.pi/extensions/`（项目本地），pi 启动时自动发现并加载。

接下里我介绍一下我自己在使用的一些扩展,

一些是自己写的,一些来自官方示例代码经过了自己的改良

这是官方的示例库:

https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions

大家可以自己去挑自己感兴趣的研究研究,或者让Ai研究研究,我挑选了一些不错的给大家推荐一下

#### 1. custom-provider.ts — 自定义 API 提供商 {#custom-provider}

**用途**：给 pi 接入第三方 OpenAI 兼容的 API 服务（比如商汤、LinuxDo 等）。

**这里提供两个注册示例**:

```ts
export default function (pi: ExtensionAPI) {
  pi.registerProvider('商汤科技', {
    name: '商汤科技',
    baseUrl: 'https://token.sensenova.cn/v1',
    apiKey: 'sk-...',
    api: 'openai-completions',
    models: [
      {
        id: 'sensenova-6.7-flash-lite',
        name: 'sensenova-6.7-flash-lite',
        reasoning: false,
        input: ['text'],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 256_000,
        maxTokens: 64_000,
      },
    ],
  })
  pi.registerProvider('LinuxDo', {
    // === 你只需要改这里 ===
    name: 'LinuxDo',
    baseUrl: 'https://hub.linux.do/v1', // ← 改成你的 API 地址
    apiKey: 'ah-...', // ← 环境变量名，或直接填密钥
    api: 'openai-completions', // ← 大多数兼容 OpenAI 的 API 用这个
    models: [
      {
        id: 'deepseek-v4-flash',
        name: 'deepseek-v4-flash',
        reasoning: true,
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: false, // 兼容性代码
        },
        input: ['text'],
        cost: { input: 1, output: 2, cacheRead: 0.02, cacheWrite: 0 },
        contextWindow: 1_000_000,
        maxTokens: 64_000,
      },
    ],
  })
}
```

有时候有些模型配置完成后,发出提问会返回Error,类似于这样:

```bash
Error: 400: {"message":"developer is not one of ['system', 'assistant', 'user', 'tool', 'function'] - 'messages.['0].role'","type":"invalid_request_error"}
```

> [!tip] 提醒
> 需要注意的是,有些模型不支持`DeveloperRole`,需要在模型下单独配置,上文中的示例代码已包含

```ts
"compat": {
  "supportsReasoningEffort": true,
  "supportsDeveloperRole": false
},
```

**关键 API**：`pi.registerProvider(name, config)`
**核心要点**：

- 一个扩展可以注册多个 provider（通过多次调用 `registerProvider`）
- `api` 字段指定协议类型，大多数 OpenAI 兼容服务用 `"openai-completions"`
- `cost` 和 `compat` 等字段可选，用于成本展示和功能协商
- `input`字段其实不止于`text`还支持`image`,这个我还没试过,有需要的朋友可以尝试一下

配置完成后, 就可以通过对话与大模型沟通了,

还可以通过`ctrl+p`快捷键快速切换模型,也可以通过快捷键`ctrl+l`直接选择指定模型

#### 2. permission-gate.ts — 权限控制 {#permission-gate}

![权限控制测试](/imgs/2026-07-31_10-03-10.avif)
**用途**：在执行危险命令前弹窗确认，同时保护敏感文件不被意外写入。

> [!tip]
> 我这边默认是所有文件可读,如果大家觉得不太安全,可以让AI进一步限制权限

**两大功能**：

**① 危险命令检测** — 监听 `tool_call` 事件，匹配 `rm`、`sudo`、`Remove-Item` 等危险关键词：

```ts
// ========== 1. 危险命令检测 ==========
// Git Bash 危险命令
const gitBashPatterns = [
  /\brm\b/i, // 任何 rm 删除
  /\bsudo\b/i, // sudo
  /\b(chmod|chown)\b.*777/i, // chmod 777
  /\bdd\s+if=/i, // dd 写磁盘
  /\bmkfs\b/i, // 格式化
  // 注: 原规则 /\b:?>\s*\/dev\//i 会误拦 2>/dev/null 等正常 shell 重定向，已删除
]

// PowerShell 危险命令
const powershellPatterns = [
  /\bRemove-Item\b/i, // Remove-Item
  /\brm\s+-recurse\b/i, // rm -recurse
  /\bdel\s+\/f/i, // del /f
  /\brd\s+\/s/i, // rd /s
  /\brmdir\s+\/s/i, // rmdir /s
  /\bFormat-Volume\b/i, // 格式化磁盘
  /\bClear-Content\b/i, // 清空文件
]
pi.on('tool_call', async (event, ctx) => {
  if (event.toolName !== 'bash') return undefined

  const command = event.input.command as string
  const isDangerous = [...gitBashPatterns, ...powershellPatterns].some(p => p.test(command))

  if (isDangerous) {
    const choice = await ctx.ui.select('⚠️ 危险命令，是否允许执行？', ['是，允许执行', '否，阻止'])
    if (choice !== '是，允许执行') {
      return { block: true, reason: '用户已阻止' }
    }
  }
})
```

**② 敏感路径保护** — 拦截对 `.env`、`.git/`、`node_modules/` 等路径的写入：

```ts
// ========== 2. 敏感路径保护 ==========
const protectedPaths = [
  '.env',
  '.git/',
  'node_modules/',
  'package-lock.json',
  'pnpm-lock.yaml',
  'secrets.',
  'credentials',
  'id_rsa',
  'id_ed25519',
]
pi.on('tool_call', async (event, ctx) => {
  if (event.toolName !== 'write' && event.toolName !== 'edit') return undefined

  const path = event.input.path as string
  const isProtected = protectedPaths.some(p => path.includes(p))

  if (isProtected) {
    ctx.ui.notify(`已阻止写入受保护路径: ${path}`, 'warning')
    return { block: true, reason: `路径受保护` }
  }
})
```

**关键 API**：`pi.on("tool_call")`、`ctx.ui.select()`、`ctx.ui.notify()`
**核心要点**：

- `tool_call` handler 返回 `{ block: true }` 即可阻止工具执行
- 必须用 `ctx.hasUI` 判断是否有交互界面，否则在无 UI 模式下无法弹窗

---

#### 3. qna.ts — 问题抽取与箭头选择 {#qna}

![问题抽取与箭头选择](/imgs/2026-07-31_10-17-23.avif)

**用途**：从 AI 回复中提取待回答的问题，用箭头上下导航选择答案。

**流程**：

```text
/qna
  → 取最后一条 AI 回复
  → LLM 抽取问题（[Q]/[O] 格式）
  → 逐题弹出箭头选择界面
  → 汇总填入编辑器
```

这个扩展是我从示例库移植过来的,它默认的使用办法居然是手动去敲`/qna`命令来实现,

我改成回答完问题就自动运行了, 还修改了提问风格,默认是你要去回答一段话,

现在改成它抛出几个问题, 你用方向键选择+回车就可以了,我感觉非常Nice!

**关键 API**：`pi.registerCommand`、`ctx.sessionManager.getBranch()`、`ctx.ui.custom()`、`matchesKey()`
**核心要点**：

- `complete()` 来自 `@earendil-works/pi-ai/compat`，直接用当前模型做一次 LLM 调用
- `ctx.ui.custom()` 接收工厂函数，返回 `{ render, handleInput, invalidate }` 三方法组件
- `BorderedLoader` 是内置的加载动画组件

#### 4. question.ts — AI 主动提问（选项选择） {#question}

**用途**：AI 拿不定主意时，主动弹出选项让用户选择。

与 `qna.ts` 的区别：`question` 是 **AI 调用工具**触发（agent 驱动），~~`qna` 是 **用户手动输入** `/qna` 触发（用户驱动）~~,

`/qna`现在支持手动触发,也支持**自动触发**(并非100%触发,要看具体的上下文)。

**关键 API**：`pi.registerTool`、`TypeBox` 参数定义、`ctx.ui.custom()`
**核心要点**：

- `toolCall` 的返回 `{ content: [{ type: "text", text }] }` 是 agent 收到的结构化结果
- `parameters` 用 TypeBox 定义 schema，ai 自动校验参数

---

#### 5. questionnaire.ts — 多问题问卷（标签页导航） {#questionnaire}

![多问题问卷](/imgs/2026-07-31_10-16-22.avif)

**用途**：一次性问多个问题，用标签页 Tab 切换。

与 `question.ts` 的区别：`questionnaire` 支持 **多题 + 标签页导航 + 文本输入框**，`question` 是单题。

**关键 API**：`pi.registerTool`、`new Editor()`、`ctx.ui.custom()`、TypeBox 数组参数
**核心要点**：

- `Editor` 是内置的编辑器组件，支持多行文本输入
- Tab 键切换标签页，Tab+Shift 反向切换
- `renderResult()` 可自定义工具执行结果的渲染样式

#### 6. tools.ts — 交互式工具开关 {#tools}

![交互式工具开关](/imgs/2026-07-31_10-24-00.avif)

**用途**：`/tools` 命令打开工具选择界面，实时启用/禁用工具，状态持久化到会话。

**关键 API**：`pi.getAllTools()`、`pi.setActiveTools()`、`pi.appendEntry()`、`SettingsList`
**核心要点**：

- 工具状态通过 `pi.appendEntry()` 持久化到会话文件中
- `session_tree` 事件确保在树导航后也正确还原
- `SettingsList` 是内置的双选项（on/off）组件

这个我主要是用来关闭 内置的 `Agents` 工具, 因为上下文长度1M,所以用不到,这是个主观行为,大家随意.

### 排除掉的工具 {#excluded-tools}

在调试过程中，有些工具被试过但最终排除掉了。以下是排除过程和原因记录：

#### 1. 内置 `Agent` 工具 — 已禁用 {#built-in-agent}

**排除时间**：7月30日

**过程**：

1. 询问 `agents` 命令和 `subagent/` 示例的区别
2. 发现内置的 `Agent` 工具能力较弱，且模型是写死的（`claude-haiku-4-5` / `claude-sonnet-4-5`）
3. 自己没有这两个模型，`model` 参数指定后也无法编辑被锁定的模型
4. 安装 `tools.ts` 扩展，通过 `/tools` 命令将内置 `Agent` 设为 **disabled**

**排除原因**：

- 模型写死，不支持自定义模型
- 能力弱于扩展+skills 组合方案
- 无法编辑锁定的 agent 配置

---

#### 2. `subagent` — 不推荐 {#subagent}

**排除时间**：7月30日

**排除原因**：当前模型有 **1M 上下文长度**，单会话足够容纳所有工作，不需要 subagent 的隔离上下文。

**过程**：

1. 将 `subagent/` 复制到 `~/.pi/agent/extensions/`
2. agent 定义写死了 `claude-haiku-4-5` / `claude-sonnet-4-5` 模型（自己没有）
3. 修改 agent 定义去掉 `model` 字段，让其实继承当前会话模型
4. 实际测试发现 1M 上下文足够用，subagent 的隔离上下文在当前场景下没必要的额外开销

### Skills {#skills}

Skills 放在 `~/.agents/skills/` 目录,或者是在`~/.agents/skills/`，

都可以,pi agent都可以读取, 每个是一个文件夹（含 `SKILL.md`），

描述一种工作流。Pi 根据 SKILL.md 的 `description` 自动判断是否加载。

我来介绍一些我自己用的,有些是自己原创,有些来自GitHub

#### 1. add-anchor — 为 Markdown 标题添加锚点 {#add-anchor}

**用途**：为 Markdown 文件的 h1~h6 标题添加 `{#anchor-id}` 锚点。

**流程**：

1. 提取标题纯文本
2. 去掉 emoji、中文标点、特殊符号
3. 中文翻译为简短英文关键词
4. 小写 + 连字符格式
5. 同文件去重（后缀 -2、-3）

```text
## 📋 今日目标  →  ## 📋 今日目标 {#today-target}
### 安装与配置  →  ### 安装与配置 {#installation-and-configuration}
```

**特点**：支持单文件和整个目录批量处理。

这个是我写博客自用的,主要目的是给标题添加锚点,分享的时候:

1. 方便定位
2. url干净

**使用前**分享的url:`https://docs.bddxg.top/Nodejs60DaysDocs/days/day-05/#_1-%E5%89%8D%E7%AB%AFvs%E5%90%8E%E7%AB%AF-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E7%9A%84%E5%B7%AE%E5%BC%82`

**使用后**分享的url:`https://docs.bddxg.top/GoGuide/GoConditional.html#logic-operator`

哪一个更优雅就不用多说了吧

#### 2. add-frontmatter — 添加 Markdown Frontmatter {#add-frontmatter}

**用途**：为当前打开的 Markdown 文件自动添加 `title`（取一级标题）和 `description`（生成简短描述）。

这个还是服务于博客, 这是一个seo优化小技巧,

可以让链接转换成的卡片有自定义标题和描述信息,更加个性化

#### 3. code-review-expert — 代码审查 {#code-review-expert}

**用途**：对 git 变更进行结构化审查，检测 SOLID 违反、安全风险。

**审查流程**：

1. Preflight（`git status`、`git diff --stat`）
2. SOLID + 架构问题
3. 删除候选 + 迭代计划
4. 安全扫描（注入、SSRF、密钥泄露等）
5. 代码质量（错误处理、性能、边界条件）
6. 输出报告（P0~P3 分级）
7. 询问下一步（修复全部 / 仅 P0/P1 / 指定项 / 不改）

**原则**：先审查后修改，不自动实施。

> [!tip]
> 这是我用过最好的review code skill,墙裂推荐!!!

仓库地址:

https://github.com/sanyuan0704/sanyuan-skills/tree/main/skills/code-review-expert

#### 4. gencom — 提交信息生成器 {#gencom}

**用途**：根据 git diff 生成符合项目风格的提交信息。

**核心规则**：

- 必须分析最近 5-10 条提交记录的风格
- 使用 emoji 前缀（📝✨🔧📦🚚🐛♻️🎨）
- 中文描述，<50 字
- 主体用 `-` 列表

```text
📝 新增 Vite 打包结构控制文章
- 添加 vite.config.ts 配置
- 优化打包路径
```

这个也是我自己写的,增加了emoji图标,好看!

#### 6. grill-me — 持续追问 {#grill-me}

**用途**：对计划或设计逐方面追问，直到达成共识。

**规则**：

- 一次只问一个问题，得到回答后再问下一个
- 每个问题给 2-4 个选项 + "其他"
- 标注推荐答案 `[推荐]`
- 能靠读代码回答的，先读代码再问

这个就不多说了,最近非常火的skill, 仓库地址:

https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me

#### 7. naming — 文件命名助手 {#naming}

**用途**：根据中文描述生成 PascalCase 英文文件名。

| 中文                     | 推荐命名         |
| ------------------------ | ---------------- |
| 用户配置                 | `UserConfig`     |
| 获取订单列表的接口       | `OrderListApi`   |
| 处理用户登录验证的中间件 | `AuthMiddleware` |

这是我自己写的,主要是用来转化比较绕口的中文变量名

#### 8. planning-with-files — 文件驱动的任务规划 {#planning-with-files}

**用途**：用磁盘文件做"持久工作记忆"，替代上下文窗口。

**核心文件**（放在项目 `Task/` 目录下）：

| 文件           | 用途               |
| -------------- | ------------------ |
| `task_plan.md` | 阶段、进度、决策   |
| `findings.md`  | 研究、发现         |
| `progress.md`  | 会话日志、测试结果 |

**核心规则**：

- 复杂任务（3+ 步骤）必须先创建 plan
- 每 2 次查看/搜索后，立即保存发现到文件
- 决策前读 plan，保持目标在注意力窗口内
- 日志所有错误，避免重复失败

> [!tip]
> 这也是我使用过最好的plan相关 skill!!!

最开始它是直接把文件创建在项目根目录(我看了后来更新的代码,现在不是在根目录了)

我就修改了一下,让它创建在根目录下的`Task`文件夹下,避免混乱

原仓库地址:

https://github.com/othmanadi/planning-with-files

## 美化 {#beautification}

![美化](/imgs/2026-07-31_10-51-35.avif)

这个也没太多要说的, 我是用了3个插件:

| 插件               | 安装命令                                     | 简介                                                                                                                                                                            |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open-tui`         | `pi install npm:pi-open-tui`                 | 在终端中打开 TUI 组件面板，方便快速浏览和调试 UI 组件                                                                                                                           |
| `themes`           | `pi install npm:@firstpick/pi-themes-bundle` | 主题合集包，提供多套预设配色方案，安装后可通过 `/settings`进入选项后,输入`theme` 命令切换                                                                                       |
| `pi-rounded-tools` | `pi install npm:pi-rounded-tools`            | 给内置工具（read/write/edit/bash/grep/find/ls）的调用结果加上圆角边框，用 `╭ ╮ ╰ ╯ ─ │` 勾勒，无左侧色条、无主题匹配，仅圆角；边框颜色跟随 `theme.fg("border", ...)` 自适应主题 |


因为考虑到阅读体验,扩展部分没有展示完整的代码,我已经把自己的pi的配置上传到了新建的仓库,供大家参考!

https://github.com/bd-dxg/my-pi

