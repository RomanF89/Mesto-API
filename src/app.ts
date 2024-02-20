import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index'

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
