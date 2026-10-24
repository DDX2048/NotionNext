import SmartLink from '@/components/SmartLink'

/**
 * 上一篇 / 下一篇
 * prev、next 由 NotionNext 在生成文章详情页数据时一并传入。
 * 只有一边存在时也要显示（很多主题在这里会漏掉一边）。
 */
export const ArticleAround = ({ prev, next }) => {
  // 两边都没有就整块不渲染
  if (!prev && !next) {
    return null
  }

  // 优先用 NotionNext 提供的 href，缺失时退回 slug 拼接
  const getHref = post => post?.href || (post?.slug ? `/${post.slug}` : '#')

  return (
    <nav className='aero-prevnext'>
      {prev ? (
        <SmartLink href={getHref(prev)} className='aero-prevnext-item prev'>
          <span className='aero-prevnext-label'>← 上一篇</span>
          <span className='aero-prevnext-title'>{prev.title}</span>
        </SmartLink>
      ) : (
        // 占位，保证“下一篇”仍然靠右
        <span />
      )}

      {next ? (
        <SmartLink href={getHref(next)} className='aero-prevnext-item next'>
          <span className='aero-prevnext-label'>下一篇 →</span>
          <span className='aero-prevnext-title'>{next.title}</span>
        </SmartLink>
      ) : (
        <span />
      )}
    </nav>
  )
}
