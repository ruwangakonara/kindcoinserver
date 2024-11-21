const axios = require("axios")
const TEXT_RAZOR_API_KEY = "27b19674986f0631b7231fae9c7c70516357dd2bf3917e192871a7fb"; // Replace with your TextRazor API key

async function textrazor(req, res) {

    try{

        const query = req.body.query
        const response = await axios.post('https://api.textrazor.com/',
            `text=${query}&extractors=entities,topics, categories`,
            { headers: { 'x-textrazor-key': TEXT_RAZOR_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const topics = response.data.response.topics || [];
        const entities = response.data.response.entities || [];
        const categories = response.data.response.categories || [];

        console.log(response);

        res.status(200).json({entities, topics, categories});

    }catch(error){

        console.log(error.message);
    }

}


module.exports = {
    textrazor,
}
