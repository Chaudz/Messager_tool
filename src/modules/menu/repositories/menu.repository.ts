import { Injectable } from '@nestjs/common';
import { MenuCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.menuItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findById(id: string) {
    return this.prisma.menuItem.findUnique({ where: { id } });
  }

  search(keyword?: string, category?: MenuCategory) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(keyword
          ? {
              OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      take: 20,
    });
  }

  create(data: Prisma.MenuItemCreateInput) {
    return this.prisma.menuItem.create({ data });
  }

  update(id: string, data: Prisma.MenuItemUpdateInput) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
