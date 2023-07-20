import { Repository } from 'typeorm';
import Web3 from 'web3';
import { Contract, EventData } from 'web3-eth-contract';
import { Transaction } from '../../transactions/entities/transaction';

export async function listenForTransactions(
  web3: Web3,
  daiContract: Contract,
  transactionRepository: Repository<Transaction>,
) {
  daiContract.events.Transfer(
    {
      fromBlock: 'latest',
    },
    async (error, event: EventData) => {
      if (error) console.error('Error: ', error);
      else if (event) {
        await transactionRepository
          .create({
            hash: event.transactionHash,
            blockNumber: event.blockNumber,
            from: event.returnValues.from,
            to: event.returnValues.to,
            amount: parseFloat(web3.utils.fromWei(event.returnValues.value)),
          })
          .save();
      }
    },
  );
}
