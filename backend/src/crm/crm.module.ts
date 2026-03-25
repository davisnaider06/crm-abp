import { Module } from '@nestjs/common';
import { AccessScopeService } from '../common/access-scope.service';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';

@Module({
  controllers: [CrmController],
  providers: [CrmService, AccessScopeService],
})
export class CrmModule {}
