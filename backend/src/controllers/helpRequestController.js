const HelpRequest = require('../models/HelpRequest');
const IncidentReport = require('../models/IncidentReport');

exports.createHelpRequest = async (req, res, next) => {
  try {
    const incident = await IncidentReport.findById(req.body.incidentReport);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (incident.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const helpRequest = await HelpRequest.create({
      ...req.body,
      requestedBy: req.user._id,
    });

    incident.helpRequested = true;
    await incident.save();

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('incidentReport', 'title status severity')
      .populate('requestedBy', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyHelpRequests = async (req, res, next) => {
  try {
    const requests = await HelpRequest.find({ requestedBy: req.user._id })
      .populate('incidentReport', 'title status severity location')
      .populate('respondedBy', 'name email')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.getAllHelpRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await HelpRequest.find(filter)
      .populate('incidentReport', 'title status severity location')
      .populate('requestedBy', 'name email role')
      .populate('respondedBy', 'name email')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.updateHelpRequest = async (req, res, next) => {
  try {
    const { status, responseNotes } = req.body;
    let helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: 'Help request not found' });
    }

    if (status) helpRequest.status = status;
    if (responseNotes !== undefined) helpRequest.responseNotes = responseNotes;
    helpRequest.respondedBy = req.user._id;

    await helpRequest.save();

    helpRequest = await HelpRequest.findById(helpRequest._id)
      .populate('incidentReport', 'title status severity')
      .populate('requestedBy', 'name email')
      .populate('respondedBy', 'name email');

    res.json({ success: true, data: helpRequest });
  } catch (error) {
    next(error);
  }
};
