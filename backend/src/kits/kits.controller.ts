import { Controller, Get, Param } from '@nestjs/common';
import { KitsService } from './kits.service';

@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  @Get()
  findAll() {
    return this.kitsService.findAll();
  }

  @Get('domaine/:code')
  findByDomaine(@Param('code') code: string) {
    return this.kitsService.findByDomaine(code);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.kitsService.findByCode(code);
  }
}
