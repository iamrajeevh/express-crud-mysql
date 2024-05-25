const express = require('express');
const router = express.Router();
const  {getAllUsers}  =  require("../controllers/UserController");

router.get("/",getAllUsers);

router.route("/:id").get((req, res) => {
    return res.json({
        'status' : 'success',
        'status_code' : 20,
        'message' : 'user get successfully'
    });
});

router.route("/").post((req, res) => {
    return res.json({
        'status' : 'success',
        'status_code' : 20,
        'message' : 'user creates successsfully'
    });
});

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