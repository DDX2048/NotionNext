import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isClerkEnabled } from '@/lib/config/clerk'

/**
 * Clerk 身份测试
 * @param req
 * @param res
 * @returns
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clerk 未启用（缺少任一密钥）时不访问 Clerk 服务，直接返回未授权
  if (!isClerkEnabled()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Retrieve data from your database
    res.status(200).json({ userId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
