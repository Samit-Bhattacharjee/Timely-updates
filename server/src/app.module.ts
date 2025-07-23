import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule, UsersModule, AttendanceModule, MailModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
