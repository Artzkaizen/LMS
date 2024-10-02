import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import launch from './launch';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use('/', launch);
router.use('/emojis', emojis);

export default router;
