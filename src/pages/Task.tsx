import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TaskCard from '../components/TaskCard'

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    supabase.from('tasks').select('*').gt('deadline', new Date().toISOString()).then(({ data }) => setTasks(data || []))
  }, [])
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Available Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2">{tasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
    </div>
  )
}
