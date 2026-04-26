import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domaine } from '../domaines/entities/domaine.entity';
import { Kit } from '../kits/entities/kit.entity';
import { ReferentielItem } from '../referentiel/entities/referentiel-item.entity';
import { DOMAINES_DATA } from './data/domaines.data';
import { KITS_DATA } from './data/kits.data';
import { CLARIFIE_C1 } from './data/clarifie-c1.data';
import { CLARIFIE_C2 } from './data/clarifie-c2.data';
import { CLARIFIE_C3 } from './data/clarifie-c3.data';
import { CLARIFIE_C4 } from './data/clarifie-c4.data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Domaine) private domaineRepo: Repository<Domaine>,
    @InjectRepository(Kit) private kitRepo: Repository<Kit>,
    @InjectRepository(ReferentielItem) private refRepo: Repository<ReferentielItem>,
  ) {}

  async run() {
    await this.seedDomaines();
    await this.seedKits();
    await this.seedReferentiel();
    console.log('✅ SORIA — Seed complet');
  }

  private async seedDomaines() {
    const count = await this.domaineRepo.count();
    if (count > 0) return;
    await this.domaineRepo.save(DOMAINES_DATA);
    console.log('✅ 8 domaines seedés');
  }

  private async seedKits() {
    const count = await this.kitRepo.count();
    if (count > 0) return;

    const domaines = await this.domaineRepo.find();
    const domaineMap = Object.fromEntries(domaines.map(d => [d.code, d.id]));

    const kits = KITS_DATA.map(k => ({
      code: k.code,
      nom: k.nom,
      sous_titre: k.sous_titre,
      ordre: k.ordre,
      domaine_id: domaineMap[k.domaine_code],
    }));

    await this.kitRepo.save(kits);
    console.log('✅ 32 kits seedés');
  }

  private async seedReferentiel() {
    const count = await this.refRepo.count();
    if (count > 0) return;
    const all = [...CLARIFIE_C1, ...CLARIFIE_C2, ...CLARIFIE_C3, ...CLARIFIE_C4];
    await this.refRepo.save(all);
    console.log(`✅ ${all.length} items référentiel seedés (Clarifie C1/C2/C3/C4)`);
  }
}
