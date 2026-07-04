const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema(
  {
    incidentReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncidentReport',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Help request message is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Acknowledged', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    responseNotes: {
      type: String,
      default: '',
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
