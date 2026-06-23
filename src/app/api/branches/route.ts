import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const branches = await db.branch.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ branches })
  } catch {
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    )
  }
}
