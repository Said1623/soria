import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferentielItem } from './entities/referentiel-item.entity';

@Injectable()
export class ReferentielService {
  constructor(
    @InjectRepository(ReferentielItem)
    private refRepo: Repository<ReferentielItem>,
  ) {}

  findByKitAndCategorie(kitCode: string, categorie: string) {
    return this.refRepo.find({
      where: { kit_code: kitCode, categorie, actif: true },
      order: { id: 'ASC' },
    });
  }

  findByKit(kitCode: string) {
    return this.refRepo.find({
      where: { kit_code: kitCode, actif: true },
      order: { categorie: 'ASC' },
    });
  }
}
