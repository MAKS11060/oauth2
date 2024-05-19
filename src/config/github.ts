import {getRequiredEnv} from '../getRequiredEnv.ts'
import type {Oauth2ClientConfig} from '../oauth2.ts'

/**
 * Returns the OAuth configuration for Github.
 *
 * {@link https://github.com/settings/developers}
 */
export const createGithubOauth2 = (config: {
  redirectUri?: string | URL
  scope?: string | string[]
  /** Suggests a specific account to use for signing in and authorizing the app. */
  login?: string
  /**
   * Whether or not unauthenticated users will be offered an option to sign up for
   * GitHub during the OAuth flow. The default is `true`. Use `false` when a policy prohibits signups.
   * */
  allowSignup?: 'true' | 'false'
}): Oauth2ClientConfig => {
  return {
    clientId: getRequiredEnv('GITHUB_CLIENT_ID'),
    clientSecret: getRequiredEnv('GITHUB_CLIENT_SECRET'),
    redirectUri: config?.redirectUri?.toString(),
    authorizeUri: 'https://github.com/login/oauth/authorize',
    tokenUri: 'https://github.com/login/oauth/access_token',
    options: {
      scope: config?.scope,
      requestOptions: {
        params: {
          ...(config.allowSignup && {allow_signup: config.allowSignup}),
        },
      },
    },
  }
}
