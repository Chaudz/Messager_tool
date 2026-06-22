import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiLogRepository } from '../repositories/ai-log.repository';

@Controller('admin/v1/ai-logs')
@UseGuards(JwtAuthGuard)
export class AiLogController {
  constructor(private readonly aiLogRepo: AiLogRepository) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('conversationId') conversationId?: string,
  ) {
    const [items, total] = await this.aiLogRepo.findMany(
      Number(page),
      Number(limit),
      conversationId,
    );
    return ApiResponse.ok(items, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  }

  @Get('stats')
  async stats() {
    const stats = await this.aiLogRepo.getStats();
    return ApiResponse.ok(stats);
  }
}
