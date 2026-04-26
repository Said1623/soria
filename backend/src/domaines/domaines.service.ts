import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domaine } from './entities/domaine.entity';

@Injectable()
export class DomainesService {
  constructor(
    @InjectRepository(Domaine)
    private domaineRepo: Repository<Domaine>,
  ) {}

  findAll() {
    return this.domaineRepo.find({ where: { actif: true }, order: { ordre: 'ASC' } });
  }
}
