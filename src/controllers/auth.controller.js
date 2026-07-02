// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../services/token.service.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
     // Step 1: Check if the user already exists
    const existingUser = await User.findOne({email});
    if (existingUser){
        return res.status(409).json({message:'Email already in use'});
    }
    const newUser = new User({email,password});
    
    await newUser.save();
 
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);


    await Session.create({
        userId: newUser._id,
        refreshToken: refreshToken,
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || 'unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });


    // Sending response (Refresh Token in cookie, Access Token in JSON)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (error) {
    next(error); 
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    
    await Session.create({
        userId: user._id,
        refreshToken: refreshToken,
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || 'unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    // 1. Grab the refresh token from the secure cookie
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // 2. Attempt to delete it from the database (if it exists)
      const deletedSession = await Session.findOneAndDelete({ refreshToken });
      if(deletedSession){
        console.log('Session deleted Successfully');
      }
    }

    // 3. Clear the refresh cookie from the browser 🧼
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // 4. Always return a success status
    return res.status(200).json({ message: 'Logged out successfully on server' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error during logout' });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    // We assume the protect middleware has already run and attached the user to req.user
    const userId = req.user.id; 
    
   const deletedSession = await Session.deleteMany({ userId });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during global logout' });
  }
};


export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing, You may have to login again' });
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    const userId = decoded.id;
  
    const user = User.findById(userId);

 
    const currentSession = await Session.findOne({ refreshToken: oldRefreshToken });

    //Token is valid but NOT in our database (Reused Token)
    if (!currentSession) {
      // Wipe out ALL active sessions for this user to protect the account
      await Session.deleteMany({ userId });
      
      // Clear the cookie on the client side
      res.clearCookie('refreshToken');
      
      return res.status(401).json({ 
        success: false, 
        message: 'Security alert: Refresh token reuse detected. All sessions invalidated. Please log in again.' 
      });
    }

    const newAccessToken = generateAccessToken(user);
    
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};