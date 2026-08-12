import { useLocation } from 'react-router-dom'

const NETWORK_NODES = [
  { id: 'n1', cx: 180, cy: 140 },
  { id: 'n2', cx: 420, cy: 260 },
  { id: 'n3', cx: 720, cy: 110 },
  { id: 'n4', cx: 980, cy: 220 },
  { id: 'n5', cx: 1260, cy: 340 },
  { id: 'n6', cx: 160, cy: 520 },
  { id: 'n7', cx: 480, cy: 640 },
  { id: 'n8', cx: 760, cy: 480 },
  { id: 'n9', cx: 1040, cy: 680 },
  { id: 'n10', cx: 1280, cy: 580 },
]

const NETWORK_LINKS = [
  ['n1', 'n2'],
  ['n2', 'n3'],
  ['n3', 'n4'],
  ['n4', 'n5'],
  ['n1', 'n6'],
  ['n2', 'n8'],
  ['n6', 'n7'],
  ['n7', 'n8'],
  ['n8', 'n9'],
  ['n9', 'n10'],
  ['n4', 'n8'],
  ['n5', 'n10'],
  ['n3', 'n8'],
]

const nodeMap = Object.fromEntries(NETWORK_NODES.map((n) => [n.id, n]))

const FLOATING_FRAMES = [
  { id: 'f1', top: '8%', left: '6%', size: 120, rotate: 12, delay: '0s' },
  { id: 'f2', top: '62%', left: '78%', size: 160, rotate: -18, delay: '-4s' },
  { id: 'f3', top: '72%', left: '12%', size: 90, rotate: 24, delay: '-8s', hideMobile: true },
  { id: 'f4', top: '22%', left: '82%', size: 110, rotate: -8, delay: '-12s', hideMobile: true },
]

export default function BackgroundAnimation() {
  const { pathname } = useLocation()
  if (pathname !== '/') return null

  return (
    <div className="landing-page-bg" aria-hidden="true">
      <div className="landing-bg-dots" />

      <svg
        className="landing-bg-network"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {NETWORK_LINKS.map(([from, to], i) => {
          const a = nodeMap[from]
          const b = nodeMap[to]
          return (
            <line
              key={`${from}-${to}`}
              className="landing-bg-network__line"
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              style={{ animationDelay: `${-(i * 0.9)}s` }}
            />
          )
        })}
        {NETWORK_NODES.map((node, i) => (
          <g key={node.id}>
            <circle
              className="landing-bg-network__pulse"
              cx={node.cx}
              cy={node.cy}
              r="18"
              style={{ animationDelay: `${-(i * 1.1)}s` }}
            />
            <circle
              className="landing-bg-network__node"
              cx={node.cx}
              cy={node.cy}
              r="3.5"
              style={{ animationDelay: `${-(i * 0.7)}s` }}
            />
          </g>
        ))}
      </svg>

      <div className="landing-bg-orbit landing-bg-orbit--1" />
      <div className="landing-bg-orbit landing-bg-orbit--2" />

      {FLOATING_FRAMES.map((frame) => (
        <div
          key={frame.id}
          className={`landing-bg-frame${frame.hideMobile ? ' landing-bg-frame--hide-mobile' : ''}`}
          style={{
            top: frame.top,
            left: frame.left,
            width: frame.size,
            height: frame.size,
            animationDelay: frame.delay,
            '--frame-rotate': `${frame.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
