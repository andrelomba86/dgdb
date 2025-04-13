// 'use client'
import DocentePage from './clientSidePage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const idString = (await params).id
  const id = parseInt(idString)

  return <DocentePage idDocente={id} />
}
