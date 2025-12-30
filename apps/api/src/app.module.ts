import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { DietitiansModule } from './dietitians/dietitians.module';
import { User } from './users/entities/user.entity';
import { Tenant } from './tenants/entities/tenant.entity';
import { Dietitian } from './dietitians/entities/dietitian.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'diet_platform',
      entities: [User, Tenant, Dietitian],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TenantsModule,
    AuthModule,
    DietitiansModule,
  ],
})
export class AppModule {}
