import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateHeroBodyDto {
  @ApiPropertyOptional({ example: 'Hulk', description: 'Hero nickname' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  nickname: string;

  @ApiPropertyOptional({
    example: 'Bruce Banner',
    description: 'Hero real name',
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  real_name: string;

  @ApiPropertyOptional({
    example: 'The Incredible Hulk',
    description: 'Hero origin',
  })
  @IsString()
  @MaxLength(3000)
  @IsOptional()
  origin_description: string;

  @ApiPropertyOptional({
    example: 'Super strength,durability',
    description: 'Hero superpowers',
  })
  @IsString()
  @MaxLength(300)
  @IsOptional()
  superpowers: string;

  @ApiPropertyOptional({
    example: 'Hulk Smash',
    description: 'Hero catch phrase',
  })
  @IsString()
  @MaxLength(3000)
  @IsOptional()
  catch_phrase: string;

  @ApiPropertyOptional({
    example: [1, 2, 3],
  })
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => parseInt(id));
    }

    return value;
  })
  deletedPictureIds?: number[];
}

export class UpdateHeroDto extends UpdateHeroBodyDto {
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  pictures?: Express.Multer.File[];
}
