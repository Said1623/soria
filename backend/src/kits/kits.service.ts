import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kit } from './entities/kit.entity';

@Injectable()
export class KitsService {
  constructor(
    @InjectRepository(Kit)
    private kitRepo: Repository<Kit>,
  ) {}

  findAll() {
    return this.kitRepo.find({ where: { actif: true }, relations: ['domaine'], order: { ordre: 'ASC' } });
  }

  findByDomaine(domaineCode: string) {
    return this.kitRepo.find({
      where: { domaine: { code: domaineCode }, actif: true },
      relations: ['domaine'],
      order: { ordre: 'ASC' },
    });
  }

  findByCode(code: string) {
    return this.kitRepo.findOne({ where: { code }, relations: ['domaine'] });
  }
}
