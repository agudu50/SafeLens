export default function BackgroundAnimation() {
  return (
    <div className="cyber-page-bg" aria-hidden="true">
      {/* Light Mode: Solid Colors, Geometric Shapes & Micro Grid (NO GRADIENTS) */}
      <div className="light-bg-animation">
        {/* Solid Color Floating Geometric Orbs / Shields */}
        <div className="light-solid-shape shape-primary" />
        <div className="light-solid-shape shape-slate" />
        <div className="light-solid-shape shape-blue" />

        {/* Solid Line Blueprint Grid Matrix */}
        <div className="light-blueprint-grid" />

        {/* Solid Scanning Bar Line */}
        <div className="light-solid-scan-bar" />

        {/* Solid Floating Micro Particles */}
        <div className="light-solid-dot d1" />
        <div className="light-solid-dot d2" />
        <div className="light-solid-dot d3" />
        <div className="light-solid-dot d4" />
        <div className="light-solid-dot d5" />
        <div className="light-solid-dot d6" />
      </div>

      {/* Dark Mode Exclusive Cyber Background Animation */}
      <div className="dark-bg-animation">
        <div className="cyber-grid-overlay" />
        <div className="cyber-scan-glow" />
      </div>
    </div>
  )
}
