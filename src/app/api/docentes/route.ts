import { NextResponse } from 'next/server'
import { conectarDB } from '@/lib/db'
import { OkPacketParams } from 'mysql2'
import { FieldPacket, RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const conn = await conectarDB()
    const sql =
      'SELECT * FROM docente d \
                JOIN contrato c \
                ON d.id=c.docente_id \
                JOIN conta_bancaria cb \
                ON d.id=cb.docente_id \
                WHERE id = ?'
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(sql, [id])
    await conn.end()

    if (!rows.length) return NextResponse.json({ error: 'Docente não encontrado' }, { status: 404 })

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Erro ao buscar docente:', error)
    return NextResponse.json({ error: 'Erro ao buscar docente' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      nome,
      data_nascimento,
      endereco,
      matricula,
      email,
      data_admissao,
      regime_trabalho,
      regime_juridico,
      regime_data_aplicacao,
      banco,
      agencia,
      conta,
    } = data

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute(
      `INSERT INTO docente (
        nome,
        data_nascimento,
        endereco,
        matricula,
        email,
        data_admissao,
        regime_trabalho,
        regime_juridico,
        regime_data_aplicacao,
        banco,
        agencia,
        conta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        data_nascimento || null,
        endereco || null,
        matricula || null,
        email || null,
        data_admissao || null,
        regime_trabalho || null,
        regime_juridico || null,
        regime_data_aplicacao || null,
        banco || null,
        agencia || null,
        conta || null,
      ]
    )
    await conn.end()

    return NextResponse.json({ ...result, id: (result as OkPacketParams).insertId })
  } catch (error) {
    console.error('Erro ao criar docente:', error)
    return NextResponse.json({ error: 'Erro ao criar docente' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const {
      id,
      nome,
      data_nascimento,
      endereco,
      matricula,
      email,
      data_admissao,
      regime_trabalho,
      regime_juridico,
      regime_data_aplicacao,
      banco,
      agencia,
      conta,
    } = data

    if (!id || !nome) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute(
      `UPDATE docente SET 
        nome = ?,
        data_nascimento = ?,
        endereco = ?,
        matricula = ?,
        email = ?,
        data_admissao = ?,
        regime_trabalho = ?,
        regime_juridico = ?,
        regime_data_aplicacao = ?,
        banco = ?,
        agencia = ?,
        conta = ?
      WHERE id = ?`,
      [
        nome,
        data_nascimento,
        endereco,
        matricula,
        email,
        data_admissao,
        regime_trabalho,
        regime_juridico,
        regime_data_aplicacao,
        banco,
        agencia,
        conta,
        id,
      ]
    )
    await conn.end()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao atualizar docente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar docente' }, { status: 500 })
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
    const [result] = await conn.execute('DELETE FROM docente WHERE id = ?', [id])
    await conn.end()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao excluir docente:', error)
    return NextResponse.json({ error: 'Erro ao excluir docente' }, { status: 500 })
  }
}
