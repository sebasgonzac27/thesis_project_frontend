import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Feedback, FeedbackAnswer } from '@/models'
import { api, getParams } from '@/utils'


export async function getFeedbacks(inputParams: Partial<RequestParams> = {}): Promise<Response<Feedback[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/feedbacks${queryString}`)
  return data
}

export async function getFeedback(id: number): Promise<Feedback> {
  const { data } = await api.get(`/feedbacks/${id}`)
  return data
}

export async function createFeedback(feedback: Partial<Feedback>): Promise<Response<Feedback>> {
  const { data } = await api.post('/feedbacks', feedback)
  return data
}

export async function updateFeedback(id: number, feedback: Partial<Feedback>): Promise<Response<Feedback>> {
  const { data } = await api.put(`/feedbacks/${id}`, feedback)
  return data
}

export async function deleteFeedback(id: number): Promise<Response<void>> {
  const { data } = await api.delete(`/feedbacks/${id}`)
  return data
}


export async function getFeedbackAnswers(inputParams: Partial<RequestParams> = {}): Promise<Response<FeedbackAnswer[]>> {
  const queryString = getParams(inputParams)
  const { data } = await api.get(`/feedback_answers${queryString}`)
  return data
}

export async function getFeedbackAnswer(id: number): Promise<FeedbackAnswer> {
  const { data } = await api.get(`/feedback_answers/${id}`)
  return data
}

export async function createFeedbackAnswer(feedback_answer: Partial<FeedbackAnswer>): Promise<Response<FeedbackAnswer>> {
  const { data } = await api.post('/feedback_answers', feedback_answer)
  return data
}

export async function updateFeedbackAnswer(id: number, feedback_answer: Partial<FeedbackAnswer>): Promise<Response<FeedbackAnswer>> {
  const { data } = await api.put(`/feedback_answers/${id}`, feedback_answer)
  return data
}

export async function deleteFeedbackAnswer(id: number): Promise<Response<void>> {
  const { data } = await api.delete(`/feedback_answers/${id}`)
  return data
}
