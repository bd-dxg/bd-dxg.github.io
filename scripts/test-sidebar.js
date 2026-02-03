#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSidebarConfig } from './generate-sidebar.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 测试 sidebar 生成功能
 */

function runTests() {
  console.log('🧪 开始测试 sidebar 生成功能...\n')

  try {
    // 测试 1: 生成配置
    console.log('📋 测试 1: 生成 sidebar 配置')
    const config = generateSidebarConfig()

    // 验证配置结构
    const expectedSections = ['/InterviewQ/', '/Lives/', '/Tips/']
    const actualSections = Object.keys(config)

    console.log(`✅ 预期分区: ${expectedSections.join(', ')}`)
    console.log(`✅ 实际分区: ${actualSections.join(', ')}`)

    const missingSections = expectedSections.filter(section => !actualSections.includes(section))
    if (missingSections.length > 0) {
      throw new Error(`缺少分区: ${missingSections.join(', ')}`)
    }

    // 测试 2: 验证文章数量
    console.log('\n📊 测试 2: 验证文章数量')
    let totalArticles = 0

    for (const [section, items] of Object.entries(config)) {
      let sectionCount = 0

      if (Array.isArray(items)) {
        if (items.length > 0 && items[0].text && items[0].link) {
          // 简单列表
          sectionCount = items.length
        } else {
          // 嵌套结构
          sectionCount = items.reduce((sum, group) => {
            if (group.items && Array.isArray(group.items)) {
              if (group.items[0] && group.items[0].text) {
                return sum + group.items.length
              } else {
                // 更深层嵌套
                return sum + group.items.reduce((subSum, subGroup) =>
                  subSum + (subGroup.items ? subGroup.items.length : 0), 0)
              }
            }
            return sum
          }, 0)
        }
      }

      console.log(`  ${section}: ${sectionCount} 篇文章`)
      totalArticles += sectionCount
    }

    console.log(`✅ 总计: ${totalArticles} 篇文章`)

    // 测试 3: 验证链接格式
    console.log('\n🔗 测试 3: 验证链接格式')
    const links = []

    function extractLinks(items, prefix = '') {
      for (const item of items) {
        if (item.link) {
          links.push(item.link)
        } else if (item.items) {
          extractLinks(item.items, prefix)
        }
      }
    }

    for (const [section, items] of Object.entries(config)) {
      extractLinks(items)
    }

    const invalidLinks = links.filter(link => !link.startsWith('/'))
    if (invalidLinks.length > 0) {
      throw new Error(`无效链接格式: ${invalidLinks.join(', ')}`)
    }

    console.log(`✅ 验证了 ${links.length} 个链接，格式正确`)

    // 测试 4: 验证特定文章
    console.log('\n📄 测试 4: 验证特定文章')
    const expectedArticles = [
      '/InterviewQ/Frontend/PageCloseAnalytics',
      '/InterviewQ/Frontend/FirstScreenOptimization',
      '/InterviewQ/Backend/Go'
    ]

    const foundArticles = expectedArticles.filter(expected =>
      links.some(link => link === expected)
    )

    console.log(`✅ 找到预期文章: ${foundArticles.length}/${expectedArticles.length}`)

    if (foundArticles.length !== expectedArticles.length) {
      const missing = expectedArticles.filter(expected => !foundArticles.includes(expected))
      console.warn(`⚠️  缺少文章: ${missing.join(', ')}`)
    }

    console.log('\n🎉 所有测试通过！')
    return true

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    return false
  }
}

// 如果直接运行此脚本
const currentFile = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === currentFile

if (isMainModule) {
  const success = runTests()
  process.exit(success ? 0 : 1)
}

export { runTests }