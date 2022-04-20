const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { update } = require("./models/Activity");
const fileRoutes = require("./routes/fileUploadRoutes");
const ACTIVITY = require("./models/Activity");
const http = require('http');
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./utils/connectdb");

const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.static("images"));

app.use(passport.initialize());
require("./security/passport")(passport);
const routesTaining = require("./routes/training.routes");

app.use("/api", routesTaining);
app.use("/eya", fileRoutes.routes);
app.use("/users", userRouter);

app.get("/", function (req, res) {
  res.send({ status: "success" });
});

const server1 = app.listen(process.env.PORT || 8081, function () {
  const port = server1.address().port;

  console.log("App started at port:", port);
});



// socket

const socketUtils = require("./utils/socketUtils");

const server2 = http.createServer(app);
const io = socketUtils.sio(server2);
socketUtils.connection(io);
const socketIOMiddleware = (req, res, next) => {
  req.io = io;

  next();
};

// CORS
app.use(cors());


// ROUTES
app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
  req.io.emit("message", `Hello, ${req.originalUrl}`);
  res.send("hello world!");
});

// LISTEN

server2.listen(8002, () => {
  console.log("App running on port 8002...");
});


//web socket
const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');
const wsServer = new webSocketServer({
  httpServer: server
});
// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ', message.utf8Data);

      // broadcasting message to all connected clients
      for( var key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log('sent Message to: ', clients[key]);
      }
    }
  })

  



});
