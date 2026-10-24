'use client'

import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ArticleAround } from './components/ArticleAround'
import { ArticleBreadcrumb } from './components/ArticleBreadcrumb'
import { ArticleCover } from './components/ArticleCover'
import { ArticleInfo } from './components/ArticleInfo'
import { ArticleToc } from './components/ArticleToc'
import { BlogListPage } from './components/BlogListPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PhotoViewer } from './components/PhotoViewer'
import { ReadingProgress } from './components/ReadingProgress'
import { SectionTitle } from './components/SectionTitle'
import CONFIG from './config'
import { Style } from './style'

/**
 * 主题入口文件
 * NotionNext 会从这里加载各个页面的布局（LayoutBase / LayoutIndex / LayoutSlug ...），
 * 页面结构对应原 HTML 的骨架：
 *   导航栏 -> Hero 横幅 -> 内容区 -> 页脚
 */

/**
 * 判断当前是否「影集全屏预览页」
 * 只有纯内容板块（如 album）的详情页才进入：
 *   /album        -> 列表页，保留导航和页脚
 *   /album/xxx    -> 详情页，改为全屏横向翻页
 * 板块归属看 router.locale，页面类型看 router.pathname，
 * 这样 /album/page/2、/album/category/xxx 等列表页不会被误判。
 */
const isViewerRoute = router => {
  if (CONFIG.AERO_PHOTO_VIEWER === false) {
    return false
  }
  const isPlainBoard = (CONFIG.AERO_PLAIN_BOARDS || []).includes(router.locale)
  if (!isPlainBoard) {
    return false
  }
  return (
    router.pathname === '/[prefix]' ||
    router.pathname === '/[prefix]/[slug]' ||
    router.pathname === '/[prefix]/[slug]/[...suffix]'
  )
}

/**
 * 基础布局：所有页面都套在这一层里
 * @param {*} props children 是具体页面的内容，slotTop 是插在内容顶部的插槽
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  // onLoading 为 true 时（数据加载中）先隐藏内容，避免闪烁
  const { onLoading } = useGlobal()
  const router = useRouter()

  // 照片板块这类「纯内容页」不显示 Hero 大横幅，保持顶部干净
  const isPlainBoard = (CONFIG.AERO_PLAIN_BOARDS || []).includes(router.locale)

  // 影集详情页使用全屏预览：不渲染导航和页脚，页面交给 PhotoViewer 独占
  const viewerMode = isViewerRoute(router)

  // 本主题固定为深色：移除 light 类并强制 dark，
  // 这样既不会跟随时间自动切换，也不会残留上一次的日间模式
  useEffect(() => {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  }, [])

  return (
    // id 用于让 style.js 里的所有样式只作用于本主题；
    // data-board 标记当前是否「纯内容板块」，样式里据此调整卡片比例；
    // data-viewer 标记全屏预览页，去掉页面内边距，让照片铺满整屏
    <div
      id='theme-aero'
      data-board={isPlainBoard ? 'plain' : 'default'}
      data-viewer={viewerMode ? 'true' : 'false'}>
      {/* 主题专属样式 */}
      <Style />

      {/* 顶部导航（全屏预览页不显示） */}
      {!viewerMode && <Header {...props} />}

      {/* Hero 大横幅只在首页显示；纯内容板块（如影集）不显示 */}
      {!viewerMode && router.route === '/' && !isPlainBoard && <Hero />}

      {/* 内容区：加载完成后淡入上移 */}
      <main>
        {viewerMode ? (
          // 全屏预览页直接渲染，不套过渡动画：
          // 动画容器的 transform 会让内部的 position: fixed 失效，导致预览框尺寸错乱
          <>
            {slotTop}
            {children}
          </>
        ) : (
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-in-out duration-700 transform'
            enterFrom='opacity-0 translate-y-16'
            enterTo='opacity-100'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-16'
            unmount={false}>
            {slotTop}
            {children}
          </Transition>
        )}
      </main>

      {/* 页脚（全屏预览页不显示） */}
      {!viewerMode && <Footer {...props} />}
    </div>
  )
}

/**
 * 首页：和文章列表页相同，直接复用列表布局
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 文章列表页：交给 BlogListPage 渲染卡片网格
 */
const LayoutPostList = props => {
  return <BlogListPage {...props} />
}

/**
 * 文章详情页
 * lock 为真说明文章加密，需要先输入密码；
 * post 为空则等待一段时间后跳转 404。
 */
const LayoutSlug = props => {
  // prev / next 由 NotionNext 在详情页数据里一并提供
  const { post, lock, validPassword, prev, next, siteInfo } = props
  const router = useRouter()

  useEffect(() => {
    if (post) {
      return
    }
    // 数据可能延迟加载，等待配置的秒数再判断是否真的不存在
    const waiting = (siteConfig('POST_WAITING_TIME_FOR_404') || 3) * 1000
    const timer = setTimeout(() => router.push('/404'), waiting)
    return () => clearTimeout(timer)
  }, [post, router])

  // 加密文章：显示密码输入框
  if (lock) {
    return (
      <div className='aero-lock'>
        <p className='aero-lock-tip'>该文章已加密，请输入密码</p>
        <input
          id='password'
          type='password'
          className='aero-input'
          onKeyDown={e => e.key === 'Enter' && validPassword(e.target.value)}
        />
        <button
          type='button'
          className='aero-btn'
          onClick={() =>
            validPassword(document.getElementById('password')?.value)
          }>
          提交
        </button>
      </div>
    )
  }

  // 文章还没加载出来时先不渲染
  if (!post) {
    return null
  }

  // 影集板块的详情页：不排文章版式，直接进入全屏横向翻页的看图模式
  if (isViewerRoute(router)) {
    return <PhotoViewer post={post} />
  }

  // 计算过滤后的目录条数，只有 2 条以上才真正显示右侧目录，
  // 这里的判断要和 ArticleToc 内部保持一致，否则会出现“有空栏没内容”
  const tocLevel = Number(siteConfig('AERO_TOC_MAX_LEVEL', 3, CONFIG))
  const tocCount = (post?.toc || []).filter(
    item => item.indentLevel < tocLevel
  ).length
  const hasToc = siteConfig('AERO_TOC', true, CONFIG) && tocCount > 1

  return (
    <div className='aero-article-page'>
      {/* 顶部阅读进度条 + 右下角返回顶部 */}
      <ReadingProgress />

      {/* 封面大图 */}
      <ArticleCover post={post} siteInfo={siteInfo} />

      {/* 面包屑 + 返回列表 */}
      <ArticleBreadcrumb post={post} />

      {/* 桌面端两栏：正文 + 目录；没有目录时自动变成单栏 */}
      <div className={`aero-article-layout${hasToc ? ' has-toc' : ''}`}>
        <article id='article-wrapper' className='aero-article'>
          {/* 标题 + 日期/分类/标签/字数 */}
          <ArticleInfo post={post} />

          {/* 正文容器：NotionPage 内部会生成 id=notion-article 的节点 */}
          <div className='aero-article-body'>
            <NotionPage post={post} />
          </div>

          {/* 上一篇 / 下一篇 */}
          <ArticleAround prev={prev} next={next} />

          {/*
            正文到这里结束。
            原来这里依次是：相关推荐、分享栏、评论区，已按要求全部移除。
            以后想加新板块，直接在这个位置插入组件即可；
            旧组件文件仍保留在 components 目录，可随时重新引入。
          */}
        </article>

        {/* 右侧目录（小屏由 CSS 隐藏） */}
        {hasToc && <ArticleToc post={post} />}
      </div>
    </div>
  )
}

/**
 * 404 页面
 */
const Layout404 = () => {
  return (
    <div className='aero-empty'>
      <SectionTitle
        title={siteConfig('AERO_TEXT_NOT_FOUND', '页面不存在', CONFIG)}
        subtitle='404'
      />
      <SmartLink href='/' className='aero-btn'>
        返回首页
      </SmartLink>
    </div>
  )
}

/**
 * 搜索结果页：复用列表布局，并把命中的关键词高亮
 */
const LayoutSearch = props => {
  const { keyword, posts } = props
  const router = useRouter()

  useEffect(() => {
    const container = document.getElementById('posts-wrapper')
    if (keyword && container) {
      replaceSearchResult({
        doms: container,
        search: keyword,
        target: {
          element: 'span',
          className: 'text-[#BA68C8] border-b border-dashed'
        }
      })
    }
  }, [keyword, router])

  // 没有结果时显示空状态，避免页面只剩一个孤零零的导航
  if (!posts || posts.length === 0) {
    return (
      <div className='aero-empty'>
        <SectionTitle
          title={siteConfig('AERO_SEARCH_EMPTY', null, CONFIG)}
          subtitle='NO RESULT'
        />
        <SmartLink href='/' className='aero-btn'>
          返回首页
        </SmartLink>
      </div>
    )
  }

  return <LayoutPostList {...props} />
}

/**
 * 归档页：按年月分组列出所有文章
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div>
      {/* 归档页板块标题 */}
      <SectionTitle
        title={siteConfig('AERO_ARCHIVE_TITLE', null, CONFIG)}
        subtitle={siteConfig('AERO_ARCHIVE_SUBTITLE', null, CONFIG)}
      />
      <div className='aero-archive'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <section key={archiveTitle} className='aero-archive-group'>
            {/* 分组标题（如 2025-06），id 用于详情页日期跳转定位 */}
            <div id={archiveTitle} className='aero-archive-title'>
              {archiveTitle}
            </div>
            <ul className='aero-archive-list'>
              {archivePosts[archiveTitle].map(post => (
                <li key={post.id}>
                  <span>{post.publishDay}</span>
                  <SmartLink href={post.href}>{post.title}</SmartLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/**
 * 分类索引页
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <div>
      {/* 分类页板块标题 */}
      <SectionTitle
        title={siteConfig('AERO_CATEGORY_TITLE', null, CONFIG)}
        subtitle={siteConfig('AERO_CATEGORY_SUBTITLE', null, CONFIG)}
      />
      <div className='aero-chips'>
        {categoryOptions?.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='aero-chip'>
            {category.name} ({category.count})
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

/**
 * 标签索引页
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div>
      {/* 标签页板块标题 */}
      <SectionTitle
        title={siteConfig('AERO_TAG_TITLE', null, CONFIG)}
        subtitle={siteConfig('AERO_TAG_SUBTITLE', null, CONFIG)}
      />
      <div className='aero-chips'>
        {tagOptions?.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='aero-chip'>
            {tag.name} {tag.count ? `(${tag.count})` : ''}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  // 主题配置导出，NotionNext 读取它来注册主题
  CONFIG as THEME_CONFIG
}
