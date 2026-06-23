import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (!session) {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    const user = JSON.parse(Buffer.from(session.value, 'base64').toString())
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'فقط مدیر دسترسی دارد' }, { status: 403 })
    }

    const { id } = await params
    const { targetSent } = await request.json()

    const branch = await db.branch.update({
      where: { id },
      data: { targetSent },
    })

    return NextResponse.json({ branch })
  } catch {
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    )
  }
}
