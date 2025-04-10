import { NextResponse } from 'next/server'
import { conectarDB } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const docente_id = searchParams.get('docente_id')

    if (!docente_id) {
      return NextResponse.json({ error: 'ID do docente não fornecido' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [rows] = await conn.execute('SELECT * FROM telefone WHERE docente_id = ?', [docente_id])
    await conn.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Erro ao buscar telefones do docente:', error)
    return NextResponse.json({ error: 'Erro ao buscar telefones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { docente_id, telefone, tipo } = data

    if (!docente_id || !telefone || !tipo) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute(
      'INSERT INTO telefone (docente_id, telefone, tipo) VALUES (?, ?, ?)',
      [docente_id, telefone, tipo]
    )
    await conn.end()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao salvar telefone:', error)
    return NextResponse.json({ error: 'Erro ao salvar telefone' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, telefone, tipo } = data

    if (!id || !telefone || !tipo) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute('UPDATE telefone SET telefone = ?, tipo = ? WHERE id = ?', [
      telefone,
      tipo,
      id,
    ])
    await conn.end()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao atualizar telefone:', error)
    return NextResponse.json({ error: 'Erro ao atualizar telefone' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute('DELETE FROM telefone WHERE id = ?', [id])
    await conn.end()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao excluir telefone:', error)
    return NextResponse.json({ error: 'Erro ao excluir telefone' }, { status: 500 })
  }
}
