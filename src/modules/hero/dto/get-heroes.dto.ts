import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { HeroEntity } from 'src/models/hero.entity';

export class GetHeroesDto {
  @ApiProperty({ example: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ example: 10, description: 'Page size' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}

export class PaginatedHeroesDto {
  @ApiProperty({ type: [HeroEntity] })
  heroes: HeroEntity[];

  @ApiProperty({ example: 10, description: 'Total pages' })
  totalPages: Number;
}
