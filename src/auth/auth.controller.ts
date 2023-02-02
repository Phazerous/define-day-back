import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

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

    if (token) {
      response.cookie('token', token, {
        maxAge: 60 * 1000,
      });
    }
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

  @Get('/home')
  async getHomePageData(@Req() request: Request) {
    const token = request.cookies['token'];
    await this.authService.getHomePageData(token);
  }
}
