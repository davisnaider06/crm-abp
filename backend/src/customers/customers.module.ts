import { Module } from '@nestjs/common';
import { AccessScopeService } from '../common/access-scope.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, AccessScopeService],
  exports: [CustomersService],
})
export class CustomersModule {}
