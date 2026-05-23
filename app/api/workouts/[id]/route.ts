import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type P = { params: Promise<{ id: string }> }

export async function DELETE(_: Request, { params }: P) {
  const { id } = await params  // ← await 필요!
  await prisma.workout.delete({
    where: { id: Number(id) }
  })
  return NextResponse.json({ ok: true })
}

export async function PUT(req:Request,{params} : P) {
    const{id} = await params
    const body = await req.json()

    const updated = await prisma.workout.update({
        where:{id : Number(id)},
        data:{
            name: body.name,
            sets: body.sets,
            reps: body.reps
        }
    })
    return NextResponse.json(updated)
}