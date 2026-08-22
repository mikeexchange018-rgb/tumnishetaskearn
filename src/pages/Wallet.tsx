import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Wallet() {
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')

  const requestWithdraw = async () => {
    if (Number(amount) < 1000) return alert('Minimum withdrawal is ₦1000')
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('withdrawals').insert([{ user_id: user?.id, amount, account, status: 'pending' }])
    alert('Withdrawal request submitted')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-bold">Request Withdrawal</h2>
        <input type="number" placeholder="Amount min ₦1000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <input placeholder="Your Bank Account" value={account} onChange={e => setAccount(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <button onClick={requestWithdraw} className="mt-2 bg-orange-600 text-white px-4 py-2 rounded">Request</button>
      </div>
    </div>
  )
}
