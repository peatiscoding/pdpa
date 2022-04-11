import { handlerPath, ServerlessFnDef } from "@libs/handler-resolver"

const def = new ServerlessFnDef(`${handlerPath(__dirname)}/handlers`)
  .fn('cat')
  .fn('hello')
  .functions()

export default def