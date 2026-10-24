import { UserProfile } from '@clerk/nextjs'
import { isClerkEnabled } from '@/lib/config/clerk'
/**
 * 控制台用户账号面板
 * @returns
 */
export default function DashboardUser() {
  const enableClerk = isClerkEnabled()
  if (!enableClerk) {
    return null
  }
  return (
    <UserProfile
      appearance={{
        elements: {
          cardBox: 'w-full',
          rootBox: 'w-full'
        }
      }}
      className='bg-blue-300'
      routing='path'
      path='/dashboard/user-profile'
    />
  )
}
