require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');


//my routes
const authRoutes = require("./routes/auth")
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')



app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect("mongodb+srv://dvgreddy:Naveen143@dvg-bvelt.mongodb.net/test?retryWrites=true&w=majority" ||
    process.env.URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true

    }).then(() => {
    console.log('DB Connected')
}).catch(() => {
    console.log("Connection Error")
});


mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected');
})

//my routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);


const port = 8001;
app.listen(port, () => {
    console.log(`app is running at ${port}`)
})