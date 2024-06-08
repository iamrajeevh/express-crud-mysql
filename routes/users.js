const express = require('express');
const router = express.Router();
const  {getAllUsers,getUserDetail,createUser}  =  require("../controllers/UserController");
const multer  = require('multer')
// const upload = multer({ dest: 'public/uploads/' })
const path = require('path');
router.get("/",getAllUsers);


router.get("/:id",getUserDetail);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        console.log('extensions',extArray)
        let extension = extArray[extArray.length - 1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      console.log('fileNameOrg0',file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
    }
  })
  
const upload = multer({ dest: 'public/uploads/',storage: storage })

router.post("/upload-profile-img",upload.single('profile_img'),(req,res,next) =>{
    console.log('fileAllInfo',req.file)
    const filePath = path.resolve(__dirname, '..', req.file.path);
    console.log('__dirname', filePath);
    return res.json({
        'status':'ok',
        'fileName':'filename',
        'all':req.file,
        'complete_path':__dirname+'../public/uploads/'+req.file.filename
    })
});






router.post("/",createUser);

router.route("/:id").delete((req, res) => {
    return res.json({
        'status' : 'success',
        'status_code' : 20,
        'message' : 'user deleted successfully'
    });
});

router.route("/:id").put((req, res) => {
    return res.json({
        'status' : 'success',
        'status_code' : 20,
        'message' : 'users updated successfully'
    });
});

module.exports = router;