import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Definition from 'typeorm/Definition';
import User from 'typeorm/User';
import Word from 'typeorm/Word';
import WordCreationDto from './dto/WordCreationDto';
import WordDto from './dto/WordDto';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
    @InjectRepository(Definition)
    private definitionRepository: Repository<Definition>,
  ) {}

  async createWord(user: User, wordCreationDto: WordCreationDto) {
    const { title, definitions } = wordCreationDto;

    const word = new Word();
    word.title = title;
    word.user = user;

    if (definitions) {
      const defsEntities = definitions.map((def) => {
        const newDef = new Definition();
        newDef.text = def;
        return newDef;
      });

      word.definitions = defsEntities;
    }

    return await this.wordRepository.save(word);
  }

  async updateWord(wordDto: WordDto) {
    const { title, definitions: newDefs } = wordDto;

    const word = await this.wordRepository.findOne({
      where: { title },
      relations: ['definitions'],
    });

    if (!word) throw new Error('Something went wrong');

    const prevDefs: Definition[] = word.definitions ? word.definitions : [];

    const defsToSave: Definition[] = [];

    newDefs.forEach(function (newDef) {
      const prevDef = prevDefs.find((d) => d.id === newDef.id);

      if (!prevDef) {
        const def = new Definition();
        def.text = newDef.text;
        def.word = word;
        return defsToSave.push(def);
      }

      const index = prevDefs.indexOf(prevDef);
      prevDefs.splice(index, 1);

      if (prevDef.text !== newDef.text) {
        prevDef.text = newDef.text;
        return defsToSave.push(prevDef);
      }
    });

    if (defsToSave) {
      await this.definitionRepository.save([...defsToSave]);
    }

    if (prevDefs) {
      await this.definitionRepository.remove([...prevDefs]);
    }

    return this.wordRepository.find({
      where: { title },
      relations: ['definitions'],
    });
  }
}
