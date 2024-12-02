const Ticket = require("../../models/ticket");
// const {createRequest} = require("./RequestController");
const mongoose = require("mongoose");

async function raiseTicket(req, res) {

    try{
        if(req.sub !== req.body.user_id){
            return res.status(403).send();
        }
        await Ticket.create(req.body);
        return res.status(201).send({});
    } catch (error) {
        res.status(500).send({error: error.message});
    }

}

async function getTickets(req, res) {

    try {
        const tickets = await Ticket.find({user_id: req.sub})
        res.status(200).json({tickets});
    }catch(error){
        res.status(500).send({error: error.message});
    }

}

async function updateTicket(req, res) {

    try{
        console.log("yo")
        if(req.sub !== req.body.user_id){
            return res.status(403).send();
        }

        const ticket  = await Ticket.findById(req.body.ticket_id)
        console.log(ticket)

        if(ticket.archived){
            return res.status(403).send();

        }


        await   Ticket.findByIdAndUpdate(ticket._id, {description: req.body.description});

        res.status(200).send();
    } catch (error){
        res.status(500).send({error: error.message});
    }

}

async function deleteTicket(req, res) {

    try{
        // console.log(req.body);
        const id = req.body.ticket_id;

        const ticket = await Ticket.findOne({_id: id})
        console.log(ticket);

        if(ticket.user_id != req.sub){
            console.log(ticket.user_id)
            console.log(req.sub);
            return res.status(403).send();
        }

        if(ticket.archived){
            return res.status(403).send();

        }

        await Ticket.findByIdAndDelete(ticket._id)
        res.status(200).send({});
    } catch (error){
        res.status(500).send({error: error.message});
    }

}

module.exports = {
    raiseTicket,
    getTickets,
    updateTicket,
    deleteTicket,
    Ticket
}
