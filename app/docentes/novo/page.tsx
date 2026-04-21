import { CreateDocenteForm } from '@/components/create-docente-form'
import { DocentePageShell } from '@/components/docente-page-shell'
import { requireAuthenticatedUser } from '@/lib/auth-guard'
import { docenteService } from '@/services/docente-service'

export default async function NovoDocentePage() {
  await requireAuthenticatedUser()
  const [telefoneTiposSugeridos, progressaoFuncoesSugeridas, progressaoReferenciasSugeridas] =
    await Promise.all([
      docenteService.listTelefoneTiposSugeridos(),
      docenteService.listProgressaoFuncoesSugeridas(),
      docenteService.listProgressaoReferenciasSugeridas(),
    ])

  return (
    <DocentePageShell badge="Novo cadastro" title="Cadastrar docente">
      <CreateDocenteForm
        relatedInitialData={{
          progressoes: [],
          telefones: [],
          documentos: [],
          contasBancarias: [],
          progressaoFuncoesSugeridas,
          progressaoReferenciasSugeridas,
          telefoneTiposSugeridos,
          documentoTiposSugeridos: [],
        }}
      />
    </DocentePageShell>
  )
}
