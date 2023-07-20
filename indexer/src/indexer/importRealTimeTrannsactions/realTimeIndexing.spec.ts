import Web3 from 'web3';
import { Contract, EventData } from 'web3-eth-contract';
import { Repository } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction';
import { listenForTransactions } from './realTimeIndexing';

describe('listenForTransactions', () => {
  let web3: Web3;
  let daiContract: Contract;
  let transactionRepository: Repository<Transaction>;

  beforeEach(() => {
    // Mock the required dependencies
    web3 = {} as Web3;
    web3.utils = Web3.utils;
    daiContract = {} as Contract;
    transactionRepository = {} as Repository<Transaction>;
    transactionRepository.create = jest.fn().mockReturnValue({
      save: jest.fn(),
    });

    // Mock the events.Transfer function to return a mock event object
    daiContract.events = {
      Transfer: jest.fn().mockImplementation((options, callback) => {
        callback(null, {
          address: '',
          transactionHash: '0x1234',
          blockNumber: 1234,
          returnValues: {
            from: '0x1111',
            to: '0x2222',
            value: '1000000000000000000', // 1 in wei
          },
          raw: null,
          event: null,
          signature: null,
          logIndex: null,
          transactionIndex: null,
          blockHash: null,
        } as EventData);
      }),
    };
  });

  it('should listen for transactions', async () => {
    await listenForTransactions(web3, daiContract, transactionRepository);

    expect(daiContract.events.Transfer).toHaveBeenCalled();
    expect(transactionRepository.create).toHaveBeenCalledWith({
      hash: '0x1234',
      blockNumber: 1234,
      from: '0x1111',
      to: '0x2222',
      amount: 1,
    });
  });
});
