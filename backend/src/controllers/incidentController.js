const IncidentReport = require('../models/IncidentReport');
const HelpRequest = require('../models/HelpRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const createStatusNotification = async (incident, userId, newStatus) => {
  const notification = await Notification.create({
    title: 'Report Status Updated',
    message: `Your report "${incident.title}" status changed to "${newStatus}".`,
    type: 'status_update',
    priority: incident.severity === 'Critical' ? 'Critical' : 'Medium',
    sender: userId,
    recipients: [{ user: incident.reportedBy }],
    relatedIncident: incident._id,
  });
  return notification;
};

exports.createReport = async (req, res, next) => {
  try {
    const evidence = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      path: `/uploads/${file.filename}`,
      size: file.size,
    }));

    const report = await IncidentReport.create({
      ...req.body,
      reportedBy: req.user._id,
      evidence,
    });

    if (req.body.helpRequested === 'true' || req.body.helpRequested === true) {
      await HelpRequest.create({
        incidentReport: report._id,
        requestedBy: req.user._id,
        urgency: req.body.severity,
        message: req.body.helpMessage || 'Emergency help requested for this incident.',
      });
    }

    const populated = await IncidentReport.findById(report._id)
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyReports = async (req, res, next) => {
  try {
    const reports = await IncidentReport.find({ reportedBy: req.user._id })
      .populate('assignedTo', 'name email')
      .sort('-createdAt');
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

exports.getReportById = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id)
      .populate('reportedBy', 'name email role department')
      .populate('assignedTo', 'name email role');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const isOwner = report.reportedBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    let report = await IncidentReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (report.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: 'Can only edit reports before review',
      });
    }

    const newEvidence = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      path: `/uploads/${file.filename}`,
      size: file.size,
    }));

    const updateData = { ...req.body };
    if (newEvidence.length) {
      updateData.evidence = [...report.evidence, ...newEvidence];
    }

    report = await IncidentReport.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('reportedBy', 'name email');

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (report.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete reports before review',
      });
    }

    report.evidence.forEach((file) => {
      const filePath = path.join(__dirname, '../../uploads', file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await HelpRequest.deleteMany({ incidentReport: report._id });
    await report.deleteOne();

    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const {
      status,
      severity,
      disasterType,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (disasterType) filter.disasterType = disasterType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await IncidentReport.countDocuments(filter);
    const reports = await IncidentReport.find(filter)
      .populate('reportedBy', 'name email role department')
      .populate('assignedTo', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;
    let report = await IncidentReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const oldStatus = report.status;
    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    if (assignedTo !== undefined) report.assignedTo = assignedTo || null;

    await report.save();

    if (status && status !== oldStatus) {
      await createStatusNotification(report, req.user._id, status);
    }

    if (assignedTo) {
      await Notification.create({
        title: 'Incident Assigned',
        message: `You have been assigned to incident: "${report.title}".`,
        type: 'assignment',
        priority: report.severity === 'Critical' ? 'Critical' : 'High',
        sender: req.user._id,
        recipients: [{ user: assignedTo }],
        relatedIncident: report._id,
      });
    }

    report = await IncidentReport.findById(report._id)
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';

    const baseFilter = isAdmin ? {} : { reportedBy: req.user._id };

    const [total, pending, resolved, critical, byType, byStatus, recent] = await Promise.all([
      IncidentReport.countDocuments(baseFilter),
      IncidentReport.countDocuments({ ...baseFilter, status: { $in: ['Submitted', 'Under Review'] } }),
      IncidentReport.countDocuments({ ...baseFilter, status: 'Resolved' }),
      IncidentReport.countDocuments({ ...baseFilter, severity: 'Critical', status: { $ne: 'Resolved' } }),
      IncidentReport.aggregate([
        ...(isAdmin ? [] : [{ $match: { reportedBy: req.user._id } }]),
        { $group: { _id: '$disasterType', count: { $sum: 1 } } },
      ]),
      IncidentReport.aggregate([
        ...(isAdmin ? [] : [{ $match: { reportedBy: req.user._id } }]),
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      IncidentReport.find(isAdmin ? {} : { reportedBy: req.user._id })
        .populate('reportedBy', 'name email')
        .sort('-createdAt')
        .limit(5),
    ]);

    const activeIncidents = await IncidentReport.find({
      ...baseFilter,
      status: { $in: ['Submitted', 'Under Review', 'In Progress'] },
    })
      .populate('reportedBy', 'name email')
      .sort('-createdAt')
      .limit(10);

    let helpRequests = [];
    if (!isAdmin) {
      helpRequests = await HelpRequest.find({ requestedBy: req.user._id })
        .populate('incidentReport', 'title status severity')
        .sort('-createdAt')
        .limit(5);
    } else {
      helpRequests = await HelpRequest.find({ status: { $ne: 'Completed' } })
        .populate('incidentReport', 'title status severity')
        .populate('requestedBy', 'name email')
        .sort('-createdAt')
        .limit(10);
    }

    res.json({
      success: true,
      data: {
        stats: { total, pending, resolved, critical },
        byType,
        byStatus,
        recentReports: recent,
        activeIncidents,
        helpRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const [monthlyTrend, severityBreakdown, resolutionTime] = await Promise.all([
      IncidentReport.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      IncidentReport.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      IncidentReport.aggregate([
        { $match: { status: 'Resolved' } },
        {
          $project: {
            resolutionDays: {
              $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 1000 * 60 * 60 * 24],
            },
          },
        },
        { $group: { _id: null, avgDays: { $avg: '$resolutionDays' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        monthlyTrend,
        severityBreakdown,
        avgResolutionDays: resolutionTime[0]?.avgDays?.toFixed(1) || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
