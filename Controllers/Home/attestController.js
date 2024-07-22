const tokenController = require('../CrewMember/TokenController');
const {Server, Networks, Asset, BASE_FEE, TransactionBuilder, Operation, Keypair} = require("@stellar/stellar-sdk")
const axios = require("axios");

const External_User = require("../../models/external_user")

const server = new Server('https://horizon-testnet.stellar.org');
server.useNetwork(Networks.TESTNET)



const tokenCode = "KND"
const receiverPublicKey = "adasfdscc"
const issuerPublicKey = "fsfesffsfs"



async function get_doc(req, res) {
    const secret_key = req.body.secret_key

    try {

        // Determine the amount to transfer in LKR
        const amount = req.body.token_amount;

        const xlmToLkrRate = await tokenController.getXlmToLkrRate();
        const tokenToXlmRate = await tokenController.getTokenToXlmRate();
        // Create a Stellar transaction
        const transaction = new TransactionBuilder(Keypair.fromSecret(secret_key), {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: receiverPublicKey, // Receiver's Stellar address
                asset: new Asset(tokenCode, issuerPublicKey), // Your custom token
                amount: amount.toString(), // Amount of tokens to send
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction with the donor's secret key
        transaction.sign(Keypair.fromSecret(secret_key));

        // Submit the transaction to the Stellar network
        const transactionResult = await server.submitTransaction(transaction);

        const xlmAmount = amount/tokenToXlmRate
        const LKRamount = xlmToLkrRate * xlmAmount

        const record= await External_User.create({ name: req.body.name, xlmAmount, LKRamount, xlmToLkrRate, tokenToXlmRate, description: req.body.description, token_amount:amount, type:req.body.type})

        // Handle the response
        console.log('Transaction successful:', transactionResult);

        // Optionally, update your database or respond to the client
        res.status(200).json({ message: 'Attestation Fee transferred' ,record: record });

    } catch (error) {
        console.error('Error transferring donation:', error);
        res.status(500).json({ error: 'Failed to transfer donation' });
    }
}
