import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private svc: PermissionsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async list() {
    return this.svc.listPermissions();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreatePermissionDto) {
    return this.svc.createPermission(dto);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  async listUser(@Param('userId') userId: string) {
    return this.svc.listUserPermissions(userId);
  }

  @Post('assign')
  @Roles(UserRole.ADMIN)
  async assign(@Body() dto: AssignPermissionDto) {
    return this.svc.assignPermissionToUser(dto.userId, dto.permissionKey);
  }

  @Post('revoke')
  @Roles(UserRole.ADMIN)
  async revoke(@Body() dto: AssignPermissionDto) {
    return this.svc.revokePermissionFromUser(dto.userId, dto.permissionKey);
  }
}
