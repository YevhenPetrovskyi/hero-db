import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHeroBodyDto {
  @ApiProperty({ example: 'Hulk', description: 'Hero nickname' })
  @IsString()
  @MaxLength(20)
  nickname: string;

  @ApiProperty({ example: 'Bruce Banner', description: 'Hero real name' })
  @IsString()
  @MaxLength(20)
  real_name: string;

  @ApiProperty({ example: 'The Incredible Hulk', description: 'Hero origin' })
  @IsString()
  @MaxLength(3000)
  origin_description: string;

  @ApiProperty({
    example: 'Super strength,durability',
    description: 'Hero superpowers',
  })
  @IsString()
  @MaxLength(300)
  superpowers: string;

  @ApiPropertyOptional({
    example: 'Hulk Smash',
    description: 'Hero catch phrase',
  })
  @IsString()
  @MaxLength(3000)
  @IsOptional()
  catch_phrase: string;
}

export class CreateHeroDto extends CreateHeroBodyDto {
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  pictures?: Express.Multer.File[];
}
