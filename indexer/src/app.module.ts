import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { getDevlopmentDB } from './config';
import { IndexerModule } from './indexer/indexer.module';
import { Log } from './logger/entities/log.entity';
import { Transaction } from './transactions/entities/transaction';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Transaction, Log],
      ...getDevlopmentDB(),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    TransactionsModule,
    AuthModule,
    IndexerModule,
  ],
})
export class MainModule {}
