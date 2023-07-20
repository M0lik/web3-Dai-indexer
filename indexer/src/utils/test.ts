import { DeepPartial } from 'typeorm';
import { Log } from '../logger/entities/log.entity';
import { Transaction } from '../transactions/entities/transaction';

export const createTransaction = async (data: DeepPartial<Transaction> = {}) =>
  Transaction.create<Transaction>({
    hash: randomString(),
    blockNumber: randomNumber(),
    from: randomString(),
    to: randomString(),
    amount: randomNumber(),
    ...data,
  }).save();

export const randomString = () => {
  return Math.random().toString();
};

export const randomNumber = () => {
  return Math.floor(Math.random() * 1000);
};

export const deleteData = async () => {
  await Transaction.delete({});
  await Log.delete({});
};
