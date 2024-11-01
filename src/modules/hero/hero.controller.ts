import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroBodyDto, CreateHeroDto } from './dto/create-hero.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HeroEntity } from 'src/models/hero.entity';
import { GetHeroesDto, PaginatedHeroesDto } from './dto/get-heroes.dto';
import { DeleteHeroRsponseDto } from './dto/delete-hero.dto';
import { UpdateHeroBodyDto, UpdateHeroDto } from './dto/update-body.dto';

@Controller('/heroes')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @ApiOperation({ description: 'Add new hero' })
  @ApiCreatedResponse({
    description: 'Hero has been successfully added',
    type: HeroEntity,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'New hero', type: CreateHeroDto })
  @UseInterceptors(
    FilesInterceptor('pictures', 20, { limits: { fileSize: 5 * 10 ** 6 } }),
  )
  createHero(
    @Body() body: CreateHeroBodyDto,
    @UploadedFiles()
    pictures: Array<Express.Multer.File>,
  ) {
    return this.heroService.createHero(body, pictures);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete('/:id')
  @ApiOkResponse({
    type: DeleteHeroRsponseDto,
    description: 'Delete hero',
  })
  deleteHero(@Param('id', ParseIntPipe) id: number) {
    return this.heroService.deleteHero(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get('/:id')
  @ApiOkResponse({
    type: HeroEntity,
    description: 'Get hero',
  })
  getHero(@Param('id', ParseIntPipe) id: number) {
    return this.heroService.getHero(id);
  }

  @Get()
  @ApiOkResponse({
    type: PaginatedHeroesDto,
    description: 'Get heroes',
  })
  getHeroes(@Query() { page, limit }: GetHeroesDto) {
    return this.heroService.getHeroes(page, limit);
  }

  @Put('/:id')
  @ApiOkResponse({
    type: HeroEntity,
    description: 'Update hero',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Updated hero', type: UpdateHeroDto })
  @UseInterceptors(
    FilesInterceptor('pictures', 20, { limits: { fileSize: 5 * 10 ** 6 } }),
  )
  updateHero(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHeroBodyDto,
    @UploadedFiles()
    pictures: Array<Express.Multer.File>,
  ) {
    return this.heroService.updateHero(id, body, pictures);
  }
}
