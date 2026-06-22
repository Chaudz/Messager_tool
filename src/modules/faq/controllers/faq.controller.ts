import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FaqCategory } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FaqService } from '../services/faq.service';
import { CreateFaqDto, UpdateFaqDto } from '../dtos/faq.dto';

@Controller('admin/v1/faq')
@UseGuards(JwtAuthGuard)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async list() {
    return ApiResponse.ok(await this.faqService.findAll());
  }

  @Post()
  async create(@Body() dto: CreateFaqDto) {
    const item = await this.faqService.create({
      ...dto,
      category: dto.category as FaqCategory,
    });
    return ApiResponse.ok(item);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    const item = await this.faqService.update(id, dto);
    return ApiResponse.ok(item);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.faqService.delete(id);
    return ApiResponse.ok({ deleted: true });
  }
}
