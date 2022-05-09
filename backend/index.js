const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { update } = require("./models/Activity");
const fileRoutes = require("./routes/fileUploadRoutes");
const ACTIVITY = require("./models/Activity");
const http = require("http");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");
let path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./utils/connectdb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

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
app.use("/uploads", express.static(path.join("uploads")));
app.use("/course", express.static(path.join("course")));
//socket.io
const httpServer = http.Server(app);
io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.listen(8080);
//
app.set("socketio", io);
app.use(passport.initialize());
require("./security/passport")(passport);
const routesTaining = require("./routes/training.routes");
const userRouter = require("./routes/userRoutes");
const routesCourse = require("./routes/course.routes");

app.use("/api", routesCourse);
app.use("/api", routesTaining);
app.use("/eya", fileRoutes.routes);
app.use("/users", userRouter);

app.get("/", function (req, res) {
  res.send({ status: "success" });
});
app.get("/get-token", (req, res) => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

  const options = { expiresIn: "10m", algorithm: "HS256" };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});

//
app.post("/create-meeting/", (req, res) => {
  const { token, region } = req.body;
  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ region }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
});

//
app.post("/validate-meeting/:meetingId", (req, res) => {
  const token = req.body.token;
  const meetingId = req.params.meetingId;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
});

const server1 = app.listen(process.env.PORT || 8081, function () {
  const port = server1.address().port;

  console.log("App started at port:", port);
});

// // socket

// const socketUtils = require("./utils/socketUtils");

// const server2 = http.createServer(app);
// const io1 = socketUtils.sio(server2);
// socketUtils.connection(io1);
// const socketIOMiddleware = (req, res, next) => {
//   req.io = io1;

//   next();
// };

// // ROUTES
// app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
//   req.io.emit("message", `Hello, ${req.originalUrl}`);
//   res.send("hello world!");
// });

// // LISTEN

// server2.listen(8002, () => {
//   console.log("App running on port 8002...");
// });

//web socket
const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log("listening on port 8000");
const wsServer = new webSocketServer({
  httpServer: server,
});
// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  );
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: ", message.utf8Data);

      // broadcasting message to all connected clients
      for (var key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log("sent Message to: ", clients[key]);
      }
    }
  });
});


//stripe
const { v4: uuidv4 } = require('uuid');
const { uuid } = require("uuidv4");
uuidv4();
const stripe = require("stripe")("sk_test_51KuHK6DzmY9Xbsy847Rjz4ETDpuV66abvkEB9DAQTgAHL62K6FTd0yo839bCwxkpE0cLw4bZ9NG9Pp1a1yA12UgA00HfutQiOg");

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { training, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: training.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${training.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});
