
const axios = require("axios")
const Donor = require("../../models/donor")
const Donation = require("../../models/donation")

const {Server, Networks, Asset, BASE_FEE, TransactionBuilder, Operation, Keypair} = require("@stellar/stellar-sdk")
const res = require("express/lib/response");

const server = new Server('https://horizon-testnet.stellar.org');
server.useNetwork(Networks.TESTNET)


const tokenCode = process.env["TOKEN_CODE"]
const issuerPublicKey = process.env["ISSUER_PUBLIC_KEY"]
const distributionsecretKey = process.env["DISTRIBUTOR_SECRET_KEY"]


async function getXlmToLkrRate(req, res) {
    try {
        console.log("Benny");
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=lkr');
        const xlmToLkrRate = response.data.stellar.lkr;
        // return xlmToLkrRate;
        console.log(xlmToLkrRate);
        res.status(200).send(xlmToLkrRate);
    } catch (error) {
        console.error('Error fetching XLM to LKR rate:', error);
        throw error;
    }
}

async function getTokenToXlmRate(req, res) {
    try {
        // Create an asset object for your token
        const tokenAsset = new Asset(tokenCode, issuerPublicKey);

        // Fetch the orderbook for the specified token asset against XLM
        const orderbook = await server.orderbook(tokenAsset, Asset.native()).call();

        // Get the price of the highest bid for the token in the orderbook
        const tokenToXlmRate = orderbook.bids[0].price;

        // return tokenToXlmRate;
        console.log(tokenToXlmRate);
        res.status(200).send(tokenToXlmRate);
    } catch (error) {
        console.error('Error fetching token to XLM rate:', error);
        throw error;
    }
}

async function transfer(req, res) {
    const user_id = req.body.donor_user_id;
    const donation_id = req.body.donation_id;

    try {
        // Find the donor and retrieve their Stellar address
        const donor = await Donor.findOne({ user_id });
        const donorAddress = donor.stellar_address;

        // Find the donation details
        const donation = await Donation.findOne({ _id: donation_id });

        if(!donation.verified){
            return res.status(403).json({msg: "Not Verified"})
        }

        // Determine the amount to transfer in LKR
        const LKRamount = donation.value;

        // Get the current exchange rates
        const xlmToLkrRate = await getXlmToLkrRate();
        const tokenToXlmRate = await getTokenToXlmRate();


        // Calculate the amount of XLM and tokens to transfer
        const xlmAmount = LKRamount / xlmToLkrRate;
        const tokenAmount = xlmAmount * tokenToXlmRate;

        // Create a Stellar transaction
        const transaction = new TransactionBuilder(Keypair.fromSecret(distributionsecretKey), {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: donorAddress, // Receiver's Stellar address
                asset: new Asset(tokenCode, issuerPublicKey), // Your custom token
                amount: tokenAmount.toString(), // Amount of tokens to send
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction with the donor's secret key
        transaction.sign(Keypair.fromSecret(distributionsecretKey));

        // Submit the transaction to the Stellar network
        const transactionResult = await server.submitTransaction(transaction);

        // Handle the response
        console.log('Transaction successful:', transactionResult);

        await Donation.findByIdAndUpdate(donation_id, {token_amount: tokenAmount, rewarded: true, xlmToLkrRate, tokenToXlmRate})

        // Optionally, update your database or respond to the client
        res.status(200).json({ message: 'Donation successfully transferred' });

    } catch (error) {
        console.error('Error transferring donation:', error);
        res.status(500).json({ error: 'Failed to transfer donation' });
    }
}


module.exports = {
    getTokenToXlmRate,
    getXlmToLkrRate,
    transfer
}
