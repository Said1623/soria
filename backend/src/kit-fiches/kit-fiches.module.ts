import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitFiche } from './kit-fiche.entity';
import { KitExemple } from './kit-exemple.entity';
import { KitOutil } from './kit-outil.entity';
import { KitFichesService } from './kit-fiches.service';
import { KitFichesController } from './kit-fiches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KitFiche, KitExemple, KitOutil])],
  providers: [KitFichesService],
  controllers: [KitFichesController],
  exports: [TypeOrmModule],
})
export class KitFichesModule {}
