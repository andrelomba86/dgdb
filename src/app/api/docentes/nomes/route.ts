import { NextResponse } from 'next/server'
import { conectarDB } from '@/lib/db'

export async function GET() {
  try {
    const conn = await conectarDB()
    const [rows] = await conn.execute('SELECT id, nome FROM docente ORDER BY nome')
    await conn.end()
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Erro ao buscar docentes:', error)
    return NextResponse.json({ error: 'Erro ao buscar docentes' }, { status: 500 })
  }
}
