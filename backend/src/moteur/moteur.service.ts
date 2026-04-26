import { Injectable } from '@nestjs/common';
import { ReferentielService } from '../referentiel/referentiel.service';

export interface GenererDto {
  c1_code: string;
  c1_precision?: string;
  c2_code: string;
  c2_precision?: string;
  c3_codes: string[];
  c3_precisions?: Record<string, string>;
  c4_code: string;
  c4_precision?: string;
}

export interface ConsigneResult {
  version_eleve: string;
  version_structuree: VersionStructuree;
  version_simplifiee: string;
}

export interface VersionStructuree {
  commande: string;
  cible: string;
  chemin: string[];
  construction: string;
}

@Injectable()
export class MoteurService {
  constructor(private readonly referentielService: ReferentielService) {}

  async generer(kitCode: string, dto: GenererDto): Promise<ConsigneResult> {
    // Charger les référentiels
    const [c1Items, c2Items, c3Items, c4Items] = await Promise.all([
      this.referentielService.findByKitAndCategorie(kitCode, 'C1'),
      this.referentielService.findByKitAndCategorie(kitCode, 'C2'),
      this.referentielService.findByKitAndCategorie(kitCode, 'C3'),
      this.referentielService.findByKitAndCategorie(kitCode, 'C4'),
    ]);

    const c1 = c1Items.find(i => i.code === dto.c1_code);
    const c2 = c2Items.find(i => i.code === dto.c2_code);
    const c4 = c4Items.find(i => i.code === dto.c4_code);

    if (!c1 || !c2 || !c4) {
      throw new Error('C1, C2 ou C4 introuvable');
    }

    // Trier C3 par ordre_defaut
    const c3Selected = c3Items
      .filter(i => dto.c3_codes.includes(i.code))
      .sort((a, b) => (a.meta?.ordre_defaut ?? 9) - (b.meta?.ordre_defaut ?? 9));

    // RÈGLE 1 — max 4 étapes C3
    const c3Final = c3Selected.slice(0, 4);

    // RÈGLE 2 — SI C1=comparer ET pas "repérer" dans C3 → auto-ajouter
    if (c1.label.toLowerCase() === 'comparer') {
      const hasReperer = c3Final.some(e => e.label.toLowerCase() === 'repérer');
      if (!hasReperer) {
        const reperer = c3Items.find(i => i.label.toLowerCase() === 'repérer');
        if (reperer) c3Final.unshift(reperer);
      }
    }

    // RÈGLE 3 — éviter doublon C2/C3 (ex: C2=texte → Lis, C3=Lire → Lis)
    const c3SansDuplon = c3Final.filter(etape => {
      const gabaritC3 = etape.gabarit.toLowerCase();
      const gabaritC2 = c2.gabarit.toLowerCase().split(' ')[0];
      return gabaritC3.split(' ')[0] !== gabaritC2;
    });

    // GÉNÉRATION C2 (toujours en premier)
    const ligneC2 = this.genererLigneC2(c2, dto.c2_precision);

    // GÉNÉRATION C3 (étapes)
    const lignesC3 = c3SansDuplon.map(etape => {
      const precision = dto.c3_precisions?.[etape.code] || '';
      return this.genererLigneC3(etape, precision);
    });

    // GÉNÉRATION C1 (action principale)
    const ligneC1 = this.genererLigneC1(c1, dto.c1_precision);

    // GÉNÉRATION C4 (production finale)
    const ligneC4 = this.genererLigneC4(c4, dto.c4_precision);

    // ASSEMBLAGE version élève
    const toutes = [ligneC2, ...lignesC3, ligneC1, ligneC4].filter(Boolean);
    const version_eleve = toutes.join(' ');

    // VERSION STRUCTURÉE
    const version_structuree: VersionStructuree = {
      commande: c1.label,
      cible: `${c2.label}${dto.c2_precision ? ' ' + dto.c2_precision : ''}`,
      chemin: c3Final.map(e => e.label),
      construction: `${c4.label}${dto.c4_precision ? ' (' + dto.c4_precision + ')' : ''}`,
    };

    // VERSION SIMPLIFIÉE
    const simplifiee = [ligneC2, ...lignesC3.slice(0, 2), ligneC4].filter(Boolean);
    const version_simplifiee = simplifiee
      .map((l, i) => `Étape ${i + 1} : ${l}`)
      .join('\n');

    return { version_eleve, version_structuree, version_simplifiee };
  }

  // ─── GÉNÉRATEURS LIGNE PAR LIGNE ─────────────────────

  private genererLigneC2(c2: any, precision?: string): string {
    const gabarit = c2.gabarit.replace('___', precision || '').trim();
    return gabarit.endsWith('.') ? gabarit : gabarit + '.';
  }

  private genererLigneC3(etape: any, precision?: string): string {
    let gabarit = etape.gabarit;
    if (precision) {
      gabarit = gabarit.replace('___', precision);
    } else {
      gabarit = gabarit.replace(' ___', '').replace('___', '');
    }
    gabarit = gabarit.trim();
    return gabarit.endsWith('.') ? gabarit : gabarit + '.';
  }

  private genererLigneC1(c1: any, precision?: string): string {
    let gabarit = c1.gabarit;

    if (precision) {
      // Remplace le premier ___ par la précision
      gabarit = gabarit.replace('___', precision);
      // Supprime le deuxième ___ restant éventuel
      gabarit = gabarit.replace(' et ___', '').replace(' ___', '').replace('___', '');
    } else {
      // Supprime tous les ___
      gabarit = gabarit.replace(' et ___', '').replace(' ___', '').replace('___', '');
    }

    gabarit = gabarit.trim();
    return gabarit.endsWith('.') ? gabarit : gabarit + '.';
  }

  private genererLigneC4(c4: any, precision?: string): string {
    let gabarit = c4.gabarit;
    if (c4.meta?.necessite_nombre && precision) {
      gabarit = gabarit.replace('___', precision);
    } else if (c4.meta?.necessite_nombre && !precision) {
      gabarit = gabarit.replace('___', '').trim();
    }
    gabarit = gabarit.trim();
    return gabarit.endsWith('.') ? gabarit : gabarit + '.';
  }

  // MODE RAPIDE — C1 + C2 + C4 seulement
  async genererRapide(kitCode: string, dto: Omit<GenererDto, 'c3_codes'>): Promise<ConsigneResult> {
    return this.generer(kitCode, { ...dto, c3_codes: [] });
  }
}
