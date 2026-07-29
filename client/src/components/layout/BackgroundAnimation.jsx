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

        {/* Security Status Monitoring Nodes */}
        <div className="light-security-node node-a">
          <span className="node-dot green" />
          <span>ENCRYPTED PROTOCOL</span>
        </div>
        <div className="light-security-node node-b">
          <span className="node-dot coral" />
          <span>THREAT MONITOR ACTIVE</span>
        </div>
        <div className="light-security-node node-c">
          <span className="node-dot blue" />
          <span>REALTIME DB SYNC</span>
        </div>
      </div>

      {/* Dark Mode Exclusive Cyber Background Animation */}
      <div className="dark-bg-animation">
        <div className="cyber-grid-overlay" />
        <div className="cyber-scan-glow" />
      </div>
    </div>
  )
}
