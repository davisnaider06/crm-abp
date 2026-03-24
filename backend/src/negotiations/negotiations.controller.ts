import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { NegotiationsService } from './negotiations.service';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';

@Controller('negotiations')
@UseGuards(JwtAuthGuard)
export class NegotiationsController {
  constructor(private readonly negotiationsService: NegotiationsService) {}

  @Get()
  findAll() {
    return this.negotiationsService.findAll();
  }

  @Post()
  create(@Body() createNegotiationDto: CreateNegotiationDto) {
    return this.negotiationsService.create(createNegotiationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNegotiationDto: UpdateNegotiationDto,
  ) {
    return this.negotiationsService.update(id, updateNegotiationDto);
  }
}
