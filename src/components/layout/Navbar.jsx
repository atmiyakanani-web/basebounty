import { Link, useLocation, useNavigate } from 'react-router-dom'
import WalletButton from '../wallet/WalletButton'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHowItWorks = (event) => {
    event.preventDefault()

    if (location.pathname === '/') {
      document.getElementById('how-it-works')?.scrollIntoView({
        behavior: 'smooth',
      })
      return
    }

    navigate('/')

    setTimeout(() => {
      document.getElementById('how-it-works')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 150)
  }

  return (
    <header className="navbar">

      <Link className="brand" to="/">
        <span className="brand-mark">B</span>
        <span>BaseBounty</span>
      </Link>

      <nav className="nav-links">

        <Link to="/">
          Home
        </Link>

        <div className="nav-dropdown">
          <Link to="/explore">
            Explore
          </Link>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>MARKETPLACE</span>
              <strong>Explore</strong>
            </div>

            <Link to="/explore">
              <span>All Bounties</span>
              <small>Browse open opportunities</small>
            </Link>

            <Link to="/find-work">
              <span>Find Work</span>
              <small>Discover work for your skills</small>
            </Link>
          </div>
        </div>

        <div className="nav-dropdown">
          <Link to="/create">
            Create
          </Link>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>FOR CLIENTS</span>
              <strong>Create</strong>
            </div>

            <Link to="/create">
              <span>Create a Bounty</span>
              <small>Post a new opportunity</small>
            </Link>

            <Link to="/hire">
              <span>Hire Someone</span>
              <small>Find the right contributor</small>
            </Link>
          </div>
        </div>

        <div className="nav-dropdown">
          <Link to="/my-bounties">
            Dashboard
          </Link>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>YOUR ACTIVITY</span>
              <strong>Dashboard</strong>
            </div>

            <Link to="/my-bounties">
              <span>My Bounties</span>
              <small>Manage your opportunities</small>
            </Link>

            <Link to="/find-work">
              <span>My Work</span>
              <small>Track accepted work</small>
            </Link>
          </div>
        </div>

        <a
          href="/#how-it-works"
          onClick={handleHowItWorks}
        >
          How it works
        </a>

      </nav>

      <WalletButton />

    </header>
  )
}

export default Navbar