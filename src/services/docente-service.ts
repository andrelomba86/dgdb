import type { Prisma } from '@prisma/client'

import { ConflictError, NotFoundError } from '@/lib/errors'
import {
  normalizeBankCode,
  normalizeCompactValue,
  normalizeDocumentValue,
  normalizeEmail,
  normalizeOptionalText,
  normalizeText,
} from '@/lib/normalizers'
import { docenteRepository, type DocenteRepository } from '@/repositories/docente-repository'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import type { CreateDocenteInput, DocenteListInput, UpdateDocenteInput } from '@/validators/docente'

type NormalizedCreateDocenteInput = CreateDocenteInput
type NormalizedUpdateDocenteInput = UpdateDocenteInput

const uniqueBy = <T>(items: T[], getKey: (item: T) => string, message: string) => {
  const seen = new Set<string>()

  for (const item of items) {
    const key = getKey(item)
    if (seen.has(key)) {
      throw new ConflictError(message)
    }

    seen.add(key)
  }
}

export class DocenteService {
  constructor(private readonly repository: DocenteRepository = docenteRepository) {}

  private toDateOrUndefined(value: unknown): Date | undefined {
    if (value == null || value === '') {
      return undefined
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? undefined : parsed
    }

    return undefined
  }

  async list(filters: DocenteListInput): Promise<DocenteListResult> {
    return this.repository.list({
      ...filters,
      nome: filters.nome?.trim() || undefined,
    })
  }

  async getById(id: number): Promise<DocenteAggregate> {
    const docente = await this.repository.findById(id)

    if (!docente) {
      throw new NotFoundError('Docente não encontrado.')
    }

    return docente
  }

  async listAllForExport(filters: DocenteListInput): Promise<DocenteAggregate[]> {
    return this.repository.listAll(
      {
        nome: filters.nome?.trim() || undefined,
        ativo: filters.ativo,
      },
      filters.sortBy,
      filters.sortOrder,
    )
  }

  async create(input: CreateDocenteInput): Promise<DocenteAggregate> {
    const normalizedInput = this.normalizeCreateInput(input)
    await this.ensureUniqueDocente(normalizedInput.matricula, normalizedInput.email)
    this.ensureUniqueCollections(normalizedInput)

    return this.repository.create(this.buildCreatePayload(normalizedInput))
  }

  async update(input: UpdateDocenteInput): Promise<DocenteAggregate> {
    await this.getById(input.id)

    const normalizedInput = this.normalizeUpdateInput(input)
    await this.ensureUniqueDocente(normalizedInput.matricula, normalizedInput.email, input.id)
    this.ensureUniqueCollections(normalizedInput)

    return this.repository.update(input.id, this.buildUpdatePayload(normalizedInput))
  }

  async delete(id: number): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }

  private async ensureUniqueDocente(matricula: string | null, email: string | null, ignoreId?: number) {
    const conflict = await this.repository.findConflict({
      matricula,
      email,
      ignoreId,
    })

    if (!conflict) {
      return
    }

    if (conflict.matricula === matricula) {
      throw new ConflictError('Já existe um docente com esta matrícula.')
    }

    throw new ConflictError('Já existe um docente com este e-mail.')
  }

  private ensureUniqueCollections(input: NormalizedCreateDocenteInput | NormalizedUpdateDocenteInput) {
    uniqueBy(
      input.telefones ?? [],
      telefone => normalizeCompactValue(String(telefone.telefone)),
      'Há telefones duplicados no cadastro informado.',
    )

    uniqueBy(
      input.documentos ?? [],
      documento =>
        `${normalizeText(String(documento.tipo)).toUpperCase()}:${normalizeDocumentValue(String(documento.documento))}`,
      'Há documentos duplicados no cadastro informado.',
    )

    uniqueBy(
      input.contasBancarias ?? [],
      conta =>
        `${normalizeBankCode(String(conta.banco))}:${normalizeCompactValue(String(conta.agencia))}:${normalizeCompactValue(String(conta.conta))}`,
      'Há contas bancárias duplicadas no cadastro informado.',
    )
  }

  private normalizeCreateInput(input: CreateDocenteInput): NormalizedCreateDocenteInput {
    return {
      ...input,
      nome: normalizeText(String(input.nome)),
      endereco: normalizeOptionalText(input.endereco ? String(input.endereco) : undefined),
      matricula: input.matricula ? normalizeCompactValue(String(input.matricula)) : null,
      email: normalizeEmail(input.email ? String(input.email) : undefined),
      regimeJuridico: normalizeOptionalText(input.regimeJuridico ? String(input.regimeJuridico) : undefined),
      regimeTrabalho: normalizeOptionalText(input.regimeTrabalho ? String(input.regimeTrabalho) : undefined),
      cargos: (input.cargos ?? []).map(cargo => ({
        ...cargo,
        descricao: normalizeText(String(cargo.descricao)),
        funcao: normalizeOptionalText(cargo.funcao ? String(cargo.funcao) : undefined),
        referencia: normalizeOptionalText(cargo.referencia ? String(cargo.referencia) : undefined),
      })),
      telefones: (input.telefones ?? []).map((telefone: any) => ({
        ...telefone,
        telefone: normalizeCompactValue(String(telefone.telefone)),
        tipo: normalizeText(String(telefone.tipo)),
      })),
      documentos: (input.documentos ?? []).map(documento => ({
        ...documento,
        tipo: normalizeText(String(documento.tipo)),
        documento: normalizeDocumentValue(String(documento.documento)),
      })),
      contasBancarias: (input.contasBancarias ?? []).map(conta => ({
        ...conta,
        banco: normalizeBankCode(String(conta.banco)),
        agencia: normalizeCompactValue(String(conta.agencia)),
        conta: normalizeCompactValue(String(conta.conta)),
      })),
    }
  }

  private normalizeUpdateInput(input: UpdateDocenteInput): NormalizedUpdateDocenteInput {
    return {
      ...input,
      nome: normalizeText(String(input.nome)),
      endereco: normalizeOptionalText(input.endereco ? String(input.endereco) : undefined),
      matricula: input.matricula ? normalizeCompactValue(String(input.matricula)) : null,
      email: input.email ? normalizeEmail(String(input.email)) : null,
      regimeJuridico: normalizeOptionalText(input.regimeJuridico ? String(input.regimeJuridico) : undefined),
      regimeTrabalho: normalizeOptionalText(input.regimeTrabalho ? String(input.regimeTrabalho) : undefined),
      cargos: (input.cargos ?? []).map(cargo => ({
        ...cargo,
        descricao: normalizeText(String(cargo.descricao)),
        funcao: normalizeOptionalText(cargo.funcao ? String(cargo.funcao) : undefined),
        referencia: normalizeOptionalText(cargo.referencia ? String(cargo.referencia) : undefined),
      })),
      telefones: (input.telefones ?? []).map((telefone: any) => ({
        ...telefone,
        telefone: normalizeCompactValue(String(telefone.telefone)),
        tipo: normalizeText(String(telefone.tipo)),
      })),
      documentos: (input.documentos ?? []).map(documento => ({
        ...documento,
        tipo: normalizeText(String(documento.tipo)),
        documento: normalizeDocumentValue(String(documento.documento)),
      })),
      contasBancarias: (input.contasBancarias ?? []).map(conta => ({
        ...conta,
        banco: normalizeBankCode(String(conta.banco)),
        agencia: normalizeCompactValue(String(conta.agencia)),
        conta: normalizeCompactValue(String(conta.conta)),
      })),
    }
  }

  private buildCreatePayload(input: CreateDocenteInput): Prisma.DocenteCreateInput {
    return {
      nome: String(input.nome),
      endereco: input.endereco ? String(input.endereco) : undefined,
      dataNascimento: this.toDateOrUndefined(input.dataNascimento),
      matricula: input.matricula ? String(input.matricula) : undefined,
      email: input.email ? String(input.email) : undefined,
      dataAdmissao: this.toDateOrUndefined(input.dataAdmissao),
      regimeJuridico: input.regimeJuridico ? String(input.regimeJuridico) : undefined,
      regimeTrabalho: input.regimeTrabalho ? String(input.regimeTrabalho) : undefined,
      regimeDataAplicacao: this.toDateOrUndefined(input.regimeDataAplicacao),
      ativo: typeof input.ativo === 'boolean' ? input.ativo : undefined,
      cargos: {
        create: (input.cargos ?? []).map(cargo => ({
          descricao: String(cargo.descricao),
          funcao: cargo.funcao ? String(cargo.funcao) : undefined,
          dataInicio: this.toDateOrUndefined(cargo.dataInicio),
          referencia: cargo.referencia ? String(cargo.referencia) : undefined,
        })),
      },
      telefones: {
        create: (input.telefones ?? []).map(telefone => ({
          telefone: String(telefone.telefone),
          tipo: String(telefone.tipo),
        })),
      },
      documentos: {
        create: (input.documentos ?? []).map(documento => ({
          tipo: String(documento.tipo),
          documento: String(documento.documento),
        })),
      },
      contasBancarias: {
        create: (input.contasBancarias ?? []).map(conta => ({
          banco: String(conta.banco),
          agencia: String(conta.agencia),
          conta: String(conta.conta),
        })),
      },
    }
  }

  private buildUpdatePayload(input: UpdateDocenteInput): Prisma.DocenteUpdateInput {
    return {
      nome: String(input.nome),
      endereco: input.endereco ? String(input.endereco) : undefined,
      dataNascimento: this.toDateOrUndefined(input.dataNascimento),
      matricula: input.matricula ? String(input.matricula) : undefined,
      email: input.email ? String(input.email) : undefined,
      dataAdmissao: this.toDateOrUndefined(input.dataAdmissao),
      regimeJuridico: input.regimeJuridico ? String(input.regimeJuridico) : undefined,
      regimeTrabalho: input.regimeTrabalho ? String(input.regimeTrabalho) : undefined,
      regimeDataAplicacao: this.toDateOrUndefined(input.regimeDataAplicacao),
      ativo: typeof input.ativo === 'boolean' ? input.ativo : undefined,
      cargos: {
        deleteMany: {},
        create: (input.cargos ?? []).map(cargo => ({
          descricao: String(cargo.descricao),
          funcao: cargo.funcao ? String(cargo.funcao) : undefined,
          dataInicio: this.toDateOrUndefined(cargo.dataInicio),
          referencia: cargo.referencia ? String(cargo.referencia) : undefined,
        })),
      },
      telefones: {
        deleteMany: {},
        create: (input.telefones ?? []).map(telefone => ({
          telefone: String(telefone.telefone),
          tipo: String(telefone.tipo),
        })),
      },
      documentos: {
        deleteMany: {},
        create: (input.documentos ?? []).map(documento => ({
          tipo: String(documento.tipo),
          documento: String(documento.documento),
        })),
      },
      contasBancarias: {
        deleteMany: {},
        create: (input.contasBancarias ?? []).map(conta => ({
          banco: String(conta.banco),
          agencia: String(conta.agencia),
          conta: String(conta.conta),
        })),
      },
    }
  }
}

export const docenteService = new DocenteService()
