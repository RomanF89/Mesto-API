import express from 'express';
const { PORT = 3000 } = process.env;
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})