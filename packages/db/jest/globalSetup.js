module.exports = async () => {
  const path = require('path')
  const fs = require('fs')
  const ddb = require('dynamodb-localhost')
  const basePath = `${path.dirname(__filename)}/.dynamodb`
  console.log('Configuring Global Setup on:', basePath)
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath)
  }
  await new Promise((resolve) => ddb.install(resolve, basePath))
  ddb.start({
    port: 8002,
    sharedDb: true,
    inMemory: true,
  })
  global.__DDB__ = ddb
}