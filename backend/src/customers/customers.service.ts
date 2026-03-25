import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessScopeService } from '../common/access-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  findAll(user: User) {
    return this.prismaService.customer.findMany({
      where: this.accessScopeService.customerWhere(user),
      include: {
        leads: {
          include: {
            store: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createCustomerDto: CreateCustomerDto, user: User) {
    const customer = await this.prismaService.customer.create({
      data: createCustomerDto,
    });

    await this.prismaService.operationLog.create({
      data: {
        action: 'CREATE',
        entity: 'customer',
        entityId: customer.id,
        description: `Customer ${customer.name} created`,
        userId: user.id,
      },
    });

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user?: User) {
    const updated = await this.prismaService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    if (user) {
      await this.prismaService.operationLog.create({
        data: {
          action: 'UPDATE',
          entity: 'customer',
          entityId: id,
          description: `Customer ${updated.name} updated`,
          userId: user.id,
        },
      });
    }

    return updated;
  }
}
