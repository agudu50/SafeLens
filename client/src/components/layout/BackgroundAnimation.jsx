export default function BackgroundAnimation() {
  return (
    <div className="cyber-page-bg" aria-hidden="true">
      {/* Animated fluid ambient mesh gradient orbs for light and dark modes */}
      <div className="cyber-mesh-container">
        <div className="cyber-mesh-orb orb-primary" />
        <div className="cyber-mesh-orb orb-amber" />
        <div className="cyber-mesh-orb orb-rose" />
        <div className="cyber-mesh-orb orb-emerald" />
      </div>

      {/* Modern light shimmer sweep wave */}
      <div className="cyber-shimmer-beam" />

      {/* Cyber masked grid overlay */}
      <div className="cyber-grid-overlay" />

      {/* Scanning laser beam glow */}
      <div className="cyber-scan-glow" />
    </div>
  )
}
