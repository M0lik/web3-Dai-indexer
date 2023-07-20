import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  apiKey: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  body: string;
}
