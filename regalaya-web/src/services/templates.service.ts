import { http } from '@/lib/api'

export type CommunicationType = 'EMAIL' | 'WHATSAPP'

export interface Template {
  id: string
  name: string
  type: CommunicationType
  subject: string | null
  content: string
  variables: string | null
  description: string | null
  isActive: boolean
  version: number
  category: string | null
  createdAt: string
  updatedAt: string
}

export interface TemplateRequest {
  name: string
  type: CommunicationType
  subject?: string
  content: string
  variables?: string
  description?: string
  isActive?: boolean
  category?: string
}

export const templatesService = {
  async findAll(type?: CommunicationType, search?: string): Promise<Template[]> {
    const params: Record<string, string> = {}
    if (type) params.type = type
    if (search) params.search = search
    return http.get<Template[]>('/v1/admin/templates', params)
  },

  async findById(id: string): Promise<Template> {
    return http.get<Template>(`/v1/admin/templates/${id}`)
  },

  async create(data: TemplateRequest): Promise<Template> {
    return http.post<Template>('/v1/admin/templates', data)
  },

  async update(id: string, data: TemplateRequest): Promise<Template> {
    return http.put<Template>(`/v1/admin/templates/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return http.delete(`/v1/admin/templates/${id}`)
  },

  async getVersions(id: string): Promise<Template[]> {
    return http.get<Template[]>(`/v1/admin/templates/${id}/versions`)
  },

  async exportTemplates(): Promise<string> {
    return http.get<string>('/v1/admin/templates/export')
  },

  async importTemplates(jsonContent: string): Promise<Template[]> {
    return http.post<Template[]>('/v1/admin/templates/import', { jsonContent })
  },
}
