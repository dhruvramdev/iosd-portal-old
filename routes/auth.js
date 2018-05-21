import express from 'express';
let router = express.Router();

import userController from '../controllers/userController';

router.post('/signup', userController.signup);
router.post('/login', userController.login);

export default router ;