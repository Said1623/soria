import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domaine } from './entities/domaine.entity';
import { DomainesService } from './domaines.service';
import { DomainesController } from './domaines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Domaine])],
  providers: [DomainesService],
  controllers: [DomainesController],
  exports: [TypeOrmModule],
})
export class DomainesModule {}
