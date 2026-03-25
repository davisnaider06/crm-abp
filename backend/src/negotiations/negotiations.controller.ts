import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole, type User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { NegotiationsService } from './negotiations.service';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';

@Controller('negotiations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NegotiationsController {
  constructor(private readonly negotiationsService: NegotiationsService) {}

  @Get()
  @Roles(
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.GENERAL_MANAGER,
    UserRole.ADMIN,
  )
  findAll(@CurrentUser() user: User) {
    return this.negotiationsService.findAll(user);
  }

  @Post()
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  create(@Body() createNegotiationDto: CreateNegotiationDto) {
    return this.negotiationsService.create(createNegotiationDto);
  }

  @Patch(':id')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateNegotiationDto: UpdateNegotiationDto,
  ) {
    return this.negotiationsService.update(id, updateNegotiationDto);
  }
}
