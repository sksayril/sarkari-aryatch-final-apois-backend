const mongoose = require('mongoose');

const latestJobsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'],
    trim: true
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true
  },
  metaTags: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  contentTitle: {
    type: String,
    required: true,
    trim: true
  },
  contentDescription: {
    type: String,
    required: true,
    trim: true
  },
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

// Indexes for better query performance
latestJobsSchema.index({ category: 1, isActive: 1 });
latestJobsSchema.index({ createdAt: -1 });
latestJobsSchema.index({ metaTitle: 'text', contentTitle: 'text', contentDescription: 'text' });

module.exports = mongoose.model('LatestJobs', latestJobsSchema); 