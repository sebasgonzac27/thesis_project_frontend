import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { PostWithDetails, Post, Tag, CommentWithDetails, Comment, ReactionWithDetails, Reaction } from '@/models'
import { api, getParams } from '@/utils'


export const postService = {
  getPosts: async (inputParams: Partial<RequestParams> = {}): Promise<Response<PostWithDetails[]>> => {
    const queryString = getParams(inputParams)
    const { data } = await api.get(`/posts${queryString}`)
    return data
  },

  getPost: async (id: number): Promise<PostWithDetails> => {
    const { data } = await api.get(`/posts/${id}`)
    return data
  },

  createPost: async (post: Partial<Post>): Promise<Response<PostWithDetails>> => {
    const { data } = await api.post('/posts', post)
    return data
  },

  updatePost: async (id: number, post: Partial<PostWithDetails>): Promise<Response<PostWithDetails>> => {
    const { data } = await api.put(`/posts/${id}`, post)
    return data
  },

  deletePost: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/posts/${id}?hard=true`)
    return data
  },

  getComments: async (id: number): Promise<Comment[]> => {
    const { data } = await api.get(`/posts/${id}/comments`)
    return data
  },

  uploadImage: async (file:any) => {
    const { data } = await api.post('/upload', file)
    return data
  },
}


export const tagService = {
  getTags: async (inputParams: Partial<RequestParams> = {}): Promise<Response<Tag[]>> => {
    const queryString = getParams(inputParams)
    const { data } = await api.get(`/tags${queryString}`)
    return data
  },

  getTag: async (id: number): Promise<Tag> => {
    const { data } = await api.get(`/tags/${id}`)
    return data
  },

  createTag: async (tag: Partial<Tag>): Promise<Response<Tag>> => {
    const { data } = await api.post('/tags', tag)
    return data
  },

  updateTag: async (id: number, tag: Partial<Tag>): Promise<Response<Tag>> => {
    const { data } = await api.put(`/tags/${id}`, tag)
    return data
  },

  deleteTag: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/tags/${id}`)
    return data
  }
}


export const commentService = {
  getComments: async (inputParams: Partial<RequestParams> = {}): Promise<Response<CommentWithDetails[]>> => {
    const queryString = getParams(inputParams)
    const { data } = await api.get(`/comments${queryString}`)
    return data
  },

  getComment: async (id: number): Promise<CommentWithDetails> => {
    const { data } = await api.get(`/comments/${id}`)
    return data
  },

  createComment: async (comment: Partial<Comment>): Promise<Response<CommentWithDetails>> => {
    const { data } = await api.post('/comments', comment)
    return data
  },

  updateComment: async (id: number, comment: Partial<CommentWithDetails>): Promise<Response<CommentWithDetails>> => {
    const { data } = await api.put(`/comments/${id}`, comment)
    return data
  },

  deleteComment: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/comments/${id}`)
    return data
  },

  getReplies: async (id: number): Promise<Response<CommentWithDetails[]>> => {
    const { data } = await api.get(`/comments/${id}/replies`)
    return data
  },

  getReactions: async (id: number): Promise<Response<ReactionWithDetails[]>> => {
    const { data } = await api.get(`/comments/${id}/reactions`)
    return data
  }
}


export const reactionService = {
  getReactions: async (inputParams: Partial<RequestParams> = {}): Promise<Response<ReactionWithDetails[]>> => {
    const queryString = getParams(inputParams)
    const { data } = await api.get(`/reactions${queryString}`)
    return data
  },

  getReaction: async (id: number): Promise<ReactionWithDetails> => {
    const { data } = await api.get(`/reactions/${id}`)
    return data
  },

  createReaction: async (reaction: Partial<Reaction>): Promise<Response<ReactionWithDetails>> => {
    const { data } = await api.post('/reactions', reaction)
    return data
  },

  updateReaction: async (id: number, reaction: Partial<ReactionWithDetails>): Promise<Response<ReactionWithDetails>> => {
    const { data } = await api.put(`/reactions/${id}`, reaction)
    return data
  },

  deleteReaction: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/reactions/${id}?hard=true`)
    return data
  }
}
