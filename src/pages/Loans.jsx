import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const Loans = () => {
  const [loans, setLoans] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState('')
  const [repayAmounts, setRepayAmounts] = useState({})
  const [repayLoading, setRepayLoading] = useState(null)

  const formatAmount = (n) => Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const fetchData = async () => {
    try {
      const [wRes, lRes] = await Promise.all([api.get('/wallets'), api.get('/loans')])
      setWallet(wRes.data.wallets[0])
      setLoans(lRes.data.loans)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApply = async (e) => {
    e.preventDefault()
    setApplyLoading(true)
    setApplyError('')
    setApplySuccess('')
    try {
      await api.post('/loans/apply', { amount: parseFloat(amount), purpose })
      setApplySuccess(`Loan of $${formatAmount(amount)} approved and disbursed!`)
      setAmount('')
      setPurpose('')
      setShowForm(false)
      fetchData()
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Application failed')
    } finally {
      setApplyLoading(false)
    }
  }

  const handleRepay = async (loanId) => {
    setRepayLoading(loanId)
    try {
      await api.post(`/loans/${loanId}/repay`, { amount: parseFloat(repayAmounts[loanId]) })
      setRepayAmounts({ ...repayAmounts, [loanId]: '' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Repayment failed')
    } finally {
      setRepayLoading(null)
    }
  }

  const statusBadge = (s) => s === 'ACTIVE' ? 'badge-green' : s === 'PAID' ? 'badge-green' : 'badge-yellow'

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
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Loans</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Apply for a loan — disbursed instantly to your wallet</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Apply for Loan'}
          </button>
        </div>

        {/* Apply Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>New Loan Application</h3>
            <form onSubmit={handleApply}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field">
                  <label>Amount (max $50,000)</label>
                  <input className="input mono" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500" min="500" max="50000" required />
                </div>
                <div className="field">
                  <label>Purpose</label>
                  <input className="input" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Business, education..." required />
                </div>
              </div>
              {amount && (
                <div style={{ background: 'var(--accent-dim)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <span>Interest Rate: <strong style={{ color: 'var(--text)' }}>5.5%</strong></span>
                  <span>Total Repayable: <strong className="mono" style={{ color: 'var(--accent)' }}>${formatAmount(amount * 1.055)}</strong></span>
                </div>
              )}
              {applyError && <p className="error-msg">{applyError}</p>}
              <button className="btn btn-primary" disabled={applyLoading}>
                {applyLoading ? 'Processing...' : 'Apply & Disburse'}
              </button>
            </form>
          </div>
        )}

        {applySuccess && <p className="success-msg">✅ {applySuccess}</p>}

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            No loans yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loans.map(loan => (
              <div key={loan.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{loan.purpose}</p>
                    <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{loan.id.slice(0, 16)}...</p>
                  </div>
                  <span className={`badge ${statusBadge(loan.status)}`}>{loan.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Original', value: `$${formatAmount(loan.amount)}`, color: 'var(--text)' },
                    { label: 'Remaining', value: `$${formatAmount(loan.remaining_balance)}`, color: loan.remaining_balance > 0 ? 'var(--danger)' : 'var(--accent)' },
                    { label: 'Rate', value: `${loan.interest_rate}%`, color: 'var(--text)' },
                    { label: 'Applied', value: formatDate(loan.created_at), color: 'var(--muted)' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</p>
                      <p className="mono" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
                  <div style={{
                    height: 4,
                    background: 'var(--accent)',
                    borderRadius: 2,
                    width: `${((loan.amount - loan.remaining_balance) / loan.amount) * 100}%`
                  }} />
                </div>

                {/* Repay */}
                {loan.status === 'ACTIVE' && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      className="input mono"
                      type="number"
                      style={{ maxWidth: 200 }}
                      placeholder={`Max $${formatAmount(loan.remaining_balance)}`}
                      value={repayAmounts[loan.id] || ''}
                      onChange={e => setRepayAmounts({ ...repayAmounts, [loan.id]: e.target.value })}
                    />
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleRepay(loan.id)}
                      disabled={repayLoading === loan.id || !repayAmounts[loan.id]}
                    >
                      {repayLoading === loan.id ? 'Processing...' : 'Repay'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Loans