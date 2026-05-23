import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async enqueueForStop(
    organizationId: string,
    deliveryId: string,
    type: NotificationType,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id: deliveryId, organizationId },
    });
    if (!delivery) return;

    const channel = delivery.phone
      ? NotificationChannel.SMS
      : NotificationChannel.EMAIL;

    const notification = await this.prisma.customerNotification.create({
      data: {
        organizationId,
        deliveryId,
        channel,
        type,
        status: NotificationStatus.PENDING,
        payload: payload as object,
      },
    });

    await this.processStub(notification.id);
  }

  private async processStub(notificationId: string): Promise<void> {
    try {
      await this.prisma.customerNotification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          payload: {
            stub: true,
            message: 'Notification logged (no external provider configured)',
          },
        },
      });
    } catch (err) {
      this.logger.warn(`Failed to process notification ${notificationId}`, err);
      await this.prisma.customerNotification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
          errorMessage:
            err instanceof Error ? err.message : 'Processing failed',
        },
      });
    }
  }

  async listForOrganization(
    organizationId: string,
    date?: string,
  ) {
    const where: { organizationId: string; createdAt?: { gte: Date; lt: Date } } =
      { organizationId };

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      where.createdAt = { gte: start, lt: end };
    }

    return this.prisma.customerNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        delivery: {
          select: {
            id: true,
            customerName: true,
            phone: true,
            address: true,
          },
        },
      },
    });
  }
}
