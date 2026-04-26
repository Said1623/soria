import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('referentiel_items')
export class ReferentielItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kit_code: string;

  @Column()
  categorie: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  famille: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  formulation_eleve: string;

  @Column({ nullable: true })
  definition: string;

  @Column({ nullable: true })
  risque: string;

  @Column({ nullable: true })
  conseil: string;

  @Column()
  gabarit: string;

  @Column({ nullable: true })
  variante: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any>;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
