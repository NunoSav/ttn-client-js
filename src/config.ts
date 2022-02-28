import { ClientOptions } from './client';

export interface TTNConfig extends Partial<ClientOptions> {
  headers?: Record<string, string>;
}

export const ttnConfig: TTNConfig = {};

export function setConfigValues(config: TTNConfig): void {
  if (config.apiKey && config.apiKey !== '') setAPIKey(config.apiKey);
  if (config.domain && config.domain !== '') setDomain(config.domain);
}

export function setAPIKey(key: string): void {
  const keyParts = key.split('.');

  if (keyParts.length !== 3)
    throw new Error(
      'API Key is malformatted. The key should have the following format: <token-type>.<token-id>.<token-secret>. Refer to https://www.thethingsindustries.com/docs/reference/api/authentication/ for more information.'
    );

  ttnConfig.apiKey = key;
  setHeaders(key);
}

export function setDomain(domain: string): void {
  // TODO: add validation

  ttnConfig.domain = domain;
}

function setHeaders(apiKey: string): void {
  ttnConfig.headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}
