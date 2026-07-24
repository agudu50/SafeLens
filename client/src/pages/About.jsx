import PageContainer from '../components/layout/PageContainer'

export default function About() {
  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <h1>About SafeLens</h1>
          <p>SafeLens is designed to help people review suspicious messages and understand why they may be risky.</p>
        </div>
        <div className="feature-grid">
          <div className="info-card">
            <h3>Built for everyday users</h3>
            <p>We present findings in plain language so that ordinary users can make safer decisions without technical jargon.</p>
          </div>
          <div className="info-card">
            <h3>Focused on trust</h3>
            <p>SafeLens emphasizes cautious guidance, transparency, and practical next steps rather than absolute claims.</p>
          </div>
          <div className="info-card">
            <h3>Scalable design</h3>
            <p>The product is initially tailored to the Ghanaian context while remaining simple to expand to other regions.</p>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
