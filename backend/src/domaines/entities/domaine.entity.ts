import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('domaines')
export class Domaine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  ordre: number;

  @Column({ nullable: true })
  icone: string;

  @Column({ nullable: true })
  couleur: string;

  @Column({ default: true })
  actif: boolean;

  @OneToMany('Kit', 'domaine')
  kits: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
