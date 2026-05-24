import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    default: 5,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) 
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
