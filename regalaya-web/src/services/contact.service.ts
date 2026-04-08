import { http } from '@/lib/api'
import type {
  Contact,
  ContactDetail,
  CreateContactRequest,
  UpdateContactRequest,
  CreateSpecialDateRequest,
  UpdateSpecialDateRequest,
  SpecialDate,
  ImportContactEntry,
  ImportReport,
} from '@/types/user'

export const contactService = {
  getAll: (search?: string) => {
    const params = search ? { search } : undefined
    return http.get<Contact[]>('/contacts', params)
  },

  getById: (id: string) =>
    http.get<ContactDetail>(`/contacts/${id}`),

  create: (data: CreateContactRequest) =>
    http.post<Contact>('/contacts', data),

  update: (id: string, data: UpdateContactRequest) =>
    http.put<Contact>(`/contacts/${id}`, data),

  delete: (id: string) =>
    http.delete(`/contacts/${id}`),

  importContacts: (contacts: ImportContactEntry[]) =>
    http.post<ImportReport>('/contacts/import', { contacts }),

  addSpecialDate: (contactId: string, data: CreateSpecialDateRequest) =>
    http.post<SpecialDate>(`/contacts/${contactId}/special-dates`, data),

  updateSpecialDate: (contactId: string, dateId: string, data: UpdateSpecialDateRequest) =>
    http.put<SpecialDate>(`/contacts/${contactId}/special-dates/${dateId}`, data),

  deleteSpecialDate: (contactId: string, dateId: string) =>
    http.delete(`/contacts/${contactId}/special-dates/${dateId}`),
}
