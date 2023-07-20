import { Request, Response, NextFunction } from 'express';
import { Log } from './entities/log.entity';

export async function logger(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.get('X-API-KEY');
  const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
  const body = req.body;

  await Log.create({
    apiKey: apiKey,
    url,
    body,
  }).save();

  next();
}
