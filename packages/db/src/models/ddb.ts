import type { DynamoDB } from 'aws-sdk'
import * as dynamoose from 'dynamoose'

let _ddb: DynamoDB | undefined = undefined
let _ddm: (typeof dynamoose) | undefined = undefined

export const getDdb = (): DynamoDB => {
  if (!_ddb) {  
    _ddb = new dynamoose.aws.sdk.DynamoDB({
      // "accessKeyId": "AKID",
      // "secretAccessKey": "SECRET",
      "region": "us-east-1",
      "endpoint": "http://localhost:8002",
    })
  }
  return _ddb
}

export const getDynamoose = (): typeof dynamoose => {
  if (!_ddm) {
    _ddm = dynamoose
    dynamoose.aws.ddb.set(getDdb())
  }
  return _ddm
}

export default getDynamoose()