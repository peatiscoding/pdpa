import { makeServerWithRouter, withJson } from 'kolp'

import { HelloController } from '@controllers/hello.controller'

export default makeServerWithRouter((router) => {
  router.prefix('/hello')
    .use(withJson())    // Json error handler!
  
  // Register your controllers here.
  new HelloController().register('', router)
})
