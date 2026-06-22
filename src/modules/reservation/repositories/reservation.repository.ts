import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ReservationCreateInput) {
    return this.prisma.reservation.create({ data });
  }

  findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { customer: true, conversation: true },
    });
  }

  findMany(params: {
    page: number;
    limit: number;
    status?: string;
    date?: string;
  }) {
    const where: Prisma.ReservationWhereInput = {};
    if (params.status) where.status = params.status as never;
    if (params.date) where.reservationDate = new Date(params.date);

    return this.prisma.$transaction([
      this.prisma.reservation.findMany({
        where,
        include: { customer: true },
        orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);
  }

  update(id: string, data: Prisma.ReservationUpdateInput) {
    return this.prisma.reservation.update({ where: { id }, data });
  }

  findActiveByCustomer(customerId: string) {
    return this.prisma.reservation.findFirst({
      where: {
        customerId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
