import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e: any) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return alert(error.message)

    await supabase.from('profiles').insert([{ id: data.user?.id, email, phone, balance: 0, is_active: false }])
    await supabase.from('payments').insert([{ user_email: email, amount: 2000, status: 'pending' }])
    alert('Account created! Pay ₦2000 to 9135054964 Moniepoint - Tunmise Mubarak Seriki. Wait for admin to activate.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-600">Join Tumnishe TaskEarn</h1>
        <div className="bg-yellow-100 p-3 rounded mb-4 text-sm">
          <p className="font-bold">Pay ₦2,000 Activation Fee</p>
          <p><b>Account:</b> 9135054964</p><p><b>Bank:</b> Moniepoint</p><p><b>Name:</b> Tunmise Mubarak Seriki</p>
        </div>
        <input type="email" placeholder="Gmail" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create Account</button>
      </form>
    </div>
  )
}
