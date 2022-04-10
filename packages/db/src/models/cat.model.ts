import dynamoose from './ddb'
import { Document } from 'dynamoose/dist/Document'

export class Cat extends Document {
  id: number
  name: string
}

const schema = new dynamoose.Schema({
  id: {
    type: Number,
    hashKey: true,
  },
  name: {
    type: String,
  }
})

export const CatModel = dynamoose.model<Cat>(`${process.env.TABLE_NAME_CAT}`, schema, {
  create: true,
})