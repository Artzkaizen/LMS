import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res, next) => {
    const rd = req;
    try {
        const response = await fetch(
            'https://b-trend.digital/local/news/get-course.php?courseid=8'
        );
        if (!response.ok) throw new Error('Error');
        const data = await response.json();
        res.json([...data]);
    } catch (error) {
        next(error);
    }
});
app.use('/', middlewares.authenticate, api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
