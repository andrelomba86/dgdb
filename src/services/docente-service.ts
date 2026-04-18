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

  private toDateOrNull(value: unknown): Date | null {
    if (value == null || value === '') {
      return null
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    return null
  }

  private toNullableString(value: unknown): string | null {
    if (value == null || value === '') {
      return null
    }

    return String(value)
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
    const normalizedInput = this.normalizeInput(input)
    await this.ensureUniqueDocente(normalizedInput.matricula, normalizedInput.email)
    this.ensureUniqueCollections(normalizedInput)

    return this.repository.create(this.buildCreatePayload(normalizedInput))
  }

  async update(input: UpdateDocenteInput): Promise<DocenteAggregate> {
    await this.getById(input.id)

    const normalizedInput = this.normalizeInput(input)
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

  private ensureUniqueCollections(input: CreateDocenteInput | UpdateDocenteInput) {
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

  private normalizeInput<T extends CreateDocenteInput | UpdateDocenteInput>(input: T): T {
    return {
      ...input,
      nome: normalizeText(String(input.nome)),
      endereco: normalizeOptionalText(input.endereco ? String(input.endereco) : undefined),
      matricula: input.matricula ? normalizeCompactValue(String(input.matricula)) : null,
      email: normalizeEmail(input.email ? String(input.email) : undefined),
      regimeJuridico: normalizeOptionalText(input.regimeJuridico ? String(input.regimeJuridico) : undefined),
      regimeTrabalho: normalizeOptionalText(input.regimeTrabalho ? String(input.regimeTrabalho) : undefined),
      progressoes: (input.progressoes ?? []).map(progressao => this.normalizeProgressaoInput(progressao)),
      telefones: (input.telefones ?? []).map(telefone => this.normalizeTelefoneInput(telefone)),
      documentos: (input.documentos ?? []).map(documento => this.normalizeDocumentoInput(documento)),
      contasBancarias: (input.contasBancarias ?? []).map(conta => this.normalizeContaBancariaInput(conta)),
    } as T
  }

  private normalizeProgressaoInput<
    T extends { descricao: unknown; funcao?: unknown | null; referencia?: unknown | null },
  >(progressao: T) {
    return {
      ...progressao,
      descricao: normalizeText(String(progressao.descricao)),
      funcao: normalizeOptionalText(progressao.funcao ? String(progressao.funcao) : undefined),
      referencia: normalizeOptionalText(progressao.referencia ? String(progressao.referencia) : undefined),
    }
  }

  private normalizeTelefoneInput<T extends { telefone: unknown; tipo: unknown }>(telefone: T) {
    return {
      ...telefone,
      telefone: normalizeCompactValue(String(telefone.telefone)),
      tipo: normalizeText(String(telefone.tipo)),
    }
  }

  private normalizeDocumentoInput<T extends { tipo: unknown; documento: unknown }>(documento: T) {
    return {
      ...documento,
      tipo: normalizeText(String(documento.tipo)),
      documento: normalizeDocumentValue(String(documento.documento)),
    }
  }

  private normalizeContaBancariaInput<T extends { banco: unknown; agencia: unknown; conta: unknown }>(
    conta: T,
  ) {
    return {
      ...conta,
      banco: normalizeBankCode(String(conta.banco)),
      agencia: normalizeCompactValue(String(conta.agencia)),
      conta: normalizeCompactValue(String(conta.conta)),
    }
  }

  private buildDocenteBaseFields(input: CreateDocenteInput | UpdateDocenteInput) {
    return {
      nome: String(input.nome),
      endereco: this.toNullableString(input.endereco),
      dataNascimento: this.toDateOrNull(input.dataNascimento),
      matricula: this.toNullableString(input.matricula),
      email: this.toNullableString(input.email),
      dataAdmissao: this.toDateOrNull(input.dataAdmissao),
      regimeJuridico: this.toNullableString(input.regimeJuridico),
      regimeTrabalho: this.toNullableString(input.regimeTrabalho),
      regimeDataAplicacao: this.toDateOrNull(input.regimeDataAplicacao),
      ativo: typeof input.ativo === 'boolean' ? input.ativo : undefined,
    }
  }

  private mapProgressaoFields(progressao: {
    descricao: unknown
    funcao?: unknown | null
    dataInicio?: unknown
    referencia?: unknown | null
  }) {
    return {
      descricao: String(progressao.descricao),
      funcao: this.toNullableString(progressao.funcao),
      dataInicio: this.toDateOrNull(progressao.dataInicio),
      referencia: this.toNullableString(progressao.referencia),
    }
  }

  private mapTelefoneFields(telefone: { telefone: unknown; tipo: unknown }) {
    return {
      telefone: String(telefone.telefone),
      tipo: String(telefone.tipo),
    }
  }

  private mapDocumentoFields(documento: { tipo: unknown; documento: unknown }) {
    return {
      tipo: String(documento.tipo),
      documento: String(documento.documento),
    }
  }

  private mapContaBancariaFields(conta: { banco: unknown; agencia: unknown; conta: unknown }) {
    return {
      banco: String(conta.banco),
      agencia: String(conta.agencia),
      conta: String(conta.conta),
    }
  }

  private buildRelationUpsert<T extends { id?: number | null }, R>(items: T[], mapFields: (item: T) => R) {
    const existing = items.filter(i => i.id != null)
    const fresh = items.filter(i => i.id == null)

    return {
      deleteMany: { id: { notIn: existing.map(i => i.id!) } },
      update: existing.map(i => ({ where: { id: i.id! }, data: mapFields(i) })),
      create: fresh.map(mapFields),
    }
  }

  private buildCreatePayload(input: CreateDocenteInput): Prisma.DocenteCreateInput {
    return {
      ...this.buildDocenteBaseFields(input),
      progressoes: {
        create: (input.progressoes ?? []).map(progressao => this.mapProgressaoFields(progressao)),
      },
      telefones: {
        create: (input.telefones ?? []).map(telefone => this.mapTelefoneFields(telefone)),
      },
      documentos: {
        create: (input.documentos ?? []).map(documento => this.mapDocumentoFields(documento)),
      },
      contasBancarias: {
        create: (input.contasBancarias ?? []).map(conta => this.mapContaBancariaFields(conta)),
      },
    }
  }

  private buildUpdatePayload(input: UpdateDocenteInput): Prisma.DocenteUpdateInput {
    return {
      ...this.buildDocenteBaseFields(input),
      progressoes: this.buildRelationUpsert(input.progressoes ?? [], progressao =>
        this.mapProgressaoFields(progressao),
      ),
      telefones: this.buildRelationUpsert(input.telefones ?? [], telefone =>
        this.mapTelefoneFields(telefone),
      ),
      documentos: this.buildRelationUpsert(input.documentos ?? [], documento =>
        this.mapDocumentoFields(documento),
      ),
      contasBancarias: this.buildRelationUpsert(input.contasBancarias ?? [], conta =>
        this.mapContaBancariaFields(conta),
      ),
    }
  }
}

export const docenteService = new DocenteService()
