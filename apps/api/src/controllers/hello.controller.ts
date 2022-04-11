import type { Context } from 'koa'
import { BaseRoutedController, Route } from 'kolp'

export class HelloController extends BaseRoutedController {

  @Route({
    method: 'get',
    path: '/hi',
    middlewares: [],
  })
  async index(_context: Context) {
    return {
      hello: 'world!'
    }
  }
}