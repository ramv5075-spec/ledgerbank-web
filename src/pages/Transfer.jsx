import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Transfer = () => {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [toWalletId, setToWalletId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/wallets').then(res => setWallet(res.data.wallets[0]))
  }, [])

  const handleTransfer = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post('/wallets/transfer', {
        to_wallet_id: toWalletId,
        amount: parseFloat(amount),
        note,
      })
      setSuccess(`Transfer successful! ID: ${res.data.transaction.id.slice(0, 16)}...`)
      setWallet(prev => ({ ...prev, balance: parseFloat(prev.balance) - parseFloat(amount) }))
      setToWalletId('')
      setAmount('')
      setNote('')
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (n) => Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Send Money</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Transfer funds to any wallet instantly</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* Form */}
          <div className="card">
            <form onSubmit={handleTransfer}>
              <div className="field">
                <label>From Wallet</label>
                <div className="input mono" style={{ cursor: 'default', color: 'var(--muted)' }}>
                  {wallet?.id.slice(0, 20)}... — <span style={{ color: 'var(--accent)' }}>${wallet ? formatAmount(wallet.balance) : '...'}</span>
                </div>
              </div>
              <div className="field">
                <label>Destination Wallet ID</label>
                <input className="input" value={toWalletId} onChange={e => setToWalletId(e.target.value)} placeholder="Enter wallet ID" required />
              </div>
              <div className="field">
                <label>Amount (USD)</label>
                <input className="input mono" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" required />
              </div>
              <div className="field">
                <label>Note (optional)</label>
                <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Rent, groceries..." />
              </div>
              {error && <p className="error-msg">{error}</p>}
              {success && <p className="success-msg">✅ {success}</p>}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading || !toWalletId || !amount}>
                {loading ? 'Processing...' : `Send ${amount ? '$' + amount : ''}`}
              </button>
            </form>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>⬡ Atomic Transfers</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Every transfer is wrapped in a PostgreSQL transaction — if any step fails, the entire operation is rolled back automatically.
              </p>
            </div>
            <div className="card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your Wallet ID</h4>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', wordBreak: 'break-all' }}>{wallet?.id}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Share this to receive funds</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Transfer