import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { TenantsController } from './tenants.controller';
import { UsersModule } from '../users/users.module';
import { DietitiansModule } from '../dietitians/dietitians.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    UsersModule,
    DietitiansModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
