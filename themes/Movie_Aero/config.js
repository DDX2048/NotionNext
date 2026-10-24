/**
 * Movie_Aero 主题配置文件
 * 所有可调节的开关、文案、主色都集中在这里，
 * 修改配置后不需要动 CSS 或组件代码。
 */
const CONFIG = {
  // 主题主色：用于徽章、链接、光晕等强调元素（对应原 HTML 的 --text-accent）
  AERO_COLOR_PRIMARY: '#BA68C8',

  // ===== 顶部导航 =====
  // 顺序即显示顺序，增删菜单直接改这个数组即可。
  // resetLocale: true —— 点击后强制去掉板块前缀，回到主站首页；
  //   否则在 /album 等子板块下点「首页」会停留在板块内。
  // noActive: true —— 不参与高亮判断，用于暂时跟首页指向同一地址的占位菜单。
  AERO_NAV: [
    { name: '首页', href: '/', resetLocale: true },
    // 「文章」待定：主站首页目前就是文章列表，以后单独开文章板块时把 href 改成 /article 之类
    { name: '文章', href: '/', resetLocale: true, noActive: true },
    { name: '影集', href: '/album' }
  ],

  // 这些板块按「纯内容页」呈现：不显示 Hero 大横幅，也不显示列表板块标题。
  // 数组里填板块前缀（即 NOTION_PAGE_ID 中的前缀名，例如 album）
  AERO_PLAIN_BOARDS: ['album'],

  // 纯内容板块的详情页是否使用「全屏横向翻页」的看图模式。
  // 关掉（false）后，影集详情页会回到普通文章排版（封面 + 标题 + 正文）。
  AERO_PHOTO_VIEWER: true,

  // 首页 Hero 大标题与副标题；留空时自动取站点的 TITLE / BIO
  AERO_HERO_TITLE: '',
  AERO_HERO_DESC: '',

  // 列表区的板块标题
  AERO_SECTION_TITLE: '最新影像',
  AERO_SECTION_SUBTITLE: 'DARK AERO GALLERY',

  // 列表底部“下一页/加载更多”按钮的文案
  AERO_LOAD_MORE_TEXT: '查看更多影像',

  // ===== 文章详情页 =====
  AERO_ARTICLE_COVER: true, // 详情页顶部是否显示封面大图
  AERO_TOC: true, // 详情页右侧是否显示目录（标题少于 2 个时自动隐藏）
  AERO_TOC_MAX_LEVEL: 3, // 目录最多显示到第几级标题（1 / 2 / 3）
  AERO_ARTICLE_RECOMMEND: true, // 详情页底部是否显示相关推荐
  AERO_READING_PROGRESS: true, // 是否显示顶部阅读进度条和右下角返回顶部按钮

  // ===== 归档 / 分类 / 标签页的板块标题 =====
  AERO_ARCHIVE_TITLE: '归档',
  AERO_ARCHIVE_SUBTITLE: 'ARCHIVE',
  AERO_CATEGORY_TITLE: '分类',
  AERO_CATEGORY_SUBTITLE: 'CATEGORIES',
  AERO_TAG_TITLE: '标签',
  AERO_TAG_SUBTITLE: 'TAGS',

  // ===== 通用文案 =====
  // 这些文案写死在主题里，不走 NotionNext 的 i18n 字典。
  // 原因：板块前缀（如 album）会被当作 locale，界面语言会回退成英文；
  // 固定在这里可以保证所有板块的文案完全一致。
  AERO_TEXT_PREV_PAGE: '上一页',
  AERO_TEXT_NOT_FOUND: '页面不存在',

  // 搜索没有结果时的提示文案
  AERO_SEARCH_EMPTY: '没有找到相关影像'
}

export default CONFIG
