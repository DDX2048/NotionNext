import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import PaginationNumber from './PaginationNumber'
import { SectionTitle } from './SectionTitle'

/**
 * 文章列表页
 * 对应原 HTML 里的三块：
 * 1. .aero-section-title 板块标题
 * 2. .aero-grid + 多个 .aero-card 卡片网格
 * 3. .aero-load-more 底部“查看更多”按钮
 * 原 HTML 的 6 张写死卡片，这里替换成 Notion 的文章数据。
 */
export const BlogListPage = props => {
  const { page = 1, posts, postCount, siteInfo } = props
  const { NOTION_CONFIG } = useGlobal()
  const router = useRouter()

  // 照片板块这类「纯内容页」不显示上方的大标题，直接铺卡片
  const isPlainBoard = (CONFIG.AERO_PLAIN_BOARDS || []).includes(router.locale)

  // 每页文章数取自站点配置，用于计算总页数
  const perPage = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / perPage)

  // 没有文章时不渲染列表（避免出现空网格）
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div>
      {/* 板块标题：纯内容板块（如影集）不显示 */}
      {!isPlainBoard && (
        <SectionTitle
          title={siteConfig('AERO_SECTION_TITLE', null, CONFIG)}
          subtitle={siteConfig('AERO_SECTION_SUBTITLE', null, CONFIG)}
        />
      )}

      {/* 卡片网格：posts-wrapper 这个 id 用于搜索结果高亮 */}
      <div id='posts-wrapper' className='aero-grid'>
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} siteInfo={siteInfo} />
        ))}
      </div>

      {/* 底部翻页按钮 */}
      <div className='aero-load-more'>
        <PaginationNumber page={page} totalPage={totalPage} />
      </div>
    </div>
  )
}
