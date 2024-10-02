import express from 'express';
import emojis from './emojis';
import launch from './launch';

const router = express.Router();

router.use('/', launch);
router.use('/emojis', emojis);

export default router;
