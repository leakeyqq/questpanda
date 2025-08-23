import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import axios from "axios"
import {ethers} from 'ethers';
import SwyptOnrampOrder from "./../models/swypt/swypt-onramps.js"
import PretiumOnrampOrder from "./../models/swypt/pretium-onramp.js"

export const getSwyptExchangeRate = async(req, res)=>{
    try {

        // Get Pretium exchange
            const response_rates = await fetch(`${process.env.PRETIUM_BASE_URI}/v1/exchange-rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.PRETIUM_API_KEY}` 
                },
                body: JSON.stringify({
                    currency_code: 'KES'
                })
            });

                const data_rates = await response_rates.json();
                let kesRate = Number(data_rates.data.selling_rate) * 1.001


        const amountInUsd = Number(req.query.amountInUsd)

        // Accurate amount in Kshs
        let Kes_amount_accurate = Math.ceil(amountInUsd * kesRate)
        let roundedRate = parseFloat(kesRate.toFixed(2));

        return res.status(200).json({KES_RATE: roundedRate, amountInKes: Kes_amount_accurate})

    } catch (error) {
        // console.log('error is ', error)
        return res.status(500).json({error: error.msg})
    }
}
export const onRampUserWithMpesa = async(req, res)=>{
    console.log('begin stk push')
    try{
        const amountInUsd = Number(req.body.amountInUsd)
        const mpesaNumber = req.body.mpesaNumber

        // Get Pretium exchange
            const response_rates = await fetch(`${process.env.PRETIUM_BASE_URI}/v1/exchange-rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.PRETIUM_API_KEY}` 
                },
                body: JSON.stringify({
                    currency_code: 'KES'
                })
            });

            const data_rates = await response_rates.json();
            let kesRate = Number(data_rates.data.selling_rate) * 1.001

        // Accurate amount in Kshs
        let Kes_amount_accurate = Math.ceil(amountInUsd * kesRate)


  const postData = {
    shortcode: mpesaNumber,
    amount: Kes_amount_accurate,
    mobile_network: "Safaricom",
    chain: "CELO",
    asset: "USDT",
    address: req.userWalletAddress,
    callback_url: "https://questpanda.xyz"
  };

const response = await fetch(`${process.env.PRETIUM_BASE_URI}/v1/onramp/KES`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.PRETIUM_API_KEY}` 
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();
    console.log('Success:', data);

    const pretiumOnrampOrder = new PretiumOnrampOrder({
        userAddress: req.userWalletAddress,
        transactionCode: data.data.transaction_code
    })
    pretiumOnrampOrder.save()

    return res.status(200).json({stkSent: true})

    }catch(e){
        console.log(e)
        return res.status(500).json({message: e})
    }
}
export const transferFundsAfterMpesaPayment = async(req, res)=>{
    console.log('request to transfer crypto sent at ', new Date())
    try {
        // Make sure this is not a repeat request.
        let orderId = req.body.orderId

        // Fetch Order from db
        let existingOrder = await SwyptOnrampOrder.findOne({orderId}).exec()

        if(!existingOrder){
            console.log('Swypt order was not registered on our db')
            throw new Error('Swypt order was not registered on our db')
        }else if(existingOrder.cryptoTransferred == true){
            console.log('This is a duplicate tranfer request. crypto was transferred before')
            return res.status(200).json({orderStatus: 'success', reason: 'Duplicate transaction'})
        }

        // Check order status from Swypt API
        const response = await axios.get(`https://pool.swypt.io/api/order-onramp-status/${orderId}`, {
            headers: {
                'x-api-key': process.env.SWYPT_API_KEY,
                'x-api-secret': process.env.SWYPT_SECRET_KEY
            }
            });

        const swypt_response = response.data
        console.log('swypt response is ', swypt_response)

            // Check if it was successful
        if(swypt_response.status.toLowerCase() != "success"){
            return res.status(200).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
        }else if(swypt_response.data.status.toLowerCase() == "success"){
            // TODO Call disbursement
            let fundsDisbursed = await transferCrypto_afterOnramp(orderId, req.userWalletAddress)
            if(fundsDisbursed == true){
                return res.status(200).json({orderStatus: 'success'})
            }else{
                console.log('failed to disburse funds')
                return res.status(200).json({orderStatus: 'pending', reason: 'Trying again!'})
            }
        }else if(swypt_response.data.status.toLowerCase() == "pending"){
            return res.status(200).json({orderStatus: 'pending', reason: 'Transaction is still pending. Try again in a few seconds!'})
        }else if(swypt_response.data.status.toLowerCase() == "failed"){
            return res.status(200).json({orderStatus: 'failed', reason: 'Payment did not go through due to insufficient balance or a different reason'})
        }else if(swypt_response.data.status.toLowerCase() == "cancelled"){
            return res.status(200).json({orderStatus: 'cancelled', reason: 'Payment did not go through because the user cancelled!'})
        }else{
            return res.status(200).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
        }
    
    } catch (error) {
        console.log('An unexpected error occurred trrying to transfer crypto from swypt ', error)
        return res.status(500).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
    }


}
async function swyptUsdtRate(amountKes){
    const response = await axios.post('https://pool.swypt.io/api/swypt-quotes', {
        type: "onramp",
        amount: amountKes,
        fiatCurrency: "KES",
        cryptoCurrency: "USDT", //cKes, USDC
        network: "celo"
        }, {
        headers: {
            'x-api-key': process.env.SWYPT_API_KEY,
            'x-api-secret': process.env.SWYPT_SECRET_KEY
        }
    });

    const swyptResponse = response.data

    if(swyptResponse.statusCode != 200){
        throw new Error('Payment provider is malfunctioning')
    }

    let receivedRate = Number(swyptResponse.data.exchangeRate)

    // Increase rate by 0.005% increase of any errors
    receivedRate *= 1.005
    return receivedRate
}
async function initiateStkPush(Kes_amount, mpesaNumber, receiverAddress){
      const response = await axios.post('https://pool.swypt.io/api/swypt-onramp', {
        partyA: mpesaNumber,
        amount: Kes_amount,
        side: "onramp",
        userAddress: receiverAddress,
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" // USDT
        }, {
        headers: {
            'x-api-key': process.env.SWYPT_API_KEY,
            'x-api-secret': process.env.SWYPT_SECRET_KEY
        }
        });

    // console.log(JSON.stringify(response.data, null, 2))  
    const swyptResponse = response.data
    if(swyptResponse.status.toLowerCase() != "success"){
        throw new Error('Stk push failed to send!')
    }

    return swyptResponse.data.orderID
}
async function transferCrypto_afterOnramp(orderId, receiverAddress){
    console.log('before transferring crypto')

    try{
      const response = await axios.post('https://pool.swypt.io/api/swypt-deposit', {
      chain: "celo",
      address: receiverAddress,
      orderID: orderId,
      project: "Questpanda"
    }, {
      headers: {
        'x-api-key': process.env.SWYPT_API_KEY,
        'x-api-secret': process.env.SWYPT_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('after transferring crypto')
    // Update db

    console.log('before updating db')
    await SwyptOnrampOrder.findOneAndUpdate(
      { orderId },
      {
        orderStatus: 'success',
        cryptoTransferred: true,
        MpesaReceiptNumber: response.data.MpesaReceiptNumber,
        hash: response.data.hash,
        cryptoAmount: response.data.cryptoAmount
      }
    );
    console.log('after updating db')

    return true;
  } catch (error) {
    console.log('an error appears during crypto transfer')
    console.error('Error in transferCrypto_afterOnramp:', {
      orderId,
      receiverAddress,
      error: error.response?.data || error.message
    });
    return false;
  }

    // const response = await axios.post('https://pool.swypt.io/api/swypt-deposit', {
    //     chain: "celo",
    //     address: receiverAddress,
    //     orderID: orderId,
    //     project: "onramp"
    //     }, {
    //     headers: {
    //         'x-api-key': process.env.SWYPT_API_KEY,
    //         'x-api-secret': process.env.SWYPT_SECRET_KEY
    //     }
    //     });

    // const swypt_response = response.data

    // if(swypt_response.status != 200){
    //     return false
    // }
    // await SwyptOnrampOrder.findOneAndUpdate(
    //     {orderId},
    //     {
    //         orderStatus: 'success',
    //         cryptoTransferred: true,
    //         MpesaReceiptNumber: swypt_response.MpesaReceiptNumber,
    //         hash: swypt_response.hash,
    //         cryptoAmount: swypt_response.cryptoAmount

    //     }
    // )

    // return true
}