module.exports = {
  ...require("config/jest.service.config"),
  globalSetup: './jest/globalSetup',
  globalTeardown: './jest/globalTeardown',
}