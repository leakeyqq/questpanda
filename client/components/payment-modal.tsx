"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wallet, Smartphone, Building2, CheckCircle, Copy, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import React from 'react';
import QRCodeComponent from '@/components/QRCodeComponent';
import { CopyButton } from "@/components/copyButton"
import { useWeb3 } from "@/contexts/useWeb3"
import { RefreshCw } from 'lucide-react'
import {useAlert} from "@/components/custom-popup"
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { getWeb3AuthInstance } from "../lib/web3AuthConnector"
import { getSolanaAddress } from "../lib/getSolanaKey";

import Cookies from 'js-cookie';



// Update the PaymentMethod type to include networks
type PaymentNetwork = "celo" | "solana" | null;


interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: (tokenSymbol: string, network: PaymentNetwork) => void
  prizePool: string,
  paymentAddress:  `0x${string}` | null;
  isConnected: boolean;
}

interface ExchangeRateResponse {
  KES_RATE: number;
  amountInKes: number;
}

type PaymentMethod = "cUSD" | "USDT" | "USDC" | "mpesa" | "mtn" | "bank" | null

export function PaymentModal({ isOpen, onClose, onPaymentComplete, prizePool, paymentAddress, isConnected }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentCoin, setPaymentCoin] = useState("")
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", bankName: "" })
  const { checkTokenBalances, checkBalanceOfSingleAsset, checkCombinedTokenBalances } = useWeb3();
  const [walletBalance, setWalletBalance] = useState('0.00')
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert()

  const [exchangeRate, setExchangeRate] = useState<ExchangeRateResponse | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'initiated' | 'pending' | 'success' | 'failed' | 'cancelled'>('initiated');
  // Add this near your other state declarations
  const [selectedNetwork, setSelectedNetwork] = useState<PaymentNetwork>(null);
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState(''); // 'stk' or 'confirmation'

   
useEffect(() => {
  if (isOpen && selectedMethod === "mpesa") {
    fetchExchangeRate.mutate(Number(prizePool));
  }
}, [isOpen, selectedMethod]);


useEffect(() => {
  // Check for existing order ID on component mount
  const savedOrderId = Cookies.get('SwyptOnrampOrderId');
  if (savedOrderId) {
    setOrderId(savedOrderId);
    setPaymentStatus('pending');
    startPolling(savedOrderId);
  }
}, []);

useEffect(() => {
  // Clean up cookie when payment completes or modal closes
  if (paymentStatus === 'success' || !isOpen) {
    Cookies.remove('SwyptOnrampOrderId');
  }
}, [paymentStatus, isOpen]);

  // ✅ Separate useEffect to fetch Solana Address (after Web3Auth is ready)
useEffect(() => {
  const fetchSolanaAddress = async () => {
    try {

      // 🧁 Step 1: Try to get address from cookie
      const cookieAddress = Cookies.get('solanaWalletAddress'); // or manually parse document.cookie

      if (cookieAddress) {
        setSolanaAddress(cookieAddress);
        return; // ✅ Done
      }

      const web3auth = getWeb3AuthInstance();

      // 🔐 Wait until Web3Auth is connected
      if (!web3auth.connected) {
        console.warn("⏳ Waiting for Web3Auth to connect...");
        await new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (web3auth.connected && web3auth.provider) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);

          // Optional: timeout after 5 seconds
          setTimeout(() => {
            clearInterval(interval);
            reject("Web3Auth connection timeout");
          }, 5000);
        });
      }

      const solanaAddr = await getSolanaAddress();
      setSolanaAddress(solanaAddr);
    } catch (err) {
      console.error("❌ Failed to fetch Solana address:", err);
    }
  };

  if (isConnected) {
    fetchSolanaAddress();
  }
}, [isConnected]);



// Add these mutation hooks
const fetchExchangeRate = useMutation({
  mutationFn: async (amountInUsd: number) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/swypt/exchangeRate?amountInUsd=${amountInUsd}`);
    return response.data;
  },
  onSuccess: (data: ExchangeRateResponse) => {
    setExchangeRate(data);
  },
  onError: async (error) => {
    console.log(error)
    await showAlert('Failed to get current rates. Please try again.')
  }
});

const initiatePayment = useMutation({
  mutationFn: async ({ amountInUsd, phoneNumber }: { amountInUsd: number, phoneNumber: string }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/swypt/sendStkPush`, {
      amountInUsd,
      mpesaNumber: phoneNumber
    },{
    withCredentials: true, // This is the Axios equivalent of credentials: "include"
    headers: {
      'Content-Type': 'application/json',
      // Add other headers if needed
    }
    });
    return response.data;
  },
  onSuccess: (data) => {
    setIsProcessing(false)
    // setOrderId(data.orderId);
      // Save to cookie with 1 day expiration (adjust as needed)
    // Cookies.set('SwyptOnrampOrderId', data.orderId, { 
    //   expires: 3, // 1 day
    //   secure: true, 
    //   sameSite: 'strict' 
    // });

    // setPaymentStatus('pending');
    // startPolling(data.orderId); // Start polling for payment status
    return
  },
  onError: async (error) => {
    await showAlert('Could not send payment request. Please try again.')
  }
});

// Polling function to check payment status
const startPolling = (orderId: string) => {
  let pollingCount = 0;
  const maxPollingAttempts = 24;
  const pollingInterval = 5000;
  let isCompleted = false; // New flag to track completion

  const interval = setInterval(async () => {
    if (isCompleted) return; // Exit if already completed

    try {
      pollingCount++;
      
      // Timeout handling
      if (pollingCount >= maxPollingAttempts) {
        isCompleted = true;
        clearInterval(interval);
        setPaymentStatus('failed');
        setIsProcessing(false);
        await showAlert("Payment verification timeout");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/swypt/completeMpesaPayment`, 
        { orderId, prizePool },
        {
          withCredentials: true,
          headers: {'Content-Type': 'application/json'}
        }
      );

      console.log('Polling attempt', pollingCount, 'Status:', response.data.orderStatus);
      
      const { orderStatus, reason } = response.data;
      
      // Handle final states
      if (['success', 'failed', 'cancelled'].includes(orderStatus)) {
        isCompleted = true;
        clearInterval(interval);
        
        setPaymentStatus(orderStatus);
        setIsProcessing(false);
        
        if (orderStatus === 'success') {
          setPaymentCompleted(true);
          setSelectedNetwork('celo')
        } else {
          await showAlert(reason || "Payment could not be completed");
        }
      }
      
    }catch (error) {
      if (!isCompleted) {
        isCompleted = true;
        clearInterval(interval);
        setPaymentStatus('failed');
        setIsProcessing(false);
        
        // Type-safe error handling
        if (axios.isAxiosError(error)) {
          // Axios-specific error
          console.error('Polling error:', error.response?.data);
          await showAlert(
            error.response?.data?.message || 
            'Payment verification failed. Please check your transaction history.'
          );
        } else if (error instanceof Error) {
          // Standard Error object
          console.error('Polling error:', error.message);
          await showAlert(error.message);
        } else {
          // Unknown error type
          console.error('Unknown polling error:', error);
          await showAlert('Could not verify payment status. Please try again later.');
        }
      }
}
  }, pollingInterval);

  return () => {
    if (!isCompleted) {
      clearInterval(interval);
    }
  };
};

  // Mock wallet address for crypto payments
  // const walletAddress = "0x69974Cc73815f378218B56FD0ce03A8158b9e120"
  const walletAddress = paymentAddress

  const paymentOptions = [
    {
      id: "mpesa",
      name: "M-Pesa",
      description: "Mobile Money",
      icon: "/crypto/mpesa2.png",
      color: "bg-light",
      type: "cash",
    },
    {
      id: "cUSD",
      name: "cUSD",
      description: "Virtual dollars",
      icon: "/crypto/cusd.png",
      color: "bg-light",
      type: "crypto",
    },
    {
      id: "USDT",
      name: "USDT",
      description: "Virtual dollars",
      icon: "/crypto/usdt.png",
      color: "bg-light",
      type: "crypto",
    },
    {
      id: "USDC",
      name: "USDC",
      description: "Virtual dollars",
      icon: "/crypto/usdc.png",
      color: "bg-light",
      type: "crypto",
    }
    // {
    //   id: "mtn",
    //   name: "MTN MoMo",
    //   description: "Mobile Money",
    //   icon: Smartphone,
    //   color: "bg-yellow-500",
    //   type: "cash",
    // },
    // {
    //   id: "bank",
    //   name: "Bank Transfer",
    //   description: "Direct Transfer",
    //   icon: Building2,
    //   color: "bg-brand-pink",
    //   type: "cash",
    // },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) return

    // Validation for cash payments
    if (selectedMethod === "mpesa" || selectedMethod === "mtn") {
      if (!phoneNumber) {

        await showAlert(`Please enter your ${selectedMethod === "mpesa" ? "M-Pesa" : "MTN"} phone number`)
        return
      }

      setIsProcessing(true);
      setActiveButton('stk');

      try {
        // First fetch the exchange rate if not already done
        if (!exchangeRate) {
          await fetchExchangeRate.mutateAsync(Number(prizePool));
        }
        
        await showAlert(`We are going to send an STK push to your Mpesa ${phoneNumber}. You shall enter your Pin.`)
        // Then initiate payment
        setPaymentCoin('USDT')
        await initiatePayment.mutateAsync({
          amountInUsd: Number(prizePool),
          phoneNumber
        });
        
      } catch (error) {
        setIsProcessing(false);
      }finally{
      setActiveButton('');
      }

      return
  
    }

    if (selectedMethod === "bank") {
      if (!bankDetails.accountNumber || !bankDetails.bankName) {
        toast({
          title: "Bank details required",
          description: "Please enter your bank account details",
          variant: "destructive",
        })
        return
      }
    }

    if ((selectedMethod === "USDT" || selectedMethod === "USDC") && !selectedNetwork) {
      await showAlert("Please select a network (Celo or Solana)");
      return;
    }

    setIsProcessing(true)

      const {
          celo: { cUSDBalance, USDTBalance: celoUSDTBalance, USDCBalance: celoUSDCBalance },
          solana: { USDTBalance: solUSDTBalance, USDCBalance: solUSDCBalance },
        } = await checkCombinedTokenBalances();

      let isBalanceSufficient;

      if(Number(cUSDBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(celoUSDTBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(celoUSDCBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(solUSDTBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(solUSDCBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else{
        isBalanceSufficient = false
      }

      if (!isBalanceSufficient) {
      setIsProcessing(false)
      await showAlert(`Your balance is insufficient to cover the ${prizePool} USD payment. Please deposit funds and try again`)
      return;
    }

    setPaymentCoin(selectedMethod)
    setIsProcessing(false)
    setPaymentCompleted(true)

    const isCrypto = ["cUSD", "USDT", "USDC"].includes(selectedMethod)
  }
   const handleMpesaPaymentConfirmation = async () => {
    if (!selectedMethod) return


    setIsProcessing(true)
    setActiveButton('confirmation');
      const {
          celo: { cUSDBalance, USDTBalance: celoUSDTBalance, USDCBalance: celoUSDCBalance },
          solana: { USDTBalance: solUSDTBalance, USDCBalance: solUSDCBalance },
        } = await checkCombinedTokenBalances();

      let isBalanceSufficient;

      if(Number(cUSDBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(celoUSDTBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(celoUSDCBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(solUSDTBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(solUSDCBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else{
        isBalanceSufficient = false
      }

      if (!isBalanceSufficient) {
      setIsProcessing(false)
      await showAlert(`Your balance is insufficient to cover the ${prizePool} USD payment. Please deposit funds and try again`)
      setActiveButton('');
      return;
    }

    setPaymentCoin('USDT')
    setIsProcessing(false)
    setPaymentCompleted(true)
    setSelectedNetwork('celo')
  }


  const handleComplete = () => {
    if (!selectedMethod) return; // Add type guard
    // const tokenSymbol = selectedMethod.toLowerCase();
    // onPaymentComplete(tokenSymbol)
    onPaymentComplete(paymentCoin, selectedNetwork)

    onClose()
  }

  const resetSelection = () => {
    setSelectedMethod(null)
    setPhoneNumber("")
    setBankDetails({ accountNumber: "", bankName: "" })
    setSelectedNetwork(null); // Add this line
  }

  const fetchBalance = async(tokenName: string)=>{
  try{
    console.log('selectedNetwork ', selectedNetwork)
    const bal = await checkBalanceOfSingleAsset(tokenName, selectedNetwork)
    setWalletBalance(Number(bal.balance).toFixed(2))
  }catch(e){
    throw e
  }
}

  const handleRefresh = async (tokenName: string) => {
    setIsLoading(true);
    try {
      await fetchBalance(tokenName);
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedOption = paymentOptions.find((option) => option.id === selectedMethod)


useEffect(() => {
  if (selectedOption?.type === "crypto" && selectedOption?.name) {
    // For cUSD, we don't need network selection
    if (selectedOption.id === "cUSD") {
      fetchBalance(selectedOption.name)
    } 
    // For USDT/USDC, only fetch if network is selected
    else if (selectedNetwork) {
      fetchBalance(selectedOption.name)
    }
  }
}, [selectedOption, selectedNetwork]) // Add selectedNetwork to dependencies


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-dark">Complete Payment</DialogTitle>
          <DialogDescription>Deposit {prizePool} USD to create your quest. Please select your preferred payment option.</DialogDescription>
        </DialogHeader>

        {paymentCompleted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            <Button onClick={handleComplete} className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              Complete Quest Creation
            </Button>
          </div>
        ) : selectedMethod ? (
          // Selected payment method details
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={resetSelection} className="text-brand-purple hover:text-brand-purple/80">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to options
              </Button>
            </div>

            <Card className="border border-brand-purple/10 p-2 pt-0 md:p-1">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-brand-dark text-sm md:text-base">
                  <div className={`p-1 rounded ${selectedOption?.color} text-white`}>
                    <img src={selectedOption?.icon} alt={selectedOption?.name} className="w-5 h-5" />
                  </div>
                  Pay with {selectedOption?.name}
                </CardTitle>
              </CardHeader>

            <CardContent className="space-y-1 text-md">
{["cUSD", "USDT", "USDC"].includes(selectedMethod) && (
  <div className="space-y-3">
    {/* Network Selection (only for USDT/USDC) */}
    {selectedMethod !== "cUSD" && !selectedNetwork && (
      <div className="space-y-2">
        <Label className="text-xs font-medium text-brand-dark">
          Select Network
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedNetwork("celo")}
            className="flex items-center gap-2"
          >
            <img src="/crypto/celo.png" alt="Celo" className="w-5 h-5" />
            Celo
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedNetwork("solana")}
            className="flex items-center gap-2"
          >
            <img src="/crypto/solana.png" alt="Solana" className="w-5 h-5" />
            Solana 
          </Button>
        </div>
      </div>
    )}

    {/* Payment details (shown after network selection or for cUSD) */}
    {(selectedNetwork || selectedMethod === "cUSD") && (
      
      <>
        <div className="bg-brand-light p-2 rounded border border-gray-200">
          <Label className="flex items-center gap-2 text-xs font-medium text-brand-dark">
            Send to wallet address on {selectedMethod === "cUSD" ? "Celo" : selectedNetwork === "celo" ? "Celo" : "Solana"}
            <img 
              src={selectedMethod === "cUSD" || selectedNetwork === "celo" ? "/crypto/celo.png" : "/crypto/solana.png"} 
              className="w-5 h-5" 
            />
          </Label>

          <div className="flex items-center gap-2 mt-2">
            <code className="bg-white px-2 py-1 rounded border text-xs flex-1 break-all">
              {selectedMethod === "cUSD" || selectedNetwork === "celo" 
                ? walletAddress 
                : solanaAddress /* Mock Solana address */}
            </code>
            <CopyButton text={
              selectedMethod === "cUSD" || selectedNetwork === "celo" 
                ? walletAddress || '' 
                : solanaAddress || 'InvalidAddress'
            } />
          </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-white rounded border text-xs">
          <span className="text-brand-dark font-medium">Amount to send:</span>
          <Badge variant="secondary" className="text-sm">
            {prizePool} {selectedMethod}
          </Badge>
        </div>

        {/* Wallet Balance with Refresh */}
        <div className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
          <span className="text-brand-dark">My balance:</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{walletBalance} {selectedMethod}</span>
            <button 
              onClick={() => handleRefresh(selectedMethod)} 
              className="flex items-center gap-2 text-brand-purple hover:opacity-75"
            >
              Refresh
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}/>
            </button>
          </div>
        </div>

        <div>
          <p className="font-semibold text-xs mb-1">Or scan to Pay</p>
          <QRCodeComponent text={
            selectedMethod === "cUSD" || selectedNetwork === "celo"
              ? `ethereum:${walletAddress}`
              : `solana:${solanaAddress}?amount=${prizePool}`
          } />
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white text-sm py-2"
        >
          {isProcessing ? "Processing..." : `Confirm I have sent ${selectedMethod}!`}
        </Button>
      </>
    )}
  </div>
)}


            {(selectedMethod === "mpesa") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-xs">M-Pesa Number</Label>
                  <Input
                    id="phone"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white border-gray-300 text-sm" 
                    minLength={10} 
                    maxLength={10}
                  />
                </div>

                {exchangeRate && (
                  <div className="space-y-2">
                    {/* <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount in USD:</span>
                      <span className="font-medium">${prizePool}</span>
                    </div> */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Exchange Rate:</span>
                      <span className="font-medium">1 USD = {exchangeRate.KES_RATE} KES</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-600">Amount to Pay:</span>
                      <span className="text-brand-purple">KES {exchangeRate.amountInKes?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                  You will receive a payment prompt on your phone for {exchangeRate?.amountInKes || '___'} KES.
                </div> */}

      {activeButton !== 'confirmation' && (
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white text-sm py-2"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Send STK Push
            </div>
          ) : (
            'Send STK Push'
          )}
        </Button>
      )}

      {activeButton !== 'stk' && (
        <Button
          onClick={handleMpesaPaymentConfirmation}
          disabled={isProcessing || initiatePayment.isPending}
          className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white text-sm py-2"
        >
          {isProcessing || initiatePayment.isPending ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {paymentStatus === 'pending' ? 'Waiting for payment...' : 'Confirming Mpesa payment...'}
            </div>
          ) : (
            `I have already paid!`
          )}
        </Button>
      )}
                {paymentStatus === 'pending' && (
                  <div className="text-center text-sm text-gray-600">
                    <p>Please complete the payment on your phone.</p>
                    <p>We'll notify you when payment is confirmed.</p>
                  </div>
                )}
              </div>
            )}

              {selectedMethod === "bank" && (
                <div className="space-y-2 text-sm">
                  <div>
                    <Label htmlFor="bank-name" className="text-xs">Bank Name</Label>
                    <Input
                      id="bank-name"
                      placeholder="e.g., KCB Bank"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails((prev) => ({ ...prev, bankName: e.target.value }))}
                      className="bg-white border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account-number" className="text-xs">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
                      className="bg-white border-gray-300 text-sm"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
                    Bank transfers take 1–3 business days. Activation follows payment confirmation.
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          </div>
        ) : (
          // Payment options grid
          <div className="space-y-6">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentOptions.map((option) => {
                // const IconComponent = option.icon
                return (


              <Card
                key={option.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-brand-purple/50 group"
                onClick={() => setSelectedMethod(option.id as PaymentMethod)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <img src={option.icon} alt={option.name} className="w- h-8 rounded" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-brand-dark mb-1">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>

                )
              })}
            </div>
          </div>
        )}
      <AlertComponent/>

      </DialogContent>
    </Dialog>
    
  )
}
