const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    chapter_name: {
      type: String,
      required: true,
      unique: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false, 
    },
   
  }, { timestamps: true });

  const Chapter = mongoose.model('Chapter', chapterSchema);
  
 
  module.exports = Chapter;