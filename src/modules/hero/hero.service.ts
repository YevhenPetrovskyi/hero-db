import { In, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { HeroEntity } from '../../models/hero.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHeroBodyDto } from './dto/create-hero.dto';
import { PictureEntity } from 'src/models/picture.entity';
import { S3Service } from '../common/s3.service';
import { randomUUID } from 'crypto';
import { PaginatedHeroesDto } from './dto/get-heroes.dto';
import { UpdateHeroBodyDto, UpdateHeroDto } from './dto/update-body.dto';

@Injectable()
export class HeroService {
  private readonly folder = 'heroes';

  constructor(
    @InjectRepository(HeroEntity)
    private readonly heroRepository: Repository<HeroEntity>,

    @InjectRepository(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async createHero(
    createHeroDto: CreateHeroBodyDto,
    pictures: Express.Multer.File[],
  ): Promise<HeroEntity> {
    const hero = await this.heroRepository.save(createHeroDto);

    const s3PicturesPromises = [];
    const heroPicturesArray = [];

    pictures.forEach((picture) => {
      const exstension = picture.originalname.split('.').pop();
      const name = `${randomUUID()}.${exstension}`;

      s3PicturesPromises.push(
        this.s3Service.uploadFile(
          picture.buffer,
          name,
          this.folder,
          picture.mimetype,
        ),
      );

      heroPicturesArray.push(
        this.pictureRepository.create({
          name,
          url: this.s3Service.buildPictureUrl(name, this.folder),
          hero_id: hero.id,
        }),
      );
    });

    await Promise.all(s3PicturesPromises);

    const heroPictures = await this.pictureRepository.save(heroPicturesArray);

    return { ...hero, pictures: heroPictures };
  }

  async deleteHero(id: number): Promise<{ deleted: boolean }> {
    const pictures = await this.pictureRepository.find({
      where: { hero_id: id },
    });

    await Promise.all(
      pictures.map((picture) =>
        this.s3Service.deleteFile(`${this.folder}/${picture.name}`),
      ),
    );

    await this.pictureRepository.delete({ hero_id: id });

    await this.heroRepository.delete({ id });

    return { deleted: true };
  }

  async getHero(id: number): Promise<HeroEntity> {
    return await this.heroRepository.findOne({
      where: { id },
      relations: {
        pictures: true,
      },
    });
  }

  async getHeroes(page = 1, limit = 5): Promise<PaginatedHeroesDto> {
    const [heroes, total] = await this.heroRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        pictures: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return { heroes, totalPages };
  }

  async updateHero(
    id: number,
    updateBody: UpdateHeroBodyDto,
    pictures: Express.Multer.File[],
  ): Promise<HeroEntity> {
    const { deletedPictureIds, ...heroUpdate } = updateBody;

    const hero = await this.heroRepository.update(id, heroUpdate);

    if (hero.affected === 0) {
      throw new NotFoundException('Hero not found');
    }

    const heroPictures = await this.pictureRepository.find({
      where: { hero_id: id },
    });

    const picruresForDelete = heroPictures.filter(({ id }) =>
      deletedPictureIds.includes(id),
    );

    await Promise.all(
      picruresForDelete.map((picture) =>
        this.s3Service.deleteFile(`${this.folder}/${picture.name}`),
      ),
    );

    await this.pictureRepository.delete({
      id: In(updateBody.deletedPictureIds),
    });

    const s3PicturesPromises = [];
    const heroPicturesArray = [];

    pictures.forEach((picture) => {
      const exstension = picture.originalname.split('.').pop();
      const name = `${randomUUID()}.${exstension}`;

      s3PicturesPromises.push(
        this.s3Service.uploadFile(
          picture.buffer,
          name,
          this.folder,
          picture.mimetype,
        ),
      );

      heroPicturesArray.push(
        this.pictureRepository.create({
          name,
          url: this.s3Service.buildPictureUrl(name, this.folder),
          hero_id: id,
        }),
      );
    });

    await Promise.all(s3PicturesPromises);

    const newHeroPictures =
      await this.pictureRepository.save(heroPicturesArray);

    return await this.heroRepository.findOne({
      where: { id },
      relations: {
        pictures: true,
      },
    });
  }
}
