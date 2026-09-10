import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const items = [
    { to: '/', icon: '⌂', label: 'Home' },
    { to: '/explore', icon: '◫', label: 'Explore Bounties' },
    { to: '/create', icon: '+', label: 'Create Bounty' },
    { to: '/my-bounties', icon: '▣', label: 'My Bounties' },
  ]

  return (
    <aside className="app-sidebar">
      <div className="sidebar-items">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">⚙</span>
          <span className="sidebar-label">Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar