const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  telegramLink: {
    type: String,
    required: true,
    trim: true
  },
  whatsappLink: {
    type: String,
    required: true,
    trim: true
  },
  faqs: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
homeContentSchema.index({ isActive: 1 });

module.exports = mongoose.model('HomeContent', homeContentSchema); 