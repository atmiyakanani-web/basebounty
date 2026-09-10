import { Link } from 'react-router-dom'

function HireSomeone() {
  return (
    <main className="role-page">

      {/* HIRING PROCESS FIRST */}

      <section className="hire-process">

        <div className="home-section-heading">
          <p className="eyebrow">
            FOR CLIENTS
          </p>

          <h2>
            Your hiring process.
          </h2>
        </div>

        <div className="home-steps">

          <div className="home-step">
            <span>01</span>

            <h3>
              Create a Bounty
            </h3>

            <p>
              Describe the work and set the reward.
            </p>
          </div>

          <div className="home-step">
            <span>02</span>

            <h3>
              Review Applications
            </h3>

            <p>
              See workers who want to complete
              your bounty.
            </p>
          </div>

          <div className="home-step">
            <span>03</span>

            <h3>
              Accept a Worker
            </h3>

            <p>
              Choose the person you want to work
              with.
            </p>
          </div>

          <div className="home-step">
            <span>04</span>

            <h3>
              Approve & Pay
            </h3>

            <p>
              Review the submitted work and release
              the reward.
            </p>
          </div>

        </div>

      </section>


      {/* MAIN HIRE SECTION */}

      <section className="hire-hero">

        <div>

          <p className="eyebrow">
            HIRE SOMEONE
          </p>

          <h1>
            Get the right person
            <br />
            for the job.
          </h1>

          <p>
            Create a bounty, receive applications,
            choose the right worker, and pay when the
            work is approved.
          </p>

          <div className="hire-buttons">

  <Link
    to="/create"
    className="button button-dark hire-main-button"
  >
    Create a Bounty →
  </Link>

  <Link
    to="/my-bounties"
    className="button button-light hire-main-button"
  >
    My Bounties →
  </Link>

</div>

        </div>

      </section>

    </main>
  )
}

export default HireSomeone