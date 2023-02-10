import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserDto from './dto/UserDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'typeorm/User';
import UserToken from 'typeorm/UserToken';
import { nanoid } from 'nanoid';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async signUp(userDto: UserDto) {
    const { email, password } = userDto;

    const user = await this.getUserByEmail(email);

    if (user)
      throw new HttpException(
        'User with specified email address already exists.',
        HttpStatus.BAD_REQUEST,
      );

    const userEntity = await this.userRepository.save({ email, password });

    const token = await this.generateToken(userEntity);

    return token;
  }

  async login(userDto: UserDto) {
    const { email, password } = userDto;

    const user = await this.getUserByEmail(email);

    if (!user)
      throw new HttpException(
        `User with specified email address does not exist.`,
        HttpStatus.BAD_REQUEST,
      );

    if (password !== user.password)
      throw new HttpException('Wrong passoword', HttpStatus.BAD_REQUEST);

    const token = this.generateToken(user);

    return token;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async generateToken(user: User) {
    const tokenEntity = await this.userTokenRepository.save({
      token: nanoid(),
      user,
    });

    const { token } = tokenEntity;

    return token;
  }

  async getUser(request: Request) {
    const token = request.cookies['token'];

    if (!token)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const user = await this.userTokenRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token = :tokenId', { tokenId: token })
      .getOne();

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return user.user;
  }
}
