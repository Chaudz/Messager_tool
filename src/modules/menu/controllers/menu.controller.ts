import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MenuCategory } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MenuService } from '../services/menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dtos/menu.dto';

@Controller('admin/v1/menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async list() {
    return ApiResponse.ok(await this.menuService.findAll());
  }

  @Post()
  async create(@Body() dto: CreateMenuItemDto) {
    const item = await this.menuService.create({
      ...dto,
      price: dto.price,
      category: dto.category as MenuCategory,
    });
    return ApiResponse.ok(item);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    const item = await this.menuService.update(id, dto);
    return ApiResponse.ok(item);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.menuService.delete(id);
    return ApiResponse.ok({ deleted: true });
  }

  @Patch(':id/availability')
  async toggleAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    const item = await this.menuService.update(id, { isAvailable });
    return ApiResponse.ok(item);
  }
}
