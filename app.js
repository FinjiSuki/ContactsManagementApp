const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path")
const ejs = require('ejs');
const flash = require('connect-flash');
const multer = require('multer');
const fs = require('fs');
const validateToken = require('./middleware/validateTokenHandler');

require('dotenv').config()

connectDB();
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 13453;

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.get("/", (req, res) => {
  res.redirect('/user/login')
})
app.use("/contacts", require('./routes/contactRoutes'))
app.use("/user", require('./routes/userRoutes'))
app.use("/error", require('./routes/errorRoutes'))

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const filesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { id } = req.body
    console.log("I'm from filesStorage config function ",req.body)
    const folderName = `./uploads/users/${id}`;
    // console.log(folderName)

    if (!fs.existsSync(folderName)) { fs.mkdirSync(folderName, { recursive: true }) }

    return cb(null, folderName);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    return cb(null, fileName)
  }
})

const upload = multer({ storage: filesStorage });

app.get("/stats", validateToken, (req, res) => {
  const filePath = path.join(__dirname, '.', 'views', 'uploadPicture');
  // console.log(filePath);
  const userId = req.user.id;
  // console.log(userId)
  res.render(filePath, { userId });
})

app.post("/single-photo", upload.single('uploaded_Img'), (req, res) => {
  const file = req.file;
  const { imageCaption } = req.body
  // console.log("I'm present")
  // console.log(file)
  console.log(imageCaption)

  if (!file) {
    //window.alert("Upload a file before clicking submit");
    // return 0;
    throw new Error("Upload a file before clicking submit");
  }
  res.send(file)
})

app.post("/multiple-photos", upload.array('uploaded_Images', 5), (req, res) => {
  console.log("I'm present in multiple images")
  const files = req.files;
  if (files.length > 5) { throw new Error("Upload only 5 files.!!!") }
  const { allImagesCaption } = req.body
  console.log(files)
  console.log(allImagesCaption) 

  if (!files) {
    throw new Error("Upload a file before clicking submit");
  }
  res.send(files)
})

app.post("/ProfilePageUploads", upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 3 }]), (req, res) => {
  console.log(req.files["avatar"])
  console.log("--------------------------------------")
  console.log(req.files["gallery"])

  res.send(req.files["avatar"])

})

app.get("/z", validateToken, (req, res) => {
  const dir = `./uploads/users/${req.user.id}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  res.json({ Message: "Folder created successfilly" })
})

app.use(errorHandler)




app.listen(port, (req, res) => {
  console.log(`Started listening in this ${port} port location`)
})