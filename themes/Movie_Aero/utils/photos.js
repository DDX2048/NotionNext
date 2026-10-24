import { mapImgUrl } from '@/lib/db/notion/mapImage'

/**
 * 影集照片提取工具
 *
 * 同时供两类场景使用：
 * 1. 客户端/服务端的全屏查看器（PhotoViewer）
 * 2. 影集列表卡片封面（pages/api/photo-warm.js）
 *
 * 数据来源统一是 Notion 的 recordMap（post.blockMap）。
 */

/**
 * 取出富文本属性里的纯文字（Notion record map 的格式是 [[文字, [装饰]]]）
 */
export const getRichText = property => {
  if (!Array.isArray(property)) {
    return ''
  }
  return property.map(item => item?.[0] || '').join('')
}

/**
 * 从页面 blockMap 里按顺序收集所有图片块
 * @param {*} post 文章数据，含 id / content / blockMap
 * @returns [{ src, caption }]
 */
export const collectImages = post => {
  const blockMap = post?.blockMap
  if (!blockMap?.block) {
    return []
  }

  // 先按 parent_id 建一份子节点索引，保证遍历顺序与 Notion 页面里的顺序一致
  const children = {}
  Object.entries(blockMap.block).forEach(([id, entry]) => {
    const value = entry?.value
    if (!value?.parent_id) {
      return
    }
    if (!children[value.parent_id]) {
      children[value.parent_id] = []
    }
    children[value.parent_id].push(id)
  })

  const visited = new Set()
  const images = []

  const visit = id => {
    if (!id || visited.has(id)) {
      return
    }
    visited.add(id)

    const value = blockMap.block[id]?.value
    if (!value) {
      return
    }

    // 图片块：取原始地址（外链直接用，Notion 图床交给 mapImgUrl 还原）
    if (value.type === 'image') {
      const raw =
        value.properties?.source?.[0]?.[0] || value.format?.display_source
      const src = raw ? mapImgUrl(raw, value, 'block', false) : ''
      if (src) {
        images.push({
          src,
          caption: getRichText(value.properties?.caption)
        })
      }
      return
    }

    // 其余块继续往下钻（分栏、折叠、引用里也可能放照片）
    const childIds = children[id] || value.content || []
    childIds.forEach(visit)
  }

  // 客户端会补全 post.content（页面直属子块），优先用它；
  // 服务端渲染阶段没有 content，就退回 parent_id 索引
  const roots =
    Array.isArray(post?.content) && post.content.length > 0
      ? post.content
      : children[post?.id] || []
  roots.forEach(visit)

  return images
}

/**
 * 兜底：整组照片放在 Notion 画廊/数据库视图里时，正文没有 image 块，
 * 这时从 collection_query 的结果里取每一行的封面图。
 */
export const collectGalleryCovers = post => {
  const blockMap = post?.blockMap
  if (!blockMap?.collection_query) {
    return []
  }

  const covers = []
  Object.values(blockMap.collection_query).forEach(views => {
    Object.values(views || {}).forEach(viewData => {
      const blockIds =
        viewData?.collection_group_results?.blockIds ||
        viewData?.collection_group_results?.block_ids ||
        []
      blockIds.forEach(id => {
        const value = blockMap.block?.[id]?.value
        const cover = value?.format?.page_cover
        if (!cover) {
          return
        }
        covers.push({
          src: mapImgUrl(cover, value, 'block', false),
          caption: getRichText(value?.properties?.title)
        })
      })
    })
  })
  return covers
}

/**
 * 找到这一组要展示的照片：正文图片 -> 画廊封面 -> 文章封面 -> 空
 */
export const resolveImages = post => {
  let list = collectImages(post)
  if (list.length === 0) {
    list = collectGalleryCovers(post)
  }
  if (list.length === 0) {
    const cover = post?.pageCover || post?.pageCoverThumbnail
    if (cover) {
      list = [{ src: cover, caption: '' }]
    }
  }

  // 同一张图可能既在正文又在封面里，按地址去重
  const seen = new Set()
  return list.filter(image => {
    if (!image?.src || seen.has(image.src)) {
      return false
    }
    seen.add(image.src)
    return true
  })
}
