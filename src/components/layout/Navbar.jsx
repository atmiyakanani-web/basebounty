import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import WalletButton from '../wallet/WalletButton'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleHowItWorks = (event) => {
    event.preventDefault()
    setMobileMenuOpen(false)
    setOpenDropdown(null)

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

  const handleDropdownClick = (name) => {
    setOpenDropdown((current) => (current === name ? null : name))
  }

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  return (
    <header className="navbar">

      <Link className="brand" to="/" onClick={closeMenus}>
        <span className="brand-mark">B</span>
        <span>BaseBounty</span>
      </Link>

      {/* DESKTOP NAVIGATION */}
      <nav className="nav-links">

        <Link to="/" onClick={closeMenus}>
          Home
        </Link>

        <div
          className={`nav-dropdown ${openDropdown === 'explore' ? 'nav-dropdown-open' : ''}`}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className="nav-dropdown-trigger"
            onClick={() => handleDropdownClick('explore')}
          >
            Explore
          </button>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>MARKETPLACE</span>
              <strong>Explore</strong>
            </div>

            <Link to="/explore" onClick={closeMenus}>
              <span>All Bounties</span>
              <small>Browse open opportunities</small>
            </Link>

            <Link to="/find-work" onClick={closeMenus}>
              <span>Find Work</span>
              <small>Discover work for your skills</small>
            </Link>
          </div>
        </div>

        <div
          className={`nav-dropdown ${openDropdown === 'create' ? 'nav-dropdown-open' : ''}`}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className="nav-dropdown-trigger"
            onClick={() => handleDropdownClick('create')}
          >
            Create
          </button>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>FOR CLIENTS</span>
              <strong>Create</strong>
            </div>

            <Link to="/create" onClick={closeMenus}>
              <span>Create a Bounty</span>
              <small>Post a new opportunity</small>
            </Link>

            <Link to="/hire" onClick={closeMenus}>
              <span>Hire Someone</span>
              <small>Find the right contributor</small>
            </Link>
          </div>
        </div>

        <div
          className={`nav-dropdown ${openDropdown === 'dashboard' ? 'nav-dropdown-open' : ''}`}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className="nav-dropdown-trigger"
            onClick={() => handleDropdownClick('dashboard')}
          >
            Dashboard
          </button>

          <div className="nav-menu">
            <div className="nav-menu-heading">
              <span>YOUR ACTIVITY</span>
              <strong>Dashboard</strong>
            </div>

            <Link to="/my-bounties" onClick={closeMenus}>
              <span>My Bounties</span>
              <small>Manage your opportunities</small>
            </Link>

            <Link to="/find-work" onClick={closeMenus}>
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

      {/* DESKTOP WALLET */}
      <div className="navbar-wallet">
        <WalletButton />
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MOBILE SIDE PANEL */}
      <div
        className={`mobile-menu-overlay ${
          mobileMenuOpen ? 'mobile-menu-overlay-open' : ''
        }`}
        onClick={closeMenus}
      ></div>

      <aside
        className={`mobile-menu-panel ${
          mobileMenuOpen ? 'mobile-menu-panel-open' : ''
        }`}
      >
        <div className="mobile-menu-header">
          <Link
            className="brand"
            to="/"
            onClick={closeMenus}
          >
            <span className="brand-mark">B</span>
            <span>BaseBounty</span>
          </Link>

          <button
            className="mobile-menu-close"
            onClick={closeMenus}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="mobile-menu-content">

          <Link to="/" onClick={closeMenus}>
            Home
          </Link>

          <Link to="/explore" onClick={closeMenus}>
            Explore
          </Link>

          <Link to="/find-work" onClick={closeMenus}>
            Find Work
          </Link>

          <Link to="/create" onClick={closeMenus}>
            Create Bounty
          </Link>

          <Link to="/hire" onClick={closeMenus}>
            Hire Someone
          </Link>

          <Link to="/my-bounties" onClick={closeMenus}>
            Dashboard
          </Link>

          <a
            href="/#how-it-works"
            onClick={handleHowItWorks}
          >
            How it works
          </a>

          <div className="mobile-wallet">
            <WalletButton />
          </div>

        </div>
      </aside>

    </header>
  )
}

export default Navbar