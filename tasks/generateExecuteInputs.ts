

 
import {ethers} from 'ethers'

import moment from 'moment'

import { NULL_BLOCK_HASH } from 'opensea-js/lib/constants'

import { OpenseaHelper, SignedOrder, UnhashedOrder } from '../lib/opensea-helper'
 
const OrderSide = {
  Buy: 0,
  Sell: 1
}


export async function generateExecuteInputs(): Promise<any> {

  let inputData = require('../data/inputOrder.json')

  let bidSubmitArgs = {
    lendingToken: "0xc778417e063141139fce010982780140aa0cd5ab",  //wethAddress rinkeby
    principal: inputData.loanRequired,
    duration: inputData.duration,
    APR: inputData.interestRate,
    metadataURI: "ipfs://"
  }
 
  /*
  

  need to make sure that howToCall being 1 (merkle validator) is OK 

  */

  let bnplContractAddress = "" 

  //this comes from the opensea API 
  let sellOrderWithSignature:SignedOrder = {
    feeMethod: inputData.feeMethod,
    side: OrderSide.Sell,
    saleKind: inputData.saleKind,
    howToCall: inputData.howToCall,
    quantity: inputData.quantity,
    makerReferrerFee: inputData.makerReferrerFee,
    waitingForBestCounterOrder: inputData.waitingForBestCounterOrder,
    metadata: inputData.metadata,
    exchange: inputData.exchange,
    maker: inputData.maker,
    taker: inputData.taker,
    makerRelayerFee: inputData.makerRelayerFee,
    takerRelayerFee: inputData.takerRelayerFee,
    makerProtocolFee: inputData.makerProtocolFee,
    takerProtocolFee: inputData.takerProtocolFee,
    feeRecipient: inputData.feeRecipient,
    target: inputData.target,
    calldata: inputData.calldata,
    replacementPattern: inputData.replacementPattern,
    staticTarget: inputData.staticTarget,
    staticExtradata: inputData.StaticExtradata,
    paymentToken: inputData.paymentToken,
    basePrice: inputData.basePrice,
    extra: inputData.extra,
    listingTime: inputData.listingTime,
    expirationTime: inputData.expirationTime,
    salt: inputData.salt,
    hash: inputData.orderHash,
    v: inputData.v, 
    r: inputData.r,
    s: inputData.s 
  } 

  //need the sig for this  ^ 


  //waitingForBestCounterOrder should be false 

  const minListingTimestamp = Math.round(Date.now() / 1000)

  const listingTime = minListingTimestamp - 300 // + moment.duration(1,'day').asSeconds()
  const expirationTime = listingTime + moment.duration(2, 'days').asSeconds() //getMaxOrderExpirationTimestamp()

  //we build this ourselves and dont need to sign it 
  let newBuyOrder:UnhashedOrder = {
    feeMethod: inputData.feeMethod,
    side: OrderSide.Buy,
    saleKind: inputData.saleKind,
    howToCall: inputData.howToCall,
    quantity: inputData.quantity,
    makerReferrerFee: inputData.makerReferrerFee,
    waitingForBestCounterOrder: inputData.waitingForBestCounterOrder,
    metadata: inputData.metadata,
    exchange: inputData.exchange,
    maker: bnplContractAddress,  //the buyer (bnpl contract) 
    taker: inputData.maker,  // the seller
    makerRelayerFee: inputData.takerRelayerFee,
    takerRelayerFee: inputData.makerRelayerFee,
    makerProtocolFee: OpenseaHelper.makeBigNumber(0),
    takerProtocolFee: OpenseaHelper.makeBigNumber(0),
    feeRecipient:  ethers.constants.AddressZero,// must be zero
    target: inputData.target,
    calldata: inputData.calldata,
    replacementPattern: inputData.replacementPattern,
    staticTarget: inputData.staticTarget,
    staticExtradata: inputData.StaticExtradata,
    paymentToken: inputData.paymentToken,
    basePrice: inputData.basePrice,
    extra: inputData.extra,
    listingTime: inputData.listingTime,
    expirationTime: OpenseaHelper.makeBigNumber(expirationTime),
    salt: OpenseaHelper.generatePseudoRandomSalt()
  } 


  let buyOrderWithSignature:SignedOrder = Object.assign(newBuyOrder ,{
    hash:"",
    v:0,
    r:NULL_BLOCK_HASH,
    s:NULL_BLOCK_HASH
  })



  let atomicMatchInputs = OpenseaHelper.buildWyvernAtomicMatchParamsFromOrders( 
    sellOrderWithSignature,
    buyOrderWithSignature

  ) 
 

  let lenderAddress = "" 

  let outputData = {
    bidSubmitArgs,
    lenderAddress,
    atomicMatchInputs
  }

  console.log('output ', outputData )
  

  //return insert

  return true 
}
