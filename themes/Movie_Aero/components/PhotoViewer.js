import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resolveImages } from '../utils/photos'

/**
 * 影集全屏预览（横向翻页）
 *
 * 只用于「纯内容板块」（如 album）的文章详情页：
 * 点击卡片进入后，不再显示文章排版，而是把这一组照片铺成横向排列的幻灯片，
 * 用左右箭头 / 键盘方向键 / 触摸滑动来翻页，整页固定不滚动。
 *
 * 数据来源：post.blockMap（Notion 页面内容）。
 * 之所以不直接渲染 NotionPage，是为了让照片按原始顺序独占屏幕，
 * 不受正文排版宽度、目录、上一篇下一篇等文章元素影响。
 */


const ChevronLeft = ({ double = false }) => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    {double ? (
      <path d='M11 6 5 12l6 6M18 6l-6 6 6 6' />
    ) : (
      <path d='M15 5 8 12l7 7' />
    )}
  </svg>
)

const ChevronRight = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <path d='M9 5l7 7-7 7' />
  </svg>
)

export const PhotoViewer = ({ post }) => {
  const router = useRouter()
  const images = useMemo(() => resolveImages(post), [post])
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(0)

  const total = images.length

  // 垫层上的基本信息：发布日期 + 分类，缺失的项自动跳过
  const postDate = post?.publishDay || post?.date?.start_date
  const postMeta = [postDate, post?.category].filter(Boolean).join(' · ')

  // 切换到另一个影集时回到第一张（组件会被复用，状态不会自动清空）
  useEffect(() => {
    setIndex(0)
  }, [post?.id])

  // 翻页：越界时不动作，避免出现空白页
  const go = useCallback(
    delta => {
      setIndex(current => {
        const next = current + delta
        if (next < 0 || next >= total) {
          return current
        }
        return next
      })
    },
    [total]
  )

  // 返回影集列表：当前 locale 会自动带上板块前缀，所以 href='/' 就是 /album
  const backToList = useCallback(() => {
    router.push('/')
  }, [router])

  // 键盘：← → 翻页，Esc 退出
  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        go(-1)
      } else if (event.key === 'ArrowRight') {
        go(1)
      } else if (event.key === 'Escape') {
        backToList()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, backToList])

  // 全屏预览时锁住页面滚动，退出后恢复原状
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // 预加载相邻两张，翻页时不会先看到空白
  useEffect(() => {
    ;[index - 1, index + 1].forEach(i => {
      const src = images[i]?.src
      if (src) {
        const img = new Image()
        img.src = src
      }
    })
  }, [index, images])

  // 触摸滑动：横向位移超过 50px 视为一次翻页
  const onTouchStart = event => {
    touchStartX.current = event.touches[0]?.clientX || 0
  }
  const onTouchEnd = event => {
    const delta = (event.changedTouches[0]?.clientX || 0) - touchStartX.current
    if (Math.abs(delta) > 50) {
      go(delta > 0 ? -1 : 1)
    }
  }

  return (
    <div className='aero-viewer'>
      {/* 顶部：返回影集 + 组名 + 页码 */}
      <div className='aero-viewer-top'>
        <SmartLink href='/' className='aero-viewer-close' aria-label='返回影集'>
          <ChevronLeft double />
          <span>返回影集</span>
        </SmartLink>

        <div className='aero-viewer-title'>{post?.title}</div>

        {total > 0 && (
          <div className='aero-viewer-counter'>
            {index + 1} / {total}
          </div>
        )}
      </div>

      {total === 0 ? (
        // 这一组里没有任何图片时的空状态
        <div className='aero-viewer-empty'>
          <p>这个影集里还没有照片</p>
          <SmartLink href='/' className='aero-btn'>
            返回影集
          </SmartLink>
        </div>
      ) : (
        <>
          {/* 舞台：横向轨道整体平移，实现翻页动画 */}
          <div
            className='aero-viewer-stage'
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}>
            <div
              className='aero-viewer-track'
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}>
              {images.map((image, i) => (
                <figure className='aero-viewer-slide' key={`${image.src}-${i}`}>
                  {/* 垫层：照片和基本信息都放在这块玻璃底板上，底板随照片尺寸自适应 */}
                  <div className='aero-viewer-frame'>
                    <img
                      src={image.src}
                      alt={image.caption || post?.title || ''}
                      draggable='false'
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding='async'
                    />

                    {/* 基本信息：左边是照片说明，右边是日期和分类；都没有就不占空间 */}
                    {(image.caption || postMeta) && (
                      <div className='aero-viewer-info'>
                        <span className='aero-viewer-info-caption'>
                          {image.caption}
                        </span>
                        <span className='aero-viewer-info-meta'>{postMeta}</span>
                      </div>
                    )}
                  </div>
                </figure>
              ))}
            </div>
          </div>

          {/* 底部：左右翻页（说明已移到照片下方的垫层上） */}
          <div className='aero-viewer-bottom'>
            <button
              type='button'
              className={`aero-viewer-arrow${index === 0 ? ' is-hidden' : ''}`}
              onClick={() => go(-1)}
              aria-label='上一张'>
              <ChevronLeft />
            </button>

            <button
              type='button'
              className={`aero-viewer-arrow${index === total - 1 ? ' is-hidden' : ''}`}
              onClick={() => go(1)}
              aria-label='下一张'>
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
