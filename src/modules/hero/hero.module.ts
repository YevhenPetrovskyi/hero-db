import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { entities } from '../../models/index';
import { S3Service } from '../common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [HeroController],
  providers: [HeroService, S3Service],
  exports: [HeroService],
})
export class HeroModule {}
