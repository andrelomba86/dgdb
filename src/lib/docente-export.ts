import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import type { DocenteAggregate } from '@/types/docente'

type ExportPayload = {
  filename: string
  mimeType: string
  content: string
  encoding: 'utf-8' | 'base64'
}

const csvHeaders = [
  'ID',
  'Nome',
  'Matricula',
  'Email',
  'Endereco',
  'DataNascimento',
  'DataAdmissao',
  'RegimeJuridico',
  'RegimeTrabalho',
  'RegimeDataAplicacao',
  'Cargos',
  'Telefones',
  'Documentos',
  'ContasBancarias',
]

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
  }).format(new Date(value))
}

function escapeCsvValue(value: string) {
  const normalized = value.replaceAll('"', '""')
  return `"${normalized}"`
}

function compactRelationValues(docente: DocenteAggregate) {
  return {
    cargos: docente.cargos.map(cargo => cargo.descricao).join(' | '),
    telefones: docente.telefones.map(telefone => `${telefone.tipo}: ${telefone.telefone}`).join(' | '),
    documentos: docente.documentos.map(documento => `${documento.tipo}: ${documento.documento}`).join(' | '),
    contasBancarias: docente.contasBancarias
      .map(conta => `${conta.banco}/${conta.agencia}/${conta.conta}`)
      .join(' | '),
  }
}

export function buildDocentesCsvExport(docentes: DocenteAggregate[]): ExportPayload {
  const lines = [csvHeaders.join(',')]

  docentes.forEach(docente => {
    const relations = compactRelationValues(docente)

    lines.push(
      [
        String(docente.id),
        docente.nome,
        docente.matricula || '',
        docente.email || '',
        docente.endereco || '',
        formatDate(docente.dataNascimento),
        formatDate(docente.dataAdmissao),
        docente.regimeJuridico || '',
        docente.regimeTrabalho || '',
        formatDate(docente.regimeDataAplicacao),
        relations.cargos,
        relations.telefones,
        relations.documentos,
        relations.contasBancarias,
      ]
        .map(value => escapeCsvValue(value))
        .join(','),
    )
  })

  return {
    filename: `docentes-${new Date().toISOString().slice(0, 10)}.csv`,
    mimeType: 'text/csv;charset=utf-8',
    content: `\uFEFF${lines.join('\n')}`,
    encoding: 'utf-8',
  }
}

function splitText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return [text]
  }

  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    const candidate = currentLine ? `${currentLine} ${word}` : word

    if (candidate.length <= maxLength) {
      currentLine = candidate
      return
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    currentLine = word
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

async function buildPdfBytes(docentes: DocenteAggregate[]) {
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const margin = 40
  const pageWidth = 595
  const pageHeight = 842
  const headerColor = rgb(0.11, 0.3, 0.85)
  const textColor = rgb(0.1, 0.14, 0.2)
  let page = pdf.addPage([pageWidth, pageHeight])
  let cursorY = pageHeight - margin

  const ensureSpace = (requiredHeight: number) => {
    if (cursorY - requiredHeight >= margin) {
      return
    }

    page = pdf.addPage([pageWidth, pageHeight])
    cursorY = pageHeight - margin
  }

  const drawLine = (
    text: string,
    options?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> },
  ) => {
    const size = options?.size ?? 10
    ensureSpace(size + 6)
    page.drawText(text, {
      x: margin,
      y: cursorY,
      size,
      font: options?.bold ? boldFont : regularFont,
      color: options?.color ?? textColor,
    })
    cursorY -= size + 6
  }

  drawLine('Relatorio de docentes', { bold: true, size: 18, color: headerColor })
  drawLine(
    `Gerado em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`,
    {
      size: 10,
    },
  )
  cursorY -= 8

  docentes.forEach((docente, index) => {
    const relations = compactRelationValues(docente)
    const blockLines = [
      `Matricula: ${docente.matricula || '-'}`,
      `Email: ${docente.email || '-'}`,
      `Admissao: ${formatDate(docente.dataAdmissao)}`,
      `Nascimento: ${formatDate(docente.dataNascimento) || '-'}`,
      `Regime juridico: ${docente.regimeJuridico || '-'}`,
      `Regime trabalho: ${docente.regimeTrabalho || '-'}`,
      `Endereco: ${docente.endereco || '-'}`,
      `Cargos: ${relations.cargos || '-'}`,
      `Telefones: ${relations.telefones || '-'}`,
      `Documentos: ${relations.documentos || '-'}`,
      `Contas bancarias: ${relations.contasBancarias || '-'}`,
    ].flatMap(line => splitText(line, 92))

    ensureSpace(blockLines.length * 16 + 34)
    drawLine(`${index + 1}. ${docente.nome}`, { bold: true, size: 13, color: headerColor })
    blockLines.forEach(line => drawLine(line))
    cursorY -= 8
  })

  return pdf.save()
}

export async function buildDocentesPdfExport(docentes: DocenteAggregate[]): Promise<ExportPayload> {
  const bytes = await buildPdfBytes(docentes)

  return {
    filename: `docentes-${new Date().toISOString().slice(0, 10)}.pdf`,
    mimeType: 'application/pdf',
    content: Buffer.from(bytes).toString('base64'),
    encoding: 'base64',
  }
}

export type DocenteExportPayload = ExportPayload
