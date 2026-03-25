import { Controller, Get, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrmService } from './crm.service';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: User) {
    return this.crmService.getDashboard(user);
  }

  @Get('leads')
  getLeads(@CurrentUser() user: User) {
    return this.crmService.getLeads(user);
  }

  @Get('customers')
  getCustomers(@CurrentUser() user: User) {
    return this.crmService.getCustomers(user);
  }

  @Get('negotiations')
  getNegotiations(@CurrentUser() user: User) {
    return this.crmService.getNegotiations(user);
  }
}
