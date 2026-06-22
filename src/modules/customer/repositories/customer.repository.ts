import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByPsid(facebookPsid: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { facebookPsid } });
  }

  upsertByPsid(
    facebookPsid: string,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    return this.prisma.customer.upsert({
      where: { facebookPsid },
      create: { ...(data as Prisma.CustomerCreateInput), facebookPsid },
      update: data,
    });
  }

  update(id: string, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return this.prisma.customer.update({ where: { id }, data });
  }
}
