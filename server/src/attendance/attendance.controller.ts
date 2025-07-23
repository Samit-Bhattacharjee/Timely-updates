import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Request() req) {
    return this.attendanceService.checkIn(req.user.userId);
  }

  @Post('check-out')
  async checkOut(@Request() req) {
    return this.attendanceService.checkOut(req.user.userId);
  }

  @Get('daily')
  async getDailyAttendance() {
    return this.attendanceService.getDailyAttendance();
  }
}
