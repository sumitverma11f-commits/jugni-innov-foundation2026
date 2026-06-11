const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ContactMessage = require('../models/ContactMessage');
const VolunteerApplication = require('../models/VolunteerApplication');

// POST /api/admin/login
async function loginAdmin(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Username and password are required.');
    }

    if (username !== process.env.ADMIN_USERNAME) {
      res.status(401);
      throw new Error('Invalid credentials.');
    }

    const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid credentials.');
    }

    const token = jwt.sign(
      { username: process.env.ADMIN_USERNAME, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({ success: true, token, message: 'Login successful.' });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/stats
async function getDashboardStats(req, res, next) {
  try {
    const [
      totalContacts,
      unreadContacts,
      totalVolunteers,
      pendingVolunteers,
      acceptedVolunteers,
      rejectedVolunteers
    ] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      VolunteerApplication.countDocuments(),
      VolunteerApplication.countDocuments({ status: 'pending' }),
      VolunteerApplication.countDocuments({ status: 'accepted' }),
      VolunteerApplication.countDocuments({ status: 'rejected' })
    ]);

    res.json({
      success: true,
      data: {
        contacts: { total: totalContacts, unread: unreadContacts },
        volunteers: {
          total: totalVolunteers,
          pending: pendingVolunteers,
          accepted: acceptedVolunteers,
          rejected: rejectedVolunteers
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { loginAdmin, getDashboardStats };
