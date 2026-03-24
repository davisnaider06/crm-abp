import { NegotiationStage, NegotiationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateNegotiationDto {
  @IsString()
  leadId!: string;

  @IsOptional()
  @IsEnum(NegotiationStage)
  stage?: NegotiationStage;

  @IsOptional()
  @IsEnum(NegotiationStatus)
  status?: NegotiationStatus;

  @IsOptional()
  @IsString()
  closingReason?: string;
}
