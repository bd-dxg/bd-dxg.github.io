#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 自动生成 VitePress sidebar 配置
 * 基于文件系统结构扫描 markdown 文件
 */

// 加载配置文件
const configPath = path.join(__dirname, 'sidebar-config.json')
const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

// 处理相对路径
const CONFIG = {
  articleRoot: path.resolve(__dirname, rawConfig.articleRoot),
  sidebarPath: path.resolve(__dirname, rawConfig.sidebarPath),
  sections: rawConfig.sections,
  titleExtraction: rawConfig.titleExtraction,
  sorting: rawConfig.sorting,
  watch: rawConfig.watch
}

/**
 * 读取 markdown 文件的标题
 * @param {string} filePath 文件路径
 * @returns {string} 文章标题
 */
function getMarkdownTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    if (CONFIG.titleExtraction.useFirstHeading) {
      // 匹配第一个 # 标题
      const titleMatch = content.match(/^#\s+(.+)$/m)
      if (titleMatch) {
        return titleMatch[1].trim()
      }
    }

    if (CONFIG.titleExtraction.fallbackToFilename) {
      // 如果没有找到标题，使用文件名
      let filename = path.basename(filePath, '.md')

      if (CONFIG.titleExtraction.camelCaseToSpaces) {
        // 驼峰转空格
        filename = filename.replace(/([A-Z])/g, ' $1').trim()
      }

      return filename
    }

    return path.basename(filePath, '.md')
  } catch (error) {
    console.warn(`无法读取文件标题: ${filePath}`, error.message)
    return path.basename(filePath, '.md')
  }
}

/**
 * 扫描目录获取 markdown 文件
 * @param {string} dirPath 目录路径
 * @param {string} baseRoute 基础路由
 * @returns {Array} 文件列表
 */
function scanMarkdownFiles(dirPath, baseRoute = '') {
  const files = []

  if (!fs.existsSync(dirPath)) {
    return files
  }

  const items = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name)
    const routePath = path.join(baseRoute, item.name).replace(/\\/g, '/')

    if (item.isDirectory()) {
      // 递归扫描子目录，但保持扁平的文件列表
      const subFiles = scanMarkdownFiles(fullPath, routePath)
      files.push(...subFiles)
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const title = getMarkdownTitle(fullPath)
      const link = routePath.replace(/\.md$/, '')

      files.push({
        title,
        link,
        filePath: fullPath,
        fileName: item.name,
        directory: path.dirname(routePath)
      })
    }
  }

  return files
}

/**
 * 生成 sidebar 配置
 * @returns {Object} sidebar 配置对象
 */
function generateSidebarConfig() {
  const sidebarConfig = {}

  for (const [route, config] of Object.entries(CONFIG.sections)) {
    const sectionPath = path.join(CONFIG.articleRoot, route.replace(/^\/|\/$/g, ''))

    if (config.subSections) {
      // 有子分类的结构
      const sections = []

      for (const [subDir, subTitle] of Object.entries(config.subSections)) {
        const subPath = path.join(sectionPath, subDir)
        const files = scanMarkdownFiles(subPath, `${route}${subDir}`)

        if (files.length > 0) {
          // 按目录分组文件
          const groupedFiles = {}

          for (const file of files) {
            const dir = file.directory
            if (!groupedFiles[dir]) {
              groupedFiles[dir] = []
            }
            groupedFiles[dir].push({
              text: file.title,
              link: file.link
            })
          }

          // 如果只有一个目录层级，直接展示文件
          const dirKeys = Object.keys(groupedFiles)
          if (dirKeys.length === 1 && dirKeys[0] === `${route}${subDir}`) {
            const items = groupedFiles[dirKeys[0]]

            if (CONFIG.sorting.enabled) {
              items.sort((a, b) => a.text.localeCompare(b.text, CONFIG.sorting.locale))
            }

            sections.push({
              text: subTitle,
              collapsed: false,
              items
            })
          } else {
            // 多层级结构，需要进一步分组
            const subSections = []

            for (const [dir, items] of Object.entries(groupedFiles)) {
              if (CONFIG.sorting.enabled) {
                items.sort((a, b) => a.text.localeCompare(b.text, CONFIG.sorting.locale))
              }

              // 提取子目录名作为分组标题
              const subDirName = dir.split('/').pop()
              subSections.push({
                text: subDirName,
                collapsed: false,
                items
              })
            }

            sections.push({
              text: subTitle,
              collapsed: false,
              items: subSections
            })
          }
        }
      }

      sidebarConfig[route] = sections
    } else {
      // 扁平结构
      const files = scanMarkdownFiles(sectionPath, route)
      const items = files.map(file => ({
        text: file.title,
        link: file.link
      }))

      // 排序
      if (CONFIG.sorting.enabled) {
        items.sort((a, b) => a.text.localeCompare(b.text, CONFIG.sorting.locale))
      }

      sidebarConfig[route] = items
    }
  }

  return sidebarConfig
}

/**
 * 生成 TypeScript 配置文件内容
 * @param {Object} config sidebar 配置
 * @returns {string} 文件内容
 */
function generateSidebarFile(config) {
  const configStr = JSON.stringify(config, null, 2)
    .replace(/"/g, "'") // 使用单引号
    .replace(/'/g, "'") // 确保一致性

  return `export default ${configStr}
`
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('🚀 开始生成 sidebar 配置...')

    // 生成配置
    const sidebarConfig = generateSidebarConfig()

    // 生成文件内容
    const fileContent = generateSidebarFile(sidebarConfig)

    // 写入文件
    fs.writeFileSync(CONFIG.sidebarPath, fileContent, 'utf-8')

    console.log('✅ sidebar 配置生成成功!')
    console.log(`📁 配置文件: ${CONFIG.sidebarPath}`)

    // 输出统计信息
    let totalItems = 0
    for (const [route, items] of Object.entries(sidebarConfig)) {
      if (Array.isArray(items)) {
        // 检查是否是简单的文章列表
        if (items.length > 0 && items[0].text && items[0].link) {
          totalItems += items.length
          console.log(`📄 ${route}: ${items.length} 篇文章`)
        } else {
          // 嵌套结构
          const count = items.reduce((sum, section) => sum + (section.items?.length || 0), 0)
          totalItems += count
          console.log(`📄 ${route}: ${count} 篇文章`)
        }
      }
    }
    console.log(`📊 总计: ${totalItems} 篇文章`)

  } catch (error) {
    console.error('❌ 生成 sidebar 配置失败:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// 如果直接运行此脚本
const currentFile = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === currentFile

if (isMainModule) {
  main()
}

export {
  generateSidebarConfig,
  generateSidebarFile,
  getMarkdownTitle,
  scanMarkdownFiles
}