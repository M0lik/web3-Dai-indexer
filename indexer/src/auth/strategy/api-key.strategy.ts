import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ApiValidKeys } from './apiKeys.mock';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor() {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apiKey: string, done) => this.validate(apiKey, done),
    );
  }

  public validate = (apiKey: string, done) => {
    return ApiValidKeys.some((key) => key === apiKey)
      ? done(null, true)
      : done(new UnauthorizedException(), null);
  };
}
