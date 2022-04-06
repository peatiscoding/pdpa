import type { Context } from 'koa'
import { BaseRoutedController, Route } from 'kolp'

import { CatModel } from '@models/cat.model'
import { withDynamoDB } from '@middlewares/withDynamoDb'

export class HelloController extends BaseRoutedController {

  @Route({
    method: 'get',
    path: '/',
    middlewares: [],
  })
  async index(_context: Context) {
    return {
      hello: 'world15'
    }
  }

  @Route({
    method: 'post',
    path: '/cat',
    middlewares: [
      withDynamoDB,
    ],
  })
  async create(context: Context) {
    const body = context.request.body
    try {
      const created = await CatModel.create({
        "id": body.id,
        "name": body.name,
      }, {
        return: 'document',
      });
      return created
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  @Route({
    method: 'get',
    path: '/cat/:id',
    middlewares: [
      withDynamoDB,
    ],
  })
  async getOne(context: Context) {
    const id = context.params.id
    const fetched = await CatModel.get(+id);
    return fetched
  }
}