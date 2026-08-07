# 程序员友好的 Skills

最近一段时间，我一直在折腾 AI Agent, 甚至糊了个MCP出来, 这里先不多讲, 因为功能还不完善,有机会继续分享

> 真正决定 Agent 能力上限的，不只是模型本身，而是它掌握了哪些 Skill。

于是我开始整理自己的 Agent 工作流，把日常开发中高频使用的能力沉淀下来，形成了一个属于自己的 Skill 仓库：

> GitHub：https://github.com/bd-dxg/skills

这里面的每一个 Skill，都是我实际开发过程中筛选、调整甚至**二次改造**过的。

它们不是为了炫技，而是解决程序员每天都会遇到的问题：

- 如何让 AI 帮我写出更好的代码？
- 如何让 AI 做 Code Review？
- 如何规范 Git 提交？
- 如何快速理解陌生项目？
- 如何让 AI 遵循我的开发习惯？

今天分享一下我目前比较推荐的一些 Skill。

## 什么是 Skill？

简单说一下(因为总有还在学习的伙伴)：

Skill 就是给 Agent(类似于Claude Code桌面端,Codex桌面端等,CLI也算) 增加的一套「专业能力」。

如果把大模型比作一个刚入职的程序员，那么：

- Prompt 是告诉他任务要求
- Tool 是给他工具
- Skill 是告诉他某类事情应该怎么做

比如：

普通 Agent：

> 帮我 Review 一下代码。

可能只能简单分析语法问题。

拥有 Code Review Skill：

> 按照架构、安全性、性能、可维护性、工程规范进行系统检查，并给出修改建议。

这就是 Skill 带来的区别。

我的 Skill 分类

![](/imgs/1786126082.avif)

目前我的仓库主要分为三类：

- 自己创建并长期维护的 Skill
- 来源于优秀开源项目的 Skill
- 我认为非常值得推荐的 Skill

其中：

🔵 蓝色：
我自己开发或者深度改造过

🟢 绿色：
来自社区优秀项目

🔴 红色：
我认为程序员非常值得使用

## 1. code-review-expert：让 AI 成为你的代码审查专家

> 源skill地址: https://github.com/sanyuan0704/sanyuan-skills/tree/main/skills/code-review-expert

推荐指数: ⭐⭐⭐⭐⭐

这是我最推荐的一个 Skill。

日常开发中，Code Review 是非常重要的一环。

但是很多时候：

- 自己写的代码不容易发现问题
- 时间有限，没有精力逐行检查
- 小问题积累成大问题

所以我希望 AI Review 不只是：

> 这里变量名可以优化

而是能够关注：

- 代码设计
- 潜在 Bug
- 边界情况
- 性能问题
- 安全风险
- 可维护性

这么讲有点空洞了, 我找一个小项目让它检测一下, 眼见为实

![](/imgs/1786126079.avif)

现在提交代码之前，我都会让 Agent 先跑一次 Review。

而且你还可以把它写进全局提示词里,让AI每次生成完毕代码后,自动调用这个skill,实现自动审阅

它更像一个随时在线的高级工程师。

## 2. planning-with-files：复杂任务规划神器

> 来源:https://github.com/bd-dxg/skills/tree/main/planning-with-files

推荐指数: ⭐⭐⭐⭐⭐

这个skill 经过我的改良:早期它直接把生成的文件放在项目根目录,

我改造成生成在根目录的Task文件夹内,这样避免了污染项目更目录,保持项目干净

这是我认为 Agent 工作流里非常重要的一环。

很多人使用 AI 的方式：

直接一句：

> 帮我实现这个功能。

然后 Agent 开始疯狂修改代码。

但是复杂项目中，这种方式很容易因为撑爆上下文(128K,200K上下文时代),

而导致丢失当前进度。

亦或者是大模型超时(429,503之类的你懂的),导致进度丢失

planning-with-files 的思路是：

> 先规划，再执行。

Agent 会：

1. 分析任务
2. 创建计划文件
3. 记录当前进度
4. 分阶段完成

类似真实团队里的：

> 需求分析 → 技术方案 → 开发 → 验证

对于大型重构、功能开发特别有效, 受限于篇幅, 这个我就不截图演示了。

## 3. skill-creator：创建 Skill 的 Skill

> 源skill地址: https://github.com/anthropics/skills/tree/main/skills/skill-creator

推荐指数: ⭐⭐⭐

这是一个很有意思的 Skill。

它负责：

> 帮助我创建新的 Skill。或者检测某个skill是否标准,是否有需要完善的地方

当我发现某个重复工作：

比如：

- 发布流程
- PR 检查
- 文档生成
- 项目初始化

我不会只是写 Prompt。

而是把它沉淀成 Skill。

这样以后 Agent 就拥有长期能力。

这也是我维护这个仓库的原因。

## 4. skill-monitor：让 Skill 保持更新

> 来源: https://github.com/bd-dxg/skills/tree/main/skill-monitor

推荐指数: ⭐⭐

> [!warning]
> 这个skill 执行环境为 `win` + `powershell 5`,大家想使用,但环境不同,可以让AI再改改,问题不大。

创建这个Skill有2个原因:

1. 我通过 `npx skills add xxx`, 某些时候会安装失败,只能手动复制文档的方式去安装,那么手动安装的skill 如何保持更新？
2. 部分我改良过的 skill 不能直接去覆盖升级,不然我改良的部分会被恢复为原样
   所以我增加了 skill-monitor。

它可以帮助检查：

- Skill 是否存在更新
- 是否需要同步社区版本
- 是否存在配置问题

让 Skill 仓库从「收藏夹」变成真正维护的工具集。

## 5. find-skills：寻找 Skill 的 Skill

> 来源: https://github.com/vercel-labs/skills/tree/main/skills/find-skills

推荐指数: ⭐⭐⭐

现在 AI 生态发展非常快, 每天都有新的：Agent、Skill、MCP和Workflow

但是问题来了：

> 我需要的能力，别人是不是已经实现过？

find-skills 就是解决这个问题。

当我需要某种能力：

比如：生成接口文档、优化 Git 工作流、自动生成测试

先让 Agent 帮我搜索已有 Skill。

避免重复造轮子。

## 6. pr-creator / pr-address-comments：GitHub 协作增强

> 来源: https://github.com/google-gemini/gemini-cli/tree/main/.gemini/skills/pr-address-comments

推荐指数: ⭐⭐⭐

作为开发者，GitHub PR 是日常工作。

但是创建 PR 和处理 Review 意见，经常比较机械。

所以我整理了：

|  pr-creator  | pr-address-comments |
| :----------: | :-----------------: |
| 分析代码变化 |  理解 Review 意见   |
| 总结修改内容 |      修改代码       |
| 生成 PR 描述 |    回复 Reviewer    |

让 Agent 参与完整开发流程。

## 7. github-issue-creator：自动生成高质量 Issue

> 来源: https://github.com/google-gemini/gemini-cli/tree/main/.gemini/skills/github-issue-creator

推荐指数: ⭐⭐⭐

很多开发者遇到 Bug：知道问题，但是不知道怎么描述。

这个 Skill 可以帮助整理：

- 问题背景
- 复现步骤
- 期望行为
- 实际行为
- 环境信息

而且会检测项目是否有提交模板,并自动应用提交模板, 提高提交 Issue 的质量。

自从使用了这俩 skill 我的 issue 和 pr 都有了明细的进步

![](/imgs/1786126080.avif)

## 8. add-frontmatter / add-anchor：文档工作流优化

> 来源: https://github.com/bd-dxg/skills

推荐指数: ⭐⭐⭐

作为一个程序员，我经常更新自己的博客

这两个 Skill 主要解决文档自动化问题。

### add-frontmatter

自动补充 Markdown 元信息。方便分享的时候自定义显示标题和描述信息, 例如这样:

![](/imgs/1786126081.avif)

### add-anchor

自动添加英文锚点。使用前分享的url

> https://docs.bddxg.top/GoGuide/GoConditional.html#%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6

使用后分享的url:

> https://docs.bddxg.top/GoGuide/GoConditional.html#logic-operator

哪一个更优雅就不用多说了吧

看起来简单，但是大量文档维护时非常省时间。

## 9. naming：中文变量命名助手

> 来源: https://github.com/bd-dxg/skills/tree/main/naming

推荐指数: ⭐⭐⭐

很多国内开发者都会遇到：

中文概念 → 英文命名

|           中文           |    推荐命名    |
| :----------------------: | :------------: |
|         用户配置         |   UserConfig   |
|    获取订单列表的接口    |  OrderListApi  |
| 处理用户登录验证的中间件 | AuthMiddleware |

这个 Skill 可以辅助生成更加符合工程习惯的命名。

## 10. init-agents-md：初始化项目 AI 配置

> 来源: https://github.com/bd-dxg/skills/tree/main/init-agents-md

推荐指数: ⭐⭐⭐

这个 skill 其实是 Claude code 的 `/init` 指令的平替,

因为之前一段时间使用的是 Pi agent , 它没有这个功能, 所以自己造了个 用`skill-creator`创建的, 哈哈

这个 Skill 可以帮助快速初始化 Agent 配置文件。

让 AI 更了解你的项目。

## 我的 AI 开发理念

整理这些 Skill 的过程中，我越来越确定一件事情：

未来程序员和 AI 协作的核心，不是谁拥有更强的模型，而是谁拥有更好的工作流。

模型会不断升级, 但是你的开发习惯、项目规范、经验沉淀

这些才是真正属于你的资产。Skill 就像给 AI 培养出来的职业技能。

## 写在最后

这个仓库目前还在持续维护。

里面很多 Skill：

不是简单复制来的，而是我实际使用过、根据开发习惯调整过和在真实项目中验证过

如果你也是程序员，希望 AI Agent 真正融入开发流程，而不是只用来聊天，可以关注这个仓库：

> GitHub：https://github.com/bd-dxg/skills

后续我也会继续分享：

我的 Agent 配置、MCP 使用经验、AI 编程工作流以及

如何打造自己的 AI 开发环境, 让 AI 真正成为开发者的第二大脑。

---

文章编写不易, 请大家动动小手点个赞吧, 谢谢!
