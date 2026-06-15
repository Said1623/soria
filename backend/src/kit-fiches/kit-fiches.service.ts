import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KitFiche } from './kit-fiche.entity';
import { KitExemple } from './kit-exemple.entity';
import { KitOutil } from './kit-outil.entity';

@Injectable()
export class KitFichesService {
  constructor(
    @InjectRepository(KitFiche) private ficheRepo: Repository<KitFiche>,
    @InjectRepository(KitExemple) private exempleRepo: Repository<KitExemple>,
    @InjectRepository(KitOutil) private outilRepo: Repository<KitOutil>,
  ) {}

  // ── Fiches ──────────────────────────────────────────────────────────────────

  findByKit(kitId: number) {
    return this.ficheRepo.find({
      where: { kitId, actif: true },
      order: { niveau: 'ASC', ordre: 'ASC' },
    });
  }

  findByNiveau(kitId: number, niveau: number) {
    return this.ficheRepo.find({
      where: { kitId, niveau, actif: true },
      order: { ordre: 'ASC' },
    });
  }

  createFiche(dto: Partial<KitFiche>) {
    return this.ficheRepo.save(this.ficheRepo.create(dto));
  }

  async updateFiche(id: number, dto: Partial<KitFiche>) {
    await this.ficheRepo.update(id, dto);
    return this.ficheRepo.findOneBy({ id });
  }

  async deleteFiche(id: number) {
    await this.ficheRepo.delete(id);
    return { deleted: true };
  }

  // ── Exemples ─────────────────────────────────────────────────────────────────

  findExemplesByKit(kitId: number) {
    return this.exempleRepo.find({ where: { kitId }, order: { ordre: 'ASC' } });
  }

  createExemple(dto: Partial<KitExemple>) {
    return this.exempleRepo.save(this.exempleRepo.create(dto));
  }

  async updateExemple(id: number, dto: Partial<KitExemple>) {
    await this.exempleRepo.update(id, dto);
    return this.exempleRepo.findOneBy({ id });
  }

  async deleteExemple(id: number) {
    await this.exempleRepo.delete(id);
    return { deleted: true };
  }

  // ── Outils ───────────────────────────────────────────────────────────────────

  findOutilsByKit(kitId: number) {
    return this.outilRepo.find({ where: { kitId }, order: { ordre: 'ASC' } });
  }

  createOutil(dto: Partial<KitOutil>) {
    return this.outilRepo.save(this.outilRepo.create(dto));
  }

  async updateOutil(id: number, dto: Partial<KitOutil>) {
    await this.outilRepo.update(id, dto);
    return this.outilRepo.findOneBy({ id });
  }

  async deleteOutil(id: number) {
    await this.outilRepo.delete(id);
    return { deleted: true };
  }
}
