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
const uploader = require("./Middleware/Donor/uploader"); // Adjust the path based on your folder structure
// const adminRoutes = require("./Routes/AdminRoutes");

const app = express();

// Ensure the images directory exists
const donorProfileImagesDir = path.join(__dirname, 'images/profileimages/donor');
if (!fs.existsSync(donorProfileImagesDir)) {
    fs.mkdirSync(donorProfileImagesDir, { recursive: true });
}

const donationImagesDir = path.join(__dirname, 'images/donation_proof');
if (!fs.existsSync(donationImagesDir)) {
    fs.mkdirSync(donationImagesDir, { recursive: true });
}

const beneficiaryProfileImagesDir = path.join(__dirname, 'images/profileimages/beneficiary');
const beneficiaryProofImagesDir = path.join(__dirname, 'images/beneficiary_proof');
const beneficiaryCertificateDir = path.join(__dirname, 'images/beneficiary_certificate');

[beneficiaryProfileImagesDir, beneficiaryProofImagesDir, beneficiaryCertificateDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const requestProofImagesDir = path.join(__dirname, 'images/request_proof');
const requestCertificateDir = path.join(__dirname, 'images/request_certificate');

[requestProofImagesDir, requestCertificateDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

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
app.use('/images/donation_proof', express.static(donationImagesDir));
app.use('/images/profileimages/beneficiary', express.static(beneficiaryProfileImagesDir));
app.use('/images/beneficiary_proof', express.static(beneficiaryProofImagesDir));
app.use('/images/beneficiary_certificate', express.static(beneficiaryCertificateDir));
app.use('/images/request_proof', express.static(requestProofImagesDir));
app.use('/images/request_certificate', express.static(requestCertificateDir));

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


// app.use("/admin", adminRoutes)
