import { Loader } from '@/components'

export default function LoaderSuspense() {
  return (
    <main className='w-full min-h-dvh grid place-items-center'>
      <Loader text='Cargando' />
    </main>
  )
}
