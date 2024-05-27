const express = require('express');
const router = express.Router();
const  {getAllUsers,getUserDetail,createUser}  =  require("../controllers/UserController");

router.get("/",getAllUsers);


router.get("/:id",getUserDetail);

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