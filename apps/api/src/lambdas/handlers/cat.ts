import { makeServerWithRouter, withJson } from 'kolp'

import { CatController } from '@controllers/cat.controller'

export default makeServerWithRouter((router) => {
  router.prefix('/cat')
    .use(withJson())    // Json error handler!
  
  // Register your controllers here.
  new CatController().register('', router)
})
