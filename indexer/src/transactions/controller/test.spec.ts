import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TransactionsModule } from '../transactions.module';
import { createTransaction, deleteData } from '../../utils/test';
import { Transaction } from '../entities/transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTestingDB } from '../../config';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { Log } from '../../logger/entities/log.entity';
import { AuthModule } from '../../auth/auth.module';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { TransactionQueryRequestDto } from '../dto/request/transaction-query.request.dto';

describe('Transaction controller (e2e)', () => {
  let app: INestApplication;
  const apiKey = 'key1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [Transaction, Log],
          ...getTestingDB(),
        }),
        TypeOrmModule.forFeature([Transaction]),
        AuthModule,
        TransactionsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await deleteData();
  });

  describe('/receiver', () => {
    it('Should get transactions where address is a receiver', async () => {
      const receiverAddress = 'receiver1';

      const transaction = await createTransaction({
        to: receiverAddress,
      });

      request(app.getHttpServer())
        .get(`/transactions/receiver/${receiverAddress}`)
        .set('X-API-KEY', apiKey)
        .expect(200)
        .expect((req) => {
          expect(req.body).toEqual([
            TransactionResponseDto.fromEntity(transaction),
          ]);
        });
    });
  });

  describe('/sender', () => {
    it('Should get transactions where address is a sender', async () => {
      const senderAddress = 'sender1';

      const transaction = await createTransaction({
        from: senderAddress,
      });

      return request(app.getHttpServer())
        .get(`/transactions/sender/${senderAddress}`)
        .set('X-API-KEY', apiKey)
        .expect(200)
        .expect((req) => {
          expect(req.body).toEqual([
            TransactionResponseDto.fromEntity(transaction),
          ]);
        });
    });
  });

  describe('/balance', () => {
    it('Should get balance of the address from db', async () => {
      const address = 'address';

      const transaction = await createTransaction({
        from: address,
      });

      const transaction2 = await createTransaction({
        to: address,
      });

      return request(app.getHttpServer())
        .get(`/transactions/balance/${address}`)
        .set('X-API-KEY', apiKey)
        .expect(200)
        .expect((req) => {
          expect(req.body.balance).toEqual(
            transaction2.amount - transaction.amount,
          );
        });
    });
  });

  describe('/transactions', () => {
    it('should return an array of transactions and a number', async () => {
      await Promise.all([
        createTransaction(),
        createTransaction(),
        createTransaction(),
      ]);

      const payload: TransactionQueryRequestDto = {
        page: 1,
        result_per_page: 2,
      };

      return request(app.getHttpServer())
        .post(`/transactions`)
        .set('X-API-KEY', apiKey)
        .send(payload)
        .expect(200)
        .expect((req) => {
          expect(req.body.total).toEqual(3);
          expect(req.body.transactions.length).toEqual(2);
        });
    });
  });
});
