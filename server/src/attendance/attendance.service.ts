import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async checkIn(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingAttendance) {
      throw new Error('Already checked in today');
    }

    const newAttendance = await this.prisma.attendance.create({
      data: {
        userId,
        checkInTime: new Date(),
      },
      include: {
        user: true,
      },
    });

    await this.mailService.sendMail(
     'samit.prsl@gmail.com',
      'Check-in Confirmation',
      `<h1>Hi ${newAttendance.user.name || newAttendance.user.email},</h1><p>You have successfully checked in at ${newAttendance.checkInTime.toLocaleString()}.</p>`,
    );

    return newAttendance;
  }

  async checkOut(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        checkOutTime: null,
      },
    });

    if (!attendance) {
      throw new NotFoundException('No active check-in found for today');
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: new Date(),
      },
      include: {
        user: true,
      },
    });

    await this.mailService.sendMail(
      'samit.prsl@gmail.com',
      'Check-out Confirmation',
      `<h1>Hi,</h1><p>${updatedAttendance.user.name || updatedAttendance.user.email} has successfully checked out at ${updatedAttendance.checkOutTime!.toLocaleString()}.</p>`,
    );

    return updatedAttendance;
  }

  async getDailyAttendance() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: { user: true },
    });
  }
}
