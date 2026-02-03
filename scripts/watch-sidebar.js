#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSidebarConfig, generateSidebarFile } from './generate-sidebar.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 文件监听器 - 自动更新 sidebar 配置
 */

// 加载配置文件
const configPath = path.join(__dirname, 'sidebar-config.json')
const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

// 配置
const WATCH_CONFIG = {
  // 监听的目录
  watchDir: path.resolve(__dirname, rawConfig.articleRoot),
  // sidebar 配置文件路径
  sidebarPath: path.resolve(__dirname, rawConfig.sidebarPath),
  // 防抖延迟（毫秒）
  debounceDelay: rawConfig.watch.debounceDelay,
  // 监听的文件扩展名
  fileExtensions: rawConfig.watch.fileExtensions
}

let updateTimer = null

/**
 * 更新 sidebar 配置
 */
function updateSidebar() {
  try {
    console.log('📝 检测到文件变化，更新 sidebar 配置...')

    const sidebarConfig = generateSidebarConfig()
    const fileContent = generateSidebarFile(sidebarConfig)

    fs.writeFileSync(WATCH_CONFIG.sidebarPath, fileContent, 'utf-8')

    console.log('✅ sidebar 配置已更新')
  } catch (error) {
    console.error('❌ 更新 sidebar 配置失败:', error.message)
  }
}

/**
 * 防抖更新函数
 */
function debouncedUpdate() {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }

  updateTimer = setTimeout(updateSidebar, WATCH_CONFIG.debounceDelay)
}

/**
 * 递归监听目录
 * @param {string} dir 目录路径
 */
function watchDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  目录不存在: ${dir}`)
    return
  }

  try {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return

      // 检查文件扩展名
      const hasValidExtension = WATCH_CONFIG.fileExtensions.some(ext =>
        filename.endsWith(ext)
      )

      if (hasValidExtension) {
        console.log(`📄 文件${eventType}: ${filename}`)
        debouncedUpdate()
      }
    })

    console.log(`👀 正在监听目录: ${dir}`)
    console.log(`📝 监听文件类型: ${WATCH_CONFIG.fileExtensions.join(', ')}`)
  } catch (error) {
    console.error(`❌ 监听目录失败: ${dir}`, error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 启动 sidebar 自动更新监听器...')

  // 首次生成配置
  updateSidebar()

  // 开始监听
  watchDirectory(WATCH_CONFIG.watchDir)

  console.log('✨ 监听器已启动，按 Ctrl+C 退出')

  // 优雅退出
  process.on('SIGINT', () => {
    console.log('\n👋 停止监听器...')
    process.exit(0)
  })
}

// 如果直接运行此脚本
const currentFile = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === currentFile

if (isMainModule) {
  main()
}

export { watchDirectory, updateSidebar }