import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Definition from './Definition';
import User from './User';

@Entity()
export default class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.words)
  user: User;

  @OneToMany(() => Definition, (definition) => definition.word)
  definitions: Definition[];
}
