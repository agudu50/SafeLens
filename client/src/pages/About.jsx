import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const scamProfiles = [
  {
    title: 'MoMo Wrong Transfer Scam',
    threat: 'High',
    tactics: 'Coercive calls, spoofed transactional SMS messages, high urgency.',
    description: 'A scammer transfers small amounts or sends a fake credit alert SMS, then calls frantically claiming it was for a family member’s medical bill. They ask you to "refund" it immediately. Legitimate wrong transfers should only be resolved through network provider customer support (like dialing MTN 100), not manual returns.',
  },
  {
    title: 'Fake Recruitment & Registration Fees',
    threat: 'High',
    tactics: 'Unrealistic salaries, telegram channels, upfront payment requests.',
    description: 'Advertised remote jobs promise high hourly payouts for basic tasks (like liking YouTube videos). Once you express interest, they demand registration fees, safety deposits, or training kit payments via Mobile Money. Real employers never charge applicants to apply or work.',
  },
  {
    title: 'Brand Impersonation Promotions',
    threat: 'Medium',
    tactics: 'Fake URLs (.xyz/promo), urgency headers, logos mimicking banks/telecoms.',
    description: 'Messages claim you won a brand anniversary sweepstake or that your bank account is suspended. They provide unsecured links pointing to web pages where you are asked to enter credit card info, bank logins, or your Mobile Money PIN. Telecos and banks will never request your PIN.',
  },
]

const quizQuestions = [
  {
    id: 1,
    title: 'Question 1: Cashout Request',
    sender: 'Mobile Money Alert',
    content: 'Cash Out request of GHS 1,000.00 initiated by Agent 544012. Enter your MoMo PIN on the prompt to receive your reward.',
    question: 'What is the correct action to take here?',
    options: [
      { text: 'Enter PIN to accept the cash payout reward.', isCorrect: false },
      { text: 'Decline prompt. Telecoms never require PIN approvals to receive funds.', isCorrect: true },
      { text: 'Approve it, and then call MTN customer service.', isCorrect: false },
    ],
    explanation: 'Scammers trigger Cash Out alerts from agent SIMs. Entering your PIN authorizes them to withdraw money from your wallet. Always reject unexpected PIN prompts.',
  },
  {
    id: 2,
    title: 'Question 2: Verification Link',
    sender: 'Unknown SMS',
    content: 'Fidelity Bank: We detected unauthorized login attempts. Verify your secure card details at http://fidelitybank-gh-security.xyz/login immediately.',
    question: 'Why is this message suspicious?',
    options: [
      { text: 'It uses an unsecure link (http) with a suspicious extension (.xyz).', isCorrect: true },
      { text: 'Fidelity Bank doesn\'t have customer support in Ghana.', isCorrect: false },
      { text: 'It was sent after banking hours.', isCorrect: false },
    ],
    explanation: 'Banks use secure HTTPS websites with official domain names (e.g. .com or .com.gh). They will never text you links pointing to generic .xyz websites requesting login credentials.',
  },
  {
    id: 3,
    title: 'Question 3: Urgency Calls',
    sender: 'Incoming Phone Call',
    content: '“Agoo! I mistakenly sent 500 GHS to your wallet instead of my daughter\'s school fees. Please refund it back to my number now or I will lose my job!”',
    question: 'How should you safely handle this call?',
    options: [
      { text: 'Directly send 500 GHS back to the caller\'s number immediately.', isCorrect: false },
      { text: 'Check your wallet balance. If a real deposit exists, tell them to call the telecom network (100) to request a legitimate reversal.', isCorrect: true },
      { text: 'Ignore the call entirely and block your MoMo wallet.', isCorrect: false },
    ],
    explanation: 'Scammers use emotional manipulation. If they made a genuine mistake, they must contact customer care to initiate a network reversal. Refunding them manually allows them to keep the original funds and double their take.',
  },
]

export default function About() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  const handleOptionClick = (option) => {
    if (showFeedback) return
    setSelectedOption(option)
    setShowFeedback(true)
    if (option.isCorrect) {
      setScore((s) => s + 1)
    }
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setSelectedOption(null)
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  const handleResetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setQuizFinished(false)
  }

  return (
    <PageContainer>
      <section className="scanner-card">
        <div className="section-heading">
          <h1>About SafeLens</h1>
          <p>SafeLens is an educational and analysis platform helping everyday users in Ghana identify suspicious communications and report fraudulent attempts.</p>
        </div>

        <div className="feature-grid" style={{ marginBottom: '3rem' }}>
          <div className="info-card">
            <h3>Plain Language Verdicts</h3>
            <p>We present threat analysis reports in simple, clear terms without technical security jargon so anyone can make safe decisions.</p>
          </div>
          <div className="info-card">
            <h3>Actionable Directives</h3>
            <p>Every analysis provides immediate next steps—how to report, who to contact, and how to verify claims safely.</p>
          </div>
          <div className="info-card">
            <h3>Ghanaian Focused</h3>
            <p>SafeLens addresses scams prevalent in the local market, including Mobile Money (MoMo) tricks and fake job boards.</p>
          </div>
        </div>
      </section>

      {/* Ghana Scam Educational Center */}
      <section className="scanner-card" style={{ marginTop: '2rem' }}>
        <div className="section-heading">
          <Badge tone="high">Education Center</Badge>
          <h2>Spot common scams in Ghana</h2>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Understanding the mechanics of scam formats is your first line of defense.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {scamProfiles.map((profile) => (
            <div className="info-card" key={profile.title} style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{profile.title}</h3>
                <Badge tone={profile.threat === 'High' ? 'high' : 'medium'}>{profile.threat} Threat</Badge>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
                <strong>Common Tactics:</strong> {profile.tactics}
              </p>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.4' }}>
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scam Spotter Quiz */}
      <section className="quiz-section animate-fade-in">
        <div className="quiz-intro">
          <Badge tone="low">Interactive Quiz</Badge>
          <h2>Scam Spotter Quiz</h2>
          <p className="hero-text" style={{ marginTop: '0.4rem' }}>Test your awareness of common fraudulent messages in Ghana and sharpen your security habits.</p>
        </div>

        {!quizFinished ? (
          <div className="quiz-q-card animate-fade-in" key={currentQuestion}>
            <div className="quiz-meta">
              <span>{quizQuestions[currentQuestion].title}</span>
              <span>Score: {score} / {quizQuestions.length}</span>
            </div>
            
            <h3 className="quiz-question-text">{quizQuestions[currentQuestion].question}</h3>
            
            <div className="quiz-sample-box">
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Sender ID: {quizQuestions[currentQuestion].sender}
              </div>
              &ldquo;{quizQuestions[currentQuestion].content}&rdquo;
            </div>

            <div className="quiz-options">
              {quizQuestions[currentQuestion].options.map((option, idx) => {
                let btnStyle = 'quiz-option-btn'
                if (showFeedback) {
                  if (option.isCorrect) btnStyle += ' quiz-option-btn--correct'
                  else if (selectedOption === option) btnStyle += ' quiz-option-btn--incorrect'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={btnStyle}
                    onClick={() => handleOptionClick(option)}
                    disabled={showFeedback}
                  >
                    {option.text}
                  </button>
                )
              })}
            </div>

            {showFeedback && (
              <div className="animate-fade-in" style={{ marginTop: '1.2rem', padding: '1rem', borderRadius: '0.75rem', background: selectedOption.isCorrect ? '#eff6ff' : '#fee2e2', border: selectedOption.isCorrect ? '1px solid #bfdbfe' : '1px solid #fca5a5' }}>
                <strong style={{ color: selectedOption.isCorrect ? '#1d4ed8' : '#991b1b', display: 'block', marginBottom: '0.25rem' }}>
                  {selectedOption.isCorrect ? '✓ Correct Answer!' : '✗ Incorrect!'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.92rem', color: selectedOption.isCorrect ? '#1e3a8a' : '#7f1d1d', lineHeight: '1.4' }}>
                  {quizQuestions[currentQuestion].explanation}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button onClick={handleNextQuestion}>
                    {currentQuestion + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-results-screen quiz-q-card animate-fade-in">
            <h2>Quiz Completed!</h2>
            <p className="hero-text" style={{ margin: '0.5rem auto' }}>Here is your scam awareness ranking:</p>
            
            <div className="quiz-score-circle">
              {score} / {quizQuestions.length}
            </div>

            <h3 style={{ margin: '0 0 1rem' }}>
              {score === quizQuestions.length 
                ? '🏅 Scam Guardian' 
                : score > 1 
                  ? '🥈 Vigilant Citizen' 
                  : '⚠️ Vulnerable Wallet'}
            </h3>

            <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: '1.4' }}>
              {score === quizQuestions.length 
                ? 'Excellent! You spotted all the key scam indicators. Keep using SafeLens and guide your peers.'
                : 'Good attempt! Take a closer look at the common local tactics listed in the profiles above to prevent MoMo scams.'}
            </p>

            <Button onClick={handleResetQuiz}>Retry Quiz</Button>
          </div>
        )}
      </section>
    </PageContainer>
  )
}
