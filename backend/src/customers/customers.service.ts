import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(createCustomerDto: CreateCustomerDto) {
    return this.prismaService.customer.create({
      data: createCustomerDto,
    });
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.prismaService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }
}
