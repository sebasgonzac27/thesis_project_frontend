import { PostList } from '@/components'
import { RootLayout } from '@/layouts'

export default function PostPage() {
  return (
    <RootLayout title='Publicaciones' withBreadcrumb>
      <PostList />
    </RootLayout>
  )
}
