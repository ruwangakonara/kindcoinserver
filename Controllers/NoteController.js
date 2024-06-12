const Note = require("../models/note");

const getAllNotes = async (req, res) => {
    const notes = await Note.find()

    res.json({notes})
}

const getNote = async (req, res) => {
    const note_id = req.params.id

    const note = await Note.findById(note_id)

    res.json({note})
}

const postNote = async (req, res) => {

    const {title, body} = req.body

    const note = await Note.create({
        title,
        body
    })

    res.json({note})
}

const updateNote = async (req, res) => {

    const note_id = req.params.id

    const {title, body} = req.body

    const note = await Note.findByIdAndUpdate(note_id, {title, body})
    res.json({note})
}

const deleteNote = async (req, res) => {

    const note_id = req.params.id

    await Note.deleteOne({_id: note_id})

    res.json({success: "Deleted"})
}

module.exports = {
    getAllNotes,
    getNote,
    postNote,
    updateNote,
    deleteNote
}

