import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { getInfuraKey } from '../../config';
import { DAI_ABI } from '../../transactions/daiAbi';
import { Transaction } from '../../transactions/entities/transaction';
import { listenForTransactions } from '../importRealTimeTrannsactions/realTimeIndexing';

@Injectable()
export class IndexerService implements OnModuleInit {
  private web3: Web3;
  private daiContract: Contract;

  @InjectRepository(Transaction)
  private transactionRepository: Repository<Transaction>;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        `wss://mainnet.infura.io/ws/v3/${getInfuraKey()}`,
      ),
    );
    this.daiContract = new this.web3.eth.Contract(
      DAI_ABI,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
    );
  }

  async onModuleInit(): Promise<void> {
    await listenForTransactions(
      this.web3,
      this.daiContract,
      this.transactionRepository,
    );
  }
}
