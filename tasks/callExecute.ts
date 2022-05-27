
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

    console.log('callData.atomicMatchInputs', JSON.stringify(callData.atomicMatchInputs))
    

    const atomicMatchInputs = {
        addrs: callData.atomicMatchInputs[0],
        uints: callData.atomicMatchInputs[1],
        feeMethodsSidesKindsHowToCalls: callData.atomicMatchInputs[2],
        calldataBuy: callData.atomicMatchInputs[3],
        calldataSell: callData.atomicMatchInputs[4],
        replacementPatternBuy: callData.atomicMatchInputs[5],
        replacementPatternSell: callData.atomicMatchInputs[6],
        //args 7 and 8 must be null for this to work -- they typically are
        vs: callData.atomicMatchInputs[9],
        rssMetadata: callData.atomicMatchInputs[10],
      }


    /* 
    
    struct AtomicMatchInputs {
        address[14] addrs;
        uint256[18] uints;
        uint8[8] feeMethodsSidesKindsHowToCalls;
        bytes calldataBuy;
        bytes calldataSell;
        bytes replacementPatternBuy;
        bytes replacementPatternSell;
        uint8[2] vs;
        bytes32[5] rssMetadata;
    }
    */

    let lenderAddress = callData.lenderAddress


    //this address needs to approve the forwarder on tellerv2
    lenderAddress =  "0xd96Ef5ed7F6978C18f4f26113759dCC20Ab7C28B"

    //Set price to 1 Gwei
    let gasPrice = utils.hexlify(8000000000);
    //Set max gas limit to 4M
    var gasLimit = utils.hexlify(7000000);

    let unsignedTx = await bnplContractInstance
    .populateTransaction
    .execute(callData.bidSubmitArgs, 
        lenderAddress, 
        atomicMatchInputs , {value, gasLimit, gasPrice} )

    let response = await wallet.sendTransaction(unsignedTx);
    console.log('response',response)
         //erc20 low level call failed (weth approval )->sending weth from lender 
    
   
    return true 
  }
  
  

  
