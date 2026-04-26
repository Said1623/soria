export interface ReferentielItem {
  id: number;
  code: string;
  categorie: string;
  famille: string;
  label: string;
  formulation_eleve: string;
  definition: string;
  risque: string;
  conseil: string;
  gabarit: string;
  variante?: string;
  meta?: Record<string, any>;
}

export interface ConsigneResult {
  version_eleve: string;
  version_structuree: {
    commande: string;
    cible: string;
    chemin: string[];
    construction: string;
  };
  version_simplifiee: string;
}

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
