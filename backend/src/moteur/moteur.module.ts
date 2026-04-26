import { Module } from '@nestjs/common';
import { MoteurService } from './moteur.service';
import { MoteurController } from './moteur.controller';
import { ReferentielModule } from '../referentiel/referentiel.module';

@Module({
  imports: [ReferentielModule],
  providers: [MoteurService],
  controllers: [MoteurController],
})
export class MoteurModule {}
