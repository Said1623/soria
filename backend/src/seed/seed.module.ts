import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domaine } from '../domaines/entities/domaine.entity';
import { Kit } from '../kits/entities/kit.entity';
import { ReferentielItem } from '../referentiel/entities/referentiel-item.entity';
import { KitFiche } from '../kit-fiches/kit-fiche.entity';
import { KitOutil } from '../kit-fiches/kit-outil.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Domaine, Kit, ReferentielItem, KitFiche, KitOutil])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
