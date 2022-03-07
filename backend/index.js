const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json())
mongoose.connect(
    "mongodb+srv://Firas:qs2DNSfxzNVgWzT5@pidev.rwjs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(3001, () => {
    console.log('app is running in port 3001');
})



