const express = require('express');
const bodyParser = require('body-parser');
var morgan = require('morgan')
const routes = require("./routes/index");
const sequelize = require("./model/index")
var path = require('path');
const url = require('url'); 
const port = 3000;
const app = express();


var logger = morgan("dev")
app.use(logger)
app.use("/public", express.static(path.join(__dirname, 'public')));
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json());


app.use('/', routes);

app.listen(port, function () {
    console.log("Server is listening at port:" + port);
});