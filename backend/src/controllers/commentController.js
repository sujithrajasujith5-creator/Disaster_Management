const Comment = require('../models/Comment');
const IncidentReport = require('../models/IncidentReport');

exports.getComments = async (req, res, next) => {
  try {
    const filter = { incidentReport: req.params.incidentId };

    if (req.user.role !== 'admin') {
      filter.isInternal = false;
    }

    const comments = await Comment.find(filter)
      .populate('author', 'name email role')
      .sort('createdAt');

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const incident = await IncidentReport.findById(req.params.incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const isInternal = req.body.isInternal === true || req.body.isInternal === 'true';
    if (isInternal && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for internal notes' });
    }

    const comment = await Comment.create({
      incidentReport: req.params.incidentId,
      author: req.user._id,
      content: req.body.content,
      isInternal,
    });

    const populated = await Comment.findById(comment._id).populate('author', 'name email role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
