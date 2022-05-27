

 
import {ethers} from 'ethers'

import moment from 'moment'

import { NULL_BLOCK_HASH } from 'opensea-js/lib/constants'

import { OpenseaHelper, SignedOrder, UnhashedOrder } from '../lib/opensea-helper'
 
import fs from 'fs';
import { BidSubmitArgs, ExecuteParams } from '../lib/bnpl-helper';

const OrderSide = {
  Buy: 0,
  Sell: 1
}


export async function generateExecuteInputs(): Promise<any> {

  let inputData = require('../data/inputOrder.json')


  let outputData = buildExecuteParams( inputData  )


  try {
    fs.writeFileSync('data/output.json', JSON.stringify(outputData) );
    // file written successfully
  } catch (err) {
    console.error(err);
  }
    console.log('output ', outputData )
  
 
  return true 
}



export function buildExecuteParams(inputData:any): any {

  let bidSubmitArgs:BidSubmitArgs = {
    lendingToken: "0xc778417e063141139fce010982780140aa0cd5ab",  //wethAddress rinkeby
    principal: inputData.tellerInputs.loanRequired,
    duration: inputData.tellerInputs.duration,
    APR: inputData.tellerInputs.interestRate,
    metadataURI: "ipfs://"
  }
 
  /*
  

  need to make sure that howToCall being 1 (merkle validator) is OK 

  */


  //deployed on rinkeby 
  let bnplContractAddress = "0x1001374a2Ed4b486A403733dC032032711AdF3ee" 

  let openSeaData = inputData.openSeaResponse

  //this comes from the opensea API 
  let sellOrderWithSignature:SignedOrder = {
    feeMethod: openSeaData.feeMethod,
    side: OrderSide.Sell,
    saleKind: openSeaData.saleKind,
    howToCall: openSeaData.howToCall,
    quantity: openSeaData.quantity,
    makerReferrerFee: openSeaData.makerReferrerFee,
    waitingForBestCounterOrder: openSeaData.waitingForBestCounterOrder,
    metadata: openSeaData.metadata,
    exchange: openSeaData.exchange,
    maker: openSeaData.maker,
    taker: openSeaData.taker,
    makerRelayerFee: openSeaData.makerRelayerFee,
    takerRelayerFee: openSeaData.takerRelayerFee,
    makerProtocolFee: openSeaData.makerProtocolFee,
    takerProtocolFee: openSeaData.takerProtocolFee,
    feeRecipient: openSeaData.feeRecipient,
    target: openSeaData.target,
    calldata: openSeaData.calldata,
    replacementPattern: openSeaData.replacementPattern,
    staticTarget: openSeaData.staticTarget,
    staticExtradata: openSeaData.staticExtradata,
    paymentToken: openSeaData.paymentToken,
    basePrice: openSeaData.basePrice,
    extra: openSeaData.extra,
    listingTime: openSeaData.listingTime,
    expirationTime: openSeaData.expirationTime,
    salt: openSeaData.salt,
    hash: openSeaData.orderHash,
    v: openSeaData.v, 
    r: openSeaData.r,
    s: openSeaData.s 
  } 

  //need the sig for this  ^ 


  //waitingForBestCounterOrder should be false 

  const minListingTimestamp = Math.round(Date.now() / 1000)

  const listingTime = minListingTimestamp - 300 // + moment.duration(1,'day').asSeconds()
  const expirationTime = listingTime + moment.duration(2, 'days').asSeconds() //getMaxOrderExpirationTimestamp()

  //we build this ourselves and dont need to sign it 
  let newBuyOrder:UnhashedOrder = {
    feeMethod: openSeaData.feeMethod,
    side: OrderSide.Buy,
    saleKind: openSeaData.saleKind,
    howToCall: openSeaData.howToCall,
    quantity: openSeaData.quantity,
    makerReferrerFee: openSeaData.makerReferrerFee,
    waitingForBestCounterOrder: openSeaData.waitingForBestCounterOrder,
    metadata: openSeaData.metadata,
    exchange: openSeaData.exchange,
    maker: bnplContractAddress,  //the buyer (bnpl contract) 
    taker: openSeaData.maker,  // the seller
    makerRelayerFee: openSeaData.takerRelayerFee,
    takerRelayerFee: openSeaData.makerRelayerFee,
    makerProtocolFee: OpenseaHelper.makeBigNumber(0),
    takerProtocolFee: OpenseaHelper.makeBigNumber(0),
    feeRecipient:  ethers.constants.AddressZero,// must be zero
    target: openSeaData.target,
    calldata: openSeaData.calldata,
    replacementPattern: openSeaData.replacementPattern,
    staticTarget: openSeaData.staticTarget,
    staticExtradata: openSeaData.staticExtradata,
    paymentToken: openSeaData.paymentToken,
    basePrice: openSeaData.basePrice,
    extra: openSeaData.extra,
    listingTime: openSeaData.listingTime,
    expirationTime: OpenseaHelper.makeBigNumber(expirationTime),
    salt: OpenseaHelper.generatePseudoRandomSalt()
  } 


  let buyOrderWithSignature:SignedOrder = Object.assign(newBuyOrder ,{
    hash:"",
    v:0,
    r:NULL_BLOCK_HASH,
    s:NULL_BLOCK_HASH
  })

  console.log('sellOrderWithSignature',sellOrderWithSignature)


  console.log('buyOrderWithSignature',buyOrderWithSignature)


  let atomicMatchInputs = OpenseaHelper.buildWyvernAtomicMatchParamsFromOrders( 
    sellOrderWithSignature,
    buyOrderWithSignature

  ) 
 

  let lenderAddress = "" 

  let outputData: ExecuteParams = {
    bidSubmitArgs,
    lenderAddress,
    atomicMatchInputs
  }

  return outputData 
}