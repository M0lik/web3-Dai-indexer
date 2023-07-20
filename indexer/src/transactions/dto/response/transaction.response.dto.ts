import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transaction } from '../../entities/transaction';

export class TransactionResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  blockNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  static fromEntity(transaction: Transaction) {
    const dto = new TransactionResponseDto();
    dto.amount = transaction.amount;
    dto.blockNumber = transaction.blockNumber;
    dto.hash = transaction.hash;
    dto.from = transaction.from;
    dto.to = transaction.to;
    return dto;
  }
}
