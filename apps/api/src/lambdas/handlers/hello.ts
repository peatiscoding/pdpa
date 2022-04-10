import { makeServerWithRouter, withJson } from 'kolp'

import { HelloController } from '@controllers/hello.controller'

console.log('process.env.TABLE_NAME_CAT', process.env.TABLE_NAME_CAT, process.env.STAGE)

export default makeServerWithRouter((router) => {
  router.prefix('/hello')
    .use(withJson())    // Json error handler!
  
  // Register your controllers here.
  new HelloController().register('', router)
})
