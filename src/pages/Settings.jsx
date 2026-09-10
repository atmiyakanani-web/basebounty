import { useEffect, useState } from 'react'
import './Settings.css'

function Settings() {
  const [theme, setTheme] = useState(
    localStorage.getItem('basebounty-theme') || 'system'
  )

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }

    localStorage.setItem('basebounty-theme', theme)
  }, [theme])

  return (
    <main className="settings-page">
      <div className="settings-header">
        <p className="settings-eyebrow">PREFERENCES</p>
        <h1>Settings</h1>
        <p>
          Manage your BaseBounty experience and interface preferences.
        </p>
      </div>

      <section className="settings-card">
        <div className="settings-section">
          <div>
            <h2>Appearance</h2>
            <p>Choose how BaseBounty looks on your device.</p>
          </div>

          <div className="theme-options">
            <button
              className={theme === 'light' ? 'theme-option selected' : 'theme-option'}
              onClick={() => setTheme('light')}
            >
              <span className="theme-icon">☀</span>
              <span>
                <strong>Light</strong>
                <small>Bright interface</small>
              </span>
            </button>

            <button
              className={theme === 'dark' ? 'theme-option selected' : 'theme-option'}
              onClick={() => setTheme('dark')}
            >
              <span className="theme-icon">☾</span>
              <span>
                <strong>Dark</strong>
                <small>Dark interface</small>
              </span>
            </button>

            <button
              className={theme === 'system' ? 'theme-option selected' : 'theme-option'}
              onClick={() => setTheme('system')}
            >
              <span className="theme-icon">▣</span>
              <span>
                <strong>System</strong>
                <small>Use device preference</small>
              </span>
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <h2>Notifications</h2>
            <p>Notification preferences will be available here.</p>
          </div>
          <span className="coming-soon">Coming soon</span>
        </div>

        <div className="settings-row">
          <div>
            <h2>Network</h2>
            <p>Base network configuration for blockchain features.</p>
          </div>
          <span className="network-badge">Base</span>
        </div>

        <div className="settings-row">
          <div>
            <h2>Security</h2>
            <p>Your wallet remains controlled by your connected wallet provider.</p>
          </div>
          <span className="secure-badge">Protected</span>
        </div>
      </section>
    </main>
  )
}

export default Settings