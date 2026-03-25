import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole, type User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Permission } from '../permissions/permission.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles(
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.GENERAL_MANAGER,
    UserRole.ADMIN,
  )
  findAll(@CurrentUser() user: User) {
    return this.customersService.findAll(user);
  }

  @Post()
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  @Permission('customers.create')
  create(@Body() createCustomerDto: CreateCustomerDto, @CurrentUser() user: User) {
    return this.customersService.create(createCustomerDto, user);
  }

  @Patch(':id')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  @Permission('customers.update')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: User,
  ) {
    return this.customersService.update(id, updateCustomerDto, user);
  }
}
