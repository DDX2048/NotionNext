'use client'

import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 阅读进度条 + 返回顶部按钮
 * 二者都跟随滚动，所以合成一个组件，避免重复注册 scroll 监听。
 * 进度条固定在页面最顶部，宽度 = 已滚动比例。
 */
export const ReadingProgress = () => {
  const enabled = siteConfig('AERO_READING_PROGRESS', true, CONFIG)

  // 0 ~ 100 的阅读进度
  const [progress, setProgress] = useState(0)
  // 滚动超过一屏后才显示返回顶部按钮
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const onScroll = () => {
      const doc = document.documentElement
      // 可滚动总高度，可能为 0（内容不足一屏）
      const total = doc.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0)
      setShowTop(window.scrollY > 480)
    }

    // passive 提升滚动性能
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      {/* 顶部阅读进度条 */}
      <div className='aero-progress' style={{ width: `${progress}%` }} />

      {/* 返回顶部：未滚动时隐藏，用 CSS 的 opacity 过渡 */}
      <button
        type='button'
        className={`aero-backtop${showTop ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label='返回顶部'>
        ↑
      </button>
    </>
  )
}
