import { NextResponse } from 'next/server'
import { conectarDB } from '@/lib/db'
import { logError } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const docente_id = searchParams.get('docente_id')

    // if (!docente_id) {
    //   return NextResponse.json({ error: 'ID do docente não fornecido' }, { status: 400 })
    // }

    const conn = await conectarDB()
    const [rows] = await conn.execute('SELECT * FROM cargo WHERE docente_id = ? ORDER BY data_inicio DESC', [
      docente_id,
    ])

    await conn.end()

    return NextResponse.json(rows)
  } catch (error) {
    logError('Erro ao buscar cargos', error)
    return NextResponse.json({ error: 'Erro ao buscar cargos' }, { status: 500 })
  }
}
