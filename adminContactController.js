const ContactMessage = require('../models/ContactMessage');

// GET /api/contact?search=&page=1&limit=20
async function getAllContacts(req, res, next) {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName:  { $regex: search, $options: 'i' } },
            { email:     { $regex: search, $options: 'i' } },
            { role:      { $regex: search, $options: 'i' } },
            { message:   { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [docs, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      ContactMessage.countDocuments(query)
    ]);

    res.json({ success: true, total, page: Number(page), data: docs });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/contact/:id
async function deleteContact(req, res, next) {
  try {
    const doc = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Contact message not found.');
    }
    res.json({ success: true, message: 'Contact message deleted.' });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/contact/:id/read
async function markContactRead(req, res, next) {
  try {
    const { isRead } = req.body;
    const doc = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: Boolean(isRead) },
      { new: true }
    );
    if (!doc) {
      res.status(404);
      throw new Error('Contact message not found.');
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllContacts, deleteContact, markContactRead };
