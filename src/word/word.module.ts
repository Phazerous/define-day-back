import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import Definition from 'typeorm/Definition';
import User from 'typeorm/User';
import UserToken from 'typeorm/UserToken';
import Word from 'typeorm/Word';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word, Definition, User, UserToken])],
  controllers: [WordController],
  providers: [WordService, AuthService],
})
export class WordModule {}
