import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kit_outils')
export class KitOutil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kitId: number;

  @Column()
  type: string;

  @Column()
  titre: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  fichierUrl: string;

  @Column('text', { nullable: true })
  contenu: string;

  @Column({ default: 0 })
  ordre: number;
}
