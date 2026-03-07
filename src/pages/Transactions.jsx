import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Transactions = () => {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const formatAmount = (n) => Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

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
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Transaction History</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Complete record of all your transfers</p>
        </div>

        {transactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            No transactions yet
          </div>
        ) : (
          <div className="card">
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
              gap: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>Transaction</span>
              <span>Wallets</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {transactions.map(tx => {
              const isSender = tx.from_wallet_id === wallet?.id
              return (
                <div key={tx.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
                  gap: '1rem',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center'
                }}>
                  <div>
                    <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{tx.id.slice(0, 12)}...</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.15rem' }}>{tx.note || '—'}</p>
                  </div>
                  <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    <p>From: {tx.from_wallet_id.slice(0, 8)}...</p>
                    <p>To: {tx.to_wallet_id.slice(0, 8)}...</p>
                  </div>
                  <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{formatDate(tx.created_at)}</p>
                  <p className="mono" style={{ fontSize: '0.9rem', color: isSender ? 'var(--danger)' : 'var(--accent)' }}>
                    {isSender ? '-' : '+'}${formatAmount(tx.amount)}
                  </p>
                  <span className="badge badge-green">{tx.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Transactions