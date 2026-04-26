import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('kits')
export class Kit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  nom: string;

  @Column({ nullable: true })
  sous_titre: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  ordre: number;

  @Column({ default: true })
  actif: boolean;

  @Column()
  domaine_id!: number;

  @ManyToOne('Domaine', 'kits')
  @JoinColumn({ name: 'domaine_id' })
  domaine: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
