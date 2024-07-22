
const axios = require("axios")
const Donor = require("../../models/donor")
const Donation = require("../../models/donation")

const {Server, Networks, Asset, BASE_FEE, TransactionBuilder, Operation, Keypair} = require("@stellar/stellar-sdk")


const server = new Server('https://horizon-testnet.stellar.org');
server.useNetwork(Networks.TESTNET)


const tokenCode = "KND"
const receiverPublicKey = "adasfdscc"
const issuerPublicKey = "fsfesffsfs"


async function transfer(req, res) {
    const user_id = req.body.user_id;
    const donation_id = req.body.donation_id;
    const secret_key = req.body.secret_key

    try {
        // Find the donor and retrieve their Stellar address
        const donor = await Donor.findOne({ user_id });
        const donorAddress = donor.stellar_address;

        // Find the donation details
        const donation = await Donation.findOne({ _id: donation_id });
        if(donation.user_id !== user_id){
            return res.status(403).send("Not authorized");
        }

        // Determine the amount to transfer in LKR
        const amount = donation.token_amount;

        const tokenAmount = amount/2


        // Create a Stellar transaction
        const transaction = new TransactionBuilder(Keypair.fromSecret(secret_key), {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: receiverPublicKey, // Receiver's Stellar address
                asset: new Asset(tokenCode, issuerPublicKey), // Your custom token
                amount: tokenAmount.toString(), // Amount of tokens to send
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction with the donor's secret key
        transaction.sign(Keypair.fromSecret(secret_key));

        // Submit the transaction to the Stellar network
        const transactionResult = await server.submitTransaction(transaction);

        // Handle the response
        console.log('Transaction successful:', transactionResult);

        // Optionally, update your database or respond to the client
        res.status(200).json({ message: 'Attestation Fee transferred' });

    } catch (error) {
        console.error('Error transferring donation:', error);
        res.status(500).json({ error: 'Failed to transfer donation' });
    }
}

async function get_doc(req, res) {

    try{
        const user_id = req.body.user_id;
        const donation_id = req.body.donation_id;

        const donation = await Donation.findOne({ _id: donation_id });
        if(donation.user_id !== user_id){
            return res.status(403).json({err:"Not authorized"});
        }

        if(!donation.verified || !donation.rewarded){
            return res.status(403).json({err:"Not Complete"});
        }

        res.status(200).json({donation});

    }catch (err){
        return res.status(500).json({err:err.message})
    }


}

module.exports = {
    get_doc,
    transfer
}