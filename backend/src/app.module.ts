import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from '@nestjs/typeorm';
import { Domaine } from './domaines/entities/domaine.entity';
import { Kit } from './kits/entities/kit.entity';
import { ReferentielItem } from './referentiel/entities/referentiel-item.entity';
import { DomainesModule } from './domaines/domaines.module';
import { KitsModule } from './kits/kits.module';
import { ReferentielModule } from './referentiel/referentiel.module';
import { SeedModule } from './seed/seed.module';
import { MoteurModule } from './moteur/moteur.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [Domaine, Kit, ReferentielItem],
      synchronize: true,
    }),
    DomainesModule,
    KitsModule,
    ReferentielModule,
    SeedModule,
    MoteurModule,
  ],
})
export class AppModule {}
