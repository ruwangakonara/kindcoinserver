const axios = require("axios");
const Donor = require("../Home/UserController").Donor
const Donation = require("../Donor/donation_cycle_break").Donation
const Request = require("../Beneficiary/request_cycle_breaker").Request
const DonorNotification = require("../Donor/donation_cycle_break").DonorNotification

const { Horizon, Networks, Asset, BASE_FEE, TransactionBuilder, Operation, Keypair } = require("@stellar/stellar-sdk");
const mongoose = require("mongoose");
const {request} = require("axios");
const {Beneficiary} = require("../Home/UserController");
// const {} = require("@stellar/stellar-sdk");

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

// const horizon = new Horizon(server);

const tokenCode = process.env["TOKEN_CODE"];
const issuerPublicKey = process.env["ISSUER_PUBLIC_KEY"];
const distributionSecretKey = process.env["DISTRIBUTOR_SECRET_KEY"];
const issuerSecretKey = process.env["ISSUER_SECRET_KEY"];
const distributorPublicKey = process.env["DISTRIBUTOR_PUBLIC_KEY"];
const companySecretKey = process.env["COMPANY_PROFIT_SECRET_KEY"];
const companyPublicKey = process.env["COMPANY_PROFIT_PUBLIC_KEY"];

// Load the distributor's public key from the secret key
const distributionPublicKey = Keypair.fromSecret(distributionSecretKey).publicKey();

async function getXlmToLkrRate() {
    console.log("we here")
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=lkr');
        const xlmToLkrRate = response.data.stellar.lkr;
        // console.log("XLM to LKR Rate:", xlmToLkrRate);
        return xlmToLkrRate;
        // res.status(200).send({ rate: xlmToLkrRate });
    } catch (error) {
        console.error('Error fetching XLM to LKR rate:', error);
        // res.status(500).send({ error: "Failed to fetch XLM to LKR rate" });
    }
}


async function getTokenToXlmRate() {
    try {
        const tokenAsset = new Asset(tokenCode, issuerPublicKey);

        // Create the orderbook builder for the token against XLM
        const orderbookBuilder = server.orderbook(tokenAsset, Asset.native());

        // Fetch the orderbook data
        const orderbook = await orderbookBuilder.call();
        // console.log("Orderbook data:", orderbook);

        // Extract the best bid price (if available)
        const tokenToXlmRate = orderbook.bids.length > 0 ? parseFloat(orderbook.bids[0].price) : 0;
        // console.log("Token to XLM Rate:", tokenToXlmRate);

        // res.status(200).send({ rate: tokenToXlmRate });
        return tokenToXlmRate;
    } catch (error) {
        console.error("Error fetching token to XLM rate:", error);
        // res.status(500).send({ error: "Failed to fetch token to XLM rate" });
    }
}


//endpoint
async function transfer(req, res) {
    // const user_id = new mongoose.Types.ObjectId(req.body.donor_user_id);
    console.log("arrived!!")
    const donation_id = new mongoose.Types.ObjectId(req.body.donation_id);


    try {
        // Find the donor and retrieve their Stellar address
        const donation = await Donation.findOne({ _id: donation_id });
        if (!donation) {
            return res.status(404).send({ error: "Donation not found" });
        }
        const donor = await Donor.findById( donation.donor_id);
        if (!donor) {
            return res.status(404).send({ error: "Donor not found" });
        }
        const donorAddress = donor.stellar_address;

        // Find the donation details

        if (!donation.verified) {
            return res.status(403).json({ error: "Donation not verified" });
        }

        // Determine the amount to transfer in LKR
        const LKRamount = donation.value;
        console.log(LKRamount)

        // Get the current exchange rates
        // const xlmToLkrRate = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=lkr')
        //     .then(response => response.data.stellar.lkr);
        const  xlmToLkrRate = await getXlmToLkrRate();
        console.log(xlmToLkrRate);
        // const tokenToXlmRate = await server.orderbook(new Asset(tokenCode, issuerPublicKey), Asset.native())
        //     .call()
        //     .then(orderbook => orderbook.bids[0]?.price || 0);
        const tokenToXlmRate = await getTokenToXlmRate();
        console.log("token to xlm:", tokenToXlmRate);
        if (tokenToXlmRate === 0) {
            return res.status(400).send({ error: "No bids available for token to XLM conversion" });
        }

        // Calculate the amount of XLM and tokens to transfer
        const xlmAmount = LKRamount / xlmToLkrRate;
        console.log(xlmAmount)
        const tokenAmount = (xlmAmount / tokenToXlmRate).toFixed(7);

        console.log("what inthe hell?")
        console.log(tokenAmount)
        // Load the distributor's account
        const distributorAccount = await server.loadAccount(distributionPublicKey);

        // Create a Stellar transaction
        const transaction = new TransactionBuilder(distributorAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: donorAddress, // Receiver's Stellar address
                asset: new Asset(tokenCode, issuerPublicKey), // Your custom token
                // amount: tokenAmount.toFixed(7), // Amount of tokens to send (up to 7 decimal places)
                amount: String(tokenAmount), // Amount of tokens to send (up to 7 decimal places)
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction with the distributor's secret key
        transaction.sign(Keypair.fromSecret(distributionSecretKey));

        // Submit the transaction to the Stellar network
        const transactionResult = await server.submitTransaction(transaction);

        // Log and update the database
        console.log('Transaction successful:', transactionResult);



        const updated_donation = await Donation.findByIdAndUpdate(donation_id, { token_amount: tokenAmount, rewarded: true, xlmToLkrRate, tokenToXlmRate, attestation_fee: tokenAmount/4 }, {new: true});
        const updated_donor = await  Donor.findByIdAndUpdate(donor._id, {$inc:{tokens: tokenAmount}}, {new: true})

        //notify
        const request = await Request.findById(updated_donation.request_id);
        const beneficiary = await Beneficiary.findById(request.beneficiary_id);


        const notification = {
            title:"KINDCOIN Transferred",
            donor_id: updated_donor._id,
            beneficiary_id: beneficiary._id,
            request_id: request._id,
            donation_id: updated_donation._id,
        }
        await DonorNotification.create(notification)

        await transferToCompany(tokenAmount);

        //
        res.status(200).json({ message: 'Donation successfully transferred', transactionResult, updated_donor, updated_donation });
    } catch (error) {
        console.error('Error transferring donation:', error);
        res.status(500).json({ error: 'Failed to transfer donation' });
    }
}

async function transferToCompany(tokenAmount) {
    try {
        console.log("Initiating company transfer...");

        // Load the distributor's account
        const distributorAccount = await server.loadAccount(distributorPublicKey);

        // Calculate 10% of the tokenAmount
        const companyShare = (tokenAmount * 0.1).toFixed(7);

        console.log(`Transferring ${companyShare} tokens to company account...`);

        // Create a Stellar transaction for transferring the company's share
        const transaction = new TransactionBuilder(distributorAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.payment({
                destination: companyPublicKey, // Company's Stellar address
                asset: new Asset(tokenCode, issuerPublicKey), // Custom token
                amount: String(companyShare), // Amount of tokens to send
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction with the distributor's secret key
        transaction.sign(Keypair.fromSecret(distributionSecretKey));

        // Submit the transaction to the Stellar network
        const transactionResult = await server.submitTransaction(transaction);

        console.log('Company transfer successful:', transactionResult);

        return transactionResult;
    } catch (error) {
        console.error('Error transferring to company:', error);
        throw new Error('Failed to transfer to company');
    }
}


async function dispatchTokens(req, res) {
    try {
        // Create a new asset for your token
        const tokenAsset = new Asset(tokenCode, issuerPublicKey);

        // Fetch the base fee for the network
        const baseFee = await server.fetchBaseFee();

        // Load the issuer's account from the server
        const issuerAccount = await server.loadAccount(issuerPublicKey);

        // Build the transaction to send tokens from the issuer to the distributor
        const transaction = new TransactionBuilder(issuerAccount, {
            fee: baseFee,
            networkPassphrase: Networks.TESTNET // Use 'Networks.PUBLIC' for mainnet
        })
            .addOperation(Operation.payment({
                destination: distributorPublicKey, // Address of the distributor
                asset: tokenAsset, // The token being sent
                amount:  String (req.body.amount) // Amount of tokens to send, adjust as necessary
            }))
            .setTimeout(30) // Set timeout for transaction to be valid (30 seconds)
            .build();

        // Sign the transaction with the issuer's secret key
        transaction.sign(Keypair.fromSecret(issuerSecretKey));

        // Submit the transaction to the Stellar network
        const result = await server.submitTransaction(transaction);

        console.log('Transaction successful:', result);
        res.status(200).send({ message: 'Tokens dispatched successfully', result: result });
    } catch (error) {
        console.error('Error dispatching tokens:', error);
        res.status(500).send({ error: 'Failed to dispatch tokens' });
    }
}

// const { TransactionCallBuilder } = require('stellar-sdk'); // Ensure this is already installed

async function getTransactionDetails(req, res) {
    const transactionId = req.body.transaction_id; // Transaction hash from the request

    if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
    }

    try {
        console.log("Fetching transaction details...");

        // Fetch the transaction details from the Stellar network
        const transaction = await server.transactions().transaction(transactionId).call();

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Prepare the response
        const transactionDetails = {
            id: transaction.id,
            hash: transaction.hash,
            createdAt: transaction.created_at,
            sourceAccount: transaction.source_account,
            feeCharged: transaction.fee_charged,
            operationCount: transaction.operation_count,
            successful: transaction.successful,
            ledger: transaction.ledger,
            memoType: transaction.memo_type,
            memo: transaction.memo,
            envelopeXDR: transaction.envelope_xdr,
            resultXDR: transaction.result_xdr,
            resultMetaXDR: transaction.result_meta_xdr,
        };

        console.log("Transaction details fetched successfully:", transactionDetails);

        res.status(200).json({ transactionDetails });
    } catch (error) {
        console.error("Error fetching transaction details:", error);

        res.status(500).json({
            error: "Failed to fetch transaction details",
            message: error.message,
        });
    }
}


module.exports = {
    getTokenToXlmRate,
    getXlmToLkrRate,
    transfer,
    dispatchTokens,
    getTransactionDetails
};


