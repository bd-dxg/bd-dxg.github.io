---
title: 写给自学前端同学的编程法则
description: 面向自学前端开发者的五大编程原则，包括三次法则、三步走、单一职责、幂等性与抽象层次统一，帮助写出高质量、易维护的代码。
---

# 写给自学前端同学的编程法则

> 作者: 冴羽 原文地址: https://segmentfault.com/a/1190000047631881

你可能想：“现在都是 AI 写代码了，有必要学这个吗？”

确实，AI 确实很强大，但它有 2 个致命的局限：

**1. AI 生成的代码质量参差不齐**

AI 是根据概率生成代码的，它并不知道什么是“好的代码”。

如果你不告诉它，它可能会给你生成一个把所有逻辑都塞在一起的千行函数——看似能跑，实则维护噩梦。

**2. 和 AI 对话需要清晰的思路**

想让 AI 帮你写出好代码，你首先得知道“好代码”长什么样。

这些编程原则就是你和 AI 沟通的“语言”：

- 你可以告诉 AI：“帮我拆分成单一职责的函数”
- 你可以问 AI：“这段代码的抽象层次是否一致？”
- 你可以要求 AI：“请用幂等的方式重写这段逻辑”

**不懂原则，你就无法判断 AI 给的东西好不好，更没法指导 AI 改进。**

AI 改变了写代码的方式，但没有改变好代码的标准。

以前，你手写代码，考验的是打字速度和语法记忆。现在，你和 AI 协作，考验的是：

1. 代码审查能力： 一眼看出 AI 生成的代码有没有问题
2. 架构设计能力： 告诉 AI 应该怎么组织代码结构
3. 问题解决能力： 当 AI 搞不定时，从更高层次思考

这些能力的基础，就是我今天要分享的这些编程原则。

## 法则一：三次法则

很多新手有个通病：一上来就想写出“完美”的代码。

- “这个函数将来可能需要什么功能？”
- “这个功能是不是应该做成通用的？”
- “这里的代码还能不能优化？”

结果呢？代码越写越复杂，时间越花越多，最后反而写不出好用的代码。

**说句大实话：先让它跑起来，再说别的。**

由此诞生了三次法则。具体怎么做：

1. **第一次写**：直接写，不要想太多。代码能实现功能就行，重复就重复。
2. **第二次写**：发现又要写同样的代码？直接复制粘贴，稍作修改就完事。
3. **第三次写**：这时候才需要思考，能不能把这些重复代码整合成一个通用的函数？
   为什么要这样呢？

因为只有写了三遍，你才能真正明白：

- 这些代码的真正需求是什么？
- 哪些部分是真正通用的？
- 怎么抽象才最合适？

简单说，就是别想太多，先写起来再说。

## 2. 法则二：三步走

写代码要遵循这个步骤：

### 第一步：让它能跑（Make it work）

别管代码多丑，先让功能正常运行；别担心性能问题，先确保逻辑正确；别想架构问题，先把基本功能实现。

### 第二步：让它正确（Make it right）

补充测试用例，确保各种边缘情况都能处理。

### 第三步：让它快速（Make it fast）

进行性能优化。

很多时候，你会发现根本走不到第三步。 因为大部分场景下，“够用”就行了。

## 3. 法则三：每个函数只做一件事

好的函数就像好的工具：专一、高效、易用。

一个函数应该只负责一件事，就像螺丝刀只负责拧螺丝，锤子只负责敲钉子。

比如这样一段代码：

```js
// 这样的函数做太多事情了
async function processUser() {
  // 1. 从数据库获取用户数据
  const users = await database.fetchAllUsers()

  // 2. 筛选活跃用户
  const activeUsers = users.filter(user => user.isActive)

  // 3. 给活跃用户发邮件
  activeUsers.forEach(user => {
    sendEmail(user.email, 'Hello active user!')
  })

  // 4. 统计活跃用户数量
  const count = activeUsers.length

  // 5. 记录日志
  console.log(`处理了 ${count} 个活跃用户`)
}
```

一个函数做了 5 件不同的事情：获取数据、筛选、发邮件、统计、记录日志。

其实应该拆成：

```js
// 拆分成多个专一的函数
async function getActiveUsers() {
  const users = await database.fetchAllUsers()
  return users.filter(user => user.isActive)
}

function sendEmailsToUsers(users) {
  users.forEach(user => {
    sendEmail(user.email, 'Hello active user!')
  })
}

function logUserCount(count) {
  console.log(`处理了 ${count} 个活跃用户`)
}

// 主要流程函数，只负责协调
async function processUsers() {
  const activeUsers = await getActiveUsers()
  sendEmailsToUsers(activeUsers)
  logUserCount(activeUsers.length)
}
```

使用这种方式：

- 容易理解：每个函数做的事情一目了然
- 容易测试：单独测试每个功能
- 容易修改：想改发邮件逻辑，不用动获取数据的代码
- 容易复用：获取活跃用户的逻辑其他地方也能用

## 4. 法则四：幂等性

听起来很专业，其实很简单：同样的输入，每次都得到同样的输出。

举个例子：

```js
// 不幂等的写法
let count = 0
function increment() {
  count = count + 1 // 每次调用结果都不一样
}

// 幂等的写法
function setCount(value) {
  count = value // 不管调用多少次，传同样的值结果都一样
}
```

之所以要这样做，是因为在真实的开发场景里，很多操作可能会被重复执行：

- 用户手抖点了两次提交按钮
- 网络不好，请求重试了
- 定时任务因为某些原因跑了两遍

如果你的代码不是幂等的，这些情况都可能出问题。

## 5. 法则五：保持一个抽象层次

简单说就是：同一个函数里，代码的“颗粒度”要保持一致。

举个例子：

```js
// 不好的写法 - 抽象层次混乱
function processUser(userId) {
  const user = getUser(userId)

  // 突然开始写具体的实现细节
  if (user.age > 18 && user.status === 'active' && !user.banned) {
    // 又回到高层抽象
    sendWelcomeEmail(user)
  }
}

// 好的写法 - 抽象层次一致
function processUser(userId) {
  const user = getUser(userId)

  if (isEligibleUser(user)) {
    sendWelcomeEmail(user)
  }
}

function isEligibleUser(user) {
  return user.age > 18 && user.status === 'active' && !user.banned
}
```

为什么要统一层次？

因为混搭会让逻辑跳跃，阅读代码的时候，大脑需要不断切换“焦距”。

如果一会儿看到高层概念（发送邮件），一会儿又看到底层细节（判断年龄、状态），就会觉得很累。

## 最后

这些原则不是什么高深的理论，都是前人踩坑总结出来的经验。

其实好的代码就像好的文章：

- 结构清晰 ：每个部分都有明确的作用
- 语言简洁 ：用最简单的词表达清楚的意思
- 逻辑流畅 ：读起来一气呵成，不用来回翻页
- 易于理解 ：即使是外行人也能明白在说什么

记住这些原则，哪怕是 AI 生成的代码，也可以让它有质的飞跃！
