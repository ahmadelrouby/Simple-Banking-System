const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');


var routerAdmin = express.Router();
var routerClient = express.Router();
var routerTeller = express.Router();
var routerAuth = express.Router();


var con = mysql.createConnection({
  host: "localhost",
  user: "******",
  password: "******",
  database: "*******"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


const adminRoute = require('./routes/admin')(routerAdmin,con)
const clientRoute = require('./routes/client')(routerClient,con)
const tellerRoute = require('./routes/teller')(routerTeller,con)
const authRoute = require('./routes/auth')(routerAuth,con)



var app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/',(req,res)=>{
  res.status(200).send('Thank you for doing this');
})

app.use('/admin',adminRoute);
app.use('/client',clientRoute);
app.use('/teller',tellerRoute);
app.use('/auth',authRoute);


app.listen(PORT , () => {
  console.log("Listening on port: " + PORT);
})
