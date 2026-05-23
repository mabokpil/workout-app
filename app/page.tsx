'use client'
import {useState,useEffect} from 'react'

interface Workout{
  sets:number
  id : number
  name:string
  reps:number
}

export default function Home(){
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId,setEditingId] = useState<number | null>(null)
  const [name,setName] = useState('')
  const [sets,setSets] = useState('')
  const [reps,setReps] = useState('')

  useEffect(()=> {
    fetch('/api/workouts')
    .then(res => res.json())
    .then(data => {
      setWorkouts(data)
      setLoading(false)
    })
  },[])

const handleSubmit = async () => {
  if(!name.trim()) return

  await fetch('/api/workouts',{
    method : 'POST',
    headers:{'Content-Type' : 'application/json'},
    body : JSON.stringify({
      name,
      sets:Number(sets),
      reps:Number((reps))
    })
  })
  setEditingId(null)
  setName('')
  setSets('')
  setReps('')

  fetch('/api/workouts')
  .then(res => res.json())
  .then(data => setWorkouts(data))

}

const handleDelete = async (id:number) => {
    await fetch(`/api/workouts/${id}`, {
      method : 'DELETE'
    })
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

const handleEdit = (w: Workout) => {
  setEditingId(w.id)
  setName(w.name)
  setSets(String(w.sets))
  setReps(String(w.reps))
}

const handleUpdate = async () => {
  if (!editingId) return

  await fetch(`/api/workouts/${editingId}`,{
    method: 'PUT',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify({
      name,
      sets: Number(sets),
      reps : Number(reps)
    })
  })
}

if (loading) return <p>로딩 중...</p>

return (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-2xl mx-auto px-6 py-12">
      
      {/* 헤더 */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <p className="text-xs tracking-widest text-teal-600 font-medium mb-2">WORKOUT RECORD</p>
        <h1 className="text-3xl font-light text-slate-800">운동 기록 관리</h1>
        <p className="text-sm text-slate-500 mt-2">매일의 운동을 체계적으로 기록하세요</p>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
        <p className="text-xs tracking-wider text-slate-400 font-medium mb-4">
          {editingId ? 'EDIT RECORD' : 'NEW RECORD'}
        </p>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="운동명"
            className="border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={sets}
              onChange={e => setSets(e.target.value)}
              placeholder="세트"
              className="border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
            />
            <input
              value={reps}
              onChange={e => setReps(e.target.value)}
              placeholder="반복"
              className="border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition"
            />
          </div>
        </div>
        <button
          onClick={editingId ? handleUpdate : handleSubmit}
          className="w-full bg-teal-700 text-white rounded-md py-3 text-sm font-medium hover:bg-teal-800 transition"
        >
          {editingId ? '수정 완료' : '기록 추가'}
        </button>
      </div>

      {/* 목록 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-wider text-slate-400 font-medium">RECORDS</p>
          <p className="text-xs text-slate-400">{workouts.length}건</p>
        </div>
        
        {workouts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <p className="text-sm text-slate-400">등록된 기록이 없습니다</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {workouts.map(w => (
              <li
                key={w.id}
                className="flex justify-between items-center bg-white border border-slate-200 rounded-lg px-5 py-4 hover:border-teal-300 transition"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{w.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{w.sets}세트 × {w.reps}회</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(w)}
                    className="text-xs text-slate-500 hover:text-teal-700 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-xs text-slate-500 hover:text-red-600 transition"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
)
}
