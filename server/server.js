const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const cors = require('cors');
const seats = require('./DatabaseTransactions/UpdateSeats')
const Booking =  require('./DatabaseTransactions/seats')

let app = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    next();
  });

// Inital title
app.get("/",function(req,res){
    res.setHeader("Content-Type", "application/json");
    seats.SeatsUpdate().then((result)=>res.status(200).json(result), (error) => res.status(502).json({error:"Failed to fetch"})).catch(err => res.status(502).json({error:"Failed to fetch"}))
})

// When called booking function
app.get("/book",function(req,res){
    res.setHeader("Content-Type", "application/json");
    Booking.Booking(req.query.seat).then((result)=>res.status(200).json(result), (error) => res.status(502).json({error:"Failed to fetch"})).catch(err => res.status(502).json({error:"Failed to fetch"}))
})

server.listen(process.env.PORT || 8090);