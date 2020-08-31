const createError = require('http-errors');
require('dotenv').config();
require('./db/connection');
const express = require('express');
var cors = require('cors')   
const path = require('path');

var app = express();

/* FOR CORS ACCESS CONTROL */
var corsOptions = {
	origin: '*', 
	credentials: true,
	allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());


app.use(require('./Router/Account/userRouter'));
app.use(require('./Router/subject/subjectRouter'));


/* CATCH 404 AND FORWARD TO ERROR HANDLER */
app.use(function (req, res, next) {
    next(createError(404,`Path '${req.url}' Not Found !!`));
  });
  
// Static path
app.use('/static', express.static(path.join(__dirname, 'public'))); 
  
/* Global ERROR HANDLER */
app.use(function (err, req, res, next) {
  let e = JSON.stringify(err, ['message','errmsg']);

  res.status(err.status || 500)
    .json({
      "status": err.status || 500,
      "success": false,
      "error": JSON.parse(e).errmsg || JSON.parse(e).message
    })
    .end();

});
  
  process.on('unhandledRejection', function (reason, p) {
    
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  });

var port = process.env.PORT || 3001;
app.listen(port,console.log.bind(console,`server is up on port ${port}`));