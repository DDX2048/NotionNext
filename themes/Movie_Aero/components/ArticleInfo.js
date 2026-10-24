import SmartLink from '@/components/SmartLink'
import WordCount from '@/components/WordCount'

/**
 * 文章详情页头部
 * 原 HTML 只有列表，没有详情页，这里补齐：
 * 大标题 + 发布日期 + 分类 + 标签，沿用黑玻璃/紫色高亮风格。
 */
export const ArticleInfo = ({ post }) => {
  // 取发布日期的“年-月”，用于跳转到归档页对应的月份锚点
  const publishMonth = String(post?.publishDay || '').slice(0, 7)

  return (
    <section className='aero-article-info'>
      <h1 className='aero-article-title'>{post?.title}</h1>

      <div className='aero-post-meta'>
        {/* 发布日期 */}
        <SmartLink href={`/archive#${publishMonth}`}>
          {post?.publishDay}
        </SmartLink>

        {/* 分类 */}
        {post?.category && (
          <SmartLink href={`/category/${post.category}`}>
            {post.category}
          </SmartLink>
        )}

        {/* 标签列表 */}
        {post?.tags?.map(tag => (
          <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
            #{tag}
          </SmartLink>
        ))}

        {/* 字数与预计阅读时长：wordCount / readTime 由 NotionNext 预先算好 */}
        {post?.wordCount && (
          <WordCount wordCount={post.wordCount} readTime={post.readTime} />
        )}
      </div>
    </section>
  )
}
