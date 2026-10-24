import { siteConfig } from '@/lib/config'

/**
 * 页脚组件
 * 原 HTML 是纯静态页面所以没有页脚，这里补上站点版权信息，
 * 样式沿用黑玻璃风格（.aero-footer）。
 */
export const Footer = () => {
  const year = new Date().getFullYear()
  const since = parseInt(siteConfig('SINCE'))
  // 站点起始年份早于今年时显示“起始年-今年”，否则只显示今年
  const copyrightDate = since < year ? `${since}-${year}` : `${year}`

  return (
    <footer className='aero-footer'>
      {/* 左侧：版权信息 */}
      <div>
        © {copyrightDate} {siteConfig('AUTHOR')}
      </div>
      {/* 右侧：主题与站点版本 */}
      <div>
        Powered by{' '}
        <a href='https://github.com/notionnext-org/NotionNext'>NotionNext</a>{' '}
        {siteConfig('VERSION')}
      </div>
    </footer>
  )
}
