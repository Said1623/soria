import { Controller, Post, Param, Body } from '@nestjs/common';
import type { GenererDto } from './moteur.service';
import { MoteurService } from './moteur.service';

@Controller('moteur')
export class MoteurController {
  constructor(private readonly moteurService: MoteurService) {}

  @Post(':kitCode/generer')
  generer(@Param('kitCode') kitCode: string, @Body() dto: GenererDto) {
    return this.moteurService.generer(kitCode, dto);
  }

  @Post(':kitCode/generer-rapide')
  genererRapide(
    @Param('kitCode') kitCode: string,
    @Body() dto: Omit<GenererDto, 'c3_codes'>,
  ) {
    return this.moteurService.genererRapide(kitCode, dto);
  }
}
