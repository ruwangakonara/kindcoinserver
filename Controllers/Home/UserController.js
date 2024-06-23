const User = require('../../models/user');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function signup(req, res) {

    try{
        const {username, password} = req.body;

        const hashedpass = bcrypt.hashSync(password, 8);

        await User.create({username, password: hashedpass})

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
        res.status(200).json({user: user} );
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
    checkAuth
}

