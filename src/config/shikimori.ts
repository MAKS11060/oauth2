import {getRequiredEnv} from '../getRequiredEnv.ts'
import type {Oauth2ClientConfig} from '../oauth2.ts'

/**
 * Returns the OAuth configuration for Shikimori.
 *
 * {@link https://shikimori.me/oauth/applications}
 */
export const createShikimoriOauth2 = (config: {
  redirectUri: string | URL
  scope: string | string[]
  userAgent: string
}): Oauth2ClientConfig => {
  const origin = new URL('https://shikimori.me')
  return {
    clientId: getRequiredEnv('SHIKIMORI_CLIENT_ID'),
    clientSecret: getRequiredEnv('SHIKIMORI_CLIENT_SECRET'),
    redirectUri: config.redirectUri.toString(),
    authorizeUri: new URL('/oauth/authorize', origin).toString(),
    tokenUri: new URL('/oauth/token', origin).toString(),
    // revokeUri: new URL('/oauth/revoke', origin).toString(),
    options: {
      scope: config.scope,
      requestOptions: {
        headers: {
          'User-Agent': config.userAgent,
        },
      },
    },
  }
}
