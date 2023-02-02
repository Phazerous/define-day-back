import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'typeorm/User';
import UserToken from 'typeorm/UserToken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToken])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
