const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  mainCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MainCategory', 
    required: true 
  },
  metaTitle: { 
    type: String, 
    required: true 
  },
  metaDescription: { 
    type: String 
  },
  keywords: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  contentTitle: { 
    type: String, 
    required: true 
  },
  contentDescription: { 
    type: String 
  }, // markdown data
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee' 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
