import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Word from './Word';

@Entity()
export default class Definition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  create_at: Date;

  @ManyToOne(() => Word, (word) => word.definitions)
  word: Word;
}
