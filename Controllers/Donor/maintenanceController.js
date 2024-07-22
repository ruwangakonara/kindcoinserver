const Maintenance = require("../../models/maintenancew");

 async function maintenance_done(req, res) {
    try {
        // const response = await axios.post('https://sandbox.payhere.lk/pay/checkout', req.body);
        console.log(req.body);
        await Maintenance.create(req.body);
        res.status(200).send();
    } catch (error) {
        console.error('Payment failed', error);
        res.status(500).json({ error: 'Payment failed' });
    }
}

async  function get_maintenance(req, res) {

     try{
         const {user_id} = req.body
         console.log(user_id);
         const dons = await Maintenance.find({user_id})
         console.log(dons)
         res.status(200).json({dons});
     }catch (error){
          res.status(500).json({error: error.message});
     }
}

module.exports = {
    maintenance_done,
    get_maintenance
}