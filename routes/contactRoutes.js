const express = require('express');
const {
  createContactMessage,
  getContacts,
  updateContactReadStatus,
  deleteContact
} = require('../controllers/contactController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Route
router.post('/', createContactMessage);

// Admin Routes
router.get('/', verifyToken, getContacts);
router.patch('/:id/read', verifyToken, updateContactReadStatus);
router.delete('/:id', verifyToken, deleteContact);

module.exports = router;
