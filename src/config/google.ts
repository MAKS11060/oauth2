import {getRequiredEnv} from '../getRequiredEnv.ts'
import type {Oauth2ClientConfig} from '../oauth2.ts'

/**
 * Returns the OAuth configuration for Google.
 *
 * {@link https://console.cloud.google.com/apis/dashboard}
 */
export const createGoogleOauth2 = (config: {
  redirectUri: string | URL
  /** @see {@linkcode Oauth2ClientConfig.options.scope} */
  scope: string | string[]
}): Oauth2ClientConfig => {
  return {
    clientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
    clientSecret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
    redirectUri: config?.redirectUri?.toString(),
    authorizeUri: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    options: {
      scope: config.scope,
    },
  }
}
