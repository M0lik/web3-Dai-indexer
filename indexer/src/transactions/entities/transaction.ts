import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  blockNumber: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ type: 'float' })
  amount: number;
}
