import { useState, useEffect } from "react";
import StableTokenABI from "./cusd-abi.json";
import QuestPandaABI from "./questpanda-abi.json"
// import MinipayNFTABI from "./minipay-nft.json";
import { getSolanaAddress, getEthereumPrivateKey, getSolanaPrivateKey } from "../lib/getSolanaKey";
import { getWeb3AuthInstance } from '../lib/web3AuthConnector'; // adjust this import path
import { getOrCreateAssociatedTokenAccount, transfer, TokenAccountNotFoundError } from "@solana/spl-token";
import bs58 from "bs58";

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_CELO_RPC as string));


import { Connection, Keypair, PublicKey, clusterApiUrl, SystemProgram, Transaction, VersionedMessage, VersionedTransaction, MessageV0 } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL || '';
const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

const CELO_RPC = 'https://forno.celo.org'; // or your own RPC
const SPENDER_ADDRESS = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT;



import {
    createPublicClient,
    createWalletClient,
    custom,
    decodeEventLog,
    encodeFunctionData,
    getContract,
    http,
    parseEther,
    stringToHex
} from "viem";
import { celoAlfajores, celo } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk'

const publicClient = createPublicClient({
    chain: celo,
    transport: http(),
});

const cUSDTokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
// const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF";
type SupportedNetwork = "celo" | "solana" | null;


export const useWeb3 = () => {
    const [address, setAddress] = useState<string | null>(null);
    const { data: walletClient } = useWalletClient();
    const { address: wagmiAddress } = useAccount();
    const [isWalletReady, setIsWalletReady] = useState(false);


    // Track wallet client readiness
    useEffect(() => {
        if (walletClient) {
            setIsWalletReady(true);
        } else {
            setIsWalletReady(false);
        }
    }, [walletClient]);

    const getUserAddress = async () => {
        if (wagmiAddress) {
            setAddress(wagmiAddress);
            return wagmiAddress;
        }
        
        if (typeof window !== "undefined" && window.ethereum) {
            const client = createWalletClient({
                transport: custom(window.ethereum),
                chain: celo,
            });
            const [addr] = await client.getAddresses();
            setAddress(addr);
            return addr;
        }
        return null;
    };

const approveSpending = async (_amount: string, tokenSymbol: string) => {

if (!(await isUsingWeb3Auth())) {
    const MAX_RETRIES = 1;
    let attempt = 0;
    let success = false;

    // try {


        if (!walletClient) throw new Error("Wallet not connected");

        let amount = Number(_amount) * 1.01 

        let decimals = checkDecimals(tokenSymbol)
        // const amountInWei = (Number(amount) * (10**decimals));
        const amountInWei = toWeiAmount(amount, decimals); // returns string

        const tokenContractAddress = checkContractAddress(tokenSymbol)
        const spenderAddress = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT;


        if(!(typeof window !== "undefined" && window.ethereum?.isMiniPay)){

            const gasEstimate = await publicClient.estimateContractGas({
                address: tokenContractAddress,
                abi: StableTokenABI.abi,
                functionName: "approve",
                account: walletClient.account.address,
                args: [spenderAddress, amountInWei],
            });

            await prefillGas_v2(gasEstimate)
        }

       while (!success && attempt < MAX_RETRIES) {
            try{
                    if (!spenderAddress) {
                    throw new Error("❌ Environment variable spenderAddress is not defined");
                    }

                    // const nonce = await publicClient.getTransactionCount({
                    //     address: walletClient.account.address,
                    //     blockTag: 'pending' // This is crucial
                    // });

                    const txHash = await walletClient.writeContract({
                        address: tokenContractAddress,
                        abi: StableTokenABI.abi,
                        functionName: "approve",
                        account: walletClient.account.address,
                        args: [spenderAddress, amountInWei],
                        // nonce: nonce
                    });

                    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

                    success = true;
                    return receipt;

            }catch(error){
                    attempt++;
                    console.error(`Approval attempt ${attempt} failed:`, error);

                    // Final attempt failed
                    if (attempt >= MAX_RETRIES) {
                        console.error('Max retries reached for approval');
                        throw error;
                    }

                    // Specific handling for nonce-related errors
                    if(error instanceof Error){
                        if (error.message.includes('nonce') || error.message.includes('replacement') || error.message.includes('underpriced') || error.message.includes('block is out of range') || error.message.includes('insufficient funds')) {
                            
                            // Wait with exponential backoff
                            const delay = 1000 * attempt; // 1s, 2s, 3s, etc.
                            console.log(`Retrying after ${delay}ms delay...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            
                            // Refresh wallet connection
                        } else {
                            // For other errors, rethrow immediately
                            throw error;
                        }
                }

            }
        }
}else{
  const web3 = new Web3(new Web3.providers.HttpProvider(CELO_RPC));
  const privateKey = await getEthereumPrivateKey();
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const tokenContractAddress = checkContractAddress(tokenSymbol); // your function
  const decimals = checkDecimals(tokenSymbol); // your function
  const amount = Number(_amount) * 1.01;
  const amountInWei = BigInt(Math.floor(amount * 10 ** decimals)).toString();

  const contract = new web3.eth.Contract(StableTokenABI.abi, tokenContractAddress);

  const data = contract.methods.approve(SPENDER_ADDRESS, amountInWei).encodeABI();

 // 1. Estimate gas
  const gasEstimate = await contract.methods
    .approve(SPENDER_ADDRESS, amountInWei)
    .estimateGas({ from: account.address });

  // 2. Call refillGas with BigInt
  await prefillGas_v2(BigInt(gasEstimate));

  // 3. Get current gas price
  const gasPrice = await web3.eth.getGasPrice();

  const tx = {
    from: account.address,
    to: tokenContractAddress,
    gas: gasEstimate, // You may estimate it if needed
    gasPrice: gasPrice,
    data,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
  console.log('✅ Approval successful:', receipt.transactionHash);
  return receipt;
}

};
const createQuest = async (prizePool: string, tokenSymbol: string) => {

    if (!(await isUsingWeb3Auth())){
        // const MAX_RETRIES = 3;
        const MAX_RETRIES = 1;

        let attempt = 0;
        let success = false;


    
        if (!walletClient) {
            throw new Error("Wallet not connected");
        }

        const createQuestContractAddress = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT as `0x${string}`;;

        if (!createQuestContractAddress) {
        throw new Error("❌ Environment variable createQuestContractAddress is not defined");
        }
        
        
        let decimals = checkDecimals(tokenSymbol)
        const tokenContractAddress = checkContractAddress(tokenSymbol)
        const amountInWei = (Number(prizePool) * (10**decimals));


        if(!(typeof window !== "undefined" && window.ethereum?.isMiniPay)){
            // 1. First estimate gas
            console.log('getting gas estimate on create quest')
            const gasEstimate = await publicClient.estimateContractGas({
                address: createQuestContractAddress,
                abi: QuestPandaABI,
                functionName: "createQuestAsBrand",
                account: walletClient.account.address,
                args: [amountInWei, tokenContractAddress],
            });

            console.log('gas found to be ', gasEstimate)
            await prefillGas_v2(gasEstimate)
        }

       while (!success && attempt < MAX_RETRIES) {
        console.log('attempt ', attempt)
        try {
            const txHash = await walletClient.writeContract({
                address: createQuestContractAddress,
                abi: QuestPandaABI,
                functionName: "createQuestAsBrand",
                account: walletClient.account.address,
                args: [amountInWei, tokenContractAddress]
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

            // get the matching log
            const questCreatedLog = receipt.logs.find((log) => {
            try {
                // Only decode logs from the QuestPanda contract
                if (log.address.toLowerCase() !== createQuestContractAddress.toLowerCase()) {
                return false;
                }
                const decoded = decodeEventLog({
                abi: QuestPandaABI,
                data: log.data,
                topics: log.topics,
                });
                return decoded.eventName === 'QuestCreatedByBrand';
            } catch(e) {
                return false;
            }
            });

            if (!questCreatedLog) {
            throw new Error("❌ QuestCreated event not found in logs");
            }

            // Decode with assertion
            const decoded = decodeEventLog({
                abi: QuestPandaABI,
                data: questCreatedLog.data,
                topics: questCreatedLog.topics,
            }) as unknown as {
            eventName: 'QuestCreatedByBrand';
            args: {
                questId: bigint;
                brand: `0x${string}`;
                token: `0x${string}`;
                prizePool: bigint;
            };
            };

            const questId = decoded.args.questId.toString();

        // console.log("✅ Quest created!", receipt);
            return questId;
        } catch (error) {
            attempt++;
            console.error(`Creating quest attempt ${attempt} failed:`, error);

            // Final attempt failed
            if (attempt >= MAX_RETRIES) {
                console.error('Max retries reached for creating quest');
                throw error;
            }

            // Specific handling for nonce-related errors
            if(error instanceof Error){
                if (error.message.includes('nonce') || error.message.includes('replacement') || error.message.includes('underpriced') ||  error.message.includes('insufficient allowance') || error.message.includes('insufficient funds') || error.message.includes('block is out of range')) {
                    
                    // Wait with exponential backoff
                    const delay = 1000 * attempt; // 1s, 2s, 3s, etc.
                    console.log(`Retrying after ${delay}ms delay...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    
                    // Refresh wallet connection
                } else {
                    // For other errors, rethrow immediately
                    throw error;
                }
        }
        }

       }
    } else {
        if (!SPENDER_ADDRESS) {
            throw new Error("❌ QUESTPANDA contract address not found in env");
        }

        // Setup
        const web3 = new Web3(new Web3.providers.HttpProvider(CELO_RPC));
        const privateKey = await getEthereumPrivateKey();
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const decimals = checkDecimals(tokenSymbol);
        const tokenContractAddress = checkContractAddress(tokenSymbol);
        const amountInWei = BigInt(Math.floor(Number(prizePool) * 10 ** decimals)).toString();

        const tokenContract = new web3.eth.Contract(StableTokenABI.abi, tokenContractAddress);

        const contract = new web3.eth.Contract(QuestPandaABI, SPENDER_ADDRESS);

    // 1. Allowance verification with retries (1s, 2s, 3s delays)
    const requiredAmount = BigInt(amountInWei)
    let currentAllowance = BigInt(0)
    
    
        for (let attempt = 1; attempt <= 4; attempt++) {
            try {
                currentAllowance = BigInt(await tokenContract.methods
                    .allowance(account.address, SPENDER_ADDRESS)
                    .call());

                console.log(`Attempt ${attempt}: Allowance ${currentAllowance}/${requiredAmount}`);

                if (currentAllowance >= requiredAmount) break; // Success
                

                if (attempt === 3) throw new Error("Allowance problem after 3 attempts");

                const delay = attempt * 1000; // 1s, 2s, 3s
                console.log(`Waiting ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));

            } catch (error) {
                console.log(error)
                throw new Error(`error happened ${error}`)
                // if (attempt === 3) throw new Error(`Final allowance check failed: ${error}`);
            }
        }

        const data = contract.methods.createQuestAsBrand(amountInWei, tokenContractAddress).encodeABI();

        const gas = await contract.methods
            .createQuestAsBrand(amountInWei, tokenContractAddress)
            .estimateGas({ from: account.address });

        await prefillGas_v2(gas); // Your custom gas topping logic

        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account.address, "pending");

        const tx = {
            from: account.address,
            to: SPENDER_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);

        console.log("✅ Transaction confirmed:", receipt.transactionHash);

        console.log("[DEBUG] Receipt details:", {
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber.toString(),
            gasUsed: receipt.gasUsed.toString(),
            logs: receipt.logs?.map(log => ({
                address: log.address,
                topics: log.topics,
                data: log.data
            }))
        });
    // Type-safe event extraction
    const eventSignature = web3.utils.keccak256("QuestCreatedByBrand(uint256,address,address,uint256)");
    console.log("[DEBUG] Event signature:", eventSignature);

    // Find the correct log with proper type guards
    const questCreatedLog = receipt.logs?.find((log): log is { address: string; topics: string[]; data: string } => {
        if (!log.address || !log.topics || !log.data) return false;
        return (
            log.address.toLowerCase() === SPENDER_ADDRESS.toLowerCase() &&
            log.topics[0] === eventSignature
        );
    });

    if (!questCreatedLog) {
        console.error("[DEBUG] All logs:", receipt.logs?.map(l => ({
            address: l.address,
            topics: l.topics,
            data: l.data
        })));
        throw new Error("QuestCreatedByBrand event not found in transaction logs");
    }

    console.log("[DEBUG] Found event log:", {
        address: questCreatedLog.address,
        topics: questCreatedLog.topics,
        data: questCreatedLog.data
    });

    type QuestCreatedLog = {
    questId: string;
    brand: string;
    token: string;
    prizePool: string;
};

    // Type-safe decoding with error handling
    try {
        console.log("[DEBUG] Decoding log data...");
    // Decode with proper type assertions
// Properly decode with correct parameter order and indexing
const decoded = web3.eth.abi.decodeLog(
    [
        { type: 'uint256', name: 'questId', indexed: true },
        { type: 'address', name: 'brand', indexed: true },
        { type: 'address', name: 'token', indexed: true },
        { type: 'uint256', name: 'prizePool' }
    ],
    questCreatedLog.data,
    questCreatedLog.topics.slice(1)
);

// The questId is the first indexed parameter (topics[1])
const questId = web3.utils.hexToNumber(questCreatedLog.topics[1]);
console.log("Real Quest ID:", questId); // Should now match block explorer
return questId;


    } catch (error) {
        // Proper error type handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown decoding error';
        console.error("[DEBUG] Decoding failed:", errorMessage);
        console.error("[DEBUG] Problematic log data:", {
            data: questCreatedLog.data,
            topics: questCreatedLog.topics
        });
        throw new Error(`Failed to decode event: ${errorMessage}`);

    }


}




};
const depositToEscrowOnSolana = async (prizePool: string, tokenSymbol: string) => {

    try {
        const recipientAddress = process.env.NEXT_PUBLIC_SOLANA_TREASURY;
        const privateKeyBase58 = await getSolanaPrivateKey()

        if (!recipientAddress) { throw new Error('No  receipient address') }

        const TOKEN_MINT_ADDRESS = new PublicKey(checkSolanaMintAddress(tokenSymbol))

        const connection = new Connection("https://polished-floral-violet.solana-mainnet.quiknode.pro/de20afd084c2be2d53a73375ab4836b3d3a6929d/", "confirmed");

        // Decode and load keypair
        const secretKey = bs58.decode(privateKeyBase58).slice(0, 32); // seed
        const senderKeypair = Keypair.fromSeed(secretKey);
        const senderPublicKey = senderKeypair.publicKey;


        // Estimate gas fee in solana network
                // Estimate transfer fee
        const dummyTx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: 1, // dummy lamport to create msg
            })
        );

        const compiledMessage = MessageV0.compile({
            payerKey: senderPublicKey,
            instructions: dummyTx.instructions,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        });

        const feeInfo = await connection.getFeeForMessage(compiledMessage);
        const estimatedFeeSol = (feeInfo?.value || 5000) / 1e9;

        console.log(`📦 Estimated fee: ${estimatedFeeSol} SOL`);

       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/fundSolFees`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    solAddress: senderPublicKey.toBase58(),
                    solAmount: estimatedFeeSol,
                }),
            });

            const data = await response.json();

            console.log('data is ', data)

        if (data.message !== "success") {
            throw new Error(`Failed to fund fees: ${data.error || "Unknown error"}`);
        }

        // Optional: access signature if needed
const signature = data.signature;

        console.log('sol fees funded successfully!', signature)

        // Get or create token accounts
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeypair,
            TOKEN_MINT_ADDRESS,
            senderKeypair.publicKey
        );

        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeypair, // fee payer
            TOKEN_MINT_ADDRESS,
            new PublicKey(recipientAddress)
        );

        // Transfer 1 USDT (USDT has 6 decimals)
        const txSig = await transfer(
            connection,
            senderKeypair,
            senderTokenAccount.address,
            recipientTokenAccount.address,
            senderKeypair,
            // 1_000_000 // 1 USDT = 1,000,000 base units
            Number(prizePool) * 1e6
        );
        console.log("✅ Transfer complete. Signature:", txSig);

        return txSig

    } catch (error) {
        console.log('ndani ya deposit to escrow ', error)
        throw error
    }
}
const rewardCreator = async(quest_id: string, amount: string, creatorAddress: string, tokenSymbol: string) => {
    try {
        if (!walletClient) throw new Error("Wallet not connected");

        
        if(!(typeof window !== "undefined" && window.ethereum?.isMiniPay)){
            // 1. Request CELO funding from backend
            const fundingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/prepare-deposit`, {
                method: 'GET',
                credentials: "include"
                // body: JSON.stringify({ address: walletClient.account.address }),
            });

            const { txHash } = await fundingResponse.json();

            // 2. Wait for CELO transaction confirmation
            await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        const QuestPandaContract = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT as `0x${string}`;;

        if (!tokenSymbol) {
            throw new Error("Token symbol is undefined!");
        }
        if (!QuestPandaContract) {
        throw new Error("❌ Environment variable QuestPandaContract is not defined");
        }

        let decimals = checkDecimals(tokenSymbol)
        const amountInWei = (Number(amount) * (10**decimals));

        const nonce = await publicClient.getTransactionCount({ address: walletClient.account.address });

        const txHash = await walletClient.writeContract({
            address: QuestPandaContract,
            abi: QuestPandaABI,
            functionName: "rewardCreatorAsBrand",
            account: walletClient.account.address,
            args: [quest_id, amountInWei, creatorAddress],
            nonce: nonce 
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        return;

    } catch (error) {
        throw error
    }
}
const checkDecimals = (tokenSymbol: string) => {
    if(tokenSymbol.toLowerCase() == 'cusd'){
        return 18
    }else if(tokenSymbol.toLowerCase() == 'usdt' || tokenSymbol.toLowerCase() == 'usdc'){
        return 6
    }else{
        throw new Error('Token not supported!!')
    }
}
const checkContractAddress = (tokenSymbol: string) => {
    if(tokenSymbol.toLowerCase() == 'cusd'){
        let address = '0x765DE816845861e75A25fCA122bb6898B8B1282a'
        return address as `0x${string}`;
    }else if(tokenSymbol.toLowerCase() == 'usdt'){
        let address = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e'
        return address as `0x${string}`;
    }else if(tokenSymbol.toLowerCase() == 'usdc'){
        let address = '0xcebA9300f2b948710d2653dD7B07f33A8B32118C'
        return address as `0x${string}`;
    }else{
        throw new Error('Token not supported!!')
    }
}
const sendCUSD = async (to: string, amount: string) => {
    try {
        if (!walletClient) throw new Error("Wallet not connected");

        if(!(typeof window !== "undefined" && window.ethereum?.isMiniPay)){
            // 1. Request CELO funding from backend
            const fundingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/prepare-deposit`, {
                method: 'GET',
                credentials: "include"
                // body: JSON.stringify({ address: walletClient.account.address }),
            });

            const { txHash } = await fundingResponse.json();

            // 2. Wait for CELO transaction confirmation
            await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        


        console.log('🟡 Preparing to send CUSD:', amount, 'to', to);
        const amountInWei = parseEther(amount);

        // 2. Prepare Divvi data suffix
        const dataSuffix = getDataSuffix({
            consumer: '0x6CB95b7c84675dE923E179a40347898D4AcC5BeA', // Your Divvi identifier
            providers: ['0x5f0a55fad9424ac99429f635dfb9bf20c3360ab8'], // Your reward campaign addresses
        });

                // 3. Encode the transfer function call manually
            const transferData = encodeFunctionData({
                abi: StableTokenABI.abi,
                functionName: "transfer",
                args: [to, amountInWei],
            }) + dataSuffix;

            // Ensure both parts are hex strings and combine them properly
            const combinedData = (transferData + dataSuffix.replace('0x', '')) as `0x${string}`;

            // 4. Send transaction with Divvi suffix
            const txHash = await walletClient.sendTransaction({
                account: walletClient.account.address,
                to: cUSDTokenAddress,
                data: combinedData,
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    
            const chainId = await walletClient.getChainId();
            await submitReferral({ txHash, chainId });

        // const tx = await walletClient.writeContract({
        //     address: cUSDTokenAddress,
        //     abi: StableTokenABI.abi,
        //     functionName: "transfer",
        //     account: walletClient.account.address,
        //     args: [to, amountInWei],
        // });

        // console.log('🟢 Transaction sent:', tx);
        // // alert('Transaction sent! Waiting for confirmation...');

        // let receipt = await publicClient.waitForTransactionReceipt({
        //     hash: tx,
        // });

        console.log('✅ Transaction confirmed!', receipt);
        // alert('Transaction successful!');
        return receipt;
    } catch (e: any) {
        console.error('❌ Error sending CUSD:', e);
        // alert(`Error sending CUSD: ${e?.message || e}`);
        throw e;
    }
};
const handleGetSolKey = async () => {
  try {
    const solPk = await getSolanaAddress();
    return solPk;
  } catch (err) {
    console.error("❌ Error retrieving Solana key", err);
  }
};
// Add this to your existing useWeb3 hook
const checkTokenBalances = async (): Promise<{
  cUSDBalance: string;
  USDTBalance: string;
  USDCBalance: string;
}> => {
  try {
    if (!walletClient) throw new Error("Wallet not connected");

    // Get user address
    const userAddress = walletClient.account.address;

    // Create contract instances for each token
    const cUSDContract = getContract({
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    const USDTContract = getContract({
      address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e', // USDT
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    const USDCContract = getContract({
      address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', // USDC
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    // Get balances in parallel
    const [cUSDBalanceInWei, USDTBalanceInWei, USDCBalanceInWei] = await Promise.all([
      cUSDContract.read.balanceOf([userAddress]),
      USDTContract.read.balanceOf([userAddress]),
      USDCContract.read.balanceOf([userAddress]),
    ]);

    // Convert balances to human-readable format
    // cUSD has 18 decimals, USDT and USDC have 6 decimals
    return {
      cUSDBalance: (Number(cUSDBalanceInWei) / 10**18).toString(),
      USDTBalance: (Number(USDTBalanceInWei) / 10**6).toString(),
      USDCBalance: (Number(USDCBalanceInWei) / 10**6).toString()
    };
  } catch (e: any) {
    console.error('❌ Error checking token balances:', e);
    throw new Error(`Failed to check balances: ${e?.message || e}`);
  }
};

const checkCUSDBalance = async (requiredAmount: string): Promise<{
hasEnough: boolean;
balance: string;
required: string;
}> => {
try {
if (!walletClient) throw new Error("Wallet not connected");

// Get user address
const userAddress = walletClient.account.address;

// Create contract instance
const cUSDContract = getContract({
address: cUSDTokenAddress,
abi: StableTokenABI.abi,
client: publicClient,
});

// Get balance in wei (smallest unit)
const balanceInWei = await cUSDContract.read.balanceOf([userAddress]);
const balance = Number(balanceInWei) / 10**18; // Convert to cUSD (18 decimals)

// Convert required amount to number
const required = Number(requiredAmount);

return {
hasEnough: balance >= required,
balance: balance.toFixed(2),
required: required.toFixed(2),
};

} catch (e: any) {
console.error('❌ Error checking cUSD balance:', e);
throw new Error(`Failed to check balance: ${e?.message || e}`);
}
};

const checkBalanceOfSingleAsset = async (tokenSymbol: string, network: SupportedNetwork): Promise<{
        balance: string;
    }> => {
        try {
      
            if (!walletClient) throw new Error("Wallet not connected");

            if (network == 'celo' || tokenSymbol.toLocaleLowerCase() == 'cusd') {
                // Get user address
                const userAddress = walletClient.account.address;

                // Create contract instance

                // Get contract address 
                const tokenAddress = checkContractAddress(tokenSymbol)
                const decimals = checkDecimals(tokenSymbol)

                const tokenContract = getContract({
                    address: tokenAddress,
                    abi: StableTokenABI.abi,
                    client: publicClient,
                });

                // Get balance in wei (smallest unit)
                const balanceInWei = await tokenContract.read.balanceOf([userAddress]);
                const balance = Number(balanceInWei) / 10 ** decimals; // Convert to cUSD (18 decimals)

                return {
                    balance: balance.toFixed(2)
                };

            } else if (network == 'solana') {
                const solanaWalletAddress = await handleGetSolKey(); // or however you're getting public key
                if(!solanaWalletAddress){
                    throw new Error('coud not find Solana address')
                }
                console.log('retrieved Solana address is ', solanaWalletAddress)
                const tokenMintAddress = checkSolanaMintAddress(tokenSymbol); // You need to define this
                const balance = await getSolanaTokenBalance(solanaWalletAddress, tokenMintAddress, 6);

                return {
                    balance: Number(balance).toFixed(2),
                };
            } else {
                throw new Error(`Unsupported network: ${network}`);
            }

        } catch (e: any) {
            console.error('❌ Error checking cUSD balance:', e);
            throw new Error(`Failed to check balance: ${e?.message || e}`);
        }
    };

// Main unified balance fetcher
const checkCombinedTokenBalances = async (): Promise<{
  celo: {
    cUSDBalance: string;
    USDTBalance: string;
    USDCBalance: string;
  };
  solana: {
    USDTBalance: number;
    USDCBalance: number;
  };
}> => {
  try {
    if (!walletClient) throw new Error("Wallet not connected");

    // ---------- CELO ----------
    const userAddress = walletClient.account.address;

    const cUSDContract = getContract({
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    const USDTContract = getContract({
      address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    const USDCContract = getContract({
      address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      abi: StableTokenABI.abi,
      client: publicClient,
    });

    const [cUSDBalanceInWei, USDTBalanceInWei, USDCBalanceInWei] = await Promise.all([
      cUSDContract.read.balanceOf([userAddress]),
      USDTContract.read.balanceOf([userAddress]),
      USDCContract.read.balanceOf([userAddress]),
    ]);

    // ---------- SOLANA ----------
    const solanaWalletAddress = await handleGetSolKey();

    if (!solanaWalletAddress) {
        throw new Error("Solana wallet address is undefined");
    }
    const [solUSDTBalance, solUSDCBalance] = await Promise.all([
      getSolanaTokenBalance(solanaWalletAddress, 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 6), // USDT
      getSolanaTokenBalance(solanaWalletAddress, 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 6), // USDC - Replace with actual
    ]);

    return {
      celo: {
        cUSDBalance: (Number(cUSDBalanceInWei) / 10 ** 18).toString(),
        USDTBalance: (Number(USDTBalanceInWei) / 10 ** 6).toString(),
        USDCBalance: (Number(USDCBalanceInWei) / 10 ** 6).toString()
      },
      solana: {
        USDTBalance: solUSDTBalance,
        USDCBalance: solUSDCBalance,
      }
    };
  } catch (error: any) {
    console.error('❌ Error checking combined token balances:', error);
    throw new Error(`Failed to fetch balances: ${error?.message || error}`);
  }
};

// Fetch SPL Token Balance from Solana
async function getSolanaTokenBalance(walletAddress: string, tokenMintAddress: string, decimals: number): Promise<number> {

  try {
    console.log('inside getSolanaTokenBalance ', walletAddress, tokenMintAddress)
  const walletPublicKey = new PublicKey(walletAddress);
  const mintPublicKey = new PublicKey(tokenMintAddress);

    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    );

    const tokenAccount = await getAccount(solanaConnection, associatedTokenAddress);
    const rawAmount = Number(tokenAccount.amount);
    return rawAmount / Math.pow(10, decimals);

  } catch (error: any) {
    if (error instanceof TokenAccountNotFoundError) {
      return 0;
    }else{
        throw error
    }
  }
}


const signTransaction = async () => {
    if (!walletClient) throw new Error("Wallet not connected");

    const res = await walletClient.signMessage({
        account: walletClient.account.address,
        message: stringToHex("Hello from Celo Composer MiniPay Template!"),
    });

    return res;
};

const prefillGas = async (gasEstimate: bigint) => {

    const [gasPrice, feeHistory] = await Promise.all([
    publicClient.getGasPrice(),
    publicClient.getFeeHistory({
      blockCount: 1,
      rewardPercentiles: [25]
    })
  ]);
  
// Safely access reward with proper type checking
const baseFeePerGas = feeHistory.baseFeePerGas[0];
const priorityFee = feeHistory.reward?.[0]?.[0] ?? BigInt(0);

  const totalGasPrice = baseFeePerGas + priorityFee;

  console.log('base fee is ', (Number(baseFeePerGas) /1e9), 'priority fee is ', (Number(priorityFee) / 1e9))
  
  
    // 1. Get CURRENT gas price (fresh)
    // const gasPrice = await publicClient.getGasPrice();
    console.log('Total gas price  price is ', totalGasPrice)

    // 2. Calculate raw cost (gasLimit * gasPrice)
    console.log('gas estimate units is ', gasEstimate)
    const rawCost = gasEstimate * totalGasPrice;
    
    // 3. Apply buffer (30-50% is safer than 20%)
    // const bufferedCost = (rawCost * BigInt(15)) / BigInt(10);
    const bufferedCost = rawCost
    
    // 4. Convert to CELO (1e18 wei = 1 CELO)
    const estimatedCostCELO = Number(bufferedCost) / 1e18 ;
        // console.log('estimated cost in celo from front end is ', estimatedCostCELO)
        console.log('estimated raw cost in celo from front end is ', Number(bufferedCost))
        try {
            // Send gas estimate to your API if needed
            const gasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/gas-estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    function: "createQuestAsBrand",
                    // estimatedGas: gasWithBuffer.toString(),
                    estimatedCostCELO,
                    timestamp: new Date().toISOString()
                })
            });

            const { txHash } = await gasResponse.json();

            // 2. Wait for CELO transaction confirmation
            await publicClient.waitForTransactionReceipt({ hash: txHash });

            console.log('gas has been filled')
            return true
        } catch (error) {
            console.log('error is addding gas ', error)
            throw error
        }

}
const prefillGas_v2 = async (gasEstimate: bigint) => {

  try {
    if(typeof(web3) == 'undefined'){
        throw new Error('web3 provider not defined')
    }
    // 1. Get current gas price
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPrice = BigInt(gasPriceWei);

    console.log('Current gas price (wei):', gasPrice.toString());

    // 2. Compute raw cost (gasEstimate * gasPrice)
    console.log('Gas estimate units:', gasEstimate.toString());
    const rawCost = gasEstimate * gasPrice;

    // 3. Apply buffer if needed (currently skipped)
    const bufferedCost = rawCost;

    // 4. Convert to CELO (1e18 wei = 1 CELO)
    const estimatedCostCELO = Number(bufferedCost) / 1e18;
    console.log('Estimated CELO cost:', estimatedCostCELO);

    // 5. Send the gas estimate to backend
    const gasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/gas-estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        function: 'createQuestAsBrand',
        estimatedCostCELO,
        timestamp: new Date().toISOString(),
      }),
    });

    const { txHash } = await gasResponse.json();

    // 6. Wait for transaction receipt using web3.js
    const receipt = await waitForReceipt(txHash);

    console.log('✅ Gas has been filled:', receipt.transactionHash);
    return true;

  } catch (error) {
    console.error('❌ Error adding gas:', error);
    throw error;
  }
};

// Helper function to poll for transaction receipt
const waitForReceipt = async (txHash: string, interval = 1000, maxTries = 60): Promise<any> => {
  let tries = 0;

  while (tries < maxTries) {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) return receipt;
    await new Promise(res => setTimeout(res, interval));
    tries++;
  }

  throw new Error(`Timeout waiting for transaction receipt: ${txHash}`);
};
function checkSolanaMintAddress(tokenSymbol: string): string {
  const solanaTokenMints: Record<string, string> = {
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // Mainnet USDT
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Replace with correct if different
    // Add more if needed
  };

  const mint = solanaTokenMints[tokenSymbol.toUpperCase()];
  if (!mint) throw new Error(`Unsupported token symbol for Solana: ${tokenSymbol}`);
  return mint;
}
function toWeiAmount(amount: string | number, decimals: number): string {
  // Parse safely using BigInt
  const [whole, fraction = ""] = String(amount).split(".");

  // scale the whole part
  let wei = BigInt(whole) * 10n ** BigInt(decimals);

  if (fraction.length > 0) {
    // trim/pad fraction to match decimals
    const fracPadded = fraction.padEnd(decimals, "0").slice(0, decimals);
    wei += BigInt(fracPadded);
  }

  return wei.toString();
}

async function isUsingWeb3Auth() {
  const web3auth = getWeb3AuthInstance();

  if (web3auth && web3auth.connected && web3auth.provider) {
    console.log("✅ Web3Auth is connected.");
    return true;
  } else {
    console.warn("❌ Web3Auth is NOT connected.");
    return false;
  }
}


    return {
        address: walletClient?.account.address || address,
        getUserAddress,
        sendCUSD,
        depositToEscrowOnSolana,
        // mintMinipayNFT,
        // getNFTs,
        signTransaction,
        checkCUSDBalance,
        approveSpending,
        createQuest,
        rewardCreator,
        isWalletReady,
        checkTokenBalances,
        checkBalanceOfSingleAsset,
        handleGetSolKey, 
        checkCombinedTokenBalances
    };
};