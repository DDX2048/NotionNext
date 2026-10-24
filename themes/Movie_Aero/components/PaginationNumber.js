import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 列表翻页组件
 * 对应原 HTML 底部的“查看更多影像”按钮（.aero-btn），
 * 这里改成：上一页 + 当前页/总页数 + 下一页（下一页按钮沿用该文案）。
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = Number(page) || 1

  // 从当前路径推导分页前缀，兼容 /page/2、/category/xxx/page/2 等地址
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  // 第 1 页回到前缀本身，其余页拼上 /page/n
  const pageHref = p => (p === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${p}`)

  // 只有一页时不渲染翻页区域
  if (totalPage <= 1) {
    return null
  }

  return (
    <div className='aero-pagination'>
      {/* 上一页：已经是第一页时隐藏 */}
      {currentPage > 1 && (
        <SmartLink href={pageHref(currentPage - 1)} className='aero-btn'>
          {siteConfig('AERO_TEXT_PREV_PAGE', '上一页', CONFIG)}
        </SmartLink>
      )}

      {/* 页码提示 */}
      <span className='aero-page-info'>
        {currentPage} / {totalPage}
      </span>

      {/* 下一页：已经是最后一页时隐藏 */}
      {currentPage < totalPage && (
        <SmartLink href={pageHref(currentPage + 1)} className='aero-btn'>
          {siteConfig('AERO_LOAD_MORE_TEXT', null, CONFIG)}
        </SmartLink>
      )}
    </div>
  )
}

export default PaginationNumber
