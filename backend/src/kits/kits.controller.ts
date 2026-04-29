import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { KitsService } from './kits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard }   from '../auth/roles.guard';
import { Roles }        from '../auth/roles.decorator';

@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  // ── Routes publiques ────────────────────────────────────────────────────────

  @Get()
  findAll() {
    return this.kitsService.findAll();
  }

  @Get('domaine/:code')
  findByDomaine(@Param('code') code: string) {
    return this.kitsService.findByDomaine(code);
  }

  // ── Routes admin (avant :code pour éviter les conflits) ────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Get('admin')
  adminFindAll() {
    return this.kitsService.adminFindAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Get('admin/:id')
  adminFindOne(@Param('id', ParseIntPipe) id: number) {
    return this.kitsService.adminFindOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Post('admin')
  adminCreate(@Body() body: {
    code: string; nom: string; sous_titre?: string;
    description?: string; domaine_id: number; ordre: number; actif?: boolean;
  }) {
    return this.kitsService.adminCreate(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch('admin/:id')
  adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      nom?: string; sous_titre?: string; description?: string;
      actif?: boolean; ordre?: number; domaine_id?: number;
    },
  ) {
    return this.kitsService.adminUpdate(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Delete('admin/:id')
  adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.kitsService.adminDelete(id);
  }

  // ── Route publique :code (en dernier) ──────────────────────────────────────

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.kitsService.findByCode(code);
  }
}
