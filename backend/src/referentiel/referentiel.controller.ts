import { Controller, Get, Param } from '@nestjs/common';
import { ReferentielService } from './referentiel.service';

@Controller('referentiel')
export class ReferentielController {
  constructor(private readonly referentielService: ReferentielService) {}

  @Get(':kitCode')
  findByKit(@Param('kitCode') kitCode: string) {
    return this.referentielService.findByKit(kitCode);
  }

  @Get(':kitCode/:categorie')
  findByKitAndCategorie(
    @Param('kitCode') kitCode: string,
    @Param('categorie') categorie: string,
  ) {
    return this.referentielService.findByKitAndCategorie(kitCode, categorie);
  }
}
