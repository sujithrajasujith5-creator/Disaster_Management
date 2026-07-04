const express = require('express');
const {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  deleteReport,
  getAllReports,
  updateReportStatus,
  getDashboardStats,
  getStatistics,
} = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { incidentValidation } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/my', getMyReports);
router.get('/admin/statistics', authorize('admin'), getStatistics);
router.get('/', authorize('admin'), getAllReports);
router.post('/', upload.array('evidence', 5), incidentValidation, createReport);
router.get('/:id', getReportById);
router.put('/:id', upload.array('evidence', 5), updateReport);
router.delete('/:id', deleteReport);
router.put('/:id/status', authorize('admin'), updateReportStatus);

module.exports = router;
