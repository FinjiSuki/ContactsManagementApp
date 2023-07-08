const express = require('express')
const router = express.Router()
const {getContact,getContacts,createContact,updateContact,deleteContact,bulkCreateContacts, addContact,editContact, checkingUpload,checkingUploadPOST} = require("../controllers/contactController")
// const upload = require('../middleware/uploadFile')
const validateToken = require('../middleware/validateTokenHandler')
const multer = require('multer')
const fs  = require("fs")

  
router.use(validateToken)

const filesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.body
      // console.log(req.body)
      const folderName = `./uploads/users/${id}`;
      console.log(folderName)
  
      if (!fs.existsSync(folderName)) { fs.mkdirSync(folderName, { recursive: true }) }
  
      return cb(null, folderName);
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      return cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: filesStorage });

router.route("/").get(getContacts)
// router.route("/addNewContact").get(addContact).post(createContact)
router.route("/addNewContact").get(addContact)

router.post("/addNewContact",upload.single('contactPicture'), createContact)

router.route("/bulkCreate").post(bulkCreateContacts)

router.route("/:id").get(getContact)
router.route("/update/:id").put(updateContact)
router.route("/delete/:id").post(deleteContact)
router.route("/edit/:id").get(editContact)

// router.get("/stats",checkingUpload)

// router.post("/checkupload",upload.single('uploaded_file'),checkingUploadPOST)

module.exports = router