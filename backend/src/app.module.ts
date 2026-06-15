import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from '@nestjs/typeorm';
import { Domaine } from './domaines/entities/domaine.entity';
import { Kit } from './kits/entities/kit.entity';
import { ReferentielItem } from './referentiel/entities/referentiel-item.entity';
import { SoriaUser } from './users/entities/user.entity';
import { Invitation } from './invitations/invitation.entity';
import { KitFiche } from './kit-fiches/kit-fiche.entity';
import { KitExemple } from './kit-fiches/kit-exemple.entity';
import { KitOutil } from './kit-fiches/kit-outil.entity';
import { DomainesModule } from './domaines/domaines.module';
import { KitsModule } from './kits/kits.module';
import { ReferentielModule } from './referentiel/referentiel.module';
import { SeedModule } from './seed/seed.module';
import { MoteurModule } from './moteur/moteur.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { KitFichesModule } from './kit-fiches/kit-fiches.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [Domaine, Kit, ReferentielItem, SoriaUser, Invitation, KitFiche, KitExemple, KitOutil],
      synchronize: true,
    }),
    DomainesModule,
    KitsModule,
    KitFichesModule,
    ReferentielModule,
    SeedModule,
    MoteurModule,
    AuthModule,
    InvitationsModule,
  ],
})
export class AppModule {}
