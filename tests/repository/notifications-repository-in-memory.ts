import { NotificationsRepository } from "../../src/domain/notification/application/repositories/notifications-repository";
import {
  ListNotificationsResponseDTO,
  ListNotificationsParams,
  UpdateNotificationData
} from "../../src/domain/notification/application/repositories/notifications-repository.types";
import { Notification } from "../../src/domain/notification/enterprise/entities/notification";
import { randomInt } from "node:crypto";

export class NotificationsRepositoryInMemory implements NotificationsRepository {
  notifications: Notification[] = [];

  async create(data: Notification): Promise<Notification> {
    data.id = data.id || randomInt(100);
    this.notifications.push(data);
    return data;
  }

  async findById(id: number): Promise<Notification | null> {
    const notification = await this.notifications.find(notification => notification.id === id);
    if (!notification) return null;
    return notification;
  }

  async findNotificationByTitle(title: string): Promise<Notification | null> {
    const notification = await this.notifications.find(notification => notification.title === title);
    if (!notification) return null;
    return notification;
  }

  async update(id: number, data: UpdateNotificationData): Promise<Notification> {
    const notificationIndex = this.notifications.findIndex(item => item.id === id);
    const notification = this.notifications[notificationIndex];
    if (data.content) notification.content = data.content;
    if (data.endDate) notification.endDate = data.endDate;
    if (data.startDate) notification.startDate = data.startDate;
    if (data.tier) notification.tier = data.tier;
    if (data.title) notification.title = data.title;
    if (data.status) notification.status = data.status;
    return notification;
  }

  async delete(id: number): Promise<void> {
    const notificationIndex = await this.notifications.findIndex(item => item.id === id);
    await this.notifications.splice(notificationIndex, 1);
  }

  async list(params: ListNotificationsParams): Promise<ListNotificationsResponseDTO> {
    const { page, limit, endDate, startDate, tier, title, status } = params;

    const listTier = tier ? tier.split(",").map(tier => parseInt(tier)) : [];
    const filteredNotifications = this.notifications
      .filter(notification => !title || notification.title.includes(title))
      .filter(notification => listTier.length === 0 || notification.tier.some(t => listTier.includes(t)))
      .filter(notification => !status || notification.status === status[0])
      .filter(notification => !startDate || (notification.startDate && notification.startDate >= startDate))
      .filter(notification => !endDate || (notification.endDate && notification.endDate <= endDate));

    const totalRecords = filteredNotifications.length;
    const notificationsList = filteredNotifications.slice((page - 1) * limit, page * limit);

    return {
      total: totalRecords,
      totalOfPages: Math.ceil(totalRecords / params.limit),
      list: notificationsList
    };
  }
}
