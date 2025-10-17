// .vitepress/theme/rough-notation-plugin.ts
import { annotate } from 'rough-notation'

// 定义标注选项类型
interface AnnotationOptions {
  type: 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'bracket' | 'crossed-off'
  color?: string
  strokeWidth?: number
  padding?: number | number[]
  multiline?: boolean
  iterations?: number
  brackets?: string[]
  animate?: boolean
  animationDuration?: number
}

// 定义容器元素类型
type ContainerElement = HTMLElement | Document | Element

// 从CSS变量获取颜色值
function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return '#000'
  const rootStyles = getComputedStyle(document.documentElement)
  return rootStyles.getPropertyValue(name).trim()
}

// 配置选项
const config = {
  // 是否启用动画
  animate: true,
  // 动画延迟（毫秒）
  animationDelay: 0,
  // 动画持续时间（毫秒）
  animationDuration: 800,
  // 元素选择器和对应的标注样式
  selectors: {
    // 加粗文本 -> 高亮效果
    // 'strong, b': {
    //   type: 'highlight' as const,
    //   get color() {
    //     return getCSSVariable('--rn-highlight-color')
    //   },
    //   multiline: true,
    //   iterations: 1,
    //   padding: 2,
    //   fontSize: 1.1
    // },
    // 斜体文本 -> 下划线效果
    'em, i': {
      type: 'underline' as const,
      get color() {
        return getCSSVariable('--rn-underline-color')
      },
      strokeWidth: 2,
      padding: 2,
    },
    // 行内代码 -> 方框效果
    'code:not(pre code)': {
      type: 'box' as const,
      get color() {
        return getCSSVariable('--rn-box-color')
      },
      strokeWidth: 1.5,
      padding: 4,
    },
    // 引用块 -> 括号效果
    blockquote: {
      type: 'bracket' as const,
      get color() {
        return getCSSVariable('--rn-bracket-color')
      },
      strokeWidth: 2,
      padding: [10, 10, 10, 20] as [number, number, number, number],
      brackets: ['left'],
    },
    // 删除线文本 -> 删除效果
    'del, s': {
      type: 'crossed-off' as const,
      get color() {
        return getCSSVariable('--rn-strike-color')
      },
      strokeWidth: 2,
    },
    // 链接 -> 下划线效果
    'a:not(.header-anchor):not(.nav-link)': {
      type: 'underline' as const,
      get color() {
        return getCSSVariable('--rn-link-color')
      },
      strokeWidth: 1.5,
      padding: 5,
    },
    // 标记文本 -> 高亮效果（不同颜色）
    mark: {
      type: 'highlight' as const,
      get color() {
        return getCSSVariable('--rn-mark-color')
      },
      multiline: true,
      iterations: 2,
    },
  },
  // 自定义数据属性配置
  customAttributes: {
    'data-notation': {
      highlight: {
        type: 'highlight' as const,
        get color() {
          return getCSSVariable('--rn-custom-highlight-color')
        },
      },
      underline: {
        type: 'underline' as const,
        get color() {
          return getCSSVariable('--rn-custom-underline-color')
        },
      },
      box: {
        type: 'box' as const,
        get color() {
          return getCSSVariable('--rn-custom-box-color')
        },
      },
      circle: {
        type: 'circle' as const,
        get color() {
          return getCSSVariable('--rn-custom-circle-color')
        },
      },
      bracket: {
        type: 'bracket' as const,
        get color() {
          return getCSSVariable('--rn-custom-bracket-color')
        },
      },
      strike: {
        type: 'crossed-off' as const,
        get color() {
          return getCSSVariable('--rn-custom-strike-color')
        },
      },
    },
  } as Record<string, Record<string, AnnotationOptions>>,
}

// 存储所有标注实例
let annotations = new Map()

// 清理函数
function cleanupAnnotations() {
  annotations.forEach(annotation => {
    if (annotation && annotation.remove) {
      annotation.remove()
    }
  })
  annotations.clear()

  // 额外清理：移除可能残留的 SVG 元素
  if (typeof window !== 'undefined') {
    const svgElements = document.querySelectorAll('svg.rough-annotation')
    svgElements.forEach(svg => {
      if (svg.parentNode) {
        svg.parentNode.removeChild(svg)
      }
    })
  }
}

// 应用标注到元素
function applyAnnotation(element: HTMLElement, options: AnnotationOptions, delay = 0) {
  // 避免重复标注
  if (annotations.has(element)) {
    return
  }

  // 创建标注配置
  const annotationConfig = {
    ...options,
    animate: config.animate,
    animationDuration: config.animationDuration,
  } as any

  // 创建标注
  const annotation = annotate(element, annotationConfig)
  annotations.set(element, annotation)

  // 如果启用动画，延迟显示
  if (config.animate && delay >= 0) {
    setTimeout(() => {
      if (annotations.has(element)) {
        annotation.show()
      }
    }, delay)
  } else {
    annotation.show()
  }
}

// 处理自定义数据属性
function processCustomAttributes(container: ContainerElement) {
  Object.keys(config.customAttributes).forEach(attr => {
    const elements = container.querySelectorAll(`[${attr}]`)
    elements.forEach((el: Element, index: number) => {
      const notationTypeValue = el.getAttribute(attr)
      if (notationTypeValue) {
        const options = (config.customAttributes[attr] as Record<string, AnnotationOptions>)[notationTypeValue]
        if (options) {
          const delay = config.animationDelay + index * 100
          applyAnnotation(el as HTMLElement, options, delay)
        }
      }
    })
  })
}

// 处理预定义选择器
function processSelectors(container: ContainerElement) {
  Object.entries(config.selectors).forEach(([selector, options]) => {
    const elements = container.querySelectorAll(selector)
    elements.forEach((el: Element, index: number) => {
      // 跳过已有自定义属性的元素
      const hasCustomAttr = Object.keys(config.customAttributes).some(attr => el.hasAttribute(attr))
      if (!hasCustomAttr) {
        const delay = config.animationDelay + index * 100
        applyAnnotation(el as HTMLElement, options, delay)
      }
    })
  })
}

// 初始化 Rough Notation
function initRoughNotation(container = document.body) {
  // 清理之前的标注
  cleanupAnnotations()

  // 等待 DOM 完全加载
  requestAnimationFrame(() => {
    // 处理自定义属性（优先级更高）
    processCustomAttributes(container)

    // 处理预定义选择器
    processSelectors(container)
  })
}

// 延迟初始化（用于懒加载）
function lazyInitRoughNotation(container = document.body) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target

          // 检查自定义属性
          Object.keys(config.customAttributes).forEach(attr => {
            if (element.hasAttribute(attr)) {
              const notationTypeValue = element.getAttribute(attr)
              if (notationTypeValue) {
                const options = (config.customAttributes[attr] as Record<string, AnnotationOptions>)[notationTypeValue]
                if (options) {
                  applyAnnotation(element as HTMLElement, options, 0)
                }
              }
            }
          })

          // 检查选择器匹配
          Object.entries(config.selectors).forEach(([selector, options]) => {
            if (element.matches(selector)) {
              const hasCustomAttr = Object.keys(config.customAttributes).some(attr => element.hasAttribute(attr))
              if (!hasCustomAttr) {
                applyAnnotation(element as HTMLElement, options, 0)
              }
            }
          })

          observer.unobserve(element)
        }
      })
    },
    {
      rootMargin: '50px',
    },
  )

  // 观察所有目标元素
  const allSelectors = Object.keys(config.selectors).join(', ')
  const customAttrSelectors = Object.keys(config.customAttributes)
    .map(attr => `[${attr}]`)
    .join(', ')
  const combinedSelector = `${allSelectors}, ${customAttrSelectors}`

  container.querySelectorAll(combinedSelector).forEach(el => {
    observer.observe(el)
  })

  return observer
}

// 导出配置和方法
export default {
  config,
  init: initRoughNotation,
  lazyInit: lazyInitRoughNotation,
  cleanup: cleanupAnnotations,
  annotate: applyAnnotation,
}

// 也可以单独导出 annotate 函数供手动使用
//export { annotate, annotationGroup } from 'rough-notation'
