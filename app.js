const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config(); 



const { routesInit } = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();

app.use(express.json());


app.use(cors());


app.use(express.static(path.join(__dirname, "public")));

routesInit(app);

const server = http.createServer(app);

const port = process.env.PORT ;
console.log("server running on port " + port);
server.listen(port);

