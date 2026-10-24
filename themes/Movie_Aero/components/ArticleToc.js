'use client'

import { siteConfig } from '@/lib/config'
import { uuidToId } from 'notion-utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 文章右侧目录（TOC）
 * 数据直接来自 NotionNext 解析好的 post.toc：
 *   item.id          标题块 id，需要转成 DOM 里的锚点 id
 *   item.text        标题文字
 *   item.indentLevel 缩进层级（0 对应一级标题）
 * 滚动时高亮当前所在的标题，点击可直接跳转。
 */
export const ArticleToc = ({ post }) => {
  const enabled = siteConfig('AERO_TOC', true, CONFIG)
  // 最多显示到第几级标题，默认 3 级
  const maxLevel = Number(siteConfig('AERO_TOC_MAX_LEVEL', 3, CONFIG))

  // 过滤掉过深的层级，避免目录太长
  const toc = (post?.toc || []).filter(item => item.indentLevel < maxLevel)
  // 目录条数：少于 2 条就没有导航价值
  const tocCount = toc.length

  // 当前滚动到的标题 id，用于高亮
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!enabled || tocCount < 2) {
      return
    }

    // 上一次执行滚动回调的时间，用于自己实现一个轻量节流
    let lastTime = 0

    const onScroll = () => {
      const now = Date.now()
      // 200ms 内只执行一次，避免滚动时频繁查询 DOM
      if (now - lastTime < 200) {
        return
      }
      lastTime = now

      // 找出视口上方最后一个经过的标题
      const sections = document.querySelectorAll(
        '#theme-aero #notion-article .notion-h'
      )
      let currentId = ''
      sections.forEach(section => {
        // 标题顶部越过 160px 就视为“已读到这里”
        if (section.getBoundingClientRect().top <= 160) {
          currentId = section.getAttribute('data-id') || ''
        }
      })
      setActiveId(currentId)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, post?.id, tocCount])

  // 关闭开关或标题不足时整个目录不渲染
  if (!enabled || tocCount < 2) {
    return null
  }

  return (
    // 外层只负责撑满所在网格列的高度，让内层 sticky 有足够的滚动范围
    <aside className='aero-toc-wrap'>
      {/* 内层玻璃框：高度随目录内容自然伸缩，内容超长时在框内滚动 */}
      <div className='aero-toc'>
        <div className='aero-toc-title'>本页目录</div>
        <nav className='aero-toc-list'>
          {toc.map(item => {
            // Notion 的块 id 带连字符，需要转换成页面里的锚点格式
            const id = uuidToId(item.id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`aero-toc-item${activeId === id ? ' active' : ''}`}
                // 按标题层级做缩进，层级越深越靠右
                style={{ paddingLeft: `${8 + item.indentLevel * 12}px` }}>
                {item.text}
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
