import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import { Response, Request, response } from 'express';
import { request } from 'http';

import { AuthService } from './auth.service';
import UserDto from './dto/UserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() userDto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signUp(userDto);

    response.cookie('token', token, {
      maxAge: 5 * 60 * 1000,
    });
  }

  @Get('/auth')
  async auth(@Req() request: Request) {
    const user = await this.authService.getUser(request);
  }

  @Get('/signout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('token', '-', { maxAge: 5 });
  }

  @Post('/login')
  async login(
    @Body() userDto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(userDto);

    if (token) {
      response.cookie('token', token);
    }
  }

  @Get('/login')
  async validateToken(@Req() request: Request) {
    const user = await this.authService.getUser(request);
  }

  @Get('/home')
  async getHomePageData(@Req() request: Request) {
    const user = await this.authService.getUser(request);

    return user;
  }

  @Get('/user')
  async getUsername(@Req() request: Request) {
    return {
      email: (await this.authService.getUser(request)).email,
    };
  }
}
