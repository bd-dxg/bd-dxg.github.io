---
title: git 进阶技巧
description: 介绍 Git 版本回退、撤销、重置的四种场景，涵盖命令行与 VSCode 图形化界面的操作方法。
---

# git 进阶技巧

## git fetch 与 git pull 的区别

很多新手朋友都知道 `git pull`

可以把远端仓库的代码**更新**到本地(下载项目的命令是 `git clone`)

但是忽略了`git fetch`命令, 这个命令的作用是**获取**远端仓库代码到本地,但不进行合并

可以帮助你检测你当前的代码和远端代码是否有冲突, 可以提前处理可能的冲突,

这是一个良好的coding习惯

**核心区别**：

`git fetch` = 下载远端代码(不合并)

`git pull` = `git fetch` + `git merge`(下载并合并)

## 版本回退/撤销/重置

![unnamed.webp](/imgs/1767921354449.avif)
git中的回退/撤销/重置, 有四种条件,分别是:

- 未添加到暂存区&&未提交&&未推送
- **已添加到暂存区**&&未提交&&未推送
- **已添加到暂存区&&已提交**&&未推送
- **已添加到暂存区&&已提交&&已推送**

> [!tip] 提示
> 博主这里使用的是 `vscode` , 就用这个编辑器来演示

### 撤销未添加到暂存区的文件

![2026-01-09_11-25-10.webp](/imgs/1767929136116.avif)

命令行方法:

```shell
git checkout -- 文件名
# 示例
git checkout -- GitProTips.md
```

图形化界面:
![2026-01-09_14-19-12.webp](/imgs/1767939560839.avif)

### 撤销已添加到暂存区的文件

命令行方法:

```shell
git reset --hard HEAD 文件名
# 示例
git reset HEAD siderbar.mts
```

注意: 这里提供三个参数:

| 参数    | 暂存区  | 工作目录 | 说明                                  |
| ------- | ------- | -------- | ------------------------------------- |
| --soft  | ✅ 重置 | ❌ 不变  | 只移动HEAD,修改留在暂存区(基本不用)   |
| --mixed | ✅ 重置 | ❌ 不变  | 只重置暂存区,改变的内容还在工作目录中 |
| --hard  | ✅ 重置 | ✅ 重置  | 同时重置暂存区和工作目录(常用)        |

图形化界面:
![2026-01-09_14-30-28.webp](/imgs/1767940243304.avif)
第一次**从暂存区撤回**, 第二次**恢复原来的工作空间**

### 撤销已提交到本地库的文件

命令行方法:

```shell
git reset --hard HEAD^
# 退一步一个^,多步就是多个^,也可以用波浪线~+数字代替
git reset --hard HEAD^^^ === git reset --hard HEAD~3
```

图形化界面:
![2026-01-09_16-22-02.webp](/imgs/1767947173065.avif)
这里是撤销到暂存区,可以在编辑器中可以编辑后,将新改动添加到暂存区,也可以继续撤销到工作空间

### 撤销已推送到远程仓库的文件

> [!warning] 警告
> 本操作会创建一个新的提交来"抵消"错误提交的影响，原始错误提交仍保留在历史中,**不会被撤销**

命令行方法:

```shell
git revert --no-edit 提交哈希
# 示例, --no-edit 的作用是直接使用默认的 revert 提交信息,不用再手动写描述信息
git revert --no-edit c4f76af7

git push origin 推送的分支
```

图形化界面:
需要安装一款vscode插件, [git graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

然后在 vscode 状态栏左下角 点击 `Git Graph`标签,打开插件面板, 右键需要撤回的提交, 选择 `Revert...`即可

![2026-01-09_17-13-36.webp](/imgs/1767950025946.avif)

## 文件存储(git stash)-高频使用

> 背景环境: 你在 `feat/xxx功能`分支下开发某功能,
>
> 突然收到线上出现了BUG(如8折活动**充100到80**),需要立即修复
>
> 但是你手头的功能没有开发完毕,不方便提交代码,但是不提交就无法切换分支
>
> 文件存储(git stash)为此而生

作用: 将你未开发完成的文件暂存起来,还原成一个干净的环境, 方便你切换分支去修BUG

命令行方法:

```shell
# 文件存储命令,然后切换分支去修BUG
git stash
# 修完BUG之后, 切换回功能分支
# 查看存储的列表(可选)
git stash list
# 取回存储的文件并删除存储的记录(一般都用这个)
git stash pop
# 取回文件并保留存储的记录(看个人喜好)(和上一个命令二选一)
git stash apply
```

图形化界面:

![2026-01-10_10-17-35.webp](/imgs/1768011468972.avif)

## git merge 与 git rebase 的区别

- `git merge`: **保留历史原貌**, 通过创建一个"合并提交"来连接两个分支的历史, 记录了分支合并的真实过程.
- `git rebase`: **重写历史**, 建一个分支的提交,重新挪动到另一个分支的最新提交, 是历史看起来是线性简洁的

  | 参数`--no-ff`                | 描述                                                                                                                        |
  | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
  | `git merge feat/xxx`         | Git 默认会进行"快进合并", `main` 分支的指针直接移动到 `feature` 的最新提交,**看不出曾经有过分支**,没有创建新的 merge commit |
  | `git merge --no-ff feat/xxx` | 强制创建一个 merge commit, **保留了分支的完整历史**, 方便回滚整个功能(推荐使用)                                             |

### 使用场景

#### 个人项目中(假设你有一到两个分支),

推荐使用`git rebase`

```shell
# 场景:从 main 创建了 feature 分支开发
git checkout feature
git rebase main  # 将 feature 分支的提交"移动"到 main 最新位置

# 或者使用 pull --rebase 保持线性历史
git pull --rebase origin main
```

优点:

- 保持提交历史线性、清晰,像一条直线
- 没有多余的 merge commit
- 方便查看项目演进过程

#### 公司项目(git flow流程):

对于本地、未推送的提交 → 使用 Rebase:

```shell
# 整理本地提交后再推送
git rebase -i HEAD~3  # 交互式 rebase,整理最近3个提交
git push origin feature-branch
```

对于已推送的公共分支 → 使用 Merge

```shell
# 功能分支合并到主分支
git checkout develop
git merge --no-ff feature/user-login  # --no-ff 保留分支信息

# 或通过 Pull Request/Merge Request 进行
```

> [!CAUTION]警告!
> 绝对不要 rebase 公共分支:
>
> 不要 rebase `main/master`
>
> 不要 rebase `develop`
>
> 不要 rebase 其他人正在使用的分支
>
> 不要 rebase 已经推送到远程的提交(除非团队有明确约定)

可以 rebase 的情况:

- 本地 feature 分支(未推送)
- 你独自工作的分支
- 整理本地提交历史后首次推送

> [!tip]关键:
> rebase 改写历史,merge 保留历史
>
> 在团队项目中,**安全性和可追溯性优先**,所以多用 merge
>
> 个人项目可以追求简洁,多用 rebase

## 更新记录

- 2026年1月12日:
  1. 更新 `git fetch` 和 `git pull` 的区别
  2. 更新 `git merge` 与 `git rebase` 的区别
- 2026年1月10日:
  1. 新增 文件存储(git stash)
  2. 修复部分命令拼写错误
