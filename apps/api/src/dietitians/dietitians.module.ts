import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DietitiansService } from './dietitians.service';
import { DietitiansController } from './dietitians.controller';
import { Dietitian } from './entities/dietitian.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dietitian]),
    UsersModule,
  ],
  controllers: [DietitiansController],
  providers: [DietitiansService],
  exports: [DietitiansService],
})
export class DietitiansModule {}
