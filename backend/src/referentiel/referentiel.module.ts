import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferentielItem } from './entities/referentiel-item.entity';
import { ReferentielService } from './referentiel.service';
import { ReferentielController } from './referentiel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReferentielItem])],
  providers: [ReferentielService],
  controllers: [ReferentielController],
  exports: [ReferentielService],
})
export class ReferentielModule {}
