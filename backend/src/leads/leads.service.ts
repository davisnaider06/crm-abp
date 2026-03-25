import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessScopeService } from '../common/access-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  findAll(user: User) {
    return this.prismaService.lead.findMany({
      where: this.accessScopeService.leadWhere(user),
      include: {
        customer: true,
        store: true,
        attendant: true,
        team: true,
        negotiations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createLeadDto: CreateLeadDto, currentUser: User) {
    const lead = await this.prismaService.lead.create({
      data: {
        ...createLeadDto,
        attendantId: createLeadDto.attendantId ?? currentUser.id,
        status: createLeadDto.status ?? 'NEW',
        importance: createLeadDto.importance ?? 'WARM',
      },
    });

    await this.prismaService.operationLog.create({
      data: {
        action: 'CREATE',
        entity: 'lead',
        entityId: lead.id,
        description: `Lead ${lead.title} created`,
        userId: currentUser.id,
      },
    });

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, user?: User) {
    const updated = await this.prismaService.lead.update({
      where: { id },
      data: updateLeadDto,
    });

    if (user) {
      await this.prismaService.operationLog.create({
        data: {
          action: 'UPDATE',
          entity: 'lead',
          entityId: id,
          description: `Lead ${updated.title} updated`,
          userId: user.id,
        },
      });
    }

    return updated;
  }
}
