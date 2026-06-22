import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReservationService } from '../services/reservation.service';

@Controller('admin/v1/reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const [items, total] = await this.reservationService.findMany(
      Number(page),
      Number(limit),
      status,
      date,
    );
    return ApiResponse.ok(items, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ApiResponse.ok(await this.reservationService.findById(id));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: ReservationStatus,
  ) {
    const reservation = await this.reservationService.updateStatus(id, status);
    return ApiResponse.ok(reservation);
  }
}
