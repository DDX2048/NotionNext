/* eslint-disable react/no-unknown-property */
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import CONFIG from './config'

/**
 * 主题样式文件
 * 原 HTML 里 <style> 的全部 CSS 都搬到这里，
 * 统一加上 #theme-aero 前缀，保证只影响本主题，不污染 Notion 正文。
 * 设计基调：深邃紫极光背景 + 黑色渐变玻璃卡片。
 */
const Style = () => {
  return (
    <style jsx global>{`
      /* 页面最外层也铺一层深色底，避免滚动到边缘时露出白底；
         同时把默认文字固定为白色，不再受 light/dark 模式影响，
         color-scheme 让浏览器原生控件（滚动条、输入框）也走深色 */
      body {
        background-color: #0d051a;
        color: #ffffff;
        color-scheme: dark;
      }

      /* 隐藏 NotionNext 的主题切换浮窗（右下角可拖动的盒子）。
         该浮窗由 Notion 配置表里的 THEME_SWITCH 控制，
         这里在主题层再兜底一次，避免它遮挡页面内容 */
      #draggableBox {
        display: none !important;
      }

      /* ========== 主题根节点：设计令牌 + 极光背景 ========== */
      #theme-aero {
        /* 背景极光色 */
        --p-dark: #1a0b2e;
        --p-dark-deep: #0d051a;
        --p-dark-bg: #2a1745;
        --p-light-glow: rgba(230, 215, 255, 0.6);

        /* 黑渐变玻璃核心参数 */
        --glass-black-top: rgba(40, 40, 40, 0.7);
        --glass-black-bottom: rgba(10, 10, 10, 0.4);
        --glass-border: rgba(255, 255, 255, 0.15);
        --glass-border-light: rgba(255, 255, 255, 0.4);
        --glass-shadow: rgba(0, 0, 0, 0.7);

        /* 文字颜色 */
        --text-main: #ffffff;
        --text-sub: #c0c0c0;
        /* 主色由 config.js 注入，改配置即可换主题色 */
        --text-accent: ${CONFIG.AERO_COLOR_PRIMARY};

        position: relative;
        min-height: 100vh;
        padding: 0 24px 80px;
        /* 用 clip 而不是 hidden：hidden 会把本节点变成滚动容器，
           导致右侧目录的 position: sticky 失效 */
        overflow-x: clip;
        color: var(--text-main);
        font-family: 'Nunito Sans', 'Segoe UI', system-ui, sans-serif;
        line-height: 1.65;

        /* 原 HTML 用 body::before/::after 画背景，这里改成多层背景图，
           避免负 z-index 伪元素被正文内容遮挡 */
        background-color: var(--p-dark-deep);
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(circle at 20% 30%, rgba(156, 39, 176, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(103, 58, 183, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 10%, rgba(230, 215, 255, 0.15) 0%, transparent 60%),
          linear-gradient(135deg, var(--p-dark) 0%, var(--p-dark-bg) 50%, var(--p-dark) 100%);
        background-attachment: fixed;
      }

      /* ========== 顶部导航 ========== */
      #theme-aero .aero-nav {
        max-width: 1280px;
        margin: 20px auto 40px;
        padding: 12px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 12px;
        background: linear-gradient(180deg, var(--glass-black-top) 0%, var(--glass-black-bottom) 100%);
        backdrop-filter: blur(20px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 4px 20px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        z-index: 10;
      }

      /* Logo：文字 + 球状高光圆点 */
      #theme-aero .aero-logo {
        font-family: 'Nunito', 'Segoe UI', sans-serif;
        font-weight: 800;
        font-size: 1.35rem;
        letter-spacing: 0.05em;
        color: #fff;
        text-decoration: none;
        text-shadow: 0 0 10px var(--p-light-glow);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      #theme-aero .aero-logo::before {
        content: '';
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #fff 0%, var(--text-accent) 30%, #000 100%);
        box-shadow: 0 0 12px var(--text-accent), inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      }

      /* 导航链接容器 */
      #theme-aero .aero-nav-links {
        display: flex;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      /* 单个导航链接：默认低对比，hover/active 时变成玻璃高光按钮 */
      #theme-aero .aero-nav-links a {
        display: inline-block;
        padding: 6px 18px;
        border-radius: 6px;
        font-family: 'Segoe UI', 'Nunito Sans', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-sub);
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid transparent;
      }

      #theme-aero .aero-nav-links a:hover,
      #theme-aero .aero-nav-links a.active {
        color: #fff;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.2) 100%);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
      }

      /* ========== 首页 Hero 大横幅 ========== */
      #theme-aero .aero-hero {
        max-width: 1280px;
        margin: 0 auto 40px;
        padding: 60px 40px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%);
        backdrop-filter: blur(24px) saturate(150%);
        -webkit-backdrop-filter: blur(24px) saturate(150%);
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      }

      /* Hero 上半部的高光弧面，模拟 Aero 玻璃反光 */
      #theme-aero .aero-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
        border-radius: 16px 16px 50% 50% / 16px 16px 20% 20%;
        pointer-events: none;
      }

      #theme-aero .aero-hero h1 {
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-weight: 700;
        font-size: clamp(2.2rem, 4vw, 3rem);
        letter-spacing: 0.02em;
        color: #fff;
        margin: 0;
        text-shadow: 0 0 20px rgba(156, 39, 176, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8);
        position: relative;
        z-index: 1;
      }

      #theme-aero .aero-hero p {
        margin: 12px 0 0;
        font-size: 1.1rem;
        color: var(--text-sub);
        max-width: 600px;
        position: relative;
        z-index: 1;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      }

      /* ========== 板块标题 ========== */
      #theme-aero .aero-section-title {
        max-width: 1280px;
        margin: 0 auto 24px;
        display: flex;
        align-items: baseline;
        gap: 14px;
      }

      #theme-aero .aero-section-title h2 {
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-weight: 600;
        font-size: 1.6rem;
        color: #fff;
        margin: 0;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        letter-spacing: 0.02em;
      }

      #theme-aero .aero-section-title span {
        font-size: 0.9rem;
        color: var(--text-accent);
        font-weight: 600;
        letter-spacing: 0.05em;
        text-shadow: 0 0 8px rgba(186, 104, 200, 0.5);
      }

      /* ========== 卡片网格 ========== */
      #theme-aero .aero-grid {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 28px;
      }

      /* ========== 卡片本体（黑渐变玻璃） ========== */
      #theme-aero .aero-card {
        display: block;
        position: relative;
        border-radius: 12px;
        background: linear-gradient(165deg, rgba(45, 45, 45, 0.6) 0%, rgba(5, 5, 5, 0.5) 100%);
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.6);
        padding: 10px 10px 0;
        color: inherit;
        text-decoration: none;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease;
        cursor: pointer;
      }

      /* 悬停：上浮 + 轻微放大 + 紫色光晕 */
      #theme-aero .aero-card:hover {
        transform: translateY(-6px) scale(1.02);
        background: linear-gradient(165deg, rgba(60, 60, 60, 0.7) 0%, rgba(15, 15, 15, 0.6) 100%);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
      }

      /* 卡片顶部一条细高光线 */
      #theme-aero .aero-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        z-index: 5;
        opacity: 0.5;
        pointer-events: none;
      }

      /* ========== 海报图片区 ========== */
      #theme-aero .aero-card-poster {
        position: relative;
        width: 100%;
        aspect-ratio: 4 / 3;
        border-radius: 8px;
      }

      /* 纯内容板块（如影集）：图片占位加大，卡片更偏向图片展示 */
      #theme-aero[data-board='plain'] .aero-card-poster {
        aspect-ratio: 4 / 5;
      }

      /* 图片外围的透明玻璃垫层，形成约 3px 的立体边框 */
      #theme-aero .aero-card-poster::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 10px;
        z-index: 0;
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }

      /* 图片本体：铺满海报区，悬停时轻微放大 */
      #theme-aero .aero-card-poster img {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        display: block;
        transition: transform 0.5s ease;
      }

      #theme-aero .aero-card:hover .aero-card-poster img {
        transform: scale(1.03);
      }

      /* 分类徽章（黑底磨砂胶囊） */
      #theme-aero .aero-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 3;
        padding: 4px 12px;
        border-radius: 20px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      }

      /* 卡片文字区 */
      #theme-aero .aero-card-body {
        padding: 16px 10px;
        position: relative;
        z-index: 2;
      }

      #theme-aero .aero-card-body h3 {
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-weight: 600;
        font-size: 1.15rem;
        line-height: 1.4;
        color: #fff;
        margin: 0 0 6px;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      }

      /* 摘要：最多显示两行，超出用省略号 */
      #theme-aero .aero-card-body p {
        font-size: 0.85rem;
        color: var(--text-sub);
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        opacity: 0.85;
      }

      /* 卡片底部元信息栏 */
      #theme-aero .aero-card-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      #theme-aero .aero-card-meta .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-sub);
      }

      /* 分类前的小圆点光斑 */
      #theme-aero .aero-card-meta .meta-item .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--text-accent);
        box-shadow: 0 0 8px var(--text-accent);
      }

      /* ========== 底部翻页/更多按钮 ========== */
      #theme-aero .aero-load-more {
        max-width: 1280px;
        margin: 50px auto 0;
        text-align: center;
      }

      #theme-aero .aero-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 40px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        letter-spacing: 0.05em;
        color: #fff;
        text-decoration: none;
        background: linear-gradient(180deg, rgba(100, 100, 100, 0.5) 0%, rgba(30, 30, 30, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.8);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      }

      #theme-aero .aero-btn:hover {
        background: linear-gradient(180deg, rgba(120, 120, 120, 0.6) 0%, rgba(50, 50, 50, 0.9) 50%, rgba(10, 10, 10, 1) 100%);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(156, 39, 176, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.4);
      }

      /* 按下时下沉 1px，模拟真实按键 */
      #theme-aero .aero-btn:active {
        transform: translateY(1px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      /* 翻页区域布局 */
      #theme-aero .aero-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 18px;
      }

      #theme-aero .aero-page-info {
        font-size: 0.85rem;
        color: var(--text-sub);
        letter-spacing: 0.05em;
      }

      /* ========== 文章详情页 ========== */

      /* 顶部阅读进度条：宽度由 ReadingProgress 组件动态设置 */
      #theme-aero .aero-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        z-index: 60;
        background: linear-gradient(90deg, var(--text-accent), #e6d7ff);
        box-shadow: 0 0 12px var(--text-accent);
        transition: width 0.1s linear;
      }

      /* 返回顶部按钮：默认透明且不可点，滚动后加 .show 才出现 */
      #theme-aero .aero-backtop {
        position: fixed;
        right: 24px;
        bottom: 32px;
        z-index: 60;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid var(--glass-border-light);
        background: linear-gradient(180deg, rgba(60, 60, 60, 0.85), rgba(10, 10, 10, 0.9));
        color: #fff;
        font-size: 1.1rem;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      }

      #theme-aero .aero-backtop.show {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      #theme-aero .aero-backtop:hover {
        border-color: var(--text-accent);
        box-shadow: 0 0 18px rgba(186, 104, 200, 0.5);
      }

      /* 详情页封面大图：和卡片同款玻璃边框 */
      #theme-aero .aero-article-cover {
        max-width: 1280px;
        margin: 0 auto 28px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      }

      #theme-aero .aero-article-cover img {
        display: block;
        width: 100%;
        height: clamp(220px, 36vw, 420px);
        object-fit: cover;
      }

      /* ========== 面包屑 ========== */
      #theme-aero .aero-breadcrumb {
        max-width: 1280px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-size: 0.82rem;
        color: var(--text-sub);
      }

      #theme-aero .aero-breadcrumb-path {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      #theme-aero .aero-breadcrumb-path a {
        color: var(--text-accent);
        text-decoration: none;
        white-space: nowrap;
      }

      #theme-aero .aero-breadcrumb-path a:hover {
        color: #e6d7ff;
      }

      #theme-aero .aero-breadcrumb-sep {
        opacity: 0.45;
      }

      /* 当前标题可能很长，单行省略，避免把“返回列表”挤走 */
      #theme-aero .aero-breadcrumb-current {
        color: #e6e6e6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #theme-aero .aero-breadcrumb-back {
        flex-shrink: 0;
        padding: 4px 12px;
        border-radius: 999px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-accent);
        text-decoration: none;
        transition: all 0.25s ease;
      }

      #theme-aero .aero-breadcrumb-back:hover {
        border-color: var(--text-accent);
        background: rgba(186, 104, 200, 0.12);
        box-shadow: 0 0 12px rgba(186, 104, 200, 0.25);
      }

      /* 详情页两栏网格：桌面端右侧 220px 放目录 */
      #theme-aero .aero-article-layout {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 32px;
        justify-content: center;
      }

      @media (min-width: 1180px) {
        #theme-aero .aero-article-layout.has-toc {
          grid-template-columns: minmax(0, 56rem) 220px;
        }
      }

      /* 文章主体：黑渐变玻璃卡片，延续首页卡片的设计语言 */
      #theme-aero .aero-article {
        max-width: 56rem;
        width: 100%;
        margin: 0 auto;
        /* 高度只由正文决定，不被同行的目录拉长 */
        align-self: start;
        padding: clamp(24px, 4vw, 48px);
        border-radius: 16px;
        background: linear-gradient(165deg, rgba(38, 38, 38, 0.6) 0%, rgba(8, 8, 8, 0.5) 100%);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      #theme-aero .aero-article-title {
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-size: clamp(1.8rem, 3.5vw, 2.6rem);
        font-weight: 700;
        text-align: center;
        margin: 0 0 12px;
        text-shadow: 0 0 20px rgba(156, 39, 176, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8);
      }

      #theme-aero .aero-post-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        color: var(--text-sub);
        margin-bottom: 28px;
      }

      #theme-aero .aero-post-meta a {
        color: var(--text-accent);
        text-decoration: none;
      }

      /* ========== 正文排版（react-notion-x 生成的 DOM） ========== */

      /* 基础文字：深色背景上统一用浅灰，避免黑字黑底 */
      #theme-aero #notion-article {
        color: #e6e6e6;
        font-size: 1rem;
        line-height: 1.9;
        word-break: break-word;
      }

      /* 各级标题：白色 + 预留锚点滚动偏移，避免被顶部吸住 */
      #theme-aero #notion-article .notion-h {
        color: #fff;
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-weight: 700;
        line-height: 1.4;
        margin: 1.8em 0 0.6em;
        letter-spacing: 0.01em;
        scroll-margin-top: 90px;
      }

      #theme-aero #notion-article .notion-h1 {
        font-size: 1.9rem;
      }

      /* 二级标题左侧加一条紫色竖线，作为章节分界的记忆点 */
      #theme-aero #notion-article .notion-h2 {
        font-size: 1.55rem;
        padding-left: 14px;
        border-left: 3px solid var(--text-accent);
        text-shadow: 0 0 12px rgba(186, 104, 200, 0.35);
      }

      #theme-aero #notion-article .notion-h3 {
        font-size: 1.25rem;
      }

      #theme-aero #notion-article .notion-h4 {
        font-size: 1.08rem;
      }

      /* 正文段落 */
      #theme-aero #notion-article .notion-text,
      #theme-aero #notion-article .notion-semantic-string {
        color: #dcdcdc;
      }

      #theme-aero #notion-article p {
        margin: 0.9em 0;
      }

      /* 正文链接：紫色 + 虚线下划线 */
      #theme-aero #notion-article a {
        color: var(--text-accent);
        text-decoration: none;
        border-bottom: 1px dashed rgba(186, 104, 200, 0.5);
      }

      #theme-aero #notion-article a:hover {
        color: #e6d7ff;
        border-bottom-color: #e6d7ff;
      }

      #theme-aero #notion-article strong {
        color: #fff;
      }

      /* 列表：符号颜色跟随主题色 */
      #theme-aero #notion-article ul,
      #theme-aero #notion-article ol {
        padding-left: 1.4em;
        margin: 0.9em 0;
      }

      #theme-aero #notion-article li {
        margin: 0.4em 0;
      }

      #theme-aero #notion-article li::marker {
        color: var(--text-accent);
      }

      /* 引用块：左侧紫色竖线 + 半透明底 */
      #theme-aero #notion-article .notion-quote {
        margin: 1.4em 0;
        padding: 14px 20px;
        border-left: 3px solid var(--text-accent);
        border-radius: 0 8px 8px 0;
        background: rgba(255, 255, 255, 0.04);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
      }

      #theme-aero #notion-article .notion-quote .notion-text,
      #theme-aero #notion-article .notion-quote .notion-semantic-string,
      #theme-aero #notion-article .notion-quote p {
        color: #cfcfcf;
      }

      /* 行内代码：淡紫底，和正文区分开 */
      #theme-aero #notion-article .notion-inline-code,
      #theme-aero #notion-article :not(pre) > code {
        padding: 2px 6px;
        border-radius: 5px;
        background: rgba(186, 104, 200, 0.16);
        color: #f0d9ff;
        font-size: 0.88em;
      }

      /* 代码块：纯黑玻璃底，避免默认浅色底刺眼 */
      #theme-aero #notion-article .notion-code {
        margin: 1.4em 0;
        padding: 16px 18px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        overflow-x: auto;
        font-size: 0.86rem;
        line-height: 1.7;
      }

      #theme-aero #notion-article .notion-code code {
        background: transparent;
        color: #e6e6e6;
      }

      /* 表格：细边框 + 隔行底色 */
      #theme-aero #notion-article table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.4em 0;
        font-size: 0.9rem;
      }

      #theme-aero #notion-article th,
      #theme-aero #notion-article td {
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 8px 12px;
        text-align: left;
      }

      #theme-aero #notion-article th {
        background: rgba(255, 255, 255, 0.07);
        color: #fff;
      }

      #theme-aero #notion-article tr:nth-child(even) td {
        background: rgba(255, 255, 255, 0.03);
      }

      /* 图片：圆角，和图注一起居中 */
      #theme-aero #notion-article .notion-asset-wrapper img,
      #theme-aero #notion-article .notion-image img,
      #theme-aero #notion-article img {
        border-radius: 10px;
      }

      #theme-aero #notion-article figcaption {
        color: var(--text-sub);
        text-align: center;
        font-size: 0.82rem;
        margin-top: 8px;
      }

      /* 分割线：中间亮、两端淡，比纯白线柔和 */
      #theme-aero #notion-article .notion-hr,
      #theme-aero #notion-article hr {
        border: none;
        height: 1px;
        margin: 2em 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
      }

      /* Callout 提示块：紫色淡底 + 紫色描边 */
      #theme-aero #notion-article .notion-callout {
        border-radius: 10px;
        background: rgba(186, 104, 200, 0.1);
        border: 1px solid rgba(186, 104, 200, 0.25);
      }

      #theme-aero #notion-article .notion-callout .notion-text,
      #theme-aero #notion-article .notion-callout .notion-semantic-string {
        color: #e6d7ff;
      }

      /* 折叠块 */
      #theme-aero #notion-article .notion-toggle {
        color: #e6e6e6;
      }

      /* ========== 右侧目录 ========== */

      /* 目录外层：只负责撑满整列高度，给内层 sticky 提供足够的滚动范围。
         它本身不画背景，所以玻璃框能紧贴目录内容，不会出现大片空白 */
      #theme-aero .aero-toc-wrap {
        align-self: stretch;
        min-height: 100%;
      }

      /* 玻璃框本体：高度随内容自然变化，最长到一屏，超出后框内滚动 */
      #theme-aero .aero-toc {
        position: sticky;
        top: 24px;
        max-height: calc(100vh - 48px);
        overflow-y: auto;
        padding: 18px 16px;
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(38, 38, 38, 0.62), rgba(10, 10, 10, 0.5));
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
        border: 1px solid var(--glass-border);
        border-top: 1px solid var(--glass-border-light);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
      }

      /* 目录内容超长时出现的细滚动条，避免默认粗滚动条破坏玻璃观感 */
      #theme-aero .aero-toc::-webkit-scrollbar {
        width: 4px;
      }

      #theme-aero .aero-toc::-webkit-scrollbar-track {
        background: transparent;
      }

      #theme-aero .aero-toc::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: rgba(186, 104, 200, 0.4);
      }

      #theme-aero .aero-toc-title {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: var(--text-accent);
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      #theme-aero .aero-toc-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      /* 单个目录项：左侧竖线标记当前所在章节 */
      #theme-aero .aero-toc-item {
        display: block;
        padding: 5px 8px;
        border-radius: 6px;
        border-left: 2px solid transparent;
        font-size: 0.8rem;
        line-height: 1.5;
        color: var(--text-sub);
        text-decoration: none;
        transition: all 0.2s ease;
      }

      #theme-aero .aero-toc-item:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
      }

      #theme-aero .aero-toc-item.active {
        color: #fff;
        border-left-color: var(--text-accent);
        background: rgba(186, 104, 200, 0.14);
        text-shadow: 0 0 8px rgba(186, 104, 200, 0.5);
      }

      /* ========== 上一篇 / 下一篇 ========== */
      #theme-aero .aero-prevnext {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin: 40px 0 8px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      #theme-aero .aero-prevnext-item {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px 16px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-decoration: none;
        transition: all 0.25s ease;
      }

      /* 下一篇靠右对齐 */
      #theme-aero .aero-prevnext-item.next {
        text-align: right;
        align-items: flex-end;
      }

      #theme-aero .aero-prevnext-item:hover {
        border-color: rgba(186, 104, 200, 0.6);
        background: rgba(186, 104, 200, 0.1);
        box-shadow: 0 0 16px rgba(186, 104, 200, 0.2);
      }

      #theme-aero .aero-prevnext-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: var(--text-accent);
      }

      #theme-aero .aero-prevnext-title {
        max-width: 100%;
        font-size: 0.9rem;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* ========== 相关推荐 ========== */
      #theme-aero .aero-recommend {
        margin-top: 40px;
      }

      #theme-aero .aero-recommend-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 14px;
        padding-left: 10px;
        border-left: 3px solid var(--text-accent);
      }

      #theme-aero .aero-recommend-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }

      #theme-aero .aero-recommend-card {
        position: relative;
        display: block;
        aspect-ratio: 16 / 10;
        border-radius: 10px;
        overflow: hidden;
        text-decoration: none;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      #theme-aero .aero-recommend-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      #theme-aero .aero-recommend-card:hover img {
        transform: scale(1.06);
      }

      /* 标题压在图片底部，用渐变遮罩保证文字可读 */
      #theme-aero .aero-recommend-name {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 22px 12px 10px;
        font-size: 0.82rem;
        color: #fff;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* ========== 分享 / 评论容器 ========== */
      #theme-aero .aero-article-share {
        margin-top: 32px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* 评论区套一层深色底，避免默认白底在页面上跳出来 */
      #theme-aero .aero-article-comments {
        margin-top: 32px;
        padding: 20px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* 空状态里的板块标题改为居中 */
      #theme-aero .aero-empty .aero-section-title {
        justify-content: center;
      }

      /* 中小屏：右侧目录没有空间，整个外层一起隐藏，正文自动占满单栏 */
      @media (max-width: 1179px) {
        #theme-aero .aero-toc-wrap {
          display: none;
        }
      }

      /* ========== 归档 / 分类 / 标签 / 404 ========== */
      #theme-aero .aero-archive,
      #theme-aero .aero-chips,
      #theme-aero .aero-empty {
        max-width: 1280px;
        margin: 0 auto;
      }

      #theme-aero .aero-archive-group {
        margin-bottom: 36px;
      }

      #theme-aero .aero-archive-title {
        font-family: 'Segoe UI', 'Nunito', sans-serif;
        font-size: 1.6rem;
        color: #fff;
        padding: 24px 0 10px;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }

      #theme-aero .aero-archive-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      #theme-aero .aero-archive-list li {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 8px 0 8px 12px;
        border-left: 2px solid rgba(255, 255, 255, 0.15);
        font-size: 0.9rem;
        transition: border-color 0.3s ease;
      }

      #theme-aero .aero-archive-list li:hover {
        border-left-color: var(--text-accent);
      }

      #theme-aero .aero-archive-list li span {
        color: var(--text-sub);
        white-space: nowrap;
      }

      #theme-aero .aero-archive-list a {
        color: #e6e6e6;
        text-decoration: none;
      }

      #theme-aero .aero-archive-list a:hover {
        color: #fff;
        text-decoration: underline;
      }

      /* 分类/标签胶囊 */
      #theme-aero .aero-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 20px 0 40px;
      }

      #theme-aero .aero-chip {
        padding: 8px 18px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        backdrop-filter: blur(8px);
        transition: all 0.25s ease;
      }

      #theme-aero .aero-chip:hover {
        border-color: rgba(186, 104, 200, 0.7);
        box-shadow: 0 0 15px rgba(186, 104, 200, 0.4);
      }

      /* 404 / 空列表 */
      #theme-aero .aero-empty {
        text-align: center;
        padding: 80px 0;
      }

      /* ========== 加密文章输入框 ========== */
      #theme-aero .aero-lock {
        max-width: 28rem;
        margin: 80px auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
      }

      #theme-aero .aero-lock-tip {
        color: var(--text-sub);
      }

      #theme-aero .aero-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
        outline: none;
      }

      /* ========== 页脚 ========== */
      #theme-aero .aero-footer {
        max-width: 1280px;
        margin: 60px auto 0;
        padding: 24px 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-sub);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      #theme-aero .aero-footer a {
        color: var(--text-accent);
        text-decoration: none;
      }

      /* ========== 影集全屏预览（横向翻页） ========== */

      /* 预览页去掉页面内边距，整屏交给照片 */
      #theme-aero[data-viewer='true'] {
        padding: 0;
        overflow: hidden;
        height: 100vh;
      }

      #theme-aero .aero-viewer {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        /* 配色取自极简相册参考：中心 #2A2A2E 到边缘 #111114 的柔和径向渐变 */
        background-color: #111114;
        background-image: radial-gradient(circle at 50% 50%, #2a2a2e 0%, #111114 80%);
      }

      /* 顶部：返回、组名、页码 */
      #theme-aero .aero-viewer-top {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 24px;
      }

      /* 顶部按钮/徽标：尺寸不变，只换成参考图的灰玻璃配色 */
      #theme-aero .aero-viewer-close,
      #theme-aero .aero-viewer-counter {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 0.82rem;
        letter-spacing: 0.04em;
        color: #e0e0e0;
        text-decoration: none;
        background: rgba(50, 50, 55, 0.6);
        backdrop-filter: blur(16px) saturate(120%);
        -webkit-backdrop-filter: blur(16px) saturate(120%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        opacity: 0.6;
        transition: all 0.2s ease;
      }

      #theme-aero .aero-viewer-close:hover {
        opacity: 1;
        background: rgba(80, 80, 85, 0.8);
      }

      #theme-aero .aero-viewer-close svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #theme-aero .aero-viewer-title {
        flex: 1;
        min-width: 0;
        text-align: center;
        font-size: 0.92rem;
        letter-spacing: 0.1em;
        color: #e0e0e0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #theme-aero .aero-viewer-counter {
        color: #e0e0e0;
        font-variant-numeric: tabular-nums;
      }

      /* 舞台：单屏高度，横向轨道在这里平移 */
      #theme-aero .aero-viewer-stage {
        position: relative;
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }

      #theme-aero .aero-viewer-track {
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
        will-change: transform;
      }

      #theme-aero .aero-viewer-slide {
        flex: 0 0 100%;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 8px clamp(16px, 6vw, 96px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* 垫层：照片和基本信息共用的玻璃底板，随照片尺寸收缩 */
      #theme-aero .aero-viewer-frame {
        display: flex;
        flex-direction: column;
        width: fit-content;
        max-width: 100%;
        padding: 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      /* 照片按原始比例完整显示，不裁切；去掉四周阴影以免干扰观感 */
      #theme-aero .aero-viewer-frame img {
        display: block;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: calc(100vh - 250px);
        max-height: calc(100svh - 250px);
        object-fit: contain;
        border-radius: 6px;
        user-select: none;
        -webkit-user-drag: none;
      }

      /* 垫层底部的基本信息：左侧照片说明，右侧日期与分类 */
      #theme-aero .aero-viewer-info {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 4px 2px;
        font-size: 0.75rem;
        letter-spacing: 0.04em;
        color: #88888d;
      }

      #theme-aero .aero-viewer-info-caption {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #theme-aero .aero-viewer-info-meta {
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
      }

      /* 底部：左右翻页（说明已移到照片下方的垫层上） */
      #theme-aero .aero-viewer-bottom {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 24px 22px;
      }

      #theme-aero .aero-viewer-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        padding: 0;
        border-radius: 50%;
        cursor: pointer;
        color: #e0e0e0;
        background: rgba(50, 50, 55, 0.6);
        backdrop-filter: blur(16px) saturate(120%);
        -webkit-backdrop-filter: blur(16px) saturate(120%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        opacity: 0.6;
        transition: all 0.2s ease;
      }

      #theme-aero .aero-viewer-arrow:hover {
        opacity: 1;
        background: rgba(80, 80, 85, 0.8);
      }

      /* 到头时隐藏按钮但保留占位，避免说明文字左右跳动 */
      #theme-aero .aero-viewer-arrow.is-hidden {
        opacity: 0;
        pointer-events: none;
      }

      #theme-aero .aero-viewer-arrow svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* 空影集 */
      #theme-aero .aero-viewer-empty {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        color: var(--text-sub);
      }


      /* ========== 响应式：小屏收紧间距、卡片单列 ========== */
      @media (max-width: 640px) {
        #theme-aero {
          padding: 0 14px 60px;
        }
        #theme-aero .aero-hero {
          padding: 40px 24px;
        }
        #theme-aero .aero-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        /* 原设计在手机端隐藏导航；若想保留可改成 display:flex + overflow-x:auto */
        #theme-aero .aero-nav-links {
          display: none;
        }
        /* 详情页：收紧内边距，封面变矮，上下篇改为竖排 */
        #theme-aero .aero-article {
          padding: 20px 16px;
          border-radius: 12px;
        }
        #theme-aero .aero-article-cover img {
          height: 200px;
        }
        #theme-aero .aero-prevnext {
          flex-direction: column;
        }
        #theme-aero .aero-prevnext-item.next {
          text-align: left;
          align-items: flex-start;
        }
        /* 推荐卡片窄屏两列 */
        #theme-aero .aero-recommend-list {
          grid-template-columns: repeat(2, 1fr);
        }
        #theme-aero .aero-backtop {
          right: 14px;
          bottom: 18px;
        }
        #theme-aero #notion-article {
          font-size: 0.95rem;
        }
        /* 小屏面包屑改为两行，返回按钮靠左，避免标题被压没 */
        #theme-aero .aero-breadcrumb {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        /* 全屏预览：小屏收窄上下留白，组名让位给返回和页码 */
        #theme-aero .aero-viewer-top {
          padding: 12px 14px;
          gap: 10px;
        }
        #theme-aero .aero-viewer-title {
          display: none;
        }
        #theme-aero .aero-viewer-slide {
          padding: 4px 12px;
        }
        #theme-aero .aero-viewer-frame img {
          max-height: calc(100vh - 220px);
          max-height: calc(100svh - 220px);
        }
        #theme-aero .aero-viewer-info {
          font-size: 0.7rem;
          gap: 10px;
          padding: 8px 2px 0;
        }
        #theme-aero .aero-viewer-bottom {
          padding: 10px 14px 16px;
          gap: 10px;
        }
        #theme-aero .aero-viewer-arrow {
          width: 40px;
          height: 40px;
        }
      }

      /* 主题控制台调试信息（传入主题名和配置） */
      ${themeConsoleStyle('Movie_Aero', CONFIG)}
    `}</style>
  )
}

export { Style }
