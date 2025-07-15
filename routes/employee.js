const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');
const SubCategory = require('../models/subCategory.model');
const FAQ = require('../models/faq.model');
const TopData = require('../models/topData.model');
const { authenticateToken, isEmployee } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Employee Login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find employee by userId
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if employee is active
    if (!employee.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: employee._id, userId: employee.userId, role: 'employee' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Employee login successful',
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        userId: employee.userId
      }
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Sub Categories (Employee can view)
router.get('/subcategories', authenticateToken, isEmployee, async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate('mainCategory', 'title')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      subCategories
    });
  } catch (error) {
    console.error('Get sub categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Sub Category (Employee can update)
router.put('/subcategories/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription 
    } = req.body;

    // Find sub category
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Sub category not found' });
    }

    // Update fields
    if (metaTitle) subCategory.metaTitle = metaTitle;
    if (metaDescription) subCategory.metaDescription = metaDescription;
    if (keywords) subCategory.keywords = keywords;
    if (tags) subCategory.tags = tags;
    if (contentTitle) subCategory.contentTitle = contentTitle;
    if (contentDescription) subCategory.contentDescription = contentDescription;
    
    // Set updatedBy to current employee
    subCategory.updatedBy = req.user.userId;

    await subCategory.save();

    res.json({
      message: 'Sub category updated successfully',
      subCategory: {
        id: subCategory._id,
        metaTitle: subCategory.metaTitle,
        contentTitle: subCategory.contentTitle,
        updatedBy: subCategory.updatedBy
      }
    });
  } catch (error) {
    console.error('Update sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Sub Category by ID (Employee can view)
router.get('/subcategories/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id)
      .populate('mainCategory', 'title')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!subCategory) {
      return res.status(404).json({ message: 'Sub category not found' });
    }

    res.json({
      subCategory
    });
  } catch (error) {
    console.error('Get sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Top Data (Employee can view)
router.get('/topdata', authenticateToken, isEmployee, async (req, res) => {
  try {
    const topDataList = await TopData.find({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      topDataList
    });
  } catch (error) {
    console.error('Get top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Top Data by ID (Employee can view)
router.get('/topdata/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;

    const topData = await TopData.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!topData) {
      return res.status(404).json({ message: 'Top data not found' });
    }

    res.json({
      topData
    });
  } catch (error) {
    console.error('Get top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Top Data (Employee can update)
router.put('/topdata/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription,
      colorCode
    } = req.body;

    // Find top data
    const topData = await TopData.findById(id);
    if (!topData) {
      return res.status(404).json({ message: 'Top data not found' });
    }

    // Update fields
    if (metaTitle) topData.metaTitle = metaTitle;
    if (metaDescription) topData.metaDescription = metaDescription;
    if (keywords) topData.keywords = keywords;
    if (tags) topData.tags = tags;
    if (contentTitle) topData.contentTitle = contentTitle;
    if (contentDescription) topData.contentDescription = contentDescription;
    if (colorCode) topData.colorCode = colorCode;
    
    // Set updatedBy to current employee
    topData.updatedBy = req.user.userId;

    await topData.save();

    res.json({
      message: 'Top data updated successfully',
      topData: {
        id: topData._id,
        metaTitle: topData.metaTitle,
        contentTitle: topData.contentTitle,
        colorCode: topData.colorCode,
        updatedBy: topData.updatedBy
      }
    });
  } catch (error) {
    console.error('Update top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All FAQs (Employee can view)
router.get('/faqs', authenticateToken, isEmployee, async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .populate('subCategory', 'metaTitle contentTitle')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FAQs by Sub Category (Employee can view)
router.get('/faqs/subcategory/:subCategoryId', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const faqs = await FAQ.find({ 
      subCategory: subCategoryId, 
      isActive: true 
    })
      .populate('subCategory', 'metaTitle contentTitle')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs by sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FAQ by ID (Employee can view)
router.get('/faqs/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id)
      .populate('subCategory', 'metaTitle contentTitle')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({
      faq
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update FAQ (Employee can update)
router.put('/faqs/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      question, 
      answer, 
      order 
    } = req.body;

    // Find FAQ
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Update fields
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (order !== undefined) faq.order = order;
    
    // Set updatedBy to current employee
    faq.updatedBy = req.user.userId;

    await faq.save();

    res.json({
      message: 'FAQ updated successfully',
      faq: {
        id: faq._id,
        question: faq.question,
        order: faq.order,
        updatedBy: faq.updatedBy
      }
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 