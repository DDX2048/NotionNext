/**
 * Clerk 是否启用。
 *
 * 规则：必须同时具备 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 与 CLERK_SECRET_KEY。
 * 只有公钥时，服务端渲染拿不到 auth 上下文，SSG 阶段会直接崩溃
 * （Cannot destructure property 'auth' ...）。
 *
 * 判断结果由 next.config.js 在构建期计算并注入 NEXT_PUBLIC_CLERK_ENABLED，
 * 服务端与客户端读到的是同一个值，避免 hydration 不一致。
 */
export const isClerkEnabled = () =>
  process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true'
