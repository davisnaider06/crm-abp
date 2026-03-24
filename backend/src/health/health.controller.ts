import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async check() {
    await this.prismaService.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      service: 'crm-abp-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
