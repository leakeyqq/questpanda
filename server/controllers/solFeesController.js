import solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from "dotenv"
dotenv.config()

export const fundSolFees = async (req, res) => {
    try {
        console.log('funds gas fee on solana wallet on backend')
        const { solAmount, solAddress } = req.body
        const solPrivKey = process.env.SOL_FEES_PRIVKEY

        const senderKeypair = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(solPrivKey)
        );


        // Convert receiver address to PublicKey
        const receiverPublicKey = new solanaWeb3.PublicKey(solAddress);

        // Convert SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
        const lamports = solAmount * solanaWeb3.LAMPORTS_PER_SOL;

        // Connect to the Solana cluster (mainnet-beta by default)
        // const connection = new solanaWeb3.Connection(
        //     solanaWeb3.clusterApiUrl('mainnet-beta'),
        //     'confirmed'
        // );

        const connection = new solanaWeb3.Connection(process.env.SOLANA_MAINNET_RPC_URL, 'confirmed');


        // Get the sender's current balance
        // const senderBalance = await connection.getBalance(senderKeypair.publicKey);
        // console.log(`Sender balance: ${senderBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);

        // Check if sender has enough balance
        // if (senderBalance < lamports) {
        //     throw new Error('Insufficient funds');
        // }

         // Create a transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: receiverPublicKey,
                lamports: lamports,
            })
        );

        // Set recent blockhash and fee payer
        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderKeypair.publicKey;

        // Sign the transaction
        const signature = await solanaWeb3.sendAndConfirmTransaction(
            connection,
            transaction,
            [senderKeypair]
        );

        console.log('Transaction successful!');
        console.log(`Signature: ${signature}`);
        console.log(`Explorer URL: https://solscan.io/tx/${signature}?cluster=mainnet-beta`);

        return res.status(200).json({message: "success", signature})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}