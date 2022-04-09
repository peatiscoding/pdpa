import { CatModel } from "../models/cat.model"

describe('model', () => {
  beforeAll((done) => {
    done()
  })

  const testingId = Math.floor(Math.random() * 30000 + 30000)

  it('can createa a new cat', async () => {
    const cat = await CatModel.create({
      id: testingId,
      name: "Testing Cat",
    }, {
      return: 'document'
    })
    expect(cat).toBeTruthy()
  })

  it('can be deleted', async () => {
    const deleted = await CatModel.delete({
      id: testingId,
    })

    expect(deleted).toBeFalsy()
  })
})