const mongoose = require('mongoose');

const topDataSchema = new mongoose.Schema({
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
  colorCode: {
    type: String,
    default: '#000000' // default black color
  },
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

module.exports = mongoose.model('TopData', topDataSchema); 