if (process.env.NODE_ENV !== 'production') {
    const dotenv = require("dotenv");
    dotenv.config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mongo_connect = require("./config/mongo_connect");
const NoteController = require("./controllers/NoteController");
const homeRoutes = require("./routes/HomeRoutes");
const donorRoutes = require("./routes/DonorRoutes");
const beneficiaryRoutes = require("./routes/BeneficiaryRoutes");
const uploader = require("./middleware/donor/uploader"); // Adjust the path based on your folder structure
const adminRoutes = require("./Routes/AdminRoutes");

const app = express();

// Ensure the images directory exists
const donorProfileImagesDir = path.join(__dirname, 'images/profileimages/donor');
if (!fs.existsSync(donorProfileImagesDir)) {
    fs.mkdirSync(donorProfileImagesDir, { recursive: true });
}

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the images directory
app.use('/images/profileimages/donor', express.static(donorProfileImagesDir));

mongo_connect();

app.get("/", (req, res) => {
    res.json({ howdy: "Arthur" });
});

app.get("/notes", NoteController.getAllNotes);
app.get("/notes/:id", NoteController.getNote);
app.post("/notes", NoteController.postNote);
app.put("/notes/:id", NoteController.updateNote);
app.delete("/notes/:id", NoteController.deleteNote);

app.use("/", homeRoutes);
app.use("/donor", donorRoutes);
app.use("/beneficiary", beneficiaryRoutes);


app.get("/notes/:id", NoteController.getNote)

app.post("/notes", NoteController.postNote)

app.put("/notes/:id", NoteController.updateNote)

app.delete("/notes/:id", NoteController.deleteNote)

app.listen(process.env["PORT"])

// app.use(userRoutes);


app.use("/admin", adminRoutes)
