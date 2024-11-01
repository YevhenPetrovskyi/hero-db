import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HeroEntity } from './hero.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'pictures' })
export class PictureEntity {
  @ApiProperty({ example: 1, description: 'Picture id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Hulk', description: 'Picture name' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Picture url',
  })
  @Column()
  url: string;

  @ApiProperty({ example: 1, description: 'Picture hero id' })
  @Column()
  hero_id: number;

  @ManyToOne(() => HeroEntity, (hero) => hero.pictures)
  @JoinColumn({ name: 'hero_id' })
  hero: HeroEntity[];
}
