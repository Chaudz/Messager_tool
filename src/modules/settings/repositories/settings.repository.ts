import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const settings = await this.prisma.restaurantSettings.findFirst();
    if (!settings) {
      throw new Error('Restaurant settings not found. Run seed first.');
    }
    return settings;
  }

  update(id: string, data: Prisma.RestaurantSettingsUpdateInput) {
    return this.prisma.restaurantSettings.update({ where: { id }, data });
  }
}
