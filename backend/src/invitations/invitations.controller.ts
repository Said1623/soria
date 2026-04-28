import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

class CreateInvitationDto {
  @IsEmail()
  email: string;
}

class AcceptInvitationDto {
  @IsString()
  token: string;

  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  create(@Body() dto: CreateInvitationDto) {
    return this.invitationsService.createInvitation(dto.email);
  }

  @Get('verify/:token')
  verify(@Param('token') token: string) {
    return this.invitationsService.verifyToken(token);
  }

  @Post('accept')
  accept(@Body() dto: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(dto.token, dto.nom, dto.prenom, dto.password);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  findAll() {
    return this.invitationsService.findAll();
  }
}
