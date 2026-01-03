---
title: GitFlow 五大分支概述
description: 详解 GitFlow 工作流的五大核心分支及其使用场景
---

# 五大分支概述

![fI6dAXt_8.webp](https://images.bddxg.top/blog/1767398313326.webp)

- ** 主分支 (main/master)**: 项目的生产发布分支, 始终保持稳定可发布状态
- ** 热修复分支 (hotfix/\*)**: 从 `main` 分支创建, 用于紧急修复线上 BUG, 修复后同时合并回 `main` 和 `develop`
- ** 开发分支 (develop)**: 日常开发的主分支, 所有功能开发的集成分支
- ** 特性分支 (feature/\*)**: 从 `develop` 创建, 开发新功能, 完成后合并回 `develop`
- ** 预发布分支 (release/\*)**: 从 `develop` 创建, 用于发布前的测试和最终调整, 测试通过后合并回 `main`(打版本标签) 和 `develop`

## 分支合并关系

```
feature/*  →  develop
develop    →  release/*
release/*  →  main + develop
hotfix/*   →  main + develop
```

## 主分支

作用: 存放 **稳定**, 可**随时部署到生产环境**的代码

特点:

- 分支上每一个提交对都应一个正式发布的版本
- 不允许在此分支直接开发
- 通常被打上版本标签 (如: v1.0.0 或 v20260101)

## 开发分支

作用: 存放 ** 最新开发成果 ** 的集成分支, 是功能开发的集线器

特点:

- 当 `develop` 分支上的代码到达稳定状态并准备发布时, 会合并到 `main` 分支 (如果有 `release` 分支, 则合并到此分支)
- 所有功能的分支、发布分支都从 `develop` 分支拉取

## 功能分支

来源: `develop`

合并目标: `develop`

命令惯例:`feature/user-authentication`,`feature/payment-integration`

作用: **开发新功能**

生命周期:

- 从 `develop` 分支拉取
- 开发完成后, 合并回 `develop`
- 合并后, 该功能分支通常被删除

## 发布分支

来源: `develop`

合并目标:`develop` 和 `main`

命名惯例:`release/1.2.0`,`release/2026-spring`

作用: 为发布新版本做准备. 在此分支上, 只做 **BUG 修复**,**生成版本号**,**整理文档** 等发布准备工作, **不再添加新功能**

生命周期:

- 当 `develop` 分支的功能足够进行一次发布时, 从 `develop` 拉出 `release` 分支
- 在此分支上进行最后的测试和修复
- 准备就绪后, 将 `release` 分支合并到 `main` 分支 ** 并打上版本标签 **
- 同时, 必须合并回 `develop` 分支, 因为 `release` 分支上修复的 BUG 可能 `develop` 分支上还没修复

## 热修复分支

来源:`main`

合并目标:`main`和`develop`

命名惯例:`hotfix/critical-security-patch`,`hotfix/1.2.1`

作用:快速修复生产环境(`main`分支)上的紧急BUG

生命周期:

- 从`main`分支上出现BUG的提交点(通常是最近的标签)拉取
- 修复完成后,合并回`main`分支**并打上新的版本标签**(如:v1.0.1)
- 同时,必须合并回`develop`分支,确保修复在后续开发中也生效
