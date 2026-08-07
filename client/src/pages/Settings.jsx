import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    smsAlerts: true,
    emailAlerts: false,
    momoShield: true,
    regionalAlerts: 'Accra & Kumasi'
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.4rem 0' }}>
            General &amp; Safety Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            Configure threat alert preferences and regional fraud notifications.
          </p>
        </div>

        {saved && (
          <Alert type="success" style={{ marginBottom: '1.2rem' }}>
             Preferences saved successfully!
          </Alert>
        )}

        <Card style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.8rem 0' }}>
                Fraud &amp; Threat Alerts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={settings.momoShield}
                    onChange={(e) => setSettings({ ...settings, momoShield: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <span>Active MoMo Reversal Audit Guard</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <span>High-Risk Scam Alerts (SMS Notifications)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <span>Weekly Community Scam Intelligence Summary (Email)</span>
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.4rem' }}>
                Primary Regional Monitoring Focus
              </label>
              <select
                value={settings.regionalAlerts}
                onChange={(e) => setSettings({ ...settings, regionalAlerts: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.88rem',
                  fontWeight: 700
                }}
              >
                <option value="Accra & Kumasi">Greater Accra &amp; Ashanti Regions (Accra &amp; Kumasi)</option>
                <option value="Western & Central">Western &amp; Central Regions (Takoradi &amp; Cape Coast)</option>
                <option value="Northern">Northern Regions (Tamale &amp; Wa)</option>
                <option value="All Ghana">All Regions across Ghana</option>
              </select>
            </div>

            <Button type="submit" variant="primary" style={{ marginTop: '0.5rem' }}>
              Save Settings
            </Button>
          </form>
        </Card>

        {/* Subscription & Payment Methods Quick Link Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 0.3rem 0' }}>
                Subscription &amp; Payment Methods
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0 }}>
                Manage your active protection plan, mobile money payment options, and scan quotas.
              </p>
            </div>
            <Link to="/billing" style={{ textDecoration: 'none' }}>
              <Button variant="outline">
                Manage Billing &amp; Plan
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
