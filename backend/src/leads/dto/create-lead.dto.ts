import { LeadImportance, LeadSource, LeadStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(LeadSource)
  source!: LeadSource;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadImportance)
  importance?: LeadImportance;

  @IsString()
  customerId!: string;

  @IsString()
  storeId!: string;

  @IsOptional()
  @IsString()
  attendantId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}
