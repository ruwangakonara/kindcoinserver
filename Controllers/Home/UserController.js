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

    const {username, password} = req.body;

    const user = await User.findOne({username})
    if(!user) return res.sendStatus(401)

    const passworfMatch = await bcrypt.compareSync(password, user.password)

    if(!passworfMatch) return res.sendStatus(401)


    const exp = Date.now() + 1000*60*60*24*10
    const token = jwt.sign({sub: user._id, exp}, process.env["SECRET"])

    res.cookie("Authorization", token, {

        expires: new Date(exp),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"

    })
    res.sendStatus(200)
}

function signout(req, res) {

}


module.exports = {
    signin,
    signout,
    signup
}

