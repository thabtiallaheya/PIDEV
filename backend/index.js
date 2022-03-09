const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PIDEV = require("./models/PIDEV");

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://Firas:qs2DNSfxzNVgWzT5@pidev.rwjs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

const routesTaining = require("./routes/training.routes");
app.use("/api", routesTaining);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/data", async (req, res) => {
  const activity = new PIDEV({
    title: "act",
    file: "file.txt",
    creationDate: "2022-06-21",
    limitDate: "2022-06-22",
  });
  try {
    await activity.save();
    res.send("INSERTED DATA");
  } catch (err) {
    console.log(err);
  }
});
app.listen(3001, () => {
  console.log("app is running in port 3001");
});
