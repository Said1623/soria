import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domaine } from '../domaines/entities/domaine.entity';
import { Kit } from '../kits/entities/kit.entity';
import { ReferentielItem } from '../referentiel/entities/referentiel-item.entity';
import { KitFiche } from '../kit-fiches/kit-fiche.entity';
import { KitOutil } from '../kit-fiches/kit-outil.entity';
import { DOMAINES_DATA } from './data/domaines.data';
import { KITS_DATA } from './data/kits.data';
import { CLARIFIE_C1 } from './data/clarifie-c1.data';
import { CLARIFIE_C2 } from './data/clarifie-c2.data';
import { CLARIFIE_C3 } from './data/clarifie-c3.data';
import { CLARIFIE_C4 } from './data/clarifie-c4.data';
import { CAPTE_C1 } from './data/capte-c1.data';
import { CAPTE_C2 } from './data/capte-c2.data';
import { CAPTE_C3 } from './data/capte-c3.data';
import { CAPTE_C4 } from './data/capte-c4.data';
import { KIT_FICHES_SEED } from './data/kit-fiches.data';
import { KIT_OUTILS_SEED } from './data/kit-outils.data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Domaine) private domaineRepo: Repository<Domaine>,
    @InjectRepository(Kit) private kitRepo: Repository<Kit>,
    @InjectRepository(ReferentielItem) private refRepo: Repository<ReferentielItem>,
    @InjectRepository(KitFiche) private kitFicheRepo: Repository<KitFiche>,
    @InjectRepository(KitOutil) private kitOutilRepo: Repository<KitOutil>,
  ) {}

  async run() {
    await this.seedDomaines();
    await this.seedKits();
    await this.seedClarifieReferentiel();
    await this.seedCapteReferentiel();
    await this.activateCapteKit();
    await this.seedKitFiches();
    await this.seedKitOutils();
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

  private async seedClarifieReferentiel() {
    const count = await this.refRepo.count({ where: { kit_code: 'CONSIGNES-CLARIFIE' } });
    if (count > 0) return;
    const all = [...CLARIFIE_C1, ...CLARIFIE_C2, ...CLARIFIE_C3, ...CLARIFIE_C4];
    await this.refRepo.save(all);
    console.log(`✅ ${all.length} items référentiel seedés (Clarifie C1/C2/C3/C4)`);
  }

  private async seedCapteReferentiel() {
    const count = await this.refRepo.count({ where: { kit_code: 'CONSIGNES-CAPTE' } });
    if (count > 0) return;
    const all = [...CAPTE_C1, ...CAPTE_C2, ...CAPTE_C3, ...CAPTE_C4];
    await this.refRepo.save(all);
    console.log(`✅ ${all.length} items référentiel seedés (Capte C1/C2/C3/C4)`);
  }

  private async activateCapteKit() {
    await this.kitRepo.update({ code: 'CONSIGNES-CAPTE' }, { actif: true });
  }

  private async seedKitFiches() {
    const count = await this.kitFicheRepo.count();
    if (count > 0) return;

    const kitCodes = KIT_FICHES_SEED.map(f => f.kitCode);
    const kits = await this.kitRepo.findBy(kitCodes.map(code => ({ code })));
    const kitMap = Object.fromEntries(kits.map(k => [k.code, k.id]));

    const fiches = KIT_FICHES_SEED
      .filter(f => kitMap[f.kitCode])
      .map(({ kitCode, ...rest }) => ({ ...rest, kitId: kitMap[kitCode] }));

    await this.kitFicheRepo.save(fiches);
    console.log(`✅ ${fiches.length} fiches de survie seedées`);
  }

  private async seedKitOutils() {
    const kit = await this.kitRepo.findOneBy({ code: 'CONSIGNES-VALIDE' });
    if (!kit) return;

    const count = await this.kitOutilRepo.count({ where: { kitId: kit.id } });
    if (count > 0) return;

    const outils = KIT_OUTILS_SEED.map((o, i) => ({
      ...o,
      kitId: kit.id,
      ordre: i + 1,
      description: "Fiche 2 — L'élève ne sait pas par où commencer",
    }));

    await this.kitOutilRepo.save(outils);
    console.log(`✅ ${outils.length} outils seedés (CONSIGNES-VALIDE)`);
  }
}
