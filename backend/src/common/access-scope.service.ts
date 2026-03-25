import { Injectable } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';

@Injectable()
export class AccessScopeService {
  leadWhere(user: User): Prisma.LeadWhereInput {
    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.GENERAL_MANAGER:
        return {};
      case UserRole.MANAGER:
        return {
          OR: [{ teamId: user.teamId ?? undefined }, { attendantId: user.id }],
        };
      case UserRole.ATTENDANT:
      default:
        return { attendantId: user.id };
    }
  }

  customerWhere(user: User): Prisma.CustomerWhereInput {
    const leadWhere = this.leadWhere(user);
    return Object.keys(leadWhere).length === 0
      ? {}
      : {
          leads: {
            some: leadWhere,
          },
        };
  }

  negotiationWhere(user: User): Prisma.NegotiationWhereInput {
    const leadWhere = this.leadWhere(user);
    return Object.keys(leadWhere).length === 0
      ? {}
      : {
          lead: leadWhere,
        };
  }
}
