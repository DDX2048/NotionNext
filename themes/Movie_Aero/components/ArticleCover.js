import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 文章详情页封面大图
 * 原 HTML 只有列表卡片，没有详情页头部大图；
 * 这里优先取文章自身封面，其次退回站点封面。
 * 没有封面或开关关闭时不渲染，避免留出一条空白。
 */
export const ArticleCover = ({ post, siteInfo }) => {
  // 是否显示封面，可在 config.js 里关掉
  if (!siteConfig('AERO_ARTICLE_COVER', true, CONFIG)) {
    return null
  }

  // 封面优先级：文章封面 → 文章缩略图 → 站点封面
  const cover =
    post?.pageCover || post?.pageCoverThumbnail || siteInfo?.pageCover

  // 一张图都没有就直接不渲染
  if (!cover) {
    return null
  }

  return (
    <div className='aero-article-cover'>
      {/* priority 让这张首屏大图优先加载 */}
      <LazyImage src={cover} alt={post?.title} priority={true} />
    </div>
  )
}
