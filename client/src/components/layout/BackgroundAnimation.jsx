export default function BackgroundAnimation() {
  return (
    <div className="cyber-page-bg" aria-hidden="true">
      {/* Light Mode: Subtle Ambient Mesh Glow & Micro-Dots */}
      <div className="light-bg-animation">
        {/* Soft Understated Ambient Mesh Glow Orbs */}
        <div className="light-mesh-glow glow-1" />
        <div className="light-mesh-glow glow-2" />
        <div className="light-mesh-glow glow-3" />

        {/* Delicate Micro-Dot Grid */}
        <div className="light-dot-grid" />
      </div>

      {/* Dark Mode Exclusive Cyber Background Animation */}
      <div className="dark-bg-animation">
        <div className="cyber-grid-overlay" />
        <div className="cyber-scan-glow" />
        <div className="dark-mesh-orb orb-cyber-red" />
        <div className="dark-mesh-orb orb-cyber-blue" />
        <div className="dark-mesh-orb orb-cyber-purple" />
      </div>
    </div>
  )
}
