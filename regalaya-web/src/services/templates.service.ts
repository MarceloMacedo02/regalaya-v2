import { http } from "@/lib/api"

export type CommunicationType = "EMAIL" | "WHATSAPP"

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

const BASE_PATH = "/admin/templates"

export const templatesService = {
  async findAll(type?: CommunicationType, search?: string): Promise<Template[]> {
    const params: Record<string, string> = {}
    if (type) params.type = type
    if (search) params.search = search
    return http.get<Template[]>(BASE_PATH, params)
  },

  async findById(id: string): Promise<Template> {
    return http.get<Template>(`${BASE_PATH}/${id}`)
  },

  async create(data: TemplateRequest): Promise<Template> {
    return http.post<Template>(BASE_PATH, data)
  },

  async update(id: string, data: TemplateRequest): Promise<Template> {
    return http.put<Template>(`${BASE_PATH}/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return http.delete(`${BASE_PATH}/${id}`)
  },

  async getVersions(id: string): Promise<Template[]> {
    return http.get<Template[]>(`${BASE_PATH}/${id}/versions`)
  },

  async exportTemplates(): Promise<string> {
    return http.get<string>(`${BASE_PATH}/export`)
  },

  async importTemplates(jsonContent: string): Promise<Template[]> {
    return http.post<Template[]>(`${BASE_PATH}/import`, { jsonContent })
  },
}
