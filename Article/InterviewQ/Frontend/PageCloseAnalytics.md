---
title: 页面关闭统计数据
description: 详解页面关闭时发送统计数据的最佳实践，介绍 Navigator.sendBeacon() API 的使用方法和兼容性方案
---

# 页面关闭统计数据

在现代 Web 应用中，收集用户行为数据对于产品优化至关重要。其中一个常见需求是在用户关闭页面时发送统计数据，比如页面停留时间、用户操作记录等。然而，这个看似简单的需求却有不少技术陷阱。

## 传统方案的问题

### unload 和 beforeunload 事件的不可靠性

许多开发者首先想到的是使用 `unload` 或 `beforeunload` 事件：

```javascript
// ❌ 不推荐的做法
window.addEventListener('beforeunload', function () {
  // 发送统计数据
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(analyticsData),
  })
})
```

这种方案存在以下问题：

1. **事件触发不可靠**：在移动设备上，这些事件可能不会触发
2. **异步请求被中断**：页面卸载时，异步请求往往来不及完成就被浏览器取消
3. **用户体验差**：如果使用同步请求，会阻塞页面关闭过程

### 同步请求的弊端

为了确保数据发送成功，有些开发者会使用同步的 XMLHttpRequest：

```javascript
// ❌ 会阻塞浏览器的做法
window.addEventListener('beforeunload', function () {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/analytics', false) // false 表示同步
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(analyticsData))
})
```

虽然这样可以确保数据发送，但会导致：

- 页面关闭时出现明显延迟
- 浏览器界面冻结
- 用户体验极差

## 最佳解决方案：Navigator.sendBeacon()

`Navigator.sendBeacon()` 是专门为解决这个问题而设计的 API。它具有以下优势：

- **异步发送**：不会阻塞页面卸载过程
- **可靠性高**：浏览器会确保数据发送完成，即使页面已经关闭
- **简单易用**：API 设计简洁，使用方便

### 基本语法

```javascript
navigator.sendBeacon(url, data)
```

- `url`：接收数据的服务器端点
- `data`：要发送的数据（可选）
- 返回值：`boolean`，表示是否成功加入发送队列

### 支持的数据类型

`sendBeacon()` 支持多种数据格式：

#### 1. 普通字符串 (text/plain)

```javascript
const analyticsData = JSON.stringify({
  userId: '12345',
  pageUrl: window.location.href,
  duration: Date.now() - pageStartTime,
})

navigator.sendBeacon('/api/analytics', analyticsData)
```

#### 2. FormData 对象

```javascript
const formData = new FormData()
formData.append('userId', '12345')
formData.append('pageUrl', window.location.href)
formData.append('duration', Date.now() - pageStartTime)

navigator.sendBeacon('/api/analytics', formData)
```

#### 3. URLSearchParams (application/x-www-form-urlencoded)

```javascript
const params = new URLSearchParams()
params.append('userId', '12345')
params.append('pageUrl', window.location.href)
params.append('duration', Date.now() - pageStartTime)

navigator.sendBeacon('/api/analytics', params)
```

#### 4. Blob 对象

```javascript
const data = {
  userId: '12345',
  pageUrl: window.location.href,
  duration: Date.now() - pageStartTime,
}

const blob = new Blob([JSON.stringify(data)], {
  type: 'application/json',
})

navigator.sendBeacon('/api/analytics', blob)
```

## 实际应用示例

### 页面停留时间统计

```javascript
// 页面分析功能
const createPageAnalytics = () => {
  const startTime = Date.now()

  const fallbackSend = data => {
    // 对于不支持 sendBeacon 的浏览器
    try {
      fetch('/api/page-analytics', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true, // 重要：保持连接活跃
      })
    } catch (error) {
      console.error('Analytics fallback failed:', error)
    }
  }

  const sendAnalytics = () => {
    const duration = Date.now() - startTime
    const data = {
      url: window.location.href,
      duration: duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    }

    // 使用 sendBeacon 发送数据
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon('/api/page-analytics', JSON.stringify(data))

      if (!success) {
        console.warn('Failed to queue analytics data')
      }
    } else {
      // 降级方案
      fallbackSend(data)
    }
  }

  const setupBeaconTracking = () => {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendAnalytics()
      }
    })

    // 备用方案：监听 beforeunload
    window.addEventListener('beforeunload', () => {
      sendAnalytics()
    })
  }

  // 初始化追踪
  setupBeaconTracking()

  return {
    sendAnalytics,
  }
}

// 初始化页面分析
const analytics = createPageAnalytics()
```

### 用户行为追踪

```javascript
// 用户行为追踪功能
const createUserBehaviorTracker = () => {
  let actions = []

  const getSessionId = () => {
    // 简单的会话 ID 生成
    return (
      sessionStorage.getItem('sessionId') ||
      (sessionStorage.setItem('sessionId', Date.now().toString(36)), sessionStorage.getItem('sessionId'))
    )
  }

  const recordAction = (type, data) => {
    actions.push({ type, ...data })

    // 限制数组大小，避免内存溢出
    if (actions.length > 100) {
      actions.shift()
    }
  }

  const sendBehaviorData = () => {
    if (actions.length === 0) return

    const payload = {
      sessionId: getSessionId(),
      url: window.location.href,
      actions: actions,
      timestamp: Date.now(),
    }

    // 使用 FormData 发送
    const formData = new FormData()
    formData.append('data', JSON.stringify(payload))

    navigator.sendBeacon('/api/user-behavior', formData)

    // 清空已发送的数据
    actions = []
  }

  const setupTracking = () => {
    // 追踪点击事件
    document.addEventListener('click', e => {
      recordAction('click', {
        element: e.target.tagName,
        className: e.target.className,
        id: e.target.id,
        timestamp: Date.now(),
      })
    })

    // 追踪滚动事件（节流处理）
    let scrollTimer
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        recordAction('scroll', {
          scrollY: window.scrollY,
          timestamp: Date.now(),
        })
      }, 100)
    })

    // 页面关闭时发送数据
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendBehaviorData()
      }
    })
  }

  // 初始化追踪
  setupTracking()

  return {
    recordAction,
    sendBehaviorData,
  }
}

// 初始化行为追踪
const behaviorTracker = createUserBehaviorTracker()
```

## 服务端处理

服务端需要正确处理 `sendBeacon` 发送的数据：

```javascript
// Express.js 示例
app.post('/api/analytics', (req, res) => {
  // sendBeacon 发送的数据在 req.body 中
  const analyticsData = req.body

  // 处理数据（存储到数据库等）
  console.log('Received analytics:', analyticsData)

  // 重要：快速响应，避免超时
  res.status(204).send() // 204 No Content
})

// 处理不同的 Content-Type
app.use(express.json()) // application/json
app.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(express.raw({ type: 'text/plain' })) // text/plain
```

## 兼容性和降级方案

![2026-02-03_22-06-15.jpg](https://images.bddxg.top/blog/1770127587625.jpg)

### 浏览器兼容性检查

```javascript
function sendAnalyticsData(url, data) {
  if ('sendBeacon' in navigator) {
    // 使用 sendBeacon
    return navigator.sendBeacon(url, data)
  } else if ('fetch' in window) {
    // 降级到 fetch with keepalive
    return fetch(url, {
      method: 'POST',
      body: data,
      keepalive: true,
    })
      .then(() => true)
      .catch(() => false)
  } else {
    // 最后的降级方案：同步 XHR（不推荐）
    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, false)
      xhr.send(data)
      return xhr.status >= 200 && xhr.status < 300
    } catch (error) {
      return false
    }
  }
}
```

### 完整的兼容性方案

```javascript
// 分析数据发送工具
const createAnalyticsBeacon = () => {
  const syncSend = (url, data) => {
    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, false) // 同步请求
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(data)
      return xhr.status >= 200 && xhr.status < 300
    } catch (error) {
      console.error('Sync analytics send failed:', error)
      return false
    }
  }

  const send = (url, data) => {
    // 优先使用 sendBeacon
    if (navigator.sendBeacon) {
      return navigator.sendBeacon(url, data)
    }

    // 降级到 fetch with keepalive
    if (window.fetch) {
      fetch(url, {
        method: 'POST',
        body: data,
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.warn('Analytics fetch failed:', error)
      })
      return true
    }

    // 最后的降级方案
    return syncSend(url, data)
  }

  return {
    send,
  }
}

// 使用示例
const analyticsBeacon = createAnalyticsBeacon()
analyticsBeacon.send('/api/analytics', JSON.stringify(data))
```

## 最佳实践总结

1. **优先使用 `visibilitychange` 事件**：比 `beforeunload` 更可靠
2. **数据格式选择**：JSON 字符串简单直接，FormData 适合复杂数据
3. **错误处理**：检查 `sendBeacon` 返回值，提供降级方案
4. **数据大小限制**：`sendBeacon` 有大小限制（通常 64KB），注意控制数据量
5. **服务端优化**：快速响应，避免超时
6. **隐私考虑**：遵循数据保护法规，获得用户同意

## 注意事项

- `sendBeacon` 只支持 POST 请求
- 数据大小有限制（浏览器实现不同）
- 不支持自定义请求头
- 无法获取响应内容
- 在某些情况下仍可能失败（如网络断开）

通过合理使用 `Navigator.sendBeacon()`，我们可以在不影响用户体验的前提下，可靠地收集页面关闭时的统计数据，为产品优化提供有价值的数据支持。
