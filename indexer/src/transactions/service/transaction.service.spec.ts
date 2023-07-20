import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction';
import { TransactionsService } from './transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createTransaction, deleteData } from '../../utils/test';
import { Log } from '../../logger/entities/log.entity';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { getTestingDB } from '../../config';
import { ConfigModule } from '@nestjs/config';

describe('TransactionService', () => {
  let service: TransactionsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [Transaction, Log],
          ...getTestingDB(),
        }),
        TypeOrmModule.forFeature([Transaction]),
      ],
      providers: [TransactionsService],
    }).compile();

    service = module.get(TransactionsService);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    await deleteData();
  });

  describe('getSenderTransactions', () => {
    it('should find the transaction', async () => {
      const transaction = await createTransaction();
      const res = await service.getSenderTransactions(transaction.from);
      expect(res).toEqual([TransactionResponseDto.fromEntity(transaction)]);
    });
  });

  describe('getReceiverTransactions', () => {
    it('should find transaction', async () => {
      const transaction = await createTransaction();
      const res = await service.getReceiverTransactions(transaction.to);
      expect(res).toEqual([TransactionResponseDto.fromEntity(transaction)]);
    });
  });

  describe('getDaiBalance', () => {
    it('should find have the right balance', async () => {
      const balanceAddress = '0x123';
      const transactionEarn = await createTransaction({
        amount: 22,
        to: balanceAddress,
      });
      const transactionLoss = await createTransaction({
        amount: 2,
        from: balanceAddress,
      });
      const res = await service.getDaiBalance(balanceAddress);
      expect(res.balance).toEqual(
        transactionEarn.amount - transactionLoss.amount,
      );
    });
  });

  describe('getTransactions', () => {
    it('should use pagination', async () => {
      await Promise.all([
        createTransaction(),
        createTransaction(),
        createTransaction(),
        createTransaction(),
      ]);
      const pagination = await service.getTransactions(1, 3);
      expect(pagination.transactions.length).toBeGreaterThanOrEqual(0);
      expect(pagination.transactions.length).toBeLessThanOrEqual(3);
    });
  });
});
