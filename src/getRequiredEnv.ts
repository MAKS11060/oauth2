export const getRequiredEnv = (key: string): string => {
  if (!Deno.env.has(key)) {
    throw new Error(`"${key}" environment variable must be set`)
  }
  return Deno.env.get(key)!
}
