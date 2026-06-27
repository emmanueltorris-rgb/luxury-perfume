import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      showToast('Logged in successfully', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-16">
      <div className="w-full max-w-md px-4">
        <div className="rounded-[32px] border border-[#FFD29D] bg-white shadow-[0_30px_80px_-45px_rgba(255,127,98,0.6)] p-8">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#FF7F62]">Fresh & Citrus Bloom</p>
            <h2 className="mt-4 text-4xl font-serif font-bold text-[#2B1E19]">Welcome back</h2>
            <p className="mt-2 text-sm text-[#5B463F]">Sign in to continue your fragrance journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#5B463F]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-[#FFD29D] bg-[#FDFBF7] px-4 py-3 text-[#2B1E19] outline-none transition focus:border-[#FF7F62]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#5B463F]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-[#FFD29D] bg-[#FDFBF7] px-4 py-3 text-[#2B1E19] outline-none transition focus:border-[#FF7F62]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 text-sm font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#5B463F]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#FF7F62] hover:text-[#FF4F3E]">
              Create one now.
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
