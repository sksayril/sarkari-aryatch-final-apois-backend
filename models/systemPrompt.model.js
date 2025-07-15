const mongoose = require('mongoose');

const systemPromptSchema = new mongoose.Schema({
  systemPrompt: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
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

module.exports = mongoose.model('SystemPrompt', systemPromptSchema); 