import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'نام کاربری و رمز عبور الزامی است' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { username } })

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور اشتباه است' },
        { status: 401 }
      )
    }

    // Set a simple session cookie (base64 encoded user info)
    const sessionData = Buffer.from(
      JSON.stringify({ id: user.id, username: user.username, name: user.name, role: user.role })
    ).toString('base64')

    const cookieStore = await cookies()
    cookieStore.set('session', sessionData, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    })
  } catch {
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    )
  }
}
