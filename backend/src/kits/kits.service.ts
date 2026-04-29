import { Injectable, NotFoundException } from '@nestjs/common';
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
    return plainToInstance(KitDto, kits, { excludeExtraneousValues: true });
  }

  async findByCode(code: string) {
    const kit = await this.kitRepo.findOne({ where: { code }, relations: ['domaine'] });
    return plainToInstance(KitDto, kit, { excludeExtraneousValues: true });
  }

  // ── Admin ────────────────────────────────────────────────────────────────────

  async adminFindAll() {
    return this.kitRepo.find({
      relations: ['domaine'],
      order: { domaine_id: 'ASC', ordre: 'ASC' },
    });
  }

  async adminFindOne(id: number) {
    const kit = await this.kitRepo.findOne({ where: { id }, relations: ['domaine'] });
    if (!kit) throw new NotFoundException(`Kit #${id} introuvable`);
    return kit;
  }

  async adminCreate(dto: {
    code: string; nom: string; sous_titre?: string;
    description?: string; domaine_id: number; ordre: number; actif?: boolean;
  }) {
    const kit = this.kitRepo.create({ ...dto, actif: dto.actif ?? true });
    return this.kitRepo.save(kit);
  }

  async adminUpdate(id: number, dto: {
    nom?: string; sous_titre?: string; description?: string;
    actif?: boolean; ordre?: number; domaine_id?: number;
  }) {
    await this.adminFindOne(id);
    await this.kitRepo.update(id, dto);
    return this.kitRepo.findOne({ where: { id }, relations: ['domaine'] });
  }

  async adminDelete(id: number) {
    await this.adminFindOne(id);
    await this.kitRepo.delete(id);
    return { success: true };
  }
}
