import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'

export default function SubmitTask() {
  const { taskId } = useParams()
  const [screenshot, setScreenshot] = useState<any>(null)
  const [doc, setDoc] = useState<any>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('submissions').insert([{ task_id: taskId, user_id: user?.id, screenshot_url: screenshot?.name, doc_url: doc?.name, status: 'pending' }])
    alert('Submitted for review'); navigate('/tasks')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Submit Proof</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
        <p>Upload Screenshot</p><input type="file" onChange={e => setScreenshot(e.target.files?.[0])} className="mb-3" required />
        <p>Upload PDF/DOC</p><input type="file" onChange={e => setDoc(e.target.files?.[0])} className="mb-3" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Task</button>
      </form>
    </div>
  )
}
