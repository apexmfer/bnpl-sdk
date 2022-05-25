  

export async function generateExecuteInputs(): Promise<any> {

  let inputData = require('../data/inputOrder.json')


  let outputData = {}

  console.log('output ', outputData )
  /*const database = await connectToDatabase()

  const newAuthTokenData = {
    token: web3utils.randomHex(16).toLowerCase(),
    createdAt: Date.now(),
  }

  console.log('Generated token: ', newAuthTokenData.token)

  const insert = await database.AuthTokenModel.insertMany([newAuthTokenData])
*/


  //return insert

  return true 
}
