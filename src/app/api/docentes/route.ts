import { NextResponse } from 'next/server'
import { conectarDB } from '@/lib/db'
import { DadosDocente, Docente } from '@/types/docente'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [rows]: any[] = await conn.execute('SELECT * FROM docente WHERE id = ?', [id])
    await conn.end()

    if (!rows[0]) {
      return NextResponse.json({ error: 'Docente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Erro ao buscar docente:', error)
    return NextResponse.json({ error: 'Erro ao buscar docente' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const docente: DadosDocente = await request.json()

    // Validações básicas
    if (!docente.nome || !docente.email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    const conn = await conectarDB()
    const [result] = await conn.execute(
      `INSERT INTO docente (
        nome, data_nascimento, endereco, matricula, email, 
        telefones, cpf, rg, data_admissao, regime_juridico, 
        regime_trabalho, regime_data_aplicacao, banco, agencia, conta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        docente.nome,
        docente.data_nascimento,
        docente.endereco,
        docente.matricula,
        docente.email,
        JSON.stringify(docente.telefones),
        docente.data_admissao,
        docente.regime_juridico,
        docente.regime_trabalho,
        docente.regime_data_aplicacao,
        docente.banco,
        docente.agencia,
        docente.conta,
      ]
    )

    await conn.end()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao criar docente:', error)
    return NextResponse.json({ error: 'Erro ao criar docente' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const docente: DadosDocente = await request.json()
    const conn = await conectarDB()
    const [result] = await conn.execute(
      'UPDATE docente SET nome = ?, endereco = ?, data_nascimento = ?, email = ?, data_admissao = ?, regime_juridico = ?, regime_trabalho = ?, regime_data_aplicacao = ? WHERE id = ?',
      [
        docente.nome,
        docente.endereco,
        docente.data_nascimento,
        docente.email,
        docente.data_admissao,
        docente.regime_juridico,
        docente.regime_trabalho,
        docente.regime_data_aplicacao,
        docente.id,
      ]
    )
    await conn.end()
    return NextResponse.json(result)
  } catch (error) {
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
    return NextResponse.json({ error: 'Erro ao excluir docente' }, { status: 500 })
  }
}
