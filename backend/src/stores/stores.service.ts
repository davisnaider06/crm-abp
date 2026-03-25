import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.store.findMany({
      orderBy: [{ city: 'asc' }, { name: 'asc' }],
    });
  }
}
