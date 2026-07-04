const express = require('express');
const {
  createHelpRequest,
  getMyHelpRequests,
  getAllHelpRequests,
  updateHelpRequest,
} = require('../controllers/helpRequestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createHelpRequest);
router.get('/my', getMyHelpRequests);
router.get('/', authorize('admin'), getAllHelpRequests);
router.put('/:id', authorize('admin'), updateHelpRequest);

module.exports = router;
