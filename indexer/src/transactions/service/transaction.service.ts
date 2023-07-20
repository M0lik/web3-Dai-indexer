import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { TransactionPaginationResponseDto } from '../dto/response/trasaction-pagination.response.dto';
import { Transaction } from '../entities/transaction';

@Injectable()
export class TransactionsService {
  @InjectRepository(Transaction)
  private transactionRepository: Repository<Transaction>;

  async getSenderTransactions(
    address: string,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { from: address },
    });

    return transactions.map((transaction) =>
      TransactionResponseDto.fromEntity(transaction),
    );
  }

  async getReceiverTransactions(
    address: string,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { to: address },
    });

    return transactions.map((transaction) =>
      TransactionResponseDto.fromEntity(transaction),
    );
  }

  async getDaiBalance(address: string): Promise<BalanceResponseDto> {
    //we get the difference between the sum of earns and the of sum of expenses for a specific address
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select(
        'SUM(CASE WHEN "to" = :address THEN amount ELSE 0 END) - SUM(CASE WHEN "from" = :address THEN amount ELSE 0 END)',
        'balance',
      )
      .where('"from" = :address OR "to" = :address', { address })
      .getRawOne();

    return new BalanceResponseDto(address, result.balance);
  }

  async getTransactions(
    page = 1,
    result_per_page = 100,
  ): Promise<TransactionPaginationResponseDto> {
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        skip: (page - 1) * result_per_page,
        take: result_per_page,
      },
    );

    return TransactionPaginationResponseDto.fromEntity(transactions, total);
  }
}
