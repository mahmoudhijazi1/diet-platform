import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Tenant } from './tenants/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'diet_platform',
      entities: [User, Tenant],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TenantsModule,
    AuthModule,
  ],
})
export class AppModule {}
