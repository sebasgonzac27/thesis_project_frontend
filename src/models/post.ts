import { UserWithProfile } from './user'

export enum ReactionType {
  Like = 'me gusta',
  Dislike = 'no me gusta',
}

export enum PostType {
  Unpublished = 'no publicado',
  Published = 'publicado',
}

export const tagColors: { [key: string]: string } = {
  Eventos: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  Mantenimiento: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  Equipamiento: 'bg-green-100 text-green-800 hover:bg-green-200',
  Rutas: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  Seguridad: 'bg-red-100 text-red-800 hover:bg-red-200',
  Recomendaciones: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  Novedades: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  Ofertas: 'bg-teal-100 text-teal-800 hover:bg-teal-200',
  Comunidad: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  Reglamento: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
}

export interface Tag {
  id?: number
  name: string
}

export interface Post {
  id?: number
  title: string
  content: string
  status: PostType
  thumbnail: string | null
  tags: Tag[]
  author_id: number
  created_at: Date
}
export type PostWithDetails = Omit<Post, 'author_id'> & {
  author: UserWithProfile
}

export interface Comment {
  id?: number
  content: string
  is_flagged: boolean
  author_id: number
  post_id: number
  parent_id: number | null
  created_at: Date
}
export type CommentWithDetails = Omit<Comment, 'author_id' | 'post_id' | 'parent_id'> & {
  author: UserWithProfile
  post: PostWithDetails
  parent: CommentWithDetails | null
}

export interface Reaction {
  id?: number
  type: ReactionType
  author_id: number
  comment_id: number
}
export type ReactionWithDetails = Omit<Reaction, 'author_id' | 'comment_id'> & {
  author: UserWithProfile
  comment: CommentWithDetails
}
