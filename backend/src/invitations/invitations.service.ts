import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Invitation } from './invitation.entity';
import { SoriaUser } from '../users/entities/user.entity';

@Injectable()
export class InvitationsService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(SoriaUser)
    private readonly userRepo: Repository<SoriaUser>,
    private readonly jwtService: JwtService,
  ) {}

  async createInvitation(email: string): Promise<Invitation> {
    const existing = await this.invitationRepo.findOne({
      where: { email, status: 'pending' },
    });
    if (existing) {
      throw new ConflictException('Une invitation en attente existe déjà pour cet email');
    }

    const token = randomUUID();
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 48);

    const invitation = this.invitationRepo.create({ email, token, status: 'pending', expires_at });
    await this.invitationRepo.save(invitation);
console.log('RESEND KEY:', process.env.RESEND_API_KEY ? 'OK' : 'MANQUANTE');
    await this.resend.emails.send({
      from: 'SORIA <noreply@TONDOMAINE_VERIFIE>',
      to: email,
      subject: 'Invitation à rejoindre SORIA',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Vous êtes invité à rejoindre SORIA</h2>
          <p style="color: #374151; margin-bottom: 12px;">
            Vous avez été invité à créer un compte sur <strong>SORIA</strong>,
            le système d'action guidée pour la classe.
          </p>
          <p style="color: #374151; margin-bottom: 24px;">Ce lien est valable <strong>48 heures</strong>.</p>
          <a href="https://soria-two.vercel.app/inscription?token=${token}"
             style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px;
                    border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
            Créer mon compte →
          </a>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
            Si vous n'attendiez pas cette invitation, vous pouvez ignorer ce message.
          </p>
        </div>
      `,
    });

    return invitation;
  }

  async verifyToken(token: string): Promise<{ valid: boolean; email?: string; reason?: string }> {
    const invitation = await this.invitationRepo.findOne({ where: { token } });

    if (!invitation) {
      return { valid: false, reason: 'Token invalide' };
    }
    if (invitation.status === 'accepted') {
      return { valid: false, reason: 'Ce lien a déjà été utilisé' };
    }
    if (invitation.status === 'expired' || new Date() > invitation.expires_at) {
      if (invitation.status !== 'expired') {
        await this.invitationRepo.update({ token }, { status: 'expired' });
      }
      return { valid: false, reason: 'Ce lien a expiré' };
    }

    return { valid: true, email: invitation.email };
  }

  async acceptInvitation(
    token: string,
    nom: string,
    prenom: string,
    password: string,
  ): Promise<{ access_token: string; user: Partial<SoriaUser> }> {
    const verification = await this.verifyToken(token);
    if (!verification.valid) {
      throw new BadRequestException(verification.reason);
    }

    const existing = await this.userRepo.findOne({ where: { email: verification.email } });
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email: verification.email!,
      nom,
      prenom,
      password_hash,
      role: 'invited_user',
    });
    await this.userRepo.save(user);

    await this.invitationRepo.update({ token }, { status: 'accepted', nom, prenom });

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      prenom: user.prenom,
      nom: user.nom,
    });

    return {
      access_token,
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
    };
  }

  async findAll(): Promise<Invitation[]> {
    return this.invitationRepo.find({ order: { created_at: 'DESC' } });
  }
}
