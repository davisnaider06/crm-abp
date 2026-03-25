import { Module } from '@nestjs/common';
import { AccessScopeService } from '../common/access-scope.service';
import { NegotiationsController } from './negotiations.controller';
import { NegotiationsService } from './negotiations.service';

@Module({
  controllers: [NegotiationsController],
  providers: [NegotiationsService, AccessScopeService],
  exports: [NegotiationsService],
})
export class NegotiationsModule {}
