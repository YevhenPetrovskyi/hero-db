import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PictureEntity } from './picture.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'heroes' })
export class HeroEntity {
  @ApiProperty({ example: 1, description: 'Hero id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Hulk', description: 'Hero nickname' })
  @Column()
  nickname: string;

  @ApiProperty({ example: 'Bruce Banner', description: 'Hero real name' })
  @Column()
  real_name: string;

  @ApiProperty({ example: 'The Incredible Hulk', description: 'Hero origin' })
  @Column()
  origin_description: string;

  @ApiProperty({
    example: 'Super strength,durability',
    description: 'Hero superpowers',
  })
  @Column()
  superpowers: string;

  @ApiPropertyOptional({
    example: 'Hulk Smash',
    description: 'Hero catch phrase',
  })
  @Column({ nullable: true })
  catch_phrase: string;

  @ApiPropertyOptional({
    type: [PictureEntity],
  })
  @OneToMany(() => PictureEntity, (picture) => picture.hero)
  pictures: PictureEntity[];
}
