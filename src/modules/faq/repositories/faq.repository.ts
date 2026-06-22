import { Injectable } from '@nestjs/common';
import { FaqCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class FaqRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }],
    });
  }

  findByCategory(category: FaqCategory) {
    return this.prisma.faqItem.findFirst({
      where: { category, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findById(id: string) {
    return this.prisma.faqItem.findUnique({ where: { id } });
  }

  create(data: Prisma.FaqItemCreateInput) {
    return this.prisma.faqItem.create({ data });
  }

  update(id: string, data: Prisma.FaqItemUpdateInput) {
    return this.prisma.faqItem.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.faqItem.delete({ where: { id } });
  }
}
