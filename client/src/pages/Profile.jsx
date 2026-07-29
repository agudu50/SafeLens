import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import { authService } from '../services/authService'
import { getScanHistory } from '../services/scannerService'

export default function Profile({ user, setUser }) {
  const navigate = useNavigate()

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Retrieve quiz score from localStorage to tie modules together
  const quizRank = useMemo(() => {
    try {
      const storedRank = localStorage.getItem('safelens_quiz_rank')
      const storedScore = localStorage.getItem('safelens_quiz_score')
      if (storedRank) {
        return { rank: storedRank, score: storedScore }
      }
      return null
    } catch {
      return null
    }
  }, [])

  // Calculate statistics from the history logs
  const stats = useMemo(() => {
    const scans = getScanHistory()
    const total = scans.length
    const avoided = scans.filter((s) => s.riskLevel === 'high').length
    const totalScore = scans.reduce((acc, curr) => acc + curr.riskScore, 0)
    const avgScore = total > 0 ? Math.round(totalScore / total) : 0
    return { total, avoided, avgScore }
  }, [])

  if (!user) return null

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in both name and phone fields.')
      return
    }

    const phoneDigits = phone.trim().replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !/^(02|05|03)/.test(phoneDigits)) {
      setError('Please enter a valid 10-digit Ghanaian phone number (e.g. 0541234567).')
      return
    }

    setError('')
    setSuccess('')

    try {
      const updated = authService.updateProfile({ name, phone: phoneDigits })
      setUser(updated)
      setIsEditing(false)
      setSuccess('Your profile details were updated successfully.')
    } catch (err) {
      setError(err.message || 'Profile modification failed.')
    }
  }

  const handleSignOut = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  return (
    <PageContainer>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '1rem' }} className="profile-layout-container">
        {/* Left Side: Profile Summary Card */}
        <section className="scanner-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-strong)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', border: '2px solid var(--border)' }}>
            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{user.email}</p>
          
          <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Phone:</span>
              <strong style={{ color: 'var(--text)' }}>{user.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Member Since:</span>
              <strong style={{ color: 'var(--text)' }}>{user.registeredAt}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Security Status:</span>
              <Badge tone={quizRank ? (quizRank.score >= 3 ? 'low' : 'medium') : 'neutral'}>
                {quizRank ? quizRank.rank : 'Unrated'}
              </Badge>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', marginTop: '1.5rem' }}>
            <Button variant={isEditing ? 'ghost' : 'primary'} onClick={() => { if (!isEditing) { setName(user?.name || ''); setPhone(user?.phone || ''); } setIsEditing(!isEditing); setError(''); setSuccess(''); }}>
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
            <Button variant="secondary" onClick={handleSignOut} style={{ background: '#fee2e2', color: '#dc2626' }}>
              Sign Out
            </Button>
          </div>
        </section>

        {/* Right Side: Details & Settings Form / Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Stats Overview */}
          <section className="scanner-card" style={{ padding: '1.8rem 2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>Personal Scan Dashboard</h2>
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="stat-card">
                <h4>Scans Run</h4>
                <div className="stat-number">{stats.total}</div>
              </div>
              <div className="stat-card stat-card--accent">
                <h4>Scams Flagged</h4>
                <div className="stat-number" style={{ color: 'var(--danger)' }}>{stats.avoided}</div>
              </div>
              <div className="stat-card">
                <h4>Avg. Threat Rating</h4>
                <div className="stat-number">{stats.avgScore}%</div>
              </div>
            </div>
          </section>

          {/* Edit Form or Educational Certificate Card */}
          {isEditing ? (
            <section className="scanner-card" style={{ padding: '1.8rem 2rem' }}>
              <h2 style={{ margin: '0 0 1.2rem 0', fontSize: '1.3rem' }}>Edit Profile Information</h2>
              {error ? <Alert title="Check details" tone="danger">{error}</Alert> : null}
              
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label className="input-label" htmlFor="edit-name">Full Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    className="scanner-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label className="input-label" htmlFor="edit-phone">Ghana Phone Number</label>
                  <input
                    id="edit-phone"
                    type="tel"
                    className="scanner-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </section>
          ) : (
            <section className="scanner-card" style={{ padding: '1.8rem 2rem' }}>
              <h2 style={{ margin: '0 0 0.8rem 0', fontSize: '1.3rem' }}>Security Education Status</h2>
              {success ? <Alert title="Success" tone="info">{success}</Alert> : null}

              {quizRank ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {quizRank.score >= 3 ? (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '2.5rem', height: '2.5rem', color: 'var(--success)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ) : quizRank.score > 1 ? (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '2.5rem', height: '2.5rem', color: 'var(--warning)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h-9M9 6a3 3 0 116 0 3 3 0 01-6 0z" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '2.5rem', height: '2.5rem', color: 'var(--danger)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem' }}>{quizRank.rank}</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--muted)' }}>
                      You scored <strong>{quizRank.score} out of 3</strong> in the SafeLens Scam Spotter Quiz. 
                      Keep checking suspicious links, MoMo messages, and screenshots to secure your transactions!
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                  <p style={{ color: 'var(--muted)', margin: '0 0 1rem 0' }}>
                    You haven&apos;t taken the Scam Spotter quiz yet. Take it to get your security ranking and certificate badge.
                  </p>
                  <Button onClick={() => navigate('/about')} variant="secondary">Go to Scam Quiz</Button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
