import type { Context } from 'koa'
import { BaseRoutedController, Route } from 'kolp'

import { CatModel } from 'db'

export class CatController extends BaseRoutedController {

  @Route({
    method: 'get',
    path: '/hi',
    middlewares: [],
  })
  async index(_context: Context) {
    return {
      hello: 'meow'
    }
  }

  @Route({
    method: 'post',
    path: '/',
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
    path: '/:id',
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
    path: '/:id',
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
    path: '/:id',
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