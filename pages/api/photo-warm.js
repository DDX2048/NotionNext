import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { resolveImages } from '@/themes/Movie_Aero/utils/photos'

/**
 * 影集预热接口
 *
 * 卡片被悬停时前端调用这里，提前把该页面的 Notion 区块写进缓存；
 * 真正点进去解析文章时直接命中缓存，省掉一次完整的 Notion 拉取
 * （本地开发环境首次打开一篇图文常常要 10s+）。
 *
 * 只接受 Notion 页面 ID，避免这个接口变成任意页面的代理。
 */
export default async function handler(req, res) {
  const id = String(req.query?.id || '')

  if (!/^[a-f0-9-]{32,36}$/i.test(id)) {
    return res.status(400).json({ ok: false })
  }

  try {
    // 与 fetchPageFromNotion 使用同一套缓存键，文章页可以直接复用
    const rawBlockMap = await fetchNotionPageBlocks(id, 'photo-warm')
    // 原始 recordMap 需要解包成 { value: block } 结构，图片提取逻辑才能识别
    const blockMap = adapterNotionBlockMap(rawBlockMap)
    // 顺带返回这一组的第一张照片，影集列表卡片用它当封面
    const cover = resolveImages({ id, blockMap })[0]?.src || ''
    return res.status(200).json({ ok: true, cover })
  } catch (error) {
    console.warn('[photo-warm] failed:', id, error.message)
    // 预热失败不影响用户正常点击，静默返回即可
    return res.status(200).json({ ok: false })
  }
}
