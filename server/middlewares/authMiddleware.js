import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // ✅ correct import

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ safely attach user object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // ✅ call next to proceed
    } catch (error) {
      console.error('❌ Invalid token:', error.message);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; // ✅ import the User model

// export const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.split(' ')[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // ✅ fetch the full user (without password) and attach to req.user
//       req.user = await User.findById(decoded.id).select('-password');

//       if (!req.user) {
//         return res.status(401).json({ message: 'User not found' });
//       }

//       next();
//     } catch (error) {
//       console.error('❌ Invalid token:', error.message);
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//   } else {
//     return res.status(401).json({ message: 'No token provided' });
//   }
// };
