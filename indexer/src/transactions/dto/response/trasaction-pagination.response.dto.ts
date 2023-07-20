import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { TransactionResponseDto } from './transaction.response.dto';

export class TransactionPaginationResponseDto {
  @ApiProperty({
    type: TransactionResponseDto,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  transactions: TransactionResponseDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total: number;

  static fromEntity(transactions: TransactionResponseDto[], total: number) {
    const dto = new TransactionPaginationResponseDto();
    dto.transactions = transactions;
    dto.total = total;
    return dto;
  }
}
