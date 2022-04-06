import { handlerPath } from "@libs/handler-resolver"

export const hello = {
  name: 'hello',
  handler: `${handlerPath(__dirname)}/handlers/hello.default`,
  events: [
    {
      http: {
        method: 'any',
        path: 'hello/{proxy+}',
      }
    }
  ]
}