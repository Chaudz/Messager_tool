import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class CustomerRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByPsid(facebookPsid: string): Promise<Customer | null>;
    upsertByPsid(facebookPsid: string, data: Prisma.CustomerUpdateInput): Promise<Customer>;
    update(id: string, data: Prisma.CustomerUpdateInput): Promise<Customer>;
}
