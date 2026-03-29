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

  async list(filters: DocenteListInput): Promise<DocenteListResult> {
    return this.repository.list({
      ...filters,
      nome: filters.nome?.trim() || undefined,
      matricula: filters.matricula?.trim() || undefined,
      email: filters.email?.trim().toLowerCase() || undefined,
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
        matricula: filters.matricula?.trim() || undefined,
        email: filters.email?.trim().toLowerCase() || undefined,
        dataAdmissaoInicio: filters.dataAdmissaoInicio,
        dataAdmissaoFim: filters.dataAdmissaoFim,
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

  private async ensureUniqueDocente(matricula: string, email: string, excludeId?: number) {
    const conflict = await this.repository.findConflict({
      matricula,
      email,
      excludeId,
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
      input.telefones,
      telefone => normalizeCompactValue(telefone.telefone),
      'Há telefones duplicados no cadastro informado.',
    )

    uniqueBy(
      input.documentos,
      documento =>
        `${normalizeText(documento.tipo).toUpperCase()}:${normalizeDocumentValue(documento.documento)}`,
      'Há documentos duplicados no cadastro informado.',
    )

    uniqueBy(
      input.contasBancarias,
      conta =>
        `${normalizeBankCode(conta.banco)}:${normalizeCompactValue(conta.agencia)}:${normalizeCompactValue(conta.conta)}`,
      'Há contas bancárias duplicadas no cadastro informado.',
    )
  }

  private normalizeCreateInput(input: CreateDocenteInput): NormalizedCreateDocenteInput {
    return {
      ...input,
      nome: normalizeText(input.nome),
      endereco: normalizeOptionalText(input.endereco),
      matricula: normalizeCompactValue(input.matricula),
      email: normalizeEmail(input.email),
      regimeJuridico: normalizeOptionalText(input.regimeJuridico),
      regimeTrabalho: normalizeOptionalText(input.regimeTrabalho),
      cargos: input.cargos.map(cargo => ({
        ...cargo,
        descricao: normalizeText(cargo.descricao),
        funcao: normalizeOptionalText(cargo.funcao),
        referencia: normalizeOptionalText(cargo.referencia),
      })),
      telefones: input.telefones.map((telefone: any) => ({
        ...telefone,
        telefone: normalizeCompactValue(telefone.telefone as string),
        tipo: normalizeText(telefone.tipo as string),
      })),
      documentos: input.documentos.map(documento => ({
        ...documento,
        tipo: normalizeText(documento.tipo),
        documento: normalizeDocumentValue(documento.documento),
      })),
      contasBancarias: input.contasBancarias.map(conta => ({
        ...conta,
        banco: normalizeBankCode(conta.banco),
        agencia: normalizeCompactValue(conta.agencia),
        conta: normalizeCompactValue(conta.conta),
      })),
    }
  }

  private normalizeUpdateInput(input: UpdateDocenteInput): NormalizedUpdateDocenteInput {
    return {
      ...input,
      nome: normalizeText(input.nome),
      endereco: normalizeOptionalText(input.endereco),
      matricula: normalizeCompactValue(input.matricula),
      email: normalizeEmail(input.email),
      regimeJuridico: normalizeOptionalText(input.regimeJuridico),
      regimeTrabalho: normalizeOptionalText(input.regimeTrabalho),
      cargos: input.cargos.map(cargo => ({
        ...cargo,
        descricao: normalizeText(cargo.descricao),
        funcao: normalizeOptionalText(cargo.funcao),
        referencia: normalizeOptionalText(cargo.referencia),
      })),
      telefones: input.telefones.map((telefone: any) => ({
        ...telefone,
        telefone: normalizeCompactValue(telefone.telefone as string),
        tipo: normalizeText(telefone.tipo as string),
      })),
      documentos: input.documentos.map(documento => ({
        ...documento,
        tipo: normalizeText(documento.tipo),
        documento: normalizeDocumentValue(documento.documento),
      })),
      contasBancarias: input.contasBancarias.map(conta => ({
        ...conta,
        banco: normalizeBankCode(conta.banco),
        agencia: normalizeCompactValue(conta.agencia),
        conta: normalizeCompactValue(conta.conta),
      })),
    }
  }

  private buildCreatePayload(input: CreateDocenteInput): Prisma.DocenteCreateInput {
    return {
      nome: input.nome,
      endereco: input.endereco,
      dataNascimento: input.dataNascimento,
      matricula: input.matricula,
      email: input.email,
      dataAdmissao: input.dataAdmissao,
      regimeJuridico: input.regimeJuridico,
      regimeTrabalho: input.regimeTrabalho,
      regimeDataAplicacao: input.regimeDataAplicacao,
      cargos: {
        create: input.cargos.map(cargo => ({
          descricao: cargo.descricao,
          funcao: cargo.funcao,
          dataInicio: cargo.dataInicio,
          referencia: cargo.referencia,
        })),
      },
      telefones: {
        create: input.telefones.map(telefone => ({
          telefone: telefone.telefone,
          tipo: telefone.tipo,
        })),
      },
      documentos: {
        create: input.documentos.map(documento => ({
          tipo: documento.tipo,
          documento: documento.documento,
        })),
      },
      contasBancarias: {
        create: input.contasBancarias.map(conta => ({
          banco: conta.banco,
          agencia: conta.agencia,
          conta: conta.conta,
        })),
      },
    }
  }

  private buildUpdatePayload(input: UpdateDocenteInput): Prisma.DocenteUpdateInput {
    return {
      nome: input.nome,
      endereco: input.endereco,
      dataNascimento: input.dataNascimento,
      matricula: input.matricula,
      email: input.email,
      dataAdmissao: input.dataAdmissao,
      regimeJuridico: input.regimeJuridico,
      regimeTrabalho: input.regimeTrabalho,
      regimeDataAplicacao: input.regimeDataAplicacao,
      cargos: {
        deleteMany: {},
        create: input.cargos.map(cargo => ({
          descricao: cargo.descricao,
          funcao: cargo.funcao,
          dataInicio: cargo.dataInicio,
          referencia: cargo.referencia,
        })),
      },
      telefones: {
        deleteMany: {},
        create: input.telefones.map((telefone: any) => ({
          telefone: telefone.telefone as string,
          tipo: telefone.tipo as string,
        })),
      },
      documentos: {
        deleteMany: {},
        create: input.documentos.map(documento => ({
          tipo: documento.tipo,
          documento: documento.documento,
        })),
      },
      contasBancarias: {
        deleteMany: {},
        create: input.contasBancarias.map(conta => ({
          banco: conta.banco,
          agencia: conta.agencia,
          conta: conta.conta,
        })),
      },
    }
  }
}

export const docenteService = new DocenteService()
