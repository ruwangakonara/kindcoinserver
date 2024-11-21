const User = require('../../models/user');
const Donor = require("../../models/donor")
const Beneficiary = require("../../models/beneficiary");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function signup(req, res) {

    console.log(req.body);

    try{
        const {username, password, status, name, district, type, phoneNo, date_of_birth} = req.body;

        const hashedpass = bcrypt.hashSync(password, 8);


        const user = await User.create({username, password: hashedpass, status})
        console.log("done")
        const user_id = user._id

        // const {} = req.body;

        // if(type === "individual"){
        //     const {date_of_birth} = req.body
        //     const donor = await Donor.create({user_id, name, username, district, type, date_of_birth, phoneNo})
        //
        // } else {
        //     const {date_of_birth} = req.body x

            const donor = await Donor.create({user_id, name, username, district, type, date_of_birth, phoneNo})
        console.log("Yo")

        // }

        res.sendStatus(200)
    } catch (err){
        console.log(err)
        res.sendStatus(400);
    }

}

async function beneficiary_registration(req, res) {

    try{
        console.log("dawg")
        const {username, password, status, date_of_birth, name, type, district, phoneNo} = req.body;

        const hashedpass = bcrypt.hashSync(password, 8);

        const user = await User.create({username, password: hashedpass, status})

        const user_id = user._id
        // const {} = req.body;

        // if(type === "individual"){
        //     const {date_of_birth} = req.body
            const beneficiary = await Beneficiary.create({user_id, name, phoneNo, username,district, type, date_of_birth})

        // } else {
        //     const {} = req.body

            // const beneficiary = await Beneficiary.create({user_id, name, description, username, district, type, date_of_birth})

        // }

        res.sendStatus(200)
    } catch (err){
        res.sendStatus(400);
    }

}

async function signin(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            console.log("Nigga!!")
            return res.sendStatus(420);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.sendStatus(409);
        }

        const exp = Date.now() + 1000 * 60 * 60 * 24 * 10;
        const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

        res.cookie("Authorization", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        // Include the user in the response body
        if(user.status === "donor"){
            const donor = await Donor.findOne({ user_id: user._id });
            res.status(200).json({user: user, donor: donor} );

        } else if(user.status === "beneficiary"){
            const beneficiary = await Beneficiary.findOne({ user_id: user._id });
            res.status(200).json({user: user, beneficiary: beneficiary} );

        } else {
            res.status(200).json({user: user} );

        }

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function checkAuth(req, res){

    try{
        console.log(req.user)
        res.sendStatus(200)
    } catch (err){
        console.log(err)
        res.sendStatus(400)
    }

}

function signout(req, res) {

    console.log("Ma Niggax!!")

    try{
        res.clearCookie("Authorization")
        res.sendStatus(200)
    } catch (err){
        console.log(err)
        res.sendStatus(400)
    }

}


module.exports = {
    signin,
    signout,
    signup,
    beneficiary_registration,
    checkAuth,
    Beneficiary,
    Donor
}

