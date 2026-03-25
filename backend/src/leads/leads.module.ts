import { Module } from '@nestjs/common';
import { AccessScopeService } from '../common/access-scope.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, AccessScopeService],
  exports: [LeadsService],
})
export class LeadsModule {}
