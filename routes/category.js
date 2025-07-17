const express = require('express');
const router = express.Router();
const MainCategory = require('../models/mainCategory.model');
const SubCategory = require('../models/subCategory.model');
const FAQ = require('../models/faq.model');
const TopData = require('../models/topData.model');

// Public API - Get All Main Categories
router.get('/main', async (req, res) => {
  try {
    const categories = await MainCategory.find({ isActive: true })
      .select('title')
      .sort({ createdAt: -1 });

    res.json({
      categories
    });
  } catch (error) {
    console.error('Get main categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get Main Category by ID
router.get('/main/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await MainCategory.findById(id)
      .select('title');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      category
    });
  } catch (error) {
    console.error('Get main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get All Sub Categories
router.get('/sub', async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate('mainCategory', 'title')
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription mainCategory')
      // .sort({ createdAt: -1 });

    res.json({
      subCategories
    });
  } catch (error) {
    console.error('Get sub categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get Sub Categories by Main Category
router.get('/sub/main/:mainCategoryId', async (req, res) => {
  try {
    const { mainCategoryId } = req.params;

    const subCategories = await SubCategory.find({ 
      mainCategory: mainCategoryId, 
      isActive: true 
    })
      .populate('mainCategory', 'title')
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription mainCategory')
      .sort({ createdAt: -1 });

    res.json({
      subCategories
    });
  } catch (error) {
    console.error('Get sub categories by main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get Sub Category by ID
router.get('/sub/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id)
      .populate('mainCategory', 'title')
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription mainCategory');

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

// Public API - Search Sub Categories
router.get('/sub/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const subCategories = await SubCategory.find({
      $or: [
        { metaTitle: { $regex: query, $options: 'i' } },
        { contentTitle: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ],
      isActive: true
    })
      .populate('mainCategory', 'title')
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription mainCategory')
      .sort({ createdAt: -1 });

    res.json({
      subCategories
    });
  } catch (error) {
    console.error('Search sub categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get All Top Data
router.get('/topdata', async (req, res) => {
  try {
    const topDataList = await TopData.find({ isActive: true })
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription colorCode')
      // .sort({ _id: -1 });

    res.json({
      topDataList
    });
  } catch (error) {
    console.error('Get top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get Top Data by ID
router.get('/topdata/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const topData = await TopData.findById(id)
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription colorCode');

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

// Public API - Search Top Data
router.get('/topdata/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const topDataList = await TopData.find({
      $or: [
        { metaTitle: { $regex: query, $options: 'i' } },
        { contentTitle: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ],
      isActive: true
    })
      .select('metaTitle metaDescription keywords tags contentTitle contentDescription colorCode')
      .sort({ createdAt: -1 });

    res.json({
      topDataList
    });
  } catch (error) {
    console.error('Search top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get All FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .populate('subCategory', 'metaTitle contentTitle')
      .select('question answer order subCategory')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get FAQs by Sub Category
router.get('/faqs/subcategory/:subCategoryId', async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const faqs = await FAQ.find({ 
      subCategory: subCategoryId, 
      isActive: true 
    })
      .populate('subCategory', 'metaTitle contentTitle')
      .select('question answer order subCategory')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs by sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public API - Get FAQ by ID
router.get('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id)
      .populate('subCategory', 'metaTitle contentTitle')
      .select('question answer order subCategory');

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

// Public API - Search FAQs
router.get('/faqs/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const faqs = await FAQ.find({
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
      .populate('subCategory', 'metaTitle contentTitle')
      .select('question answer order subCategory')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Search FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 