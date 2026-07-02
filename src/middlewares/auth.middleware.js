import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
    } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
