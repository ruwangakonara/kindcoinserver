const Query = require('../../models/query');

async function insertQuery(req, res){

    try{
        await Query.create(req.body);
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}


module.exports = {
    insertQuery,
}