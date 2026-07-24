const tones = {
  low: 'badge badge-low',
  medium: 'badge badge-medium',
  high: 'badge badge-high',
  neutral: 'badge badge-neutral',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`${tones[tone] || tones.neutral} ${className}`.trim()}>{children}</span>
}
