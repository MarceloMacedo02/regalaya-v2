import { notificationService } from '../notification.service'
import { http } from '@/lib/api'

jest.mock('@/lib/api')

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load notifications with pagination and optional filters', async () => {
    const mockResponse = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      empty: true,
      numberOfElements: 0,
    }
    http.get.mockResolvedValue(mockResponse)

    const result = await notificationService.getAll({ page: 1, size: 10, status: 'SENT' })

    expect(result).toEqual(mockResponse)
    expect(http.get).toHaveBeenCalledWith('/notifications', {
      page: 1,
      size: 10,
      status: 'SENT',
      type: undefined,
    })
  })

  it('should mark notification as read', async () => {
    const mockResponse = { id: '1', readAt: '2026-04-08T18:00:00' }
    http.patch.mockResolvedValue(mockResponse)

    const result = await notificationService.markAsRead('1')

    expect(result).toEqual(mockResponse)
    expect(http.patch).toHaveBeenCalledWith('/notifications/1/read', {})
  })
})
