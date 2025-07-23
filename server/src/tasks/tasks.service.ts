import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private mailService: MailService,
    private attendanceService: AttendanceService,
  ) {}

  @Cron('0 10-23 * * *', { timeZone: 'Asia/Kolkata' })
  async handleCron() {
    this.logger.debug('Called when the current second is 45');
    const dailyAttendance = await this.attendanceService.getDailyAttendance();

    let emailContent = '<h1>Daily Attendance Report</h1>';
    if (dailyAttendance.length === 0) {
      emailContent += '<p>No attendance recorded today.</p>';
    } else {
      emailContent += '<table border="1" style="width:100%; border-collapse: collapse;">';
      emailContent += '<tr><th>Employee Name</th><th>Check-in Time</th><th>Check-out Time</th></tr>';
      dailyAttendance.forEach((attendance) => {
        emailContent += `<tr>
          <td>${attendance.user.name || attendance.user.email}</td>
          <td>${attendance.checkInTime.toLocaleTimeString()}</td>
          <td>${attendance.checkOutTime ? attendance.checkOutTime.toLocaleTimeString() : 'N/A'}</td>
        </tr>`;
      });
      emailContent += '</table>';
    }

    // Replace with the manager's email address
    await this.mailService.sendMail(
      'samit.prsl@gmail.com',
      'Daily Attendance Report',
      emailContent,
    );
    this.logger.log('Daily attendance report sent to manager.');
  }
}
