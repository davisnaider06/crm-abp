import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import { CrmModule } from './crm/crm.module';
import { CustomersModule } from './customers/customers.module';
import { HealthModule } from './health/health.module';
import { LeadsModule } from './leads/leads.module';
import { NegotiationsModule } from './negotiations/negotiations.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    AuthModule,
    PrismaModule,
    HealthModule,
    CrmModule,
    CustomersModule,
    LeadsModule,
    NegotiationsModule,
    StoresModule,
  ],
})
export class AppModule {}
