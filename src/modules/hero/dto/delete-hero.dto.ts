import { ApiProperty } from '@nestjs/swagger';

export class DeleteHeroRsponseDto {
  @ApiProperty({ example: true })
  deleted: boolean;
}
