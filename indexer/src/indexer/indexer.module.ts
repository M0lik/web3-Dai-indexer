import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction';
import { IndexerService } from './service/indexer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [IndexerService],
})
export class IndexerModule {}
