import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingsDto } from '../dtos/settings.dto';

@Controller('admin/v1/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get() {
    const settings = await this.settingsService.get();
    const { facebookPageAccessToken: _token, ...safe } = settings;
    return ApiResponse.ok(safe);
  }

  @Put()
  async update(@Body() dto: UpdateSettingsDto) {
    const current = await this.settingsService.get();
    const settings = await this.settingsService.update(current.id, dto);
    const { facebookPageAccessToken: _token, ...safe } = settings;
    return ApiResponse.ok(safe);
  }

  @Patch('ai-toggle')
  async toggleAi(@Body('aiEnabled') aiEnabled: boolean) {
    const settings = await this.settingsService.toggleAi(aiEnabled);
    return ApiResponse.ok({ aiEnabled: settings.aiEnabled });
  }
}
