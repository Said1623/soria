import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { KitFichesService } from './kit-fiches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard }   from '../auth/roles.guard';
import { Roles }        from '../auth/roles.decorator';

@Controller()
export class KitFichesController {
  constructor(private readonly service: KitFichesService) {}

  // ── Kit Fiches ──────────────────────────────────────────────────────────────

  @Get('kit-fiches/:kitId')
  getFiches(@Param('kitId', ParseIntPipe) kitId: number) {
    return this.service.findByKit(kitId);
  }

  @Get('kit-fiches/:kitId/niveau/:n')
  getFichesByNiveau(
    @Param('kitId', ParseIntPipe) kitId: number,
    @Param('n', ParseIntPipe) n: number,
  ) {
    return this.service.findByNiveau(kitId, n);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Post('kit-fiches')
  createFiche(@Body() body: any) {
    return this.service.createFiche(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch('kit-fiches/:id')
  updateFiche(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.updateFiche(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Delete('kit-fiches/:id')
  deleteFiche(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteFiche(id);
  }

  // ── Kit Exemples ────────────────────────────────────────────────────────────

  @Get('kit-exemples/:kitId')
  getExemples(@Param('kitId', ParseIntPipe) kitId: number) {
    return this.service.findExemplesByKit(kitId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Post('kit-exemples')
  createExemple(@Body() body: any) {
    return this.service.createExemple(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch('kit-exemples/:id')
  updateExemple(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.updateExemple(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Delete('kit-exemples/:id')
  deleteExemple(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteExemple(id);
  }

  // ── Kit Outils ──────────────────────────────────────────────────────────────

  @Get('kit-outils/:kitId')
  getOutils(@Param('kitId', ParseIntPipe) kitId: number) {
    return this.service.findOutilsByKit(kitId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Post('kit-outils')
  createOutil(@Body() body: any) {
    return this.service.createOutil(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch('kit-outils/:id')
  updateOutil(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.updateOutil(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Delete('kit-outils/:id')
  deleteOutil(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteOutil(id);
  }
}
