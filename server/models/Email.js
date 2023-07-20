const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: 'This field is required.'
  },
  category: {
    type: String,
    required: 'This field is required.'
  },
});

module.exports = mongoose.model('Email', emailSchema);