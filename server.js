if(process.env.NODE_ENV !== 'production') {
    const dotenv = require("dotenv");

    dotenv.config();

}


const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongo_connect = require("./config/mongo_connect")
const Note = require("./models/note");
const NoteController = require("./controllers/NoteController");
const UserController = require("./controllers/Home/UserController");
const requireAuth = require("./Middleware/requireAuth")

const app = express()

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(cookieParser())


mongo_connect()

app.get("/", (req, res) => {
    res.json({howdy: "Arthur"})
})


app.get("/notes", NoteController.getAllNotes)

app.get("/notes/:id", NoteController.getNote)

app.post("/notes", NoteController.postNote)

app.put("/notes/:id", NoteController.updateNote)

app.delete("/notes/:id", NoteController.deleteNote)

app.listen(process.env["PORT"])

app.use(userRoutes);

app.post("/signin", UserController.signin)
app.post("/signup", UserController.signup)
app.get("/signout", UserController.signout)
app.get("/check-auth",requireAuth, UserController.checkAuth)