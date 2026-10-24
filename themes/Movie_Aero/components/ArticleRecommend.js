import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 相关推荐
 * recommendPosts 由 NotionNext 根据分类/标签自动挑选，
 * 这里只负责用主题的玻璃卡片风格把它排成一行小卡片。
 */
export const ArticleRecommend = ({ posts, siteInfo }) => {
  // 开关关闭或没有推荐数据时不渲染
  if (!siteConfig('AERO_ARTICLE_RECOMMEND', true, CONFIG)) {
    return null
  }
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className='aero-recommend'>
      <div className='aero-recommend-title'>相关推荐</div>
      <div className='aero-recommend-list'>
        {posts.map(post => {
          // 推荐卡片封面：优先缩略图，其次站点封面
          const cover = post?.pageCoverThumbnail || siteInfo?.pageCover
          return (
            <SmartLink
              key={post.id}
              href={post?.href}
              className='aero-recommend-card'>
              {cover && <LazyImage src={cover} alt={post?.title} />}
              {/* 标题压在图片底部，配合渐变遮罩保证可读 */}
              <div className='aero-recommend-name'>{post?.title}</div>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}
