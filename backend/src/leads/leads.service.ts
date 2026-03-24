import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.lead.findMany({
      include: {
        customer: true,
        store: true,
        attendant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(createLeadDto: CreateLeadDto, currentUser: User) {
    return this.prismaService.lead.create({
      data: {
        ...createLeadDto,
        attendantId: createLeadDto.attendantId ?? currentUser.id,
        status: createLeadDto.status ?? 'NEW',
        importance: createLeadDto.importance ?? 'WARM',
      },
    });
  }

  update(id: string, updateLeadDto: UpdateLeadDto) {
    return this.prismaService.lead.update({
      where: { id },
      data: updateLeadDto,
    });
  }
}
