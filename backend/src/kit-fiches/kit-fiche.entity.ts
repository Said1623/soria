import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('kit_fiches')
export class KitFiche {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kitId: number;

  @Column()
  niveau: number;

  @Column()
  titre: string;

  @Column('text')
  contenu: string;

  @Column({ default: 0 })
  ordre: number;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
