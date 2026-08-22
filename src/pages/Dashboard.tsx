import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) navigate('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user?.id).single()
      if (!prof?.is_active) { alert('Account not activated'); navigate('/login') }
      setProfile(prof)
    })
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>{profile?.email}</p>
      {profile?.email === ADMIN_EMAIL && <button onClick={() => navigate('/admin')} className="mt-2 bg-purple-600 text-white px-4 py-2 rounded">Admin Panel</button>}
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <p className="text-gray-500">Your Balance</p>
        <p className="text-2xl font-bold">₦{profile?.balance || 0}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate('/tasks')} className="bg-green-600 text-white px-4 py-2 rounded">View Tasks</button>
        <button onClick={() => navigate('/wallet')} className="bg-orange-600 text-white px-4 py-2 rounded">Wallet</button>
      </div>
    </div>
  )
}
