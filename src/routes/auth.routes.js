import express from 'express';
import { register, login, logout, logoutAllDevices, refreshAccessToken } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.post('/logout',logout);
router.post('/logout-all',protect,logoutAllDevices);

router.post('/refresh',refreshAccessToken);


export default router;