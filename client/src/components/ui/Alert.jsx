export default function Alert({ title, children, tone = 'info' }) {
  return (
    <div className={`alert alert-${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  )
}
