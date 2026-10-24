import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * Notion 自带的默认页封面（纯色占位图），影集卡片不应该用它当封面
 */
const NOTION_DEFAULT_COVER = /notion\.so\/images\/page-cover\//i

/**
 * 文章卡片
 * 对应原 HTML 里重复出现的 6 个 <article class="aero-card">，
 * 现在由列表数据循环渲染：
 * - .aero-card-poster：海报图 + 分类徽章 + 玻璃垫层
 * - .aero-card-body：标题、摘要、分类/日期元信息
 */
const BlogPostCard = ({ post, siteInfo }) => {
  const router = useRouter()

  // 照片板块这类「纯内容页」不展示摘要，把版面留给图片
  const isPlainBoard = (CONFIG.AERO_PLAIN_BOARDS || []).includes(router.locale)

  // 封面优先级：文章缩略图 -> 站点封面 -> 随机图（保证卡片不出现空白）
  const initialCover =
    post?.pageCoverThumbnail ||
    siteInfo?.pageCover ||
    siteConfig('RANDOM_IMAGE_URL')
  const [cover, setCover] = useState(initialCover)

  // 影集页本身没设封面时，Notion 会给一张默认纯色图；
  // 这时代码自动取该组第一张照片当卡片封面，同时顺带预热详情页缓存。
  useEffect(() => {
    if (!isPlainBoard || !post?.id) {
      return
    }
    const hasOwnCover =
      post?.pageCoverThumbnail &&
      !NOTION_DEFAULT_COVER.test(post.pageCoverThumbnail)
    if (hasOwnCover) {
      return
    }

    let cancelled = false
    fetch(`/api/photo-warm?id=${post.id}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data?.cover) {
          setCover(data.cover)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isPlainBoard, post?.id, post?.pageCoverThumbnail])

  // 悬停预热：停留 400ms 才请求，避免鼠标扫过整页卡片时把所有图文都拉一遍
  const warmTimer = useRef(null)
  const warmCache = () => {
    if (!isPlainBoard || !post?.id || warmTimer.current) {
      return
    }
    warmTimer.current = setTimeout(() => {
      fetch(`/api/photo-warm?id=${post.id}`).catch(() => {})
    }, 400)
  }
  // 移开卡片就取消预热，只有真的想点开时才触发
  const cancelWarm = () => {
    if (warmTimer.current) {
      clearTimeout(warmTimer.current)
      warmTimer.current = null
    }
  }

  return (
    // 整张卡片可点击，跳转到文章详情页
    <SmartLink
      href={post?.href}
      className='aero-card'
      onMouseEnter={warmCache}
      onMouseLeave={cancelWarm}
      onFocus={warmCache}
      onBlur={cancelWarm}>
      {/* 海报区域 */}
      <div className='aero-card-poster'>
        {/* 左上角分类徽章 */}
        {post?.category && <span className='aero-badge'>{post.category}</span>}
        <LazyImage src={cover} alt={post?.title} />
      </div>

      {/* 文字信息区域 */}
      <div className='aero-card-body'>
        <h3>{post?.title}</h3>
        {/* 摘要：纯内容板块（如影集）不显示 */}
        {!isPlainBoard && post?.summary && <p>{post.summary}</p>}

        {/* 底部元信息：分类小圆点 + 发布日期 */}
        <div className='aero-card-meta'>
          {post?.category && (
            <span className='meta-item'>
              <span className='dot' />
              {post.category}
            </span>
          )}
          {post?.publishDay && (
            <span className='meta-item'>{post.publishDay}</span>
          )}
        </div>
      </div>
    </SmartLink>
  )
}

export default BlogPostCard
