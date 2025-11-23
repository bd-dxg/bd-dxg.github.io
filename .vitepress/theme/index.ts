// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import roughNotationPlugin from './rough-notation/rough-notation-plugin'
import GitalkLayout from './gitalk/gitalkLayout.vue'
import { initCopyListener, removeCopyListener } from './utils/copyWithCopyright'

import './style.css'
import 'virtual:group-icons.css'
import './rough-notation/rough-notation.css'
import './gitalk/gitalk.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-after': () => h(GitalkLayout),
    })
  },
  // enhanceApp({ app, router, siteData }) {
  //   // 自定义配置（可选）
  //   // roughNotationPlugin.config.animate = false; // 禁用动画
  //   // roughNotationPlugin.config.animationDuration = 1000; // 修改动画时长
  // },
  setup() {
    const route = useRoute()

    // 初始化函数
    const initAnnotations = () => {
      if (typeof window !== 'undefined') {
        nextTick(() => {
          const contentContainer = document.querySelector('.content-container .main') as HTMLElement | null
          if (contentContainer) {
            roughNotationPlugin.lazyInit(contentContainer)
          }
        })
      }
    }

    onMounted(() => {
      initAnnotations()

      // 初始化复制版权信息功能
      if (typeof window !== 'undefined') {
        initCopyListener({
          author: '冰冻大西瓜',
          minLength: 50,
        })
      }

      // 监听主题变化
      if (typeof window !== 'undefined') {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const target = mutation.target as HTMLElement
              if (target === document.documentElement) {
                // 主题发生变化，重新初始化标注
                setTimeout(() => {
                  roughNotationPlugin.cleanup()
                  initAnnotations()
                }, 50)
              }
            }
          })
        })

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        })

        // 清理函数
        onUnmounted(() => {
          return () => {
            observer.disconnect()
          }
        })
      }
    })

    // 组件卸载时移除复制监听器
    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        removeCopyListener()
      }
    })

    // 监听路由变化，重新初始化
    watch(
      () => route.path,
      () => {
        if (typeof window !== 'undefined') {
          nextTick(() => {
            // 清理旧的标注
            roughNotationPlugin.cleanup()

            // 重新初始化
            setTimeout(() => {
              initAnnotations()
            }, 100)
          })
        }
      },
    )
  },
} satisfies Theme
