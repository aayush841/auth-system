import express from 'express';
import { register, login, logout, logoutAllDevices, refreshAccessToken, googleAuthCallback } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.post('/logout',logout);
router.post('/logout-all',protect,logoutAllDevices);

//redirecting the frontend to allow Permission
router.get("/google",passport.authenticate('google',{
    scope:["profile","email"],
}));

//after allowing permission browser(google) sends req to callback
router.get("/google/callback", passport.authenticate('google',{
    session:false,
    failureRedirect: 'http://localhost:5173/login?error=google_denied'
}),googleAuthCallback);

router.post('/refresh',refreshAccessToken);


export default router;