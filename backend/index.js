const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { update } = require("./models/Activity");
const fileRoutes = require("./routes/fileUploadRoutes");
const ACTIVITY = require("./models/Activity");
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
const http = require("http").Server(app);
io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.listen(8000);
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

const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port;

  console.log("App started at port:", port);
});
