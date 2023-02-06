import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import WordCreationDto from './dto/WordCreationDto';
import WordDto from './dto/WordDto';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(
    private wordService: WordService,
    private authService: AuthService,
  ) {}

  @Post('')
  async createWord(
    @Body() wordCreationDto: WordCreationDto,
    @Req() request: Request,
  ) {
    const user = await this.authService.getUser(request);

    const word = await this.wordService.createWord(user, wordCreationDto);

    console.log(word);

    return word;
  }

  // @Get('/next')
  // async updateWord(@Body() WordDto: WordDto) {
  //   console.log(WordDto);
  //   return await this.wordService.updateWord(WordDto);
  // }
}
