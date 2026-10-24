import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 顶部导航栏
 * 对应原 HTML 里的：
 * <nav class="aero-nav"><div class="aero-logo">Aero Obsidian</div><ul>...</ul></nav>
 * 菜单完全由 config.js 的 AERO_NAV 控制，不再读取 Notion 里的菜单页。
 */

/**
 * 判断菜单是否处于高亮状态
 * 不能只看地址字符串：i18n 下 /album 的 locale 是 album，
 * 用 locale 判断板块归属才准确，子页面也能保持高亮。
 */
const isActive = (router, link) => {
  if (link.noActive) {
    return false
  }

  // 首页类菜单：必须停留在默认语言（主站）且路径是根路径
  if (link.resetLocale) {
    return (
      router.locale === (router.defaultLocale || router.locale) &&
      router.pathname === '/'
    )
  }

  // 板块菜单：href 的第一段就是板块前缀（即 locale），
  // 当前 locale 与之一致就说明正处于该板块内，包括它的子页面
  const prefix = link.href.split('/')[1]
  if (prefix && router.locale === prefix) {
    return true
  }

  // 普通内部链接：按地址精确匹配或前缀匹配兜底
  const path = router.asPath.split('?')[0].split('#')[0]
  return path === link.href || path.startsWith(`${link.href}/`)
}

export const Header = () => {
  const router = useRouter()

  // 导航项来自主题配置，主站和所有子板块共用同一套，保证视觉统一
  const links = (CONFIG.AERO_NAV || []).filter(link => link?.show !== false)

  return (
    <nav className='aero-nav'>
      {/* 左侧 Logo：点击回到主站首页，文字取站点标题 */}
      <SmartLink href='/' locale={false} className='aero-logo'>
        {siteConfig('TITLE')}
      </SmartLink>

      {/* 右侧菜单：与当前路径一致时加上 active 高亮样式 */}
      <ul className='aero-nav-links'>
        {links.map((link, index) => (
          <li key={index}>
            <SmartLink
              href={link.href}
              locale={link.resetLocale ? false : undefined}
              className={isActive(router, link) ? 'active' : ''}>
              {link.name}
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
