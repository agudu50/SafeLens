import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const features = [
  {
    title: 'Message Analysis',
    text: 'Analyze suspicious SMS and chat messages with clear risk language.',
  },
  {
    title: 'Screenshot Analysis',
    text: 'Upload screenshots of suspicious conversations or messages.',
  },
  {
    title: 'Scam Risk Score',
    text: 'Receive a simple score that helps explain the level of concern.',
  },
  {
    title: 'Red Flag Detection',
    text: 'Understand the specific patterns that make a message look risky.',
  },
  {
    title: 'AI Explanation',
    text: 'Get a plain-language explanation instead of a vague yes-or-no answer.',
  },
  {
    title: 'Safety Recommendations',
    text: 'Learn what to do next before you click, reply, or send money.',
  },
]

const steps = [
  {
    title: 'Submit',
    text: 'Paste a message, upload a screenshot, or share suspicious content.',
  },
  {
    title: 'Analyze',
    text: 'SafeLens checks for common scam patterns and suspicious signals.',
  },
  {
    title: 'Protect',
    text: 'Receive guidance on risk, red flags, and next steps to stay safe.',
  },
]

export default function Home() {
  return (
    <PageContainer>
      <section className="hero-card">
        <div className="hero-copy">
          <Badge tone="neutral">AI-powered scam awareness</Badge>
          <h1>Not sure if it&apos;s a scam?</h1>
          <p className="hero-text">Let SafeLens take a closer look. We help people in Ghana and beyond review suspicious messages and spot common warning signs before they act.</p>
          <div className="hero-actions">
            <Button as={Link} to="/scan" variant="primary">Scan a Message</Button>
            <Button as={Link} to="/about" variant="secondary">Learn How It Works</Button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel__card">
            <p className="hero-panel__label">Example review</p>
            <h3>Potential scam</h3>
            <p>Urgency, payment request, and a suspicious sender identity were detected.</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <Badge tone="low">How SafeLens works</Badge>
          <h2>Simple steps to stay safer</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="info-card" key={step.title}>
              <div className="step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <Badge tone="medium">Features</Badge>
          <h2>What SafeLens helps you review</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <div className="info-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
