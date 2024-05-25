const express = require('express');
const router = express.Router();
const userRoutes  = require("./users");

router.use("/users",userRoutes);

router.get('*', function(req, res){
    res.status(404).send('what???');
});

module.exports = router