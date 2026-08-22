import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)

    const { data: profile } = await supabase.from('profiles').select('is_active').eq('id', data.user.id).single()
    if (!profile?.is_active) return alert('Your ₦2000 payment is not yet verified. Contact admin.')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <Link to="/signup" className="text-sm text-blue-500 mt-2 block">No account? Signup</Link>
      </form>
    </div>
  )
}
