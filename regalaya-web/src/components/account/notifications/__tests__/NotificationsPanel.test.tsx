import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { NotificationsPanel } from '../NotificationsPanel'
import { notificationService } from '@/services/notification.service'

const mockToast = jest.fn()

jest.mock('@/services/notification.service', () => ({
  notificationService: {
    getAll: jest.fn(),
    markAsRead: jest.fn(),
  },
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

describe('NotificationsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render empty state', async () => {
    notificationService.getAll.mockResolvedValue({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      empty: true,
      numberOfElements: 0,
    })

    render(<NotificationsPanel />)

    expect(await screen.findByText('Nenhuma notificação por aqui')).toBeInTheDocument()
  })

  it('should render notifications and mark one as read', async () => {
    notificationService.getAll.mockResolvedValue({
      content: [
        {
          id: '1',
          type: 'DATE_REMINDER_7D',
          status: 'SENT',
          title: 'Lembrete em 7 dias',
          message: 'Faltam 7 dias para o aniversário da Ana.',
          ctaLabel: 'Ver próximas ações',
          ctaUrl: '/account/notifications?contactId=1',
          contactName: 'Ana',
          specialDateType: 'BIRTHDAY',
          specialDateValue: '2026-04-15T00:00:00',
          scheduledAt: '2026-04-08T18:00:00',
          sentAt: '2026-04-08T18:01:00',
          readAt: null,
          read: false,
          retryCount: 0,
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
      empty: false,
      numberOfElements: 1,
    })
    notificationService.markAsRead.mockResolvedValue({
      id: '1',
      readAt: '2026-04-08T18:10:00',
    })

    render(<NotificationsPanel />)

    expect(await screen.findByText('Lembrete em 7 dias')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Marcar como lida' }))

    await waitFor(() => {
      expect(notificationService.markAsRead).toHaveBeenCalledWith('1')
      expect(mockToast).toHaveBeenCalled()
    })
  })
})
