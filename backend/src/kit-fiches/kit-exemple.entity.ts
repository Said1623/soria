import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kit_exemples')
export class KitExemple {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kitId: number;

  @Column()
  niveauScolaire: string;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column('text')
  contenu: string;

  @Column({ default: 0 })
  ordre: number;
}
