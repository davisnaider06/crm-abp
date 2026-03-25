import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole, type User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Permission } from '../permissions/permission.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @Roles(
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.GENERAL_MANAGER,
    UserRole.ADMIN,
  )
  findAll(@CurrentUser() user: User) {
    return this.leadsService.findAll(user);
  }

  @Post()
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  @Permission('leads.create')
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: User) {
    return this.leadsService.create(createLeadDto, user);
  }

  @Patch(':id')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  @Permission('leads.update')
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.update(id, updateLeadDto, user);
  }
}
