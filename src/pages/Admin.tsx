import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function Admin() {
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [title, setTitle] = useState(''); const [reward, setReward] = useState(''); const [max, setMax] = useState(''); const [deadline, setDeadline] = useState('')

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => setUsers(data || []))
    supabase.from('payments').select('*').then(({ data }) => setPayments(data || []))
    supabase.from('submissions').select('*').then(({ data }) => setSubmissions(data || []))
    supabase.from('withdrawals').select('*').then(({ data }) => setWithdrawals(data || []))
  }, [])

  const createTask = async () => {
    await supabase.from('tasks').insert([{ title, reward: Number(reward), max_users: Number(max), deadline, joined: 0 }])
    alert('Task Created')
  }

  const verifyPayment = async (paymentId: number, userEmail: string) => {
    await supabase.from('payments').update({status: 'verified'}).eq('id', paymentId)
    await supabase.from('profiles').update({is_active: true, balance: 500}).eq('email', userEmail)
    alert('User activated + ₦500 bonus')
  }

  const approveTask = async (id: number, userId: string, reward: number) => {
    await supabase.from('submissions').update({ status: 'approved' }).eq('id', id)
    await supabase.rpc('add_balance', { user_id: userId, amount: reward })
  }

  const approveWithdrawal = async (id: number) => {
    await supabase.from('withdrawals').update({ status: 'paid' }).eq('id', id)
    alert('Mark as PAID. Go send the money manually to their account.')
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700">Admin Panel</h1>
      <p>Total Users: {users.length}</p>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-bold">Create Task</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <input type="number" placeholder="Reward ₦" value={reward} onChange={e => setReward(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <input type="number" placeholder="Max Users" value={max} onChange={e => setMax(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <button onClick={createTask} className="mt-2 bg-purple-600 text-white px-4 py-2 rounded">Create Task</button>
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-bold">Pending ₦2000 Payments</h2>
        {payments.filter(p => p.status === 'pending').map(p => (
          <div key={p.id} className="border p-2 mt-2 flex justify-between">
            <p>{p.user_email} - ₦{p.amount}</p>
            <button onClick={() => verifyPayment(p.id, p.user_email)} className="bg-green-500 text-white px-2">Verify & Activate +₦500</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-bold">Pending Task Submissions</h2>
        {submissions.filter(s => s.status === 'pending').map(s => (
          <div key={s.id} className="border p-2 mt-2">
            <p>User: {s.user_id} | Task: {s.task_id}</p>
            <button onClick={() => approveTask(s.id, s.user_id, 100)} className="bg-green-500 text-white px-2 mr-2">Approve</button>
            <button onClick={() => supabase.from('submissions').update({status: 'rejected'}).eq('id', s.id)} className="bg-red-500 text-white px-2">Reject</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-bold">Pending Withdrawals</h2>
        {withdrawals.filter(w => w.status === 'pending').map(w => (
          <div key={w.id} className="border p-2 mt-2 flex justify-between">
            <p>User: {w.user_id} | Amount: ₦{w.amount} | To: {w.account}</p>
            <button onClick={() => approveWithdrawal(w.id)} className="bg-orange-500 text-white px-2">Mark as Paid</button>
          </div>
        ))}
      </div>
    </div>
  )
}
