import { Request, Response, NextFunction } from 'express';
import { Log } from './entities/log.entity';
import { logger } from './logger.middleware';

describe('logger middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    req = {} as Request;
    req.protocol = 'http';
    req.hostname = 'localhost';
    req.originalUrl = '/test';
    req.body = "{ foo:'bar' }";

    const headers = {
      'set-cookie': ['sessionId=123456'],
      Host: 'localhost:3000',
      'X-API-KEY': 'key',
    };

    function get(name: 'set-cookie'): string[];
    function get(name: string): string | undefined;
    function get(name: string): string | string[] | undefined {
      return headers[name];
    }

    req.get = get;

    next = jest.fn();
    Log.create = jest.fn().mockReturnValue({
      save: jest.fn(),
    });
  });

  it('should log request and save log entity to the database', async () => {
    await logger(req, res, next);

    expect(Log.create).toHaveBeenCalledWith({
      apiKey: 'key',
      url: 'http://localhost:3000/test',
      body: "{ foo:'bar' }",
    });
    expect(next).toHaveBeenCalled();
  });
});
