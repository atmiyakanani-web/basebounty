import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <span className="not-found-code">404</span>

        <p className="eyebrow">
          PAGE NOT FOUND
        </p>

        <h1>
          This page doesn't exist.
        </h1>

        <p>
          The page you are looking for may have been
          moved, removed, or the URL may be incorrect.
        </p>

        <div className="not-found-actions">
          <Link
            to="/"
            className="button button-dark"
          >
            Back to Home →
          </Link>

          <Link
            to="/explore"
            className="button button-light"
          >
            Explore Bounties
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound