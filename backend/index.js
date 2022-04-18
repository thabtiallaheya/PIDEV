const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join("images")));
mongoose
  .connect(
    "mongodb://localhost:27017/pidev",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

const routesTaining = require("./routes/training.routes");
const routesCourse = require("./routes/course.routes");

app.use("/api", routesTaining);
app.use("/api", routesCourse);
app.listen(3001, () => {
  console.log("app is running in port 3001");
});
