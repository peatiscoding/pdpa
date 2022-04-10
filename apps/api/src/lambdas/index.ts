import { handlerPath } from "@libs/handler-resolver"

export const hello = {
  name: '${self:custom.stage}-hello',
  handler: `${handlerPath(__dirname)}/handlers/hello.default`,
  events: [
    {
      http: {
        method: 'any',
        path: 'hello/{proxy+}',
      }
    },
    {
      http: {
        method: 'any',
        path: 'hello/',
      }
    }
  ]
}