import { CreateDocenteForm } from '@/components/create-docente-form'
import { DocentePageShell } from '@/components/docente-page-shell'
import { requireAuthenticatedUser } from '@/lib/auth-guard'

export default async function NovoDocentePage() {
  await requireAuthenticatedUser()

  return (
    <DocentePageShell badge="Novo cadastro" title="Cadastrar docente">
      <CreateDocenteForm />
    </DocentePageShell>
  )
}
