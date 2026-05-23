import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'

export async function GET() {
    const data = await prisma.workout.findMany()
    return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()  // 프론트에서 보낸 데이터
  const created = await prisma.workout.create({
    data : {
        name : body.name,
        sets : body.sets,
        reps : body.reps
    }
  })
  return NextResponse.json(created, { status: 201 })
} 