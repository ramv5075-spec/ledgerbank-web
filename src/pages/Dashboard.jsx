import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const formatAmount = (n) => Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wRes = await api.get('/wallets')
        const w = wRes.data.wallets[0]
        setWallet(w)
        const txRes = await api.get(`/transactions?walletId=${w.id}`)
        setTransactions(txRes.data.transactions)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading...</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="page">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Your financial overview</p>
          </div>
          <Link to="/transfer" className="btn btn-primary">Send Money →</Link>
        </div>

        {/* Wallet Card */}
        {wallet && (
          <div style={{
            background: 'linear-gradient(135deg, #00e5a015 0%, var(--surface) 60%)',
            border: '1px solid #00e5a030',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Balance</p>
            <p className="mono" style={{ fontSize: '3rem', color: 'var(--accent)', margin: '0.5rem 0' }}>${formatAmount(wallet.balance)}</p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="badge badge-green">{wallet.currency}</span>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{wallet.id.slice(0, 16)}...</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Sent</p>
            <p className="mono" style={{ fontSize: '1.3rem', color: 'var(--danger)' }}>
              -${formatAmount(transactions.filter(t => t.from_wallet_id === wallet?.id).reduce((s, t) => s + parseFloat(t.amount), 0))}
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Received</p>
            <p className="mono" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}>
              +${formatAmount(transactions.filter(t => t.to_wallet_id === wallet?.id).reduce((s, t) => s + parseFloat(t.amount), 0))}
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Transactions</p>
            <p className="mono" style={{ fontSize: '1.3rem' }}>{transactions.length}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ color: 'var(--accent)', fontSize: '0.85rem', textDecoration: 'none' }}>View all →</Link>
          </div>
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>No transactions yet</p>
          ) : (
            transactions.slice(0, 5).map(tx => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                  {tx.from_wallet_id === wallet?.id ? '↑' : '↓'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.15rem' }}>{tx.note || 'Transfer'}</p>
                  <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{formatDate(tx.created_at)}</p>
                </div>
                <p className="mono" style={{ fontSize: '0.95rem', color: tx.from_wallet_id === wallet?.id ? 'var(--danger)' : 'var(--accent)' }}>
                  {tx.from_wallet_id === wallet?.id ? '-' : '+'}${formatAmount(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard