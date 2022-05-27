
import {Contract, Wallet, providers, utils} from 'ethers'
import { ExecuteParams } from '../lib/bnpl-helper'

require('dotenv').config()

const contractConfig = {
    address: '0xc7bf3a3dc093347e31976ea79187855d75f913c3',
    abi: require('../abi/BNPLMarket.json')
}


export async function callExecute(): Promise<any> {

    let callData:ExecuteParams = require('../data/output.json')

    let rpcURI = process.env.RINKEBY_RPC_URL
    let privateKey = process.env.WALLET_PRIVATE_KEY

    let rpcProvider = new providers.JsonRpcProvider( rpcURI )
  
    let bnplContractInstance = new Contract(contractConfig.address,contractConfig.abi,rpcProvider)

    let wallet = new Wallet(privateKey).connect(rpcProvider)

    let ethValue = "0.05" //50000000000000000

    let value = utils.parseEther(ethValue).toHexString()
    
    await bnplContractInstance
    .connect(wallet)
    .execute(callData.bidSubmitArgs, 
        callData.lenderAddress, 
        callData.atomicMatchInputs ,
         { value } )
    
   
    return true 
  }
  
  

  
