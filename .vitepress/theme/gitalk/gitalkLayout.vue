<template>
  <div class="comment-rules">
    <p>📌 评论规则</p>
    需要 GitHub 账号登录 禁止发布广告、无关内容 请保持友善讨论
  </div>
  <div id="gitalk-container"></div>
</template>

<script setup>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { gitalkConfig, generatePageId, getPageTitle, generateBody } from './config'

const route = useRoute()

let gitalk = null

onMounted(() => {
  // 确保在客户端渲染
  if (typeof window !== 'undefined') {
    initGitalk()
  }
})

onUnmounted(() => {
  // 清理
  if (gitalk) {
    gitalk = null
  }
})

// 监听路由变化，重新初始化Gitalk
watch(
  () => route.path,
  () => {
    if (typeof window !== 'undefined') {
      // 清除旧的容器内容
      const container = document.getElementById('gitalk-container')
      if (container) {
        container.innerHTML = ''
      }
      // 重新初始化
      setTimeout(() => {
        initGitalk()
      }, 100)
    }
  },
)

function initGitalk() {
  try {
    // 生成页面唯一ID
    const id = generatePageId(route.path)

    // 获取页面标题
    const title = getPageTitle()

    // 生成评论区描述
    const body = generateBody(title, route.path)

    gitalk = new Gitalk({
      ...gitalkConfig,
      id,
      title,
      body,
    })

    gitalk.render('gitalk-container')
  } catch (error) {
    console.error('Gitalk 初始化失败:', error)
  }
}
</script>

<style scoped>
#gitalk-container {
  margin-top: 2rem;
}
.comment-rules {
  margin-top: 1rem;
  text-align: center;
}
/* 深色主题适配 */
.dark #gitalk-container {
  --gitalk-color-main: #ffffff;
  --gitalk-color-sub: #cccccc;
  --gitalk-color-border: #444444;
  --gitalk-color-bg: #1a1a1a;
}
</style>
