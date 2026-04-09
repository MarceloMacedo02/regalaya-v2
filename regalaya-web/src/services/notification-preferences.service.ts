import { http } from "@/lib/api"

export interface NotificationPreferences {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  marketingEnabled: boolean;
  transactionalEnabled: boolean;
}

export const notificationPreferencesService = {
  async getPreferences(): Promise<NotificationPreferences> {
    return await http.get<NotificationPreferences>("/account/preferences/notifications");
  },

  async updatePreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return await http.put<NotificationPreferences>("/account/preferences/notifications", data);
  }
}
