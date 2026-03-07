import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-logo">⬡ LedgerBank</NavLink>
        <div className="navbar-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/transfer" className={({ isActive }) => isActive ? 'active' : ''}>Transfer</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>Transactions</NavLink>
          <NavLink to="/loans" className={({ isActive }) => isActive ? 'active' : ''}>Loans</NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{user?.name}</span>
          <button className="btn btn-ghost" style={{ padding: '0.4rem 1rem' }} onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar