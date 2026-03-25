import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessScopeService } from '../common/access-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';

@Injectable()
export class NegotiationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  findAll(user: User) {
    return this.prismaService.negotiation.findMany({
      where: this.accessScopeService.negotiationWhere(user),
      include: {
        lead: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createNegotiationDto: CreateNegotiationDto) {
    const activeNegotiation = await this.prismaService.negotiation.findFirst({
      where: {
        leadId: createNegotiationDto.leadId,
        isActive: true,
      },
    });

    if (activeNegotiation) {
      throw new BadRequestException('Lead already has an active negotiation');
    }

    return this.prismaService.$transaction(async (tx) => {
      const negotiation = await tx.negotiation.create({
        data: {
          leadId: createNegotiationDto.leadId,
          stage: createNegotiationDto.stage ?? 'FIRST_CONTACT',
          status: createNegotiationDto.status ?? 'OPEN',
          closingReason: createNegotiationDto.closingReason,
        },
      });

      await tx.negotiationStageHistory.create({
        data: {
          leadId: createNegotiationDto.leadId,
          toStage: negotiation.stage,
        },
      });

      await tx.negotiationStatusHistory.create({
        data: {
          leadId: createNegotiationDto.leadId,
          toStatus: negotiation.status,
        },
      });

      return negotiation;
    });
  }

  async update(id: string, updateNegotiationDto: UpdateNegotiationDto) {
    const current = await this.prismaService.negotiation.findUnique({
      where: { id },
    });

    if (!current) {
      throw new BadRequestException('Negotiation not found');
    }

    return this.prismaService.$transaction(async (tx) => {
      const updated = await tx.negotiation.update({
        where: { id },
        data: {
          ...updateNegotiationDto,
          isActive:
            updateNegotiationDto.status && updateNegotiationDto.status !== 'OPEN'
              ? false
              : current.isActive,
          closedAt:
            updateNegotiationDto.status && updateNegotiationDto.status !== 'OPEN'
              ? new Date()
              : current.closedAt,
        },
      });

      if (updateNegotiationDto.stage && updateNegotiationDto.stage !== current.stage) {
        await tx.negotiationStageHistory.create({
          data: {
            leadId: current.leadId,
            fromStage: current.stage,
            toStage: updateNegotiationDto.stage,
          },
        });
      }

      if (
        updateNegotiationDto.status &&
        updateNegotiationDto.status !== current.status
      ) {
        await tx.negotiationStatusHistory.create({
          data: {
            leadId: current.leadId,
            fromStatus: current.status,
            toStatus: updateNegotiationDto.status,
          },
        });
      }

      return updated;
    });
  }
}
