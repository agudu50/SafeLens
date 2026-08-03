export default function BackgroundAnimation() {
  return (
    <div className="cyber-page-bg" aria-hidden="true">
      {/* Light Mode: Professional, Non-Distracting Cybersecurity Animation */}
      <div className="light-bg-animation">
        {/* Technical Security Grid Overlay */}
        <div className="light-cyber-grid" />

        {/* Thin Radar Scan Bar */}
        <div className="light-cyber-radar-sweep" />

        {/* Concentric Safety Shield Radar Wave */}
        <div className="light-radar-wave wave-1" />
        <div className="light-radar-wave wave-2" />
      </div>

      {/* Dark Mode Exclusive Cyber Background Animation */}
      <div className="dark-bg-animation">
        <div className="cyber-grid-overlay" />
        <div className="cyber-scan-glow" />
      </div>
    </div>
  )
}
