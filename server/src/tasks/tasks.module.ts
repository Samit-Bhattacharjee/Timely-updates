import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MailModule } from '../mail/mail.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [MailModule, AttendanceModule],
  providers: [TasksService],
})
export class TasksModule {}
