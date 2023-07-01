const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  Tips: {
    type: Array,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['SoftwareDevelopment','DataAnalyst','Consultancy'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

BlogSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Interview', BlogSchema);