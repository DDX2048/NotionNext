/**
 * 板块标题组件
 * 对应原 HTML 里的：
 * <div class="aero-section-title"><h2>最新影像</h2><span>DARK AERO GALLERY</span></div>
 * 列表页、404 页等都可以复用。
 */
export const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className='aero-section-title'>
      {/* 主标题 */}
      <h2>{title}</h2>
      {/* 副标题（英文小字），没有传入就不渲染 */}
      {subtitle && <span>{subtitle}</span>}
    </div>
  )
}
