import {getRequiredEnv} from '../getRequiredEnv.ts'
import type {Oauth2ClientConfig} from '../oauth2.ts'

/**
 * Returns the OAuth configuration for Discord.
 *
 * {@link https://discord.com/developers/applications}
 */
export const createDiscordOauth2 = (config: {
  redirectUri: string | URL
  scope: string | string[]
  prompt?: 'none' | 'consent'
}): Oauth2ClientConfig => {
  return {
    clientId: getRequiredEnv('DISCORD_CLIENT_ID'),
    clientSecret: getRequiredEnv('DISCORD_CLIENT_SECRET'),
    redirectUri: config.redirectUri.toString(),
    authorizeUri: 'https://discord.com/oauth2/authorize',
    tokenUri: 'https://discord.com/api/oauth2/token',
    options: {
      scope: config.scope,
      requestOptions: {
        params: {
          ...(config.prompt && {prompt: config.prompt}),
        },
      },
    },
  }
}
