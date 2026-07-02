// src/services/token.service.js
import jwt from 'jsonwebtoken';

/**
 * 🔑 Generates a short-lived Access Token
 * @param {Object} user - The user object containing id and role
 * @returns {String} JWT Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' } //  Short lifespan for security
  );
};

/**
 * 🔄 Generates a long-lived Refresh Token
 * @param {Object} user - The user object containing id
 * @returns {String} JWT Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // ⏳ Long lifespan to keep user logged in
  );
};