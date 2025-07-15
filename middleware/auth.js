const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Combined middleware for admin authentication
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Admin token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin access required.' });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access denied. Invalid admin token.' });
  }
};

// Middleware to check if user is employee
const isEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(403).json({ message: 'Employee access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Combined middleware for employee authentication
const authenticateEmployee = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Employee token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(403).json({ message: 'Access denied. Employee access required.' });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access denied. Invalid employee token.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isEmployee,
  authenticateAdmin,
  authenticateEmployee
}; 