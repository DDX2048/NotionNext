import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 首页 Hero 大横幅
 * 对应原 HTML 里的：
 * <header class="aero-hero"><h1>黑曜石与极光</h1><p>...</p></header>
 * 标题和副标题优先取主题配置，没配则回退到站点 TITLE / BIO。
 */
export const Hero = () => {
  const title =
    siteConfig('AERO_HERO_TITLE', null, CONFIG) || siteConfig('TITLE')
  const desc = siteConfig('AERO_HERO_DESC', null, CONFIG) || siteConfig('BIO')

  return (
    <header className='aero-hero'>
      <h1>{title}</h1>
      {/* 站点没有简介时就不渲染这一段 */}
      {desc && <p>{desc}</p>}
    </header>
  )
}
