const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    incidentReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncidentReport',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
