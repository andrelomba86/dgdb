import { CreateDocenteForm } from '@/components/create-docente-form'
import { DocentePageShell } from '@/components/docente-page-shell'
import { requireAuthenticatedUser } from '@/lib/auth-guard'
import { docenteService } from '@/services/docente-service'

export default async function NovoDocentePage() {
  await requireAuthenticatedUser()
  const suggestedOptions = await docenteService.listSuggestedOptions()

  return (
    <DocentePageShell badge="Novo cadastro" title="Cadastrar docente">
      <CreateDocenteForm
        relatedInitialData={{
          progressoes: [],
          telefones: [],
          documentos: [],
          contasBancarias: [],
          suggestedOptions,
        }}
      />
    </DocentePageShell>
  )
}
