const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { commentValidation } = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/', getComments);
router.post('/', commentValidation, addComment);
router.delete('/:id', deleteComment);

module.exports = router;
