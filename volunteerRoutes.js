const express = require('express');
const {
  createVolunteerApplication,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer
} = require('../controllers/volunteerController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Route
router.post('/', createVolunteerApplication);

// Admin Routes
router.get('/', verifyToken, getVolunteers);
router.patch('/:id/status', verifyToken, updateVolunteerStatus);
router.delete('/:id', verifyToken, deleteVolunteer);

module.exports = router;
