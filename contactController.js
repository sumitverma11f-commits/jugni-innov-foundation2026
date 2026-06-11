const ContactMessage = require('../models/ContactMessage');
const { cleanText, isEmail, isPhone } = require('../utils/validators');

const { notifyContactSubmission } = require('../utils/emailService');

async function createContactMessage(req, res, next) {
  try {
    const data = {
      firstName: cleanText(req.body.firstName),
      lastName: cleanText(req.body.lastName),
      email: cleanText(req.body.email).toLowerCase(),
      phone: cleanText(req.body.phone),
      role: cleanText(req.body.role),
      message: cleanText(req.body.message)
    };

    if (!data.firstName || !data.lastName || !data.email || !data.role || !data.message) {
      res.status(400);
      throw new Error('Please fill all required fields.');
    }

    if (data.firstName.length < 2) {
      res.status(400);
      throw new Error('First name must be at least 2 characters.');
    }

    if (data.lastName.length < 2) {
      res.status(400);
      throw new Error('Last name must be at least 2 characters.');
    }

    if (data.message.length < 10) {
      res.status(400);
      throw new Error('Message must be at least 10 characters.');
    }

    if (!isEmail(data.email)) {
      res.status(400);
      throw new Error('Please enter a valid email address.');
    }

    if (data.phone && !isPhone(data.phone)) {
      res.status(400);
      throw new Error('Please enter a valid phone number (e.g. +91 98765 43210).');
    }

    const savedMessage = await ContactMessage.create(data);

    notifyContactSubmission(data).catch(err =>
      console.error('Contact email notification failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully.',
      data: { id: savedMessage._id }
    });

  } catch (error) {
    next(error);
  }
}

async function getContacts(req, res, next) {
  try {
    const { search, limit = 100 } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { message: searchRegex }
      ];
    }

    const contacts = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      total,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
}

async function updateContactReadStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== 'boolean') {
      res.status(400);
      throw new Error('Invalid status: isRead must be a boolean.');
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error('Contact message not found.');
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404);
      throw new Error('Contact message not found.');
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createContactMessage,
  getContacts,
  updateContactReadStatus,
  deleteContact
};