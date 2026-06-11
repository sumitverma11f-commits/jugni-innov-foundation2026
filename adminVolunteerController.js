const VolunteerApplication = require('../models/VolunteerApplication');

// GET /api/volunteer?search=&status=&page=1&limit=50
async function getAllVolunteers(req, res, next) {
  try {
    const { search = '', status = '', page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { fullName:       { $regex: search, $options: 'i' } },
        { email:          { $regex: search, $options: 'i' } },
        { areaOfInterest: { $regex: search, $options: 'i' } },
        { motivation:     { $regex: search, $options: 'i' } }
      ];
    }

    const [docs, total] = await Promise.all([
      VolunteerApplication.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      VolunteerApplication.countDocuments(query)
    ]);

    res.json({ success: true, total, page: Number(page), data: docs });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/volunteer/:id
async function deleteVolunteer(req, res, next) {
  try {
    const doc = await VolunteerApplication.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Volunteer application not found.');
    }
    res.json({ success: true, message: 'Volunteer application deleted.' });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/volunteer/:id/status
async function updateVolunteerStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Allowed: ${allowed.join(', ')}`);
    }

    const doc = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doc) {
      res.status(404);
      throw new Error('Volunteer application not found.');
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllVolunteers, deleteVolunteer, updateVolunteerStatus };
