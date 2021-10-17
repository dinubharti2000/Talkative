// imports 

const cookieParser = require("cookie-parser");

const csrf = require("csurf");

const bodyParser = require("body-parser");

const csrfMiddleware = csrf({cookie: true});

var admin = require("firebase-admin");

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const path = require('path');

// configuring static folder

app.use('/static', express.static('public'));

// innitilizing firbase auth

var serviceAccount = require("./talkative-auth-firebase-adminsdk-1qc10-79dc00a955.json");

// socket code starts from here 
const server = require("http").createServer(app);

const io = require("socket.io")(server);

io.on("connection", function(socket){
	socket.on("newuser",function(username){
		socket.broadcast.emit("update", username + " joined the conversation");
	});
	socket.on("exituser",function(username){
		socket.broadcast.emit("update", username + " left the conversation");
	});
	socket.on("chat",function(message){
		socket.broadcast.emit("chat", message);
	});
});



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://server-auth-41acc.firebaseio.com"
});



// using middleware

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);


app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});


app.post("/sessionLogin", (req, res) => {

    const idToken = req.body.idToken.toString();
 
    const expiresIn = 60*60*24*5*1000;
    admin
    .auth()
    .createSessionCookie(idToken,{expiresIn})
    .then(
        (sessionCookie) =>{
        const options = {maxAge:expiresIn, httpOnly:true};
        res.cookie("session",sessionCookie,options);
        res.end(JSON.stringify({status:"success"}));
        },
        (error)=>{
            res.status(401).send("unauthorised access");


        });
});







// routes 

app.get('/',(req,res)=>{
    res.sendFile(path. join(__dirname + '/views/index.html'));
});

app.get('/loggedin',(req,res)=>{
    res.sendFile(path.join(__dirname + '/views/logged_in.html'));

});


// listening on port
server.listen(PORT,()=>{
    console.log(`listening on http://localhost:${PORT}`)
}); 










