import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Kit } from './entities/kit.entity';
import { KitDto } from './dto/kit.dto';

@Injectable()
export class KitsService {
  constructor(
    @InjectRepository(Kit)
    private kitRepo: Repository<Kit>,
  ) {}

  async findAll() {
    const kits = await this.kitRepo.find({ where: { actif: true }, relations: ['domaine'], order: { ordre: 'ASC' } });
    return plainToInstance(KitDto, kits, { excludeExtraneousValues: true });
  }

  async findByDomaine(domaineCode: string) {
    const kits = await this.kitRepo.find({
      where: { domaine: { code: domaineCode } },
      relations: ['domaine'],
      order: { ordre: 'ASC' },
    });
    console.log('findByDomaine', domaineCode, kits.length, kits.map(k => k.code + ':' + k.actif));
    return plainToInstance(KitDto, kits, { excludeExtraneousValues: true });
  }

  async findByCode(code: string) {
    const kit = await this.kitRepo.findOne({ where: { code }, relations: ['domaine'] });
    return plainToInstance(KitDto, kit, { excludeExtraneousValues: true });
  }
}
