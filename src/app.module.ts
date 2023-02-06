import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './auth/auth.module';
import { WordModule } from './word/word.module';
import User from 'typeorm/User';
import UserToken from 'typeorm/UserToken';
import Definition from 'typeorm/Definition';
import Word from 'typeorm/Word';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, UserToken, Definition, Word],
      logging: false,
      synchronize: true,
    }),
    AuthModule,
    WordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
