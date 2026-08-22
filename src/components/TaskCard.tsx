import { useNavigate } from 'react-router-dom'
export default function TaskCard({ task }: { task: any }) {
  const navigate = useNavigate()
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p>Earn: ₦{task.reward}</p>
      <p className="text-sm text-gray-500">Slots: {task.joined}/{task.max_users}</p>
      <p className="text-sm text-red-500">Deadline: {new Date(task.deadline).toLocaleString()}</p>
      <button onClick={() => navigate(`/submit/${task.id}`)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Submit Proof</button>
    </div>
  )
}
  
