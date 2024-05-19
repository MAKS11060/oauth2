interface RequestOptions {
  /** Additional Headers */
  headers?: HeadersInit
  /** Additional URI Params */
  params?: Iterable<string[]> | Record<string, string> | string
}

export interface Oauth2ClientConfig {
  clientId: string
  clientSecret?: string
  /** @example https://localhost/api/oauth2/callback */
  redirectUri?: string
  authorizeUri: string
  tokenUri: string
  pkce?: boolean
  options?: {
    scope?: string | string[]
    requestOptions?: RequestOptions
  }
}

export interface AccessTokenResponse {
  access_token: string
  token_type: 'Bearer' | string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export interface Oauth2Token {
  tokenType: 'Bearer'
  expiresIn?: number
  accessToken: string
  refreshToken: string | null
  scope: string[]
}

/**
 * Format oauth2
 */
export const oauth2Token = (token: AccessTokenResponse): Oauth2Token => {
  token.scope ??= ''
  return {
    tokenType: 'Bearer',
    expiresIn: token.expires_in,
    accessToken: token.access_token,
    refreshToken: token.refresh_token || null,
    scope: token.scope ? token.scope.split(',').map((v) => v.trim()) : [],
  }
}

/**
 * Get `oauth2` authorization {@linkcode URL}
 */
export const oauth2Authorize = (config: Oauth2ClientConfig, state?: string): URL => {
  const uri = new URL(config.authorizeUri)

  uri.searchParams.set('response_type', 'code')
  uri.searchParams.set('client_id', config.clientId)

  if (config?.redirectUri)
    uri.searchParams.set('redirect_uri', config.redirectUri)

  const scope = config.options?.scope
  if (scope) {
    uri.searchParams.set(
      'scope',
      Array.isArray(scope) ? scope.join(' ') : scope
    )
  }

  if (state) uri.searchParams.set('state', state)

  if (config.options?.requestOptions?.params) {
    new URLSearchParams(config.options?.requestOptions?.params).forEach(
      (v, k) => uri.searchParams.append(k, v)
    )
  }

  return uri
}

export const oauth2ExchangeCode = async (
  config: Oauth2ClientConfig,
  options: {
    code: string
    /** pkce verify code */
    codeVerifier?: string
  }
) => {
  const headers = new Headers({
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
    ...config.options?.requestOptions?.headers,
  })
  const body = new URLSearchParams()

  body.set('grant_type', 'authorization_code')
  body.set('client_id', config.clientId)
  body.set('code', options.code)

  if (config.clientSecret) body.set('client_secret', config.clientSecret)
  if (config.redirectUri) body.set('redirect_uri', config.redirectUri)
  if (options.codeVerifier) body.set('code_verifier', options.codeVerifier)

  const res = await fetch(config.tokenUri, {method: 'POST', headers, body})
  if (!res.ok) throw await res.text()
  return (await res.json()) as AccessTokenResponse
}

export const oauth2RefreshToken = async (
  config: Oauth2ClientConfig,
  refreshToken: string
) => {
  const headers = new Headers({
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
    ...config.options?.requestOptions?.headers,
  })
  const body = new URLSearchParams()

  body.set('grant_type', 'refresh_token')
  body.set('client_id', config.clientId)
  body.set('refresh_token', refreshToken)

  if (config.clientSecret) body.set('client_secret', config.clientSecret)

  const res = await fetch(config.tokenUri, {method: 'POST', headers, body})
  if (!res.ok) throw await res.text()
  return (await res.json()) as AccessTokenResponse
}
