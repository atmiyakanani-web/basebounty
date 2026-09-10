import Navbar from '../components/layout/Navbar'

function Home() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="dot" />
              The bounty marketplace on Base
            </div>

            <h1>
              Get work done.
              <br />
              <span>Pay with confidence.</span>
            </h1>

            <p>
              Create bounties, find skilled contributors, and release
              payments securely through on-chain escrow.
            </p>

            <div className="hero-buttons">
              <a href="/create" className="button button-dark">
                Create a Bounty <span>→</span>
              </a>

              <a href="#explore" className="button button-light">
                Explore Bounties
              </a>
            </div>

            <div className="hero-meta">
              <span>Built on Base</span>
              <i />
              <span>On-chain escrow</span>
              <i />
              <span>Transparent payments</span>
            </div>
          </div>

          <div className="bounty-preview">
            <div className="preview-glow" />

            <div className="preview-card">
              <div className="preview-header">
                <span className="label">OPEN BOUNTY</span>
                <span className="open-status">
                  <b /> Open
                </span>
              </div>

              <div className="preview-icon">✦</div>

              <h2>Build a landing page for a Web3 startup</h2>

              <p>
                Looking for a frontend contributor to create a clean,
                responsive landing page.
              </p>

              <div className="preview-line" />

              <div className="preview-footer">
                <div>
                  <span>REWARD</span>
                  <strong>250 USDC</strong>
                </div>

                <button>View bounty ↗</button>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>100%</strong>
            <span>On-chain escrow</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Open marketplace</span>
          </div>

          <div>
            <strong>Base</strong>
            <span>Fast & affordable</span>
          </div>
        </section>

        <section className="features" id="about">
          <div className="section-intro">
            <span>WHY BASEBOUNTY</span>
            <h2>
              A better way to
              <br />
              get work done.
            </h2>
          </div>

          <div className="feature-grid">
            <article className="feature">
              <div className="feature-number">01</div>
              <div className="feature-symbol">◇</div>
              <h3>Secure Escrow</h3>
              <p>
                Rewards are held in smart-contract escrow until the
                agreed work is approved.
              </p>
            </article>

            <article className="feature">
              <div className="feature-number">02</div>
              <div className="feature-symbol">↗</div>
              <h3>Transparent</h3>
              <p>
                Bounty activity and payment status can be verified
                on-chain.
              </p>
            </article>

            <article className="feature">
              <div className="feature-number">03</div>
              <div className="feature-symbol">◆</div>
              <h3>Built on Base</h3>
              <p>
                Fast, low-cost transactions make smaller bounties
                practical.
              </p>
            </article>
          </div>
        </section>

        <section className="how" id="how-it-works">
          <div className="how-heading">
            <span>HOW IT WORKS</span>
            <h2>
              From idea to
              <br />
              completed work.
            </h2>
          </div>

          <div className="process">
            <div className="process-item">
              <span>01</span>
              <div>
                <h3>Create a bounty</h3>
                <p>
                  Define the work, reward, and contributor before
                  funding the bounty.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>02</span>
              <div>
                <h3>Contributor works</h3>
                <p>
                  The contributor accepts the bounty and completes
                  the requested work.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>03</span>
              <div>
                <h3>Approve & pay</h3>
                <p>
                  Approve the submission and the escrow releases the
                  reward.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <span>READY TO GET STARTED?</span>

          <h2>
            Turn your next idea
            <br />
            into a bounty.
          </h2>

          <a href="/create" className="button button-white">
            Create a Bounty <span>→</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="/">
          <span className="brand-mark">B</span>
          <span>BaseBounty</span>
        </a>

        <span>Built for the open economy.</span>

        <span>© 2026 BaseBounty</span>
      </footer>
    </div>
  )
}

export default Home