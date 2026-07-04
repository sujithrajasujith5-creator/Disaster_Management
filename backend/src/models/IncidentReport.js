const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    disasterType: {
      type: String,
      enum: ['Fire', 'Flood', 'Earthquake', 'Medical Emergency', 'Electrical Hazard', 'Other'],
      required: [true, 'Disaster type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: [true, 'Severity is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    incidentDateTime: {
      type: Date,
      required: [true, 'Incident date and time is required'],
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
      default: 'Submitted',
    },
    evidence: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        path: String,
        size: Number,
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    helpRequested: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

incidentReportSchema.index({ status: 1, severity: 1, createdAt: -1 });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
