import SmartLink from '@/components/SmartLink'

/**
 * 文章详情页面包屑
 * 结构：首页 / 分类 / 当前标题，右侧带一个明确的“返回列表”按钮。
 * 分类不存在时自动省略中间一段。
 */
export const ArticleBreadcrumb = ({ post }) => {
  return (
    <nav className='aero-breadcrumb'>
      <div className='aero-breadcrumb-path'>
        {/* 首页，同时也是返回列表的入口 */}
        <SmartLink href='/'>首页</SmartLink>

        {/* 有分类时插入“分类”这一段 */}
        {post?.category && (
          <>
            <span className='aero-breadcrumb-sep'>/</span>
            <SmartLink href={`/category/${post.category}`}>
              {post.category}
            </SmartLink>
          </>
        )}

        <span className='aero-breadcrumb-sep'>/</span>

        {/* 当前文章只显示文字，不做成链接 */}
        <span className='aero-breadcrumb-current'>{post?.title}</span>
      </div>

      {/* 右侧返回按钮，固定回首页列表 */}
      <SmartLink href='/' className='aero-breadcrumb-back'>
        ← 返回列表
      </SmartLink>
    </nav>
  )
}
