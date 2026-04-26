import { Controller, Get } from '@nestjs/common';
import { DomainesService } from './domaines.service';

@Controller('domaines')
export class DomainesController {
  constructor(private readonly domainesService: DomainesService) {}

  @Get()
  findAll() {
    return this.domainesService.findAll();
  }
}
