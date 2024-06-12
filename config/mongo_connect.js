const mongoose = require("mongoose");

async function mongo_connect(){
    try {
        await mongoose.connect(process.env["DB_STRING"])
        console.log("We in!!")
    } catch (err){
        console.log(err)
    }

}

module.exports = mongo_connect