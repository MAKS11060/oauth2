import {getRequiredEnv} from '../getRequiredEnv.ts'
import type {Oauth2ClientConfig} from '../oauth2.ts'

/**
 * Returns the OAuth configuration for Example.
 *
 * {@link https://example.com} Developer site
 */
export const createExampleOauth2 = (config: {
  redirectUri: string | URL
  scope: string | string[]
}): Oauth2ClientConfig => {
  return {
    clientId: getRequiredEnv('CLIENT_ID'),
    clientSecret: getRequiredEnv('CLIENT_SECRET'),
    redirectUri: config.redirectUri.toString(),
    authorizeUri: 'https://example.com/oauth2/authorize',
    tokenUri: 'https://example.com/api/oauth2/token',
    options: {
      scope: config.scope,
    },
  }
}
