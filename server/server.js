const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/db');
const scriptRouter = require('./routes/scriptRoute');
const uploadRouter = require('./routes/uploadRoute');


dotenv.config();
const PORT = process.env.PORT || 5000;



const app = express();

connectDB();
app.use(express.json());
app.use(cors());


app.use('/api/scripts',scriptRouter);
app.use('/api/upload',uploadRouter);

app.use('/uploads',express.static(path.join(path.resolve(),'/uploads')));


app.listen(PORT, () => {
    console.log(`Server is up at port: ${PORT}`.green);
})