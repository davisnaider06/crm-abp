import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrmService } from './crm.service';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  getDashboard() {
    return this.crmService.getDashboard();
  }

  @Get('leads')
  getLeads() {
    return this.crmService.getLeads();
  }

  @Get('customers')
  getCustomers() {
    return this.crmService.getCustomers();
  }

  @Get('negotiations')
  getNegotiations() {
    return this.crmService.getNegotiations();
  }
}
