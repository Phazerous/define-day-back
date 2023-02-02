import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import User from './User';

@Entity()
export default class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
