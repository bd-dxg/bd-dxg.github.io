---
title: git 进阶技巧
description: 介绍 Git 版本回退、撤销、重置的四种场景，涵盖命令行与 VSCode 图形化界面的操作方法。
---

# git 进阶技巧

![unnamed.webp](https://images.bddxg.top/blog/1767921354449.webp)

## 版本回退/撤销/重置

git中的回退/撤销/重置, 有四种条件,分别是:

- 未添加到暂存区&&未提交&&未推送
- **已添加到暂存区**&&未提交&&未推送
- **已添加到暂存区&&已提交**&&未推送
- **已添加到暂存区&&已提交&&已推送**

> [!tip] 提示
> 博主这里使用的是 `vscode` , 就用这个编辑器来演示

### 撤销未添加到暂存区的文件

![2026-01-09_11-25-10.webp](https://images.bddxg.top/blog/1767929136116.webp)

命令行方法:

```shell
git checkout -- 文件名
# 示例
git checkout -- GitProTips.md
```

图形化界面:
![2026-01-09_14-19-12.webp](https://images.bddxg.top/blog/1767939560839.webp)

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
![2026-01-09_14-30-28.webp](https://images.bddxg.top/blog/1767940243304.webp)
第一次**从暂存区撤回**, 第二次**恢复原来的工作空间**

### 撤销已提交到本地库的文件

命令行方法:

```shell
get reset --hard HEAD^
# 退一步一个^,多步就是多个^,也可以用波浪线~+数字代替
get reset --hard HEAD^ === get reset --hard HEAD~3
```

图形化界面:
![2026-01-09_16-22-02.webp](https://images.bddxg.top/blog/1767947173065.webp)
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

![2026-01-09_17-13-36.webp](https://images.bddxg.top/blog/1767950025946.webp)

## TODO(未更完,先回家)
