import { RequestParams } from '@/interfaces/request-params'
import { Response } from '@/interfaces/response'
import { Company, Agreement, AgreementWithDetails, Team } from '@/models'
import { api, getParams } from '@/utils'


export const companyService = {
  getCompanies: async (inputParams: Partial<RequestParams> = {}): Promise<Response<Company[]>> => {
    const queryString = getParams(inputParams)
    const { data } = await api.get(`/companies${queryString}`)
    return data
  },

  getCompany: async (id: number): Promise<Company> => {
    const { data } = await api.get(`/companies/${id}`)
    return data
  },

  createCompany: async (company: Partial<Company>): Promise<Response<Company>> => {
    const { data } = await api.post('/companies', company)
    return data
  },

  updateCompany: async (id: number, company: Partial<Company>): Promise<Response<Company>> => {
    const { data } = await api.put(`/companies/${id}`, company)
    return data
  },

  deleteCompany: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/companies/${id}`)
    return data
  }
}

export const agreementService = {
  getAgreements: async (params: Partial<RequestParams> = {}): Promise<Response<Agreement[]>> => {
    const queryString = getParams(params)
    const { data } = await api.get(`/agreements${queryString}`)
    return data
  },

  getAgreement: async (id: number): Promise<AgreementWithDetails> => {
    const { data } = await api.get(`/agreements/${id}`)
    return data
  },

  createAgreement: async (agreement: Partial<Agreement>): Promise<Response<Agreement>> => {
    const { data } = await api.post('/agreements', agreement)
    return data
  },

  updateAgreement: async (id: number, agreement: Partial<Agreement>): Promise<Response<Agreement>> => {
    const { data } = await api.put(`/agreements/${id}`, agreement)
    return data
  },

  deleteAgreement: async (id: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/agreements/${id}`)
    return data
  },

  getAgreementTeams: async (id: number): Promise<Response<Team[]>> => {
    const { data } = await api.get(`/agreements/${id}/teams`)
    return data
  },

  addTeamToAgreement: async (agreementId: number, teamId: number): Promise<Response<void>> => {
    const { data } = await api.post(`/agreements/${agreementId}/teams`, { team_id: teamId })
    return data
  },

  removeTeamFromAgreement: async (agreementId: number, teamId: number): Promise<Response<void>> => {
    const { data } = await api.delete(`/agreements/${agreementId}/teams/${teamId}`)
    return data
  }
}
