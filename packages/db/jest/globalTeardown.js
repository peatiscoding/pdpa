module.exports = async () => {
  const ddb = global.__DDB__
  ddb.stop(8002)
  console.log('Configuring Global Teardown')
}