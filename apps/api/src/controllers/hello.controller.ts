import type { Context } from 'koa'
import { BaseRoutedController, Route } from 'kolp'

import { CatModel } from 'db'

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
    ],
  })
  async getOne(context: Context) {
    const id = context.params.id
    const fetched = await CatModel.get(+id);
    return fetched
  }

  @Route({
    method: 'post',
    path: '/cat/:id',
    middlewares: [
    ],
  })
  async update(context: Context) {
    const id = context.params.id
    const body = context.request.body
    try {
      const update = await CatModel.update({
        "id": +id,
      }, {
        "name": body.name,
      }, {
        return: 'document',
      });
      return update
    } catch (e) {
      console.error(e)
      throw e
    }
  }
  @Route({
    method: 'delete',
    path: '/cat/:id',
    middlewares: [
    ],
  })
  async delete(context: Context) {
    const id = context.params.id
    try {
      const deleted = await CatModel.delete({
        id: +id
      })
      return deleted
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}