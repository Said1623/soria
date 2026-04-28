import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('soria_invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
