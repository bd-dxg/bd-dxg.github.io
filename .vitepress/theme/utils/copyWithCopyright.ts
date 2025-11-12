/**
 * 复制版权信息工具
 * 在用户复制内容时自动追加版权信息
 */

interface CopyrightConfig {
  author?: string
  minLength?: number // 最小复制长度, 低于此长度不追加版权信息
}

const defaultConfig: CopyrightConfig = {
  author: '冰冻大西瓜',
  minLength: 50, // 少于50个字符不追加版权信息
}

// 保存事件处理函数的引用, 用于后续移除监听器
let copyHandler: ((event: ClipboardEvent) => void) | null = null

/**
 * 生成版权信息文本
 */
function generateCopyrightText(url: string, author: string): string {
  return `\n\n————————————————\n作者: ${author}\n链接: ${url}\n著作权归作者所有。商业转载请联系作者获得授权, 非商业转载请注明出处。`
}

/**
 * 生成版权信息 HTML
 */
function generateCopyrightHTML(url: string, author: string): string {
  return `<br><br><div style="margin-top: 20px; padding: 10px; border-left: 3px solid #42b983; background: #f3f4f5;">
<strong>作者: </strong>${author}<br>
<strong>链接: </strong><a href="${url}">${url}</a><br>
著作权归作者所有。商业转载请联系作者获得授权, 非商业转载请注明出处。
</div>`
}

/**
 * 初始化复制监听器
 */
export function initCopyListener(config: CopyrightConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  // 创建事件处理函数
  copyHandler = (event: ClipboardEvent) => {
    const selection = window.getSelection()?.toString()
    if (!selection || selection.length < finalConfig.minLength!) {
      return
    }

    const url = window.location.href
    const author = finalConfig.author || '冰冻大西瓜'

    // 生成版权信息
    const copyrightText = generateCopyrightText(url, author)
    const copyrightHTML = generateCopyrightHTML(url, author)

    // 获取选中内容的 HTML（如果有的话）
    const selectedHTML = getSelectionHTML()

    // 设置剪贴板数据
    event.clipboardData?.setData('text/plain', selection + copyrightText)
    event.clipboardData?.setData('text/html', selectedHTML + copyrightHTML)

    // 阻止默认复制行为
    event.preventDefault()
  }

  // 添加事件监听器
  document.addEventListener('copy', copyHandler)
}

/**
 * 获取选中内容的 HTML 格式
 */
function getSelectionHTML(): string {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return ''
  }

  const range = selection.getRangeAt(0)
  const container = document.createElement('div')
  container.appendChild(range.cloneContents())
  return container.innerHTML
}

/**
 * 移除复制监听器
 */
export function removeCopyListener() {
  if (copyHandler) {
    document.removeEventListener('copy', copyHandler)
    copyHandler = null
  }
}
