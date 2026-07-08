import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import crypto from 'crypto';

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await User.findOne({email});
        if(user){
            return done(null,user);
        }else{
            const randomPassword = crypto.randomBytes(20).toString('hex');
             user = await User.create({
                email,
                password:randomPassword
            });
            return done(null,user);
        }
    }
));