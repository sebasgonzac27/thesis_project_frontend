import { UserWithProfile } from './user'

export enum FeedbackType {
  QUESTION = 'pregunta',
  SUGGESTION = 'sugerencia',
  COMPLAINT = 'queja',
}

export enum FeedbackStatus {
  PENDING = 'pendiente',
  UNDER_REVIEW = 'en revisión',
  RESOLVED = 'resuelto',
}

export const FeedbackTypeColors = {
  pregunta: { bg: 'bg-blue-100', text: 'text-blue-800' },
  sugerencia: { bg: 'bg-green-100', text: 'text-green-800' },
  queja: { bg: 'bg-pink-100', text: 'text-pink-800' },
}

export const FeedbackStatusColors = {
  pendiente: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'en revisión': { bg: 'bg-green-100', text: 'text-green-800' },
  resuelto: { bg: 'bg-pink-100', text: 'text-pink-800' },
}

export interface Feedback {
  id?: number
  type: FeedbackType
  title: string
  content: string
  status: FeedbackStatus
  author_id: number
  created_at: Date
  updated_at: Date
}

export type FeedbackWithDetails = Omit<Feedback, 'author_id'> & {
  author: UserWithProfile
}

export interface FeedbackAnswer {
  id?: number
  content: string
  author_id: number
  feedback_id: number
  created_at: Date
  updated_at: Date
}

export type FeedbackAnswerWithDetails = Omit<FeedbackAnswer, 'author_id' | 'feedback_id'> & {
  author: UserWithProfile
  feedback: FeedbackWithDetails
}
