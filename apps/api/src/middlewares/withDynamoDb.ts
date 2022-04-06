import type { Middleware } from 'koa'


export const withDynamoDB: Middleware = async (_context, next) => {
  // Using local
  await next()
}