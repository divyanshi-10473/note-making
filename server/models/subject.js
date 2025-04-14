const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  ],
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
