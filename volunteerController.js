const VolunteerApplication = require('../models/VolunteerApplication');
const { cleanText, isEmail } = require('../utils/validators');

const {  notifyVolunteerSubmission } = require('../utils/emailService');

async function createVolunteerApplication(req, res, next) {
  try {
    const data = {
      fullName: cleanText(req.body.fullName),
      email: cleanText(req.body.email).toLowerCase(),
      areaOfInterest: cleanText(req.body.areaOfInterest),
      motivation: cleanText(req.body.motivation)
    };

    if (!data.fullName || !data.email || !data.areaOfInterest || !data.motivation) {
      res.status(400);
      throw new Error('Please fill all required fields.');
    }

    if (data.fullName.length < 2) {
      res.status(400);
      throw new Error('Full name must be at least 2 characters.');
    }

    if (data.motivation.length < 10) {
      res.status(400);
      throw new Error('Motivation must be at least 10 characters.');
    }

    if (!isEmail(data.email)) {
      res.status(400);
      throw new Error('Please enter a valid email address.');
    }

    const savedApplication = await VolunteerApplication.create(data);

    notifyVolunteerSubmission(data).catch(err =>
      console.error('Volunteer email notification failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Your volunteer application has been submitted successfully.',
      data: { id: savedApplication._id }
    });

  } catch (error) {
    next(error);
  }
}

async function getVolunteers(req, res, next) {
  try {
    const { search, status, limit = 100 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { areaOfInterest: searchRegex },
        { motivation: searchRegex }
      ];
    }

    const volunteers = await VolunteerApplication.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await VolunteerApplication.countDocuments(query);

    res.json({
      success: true,
      total,
      data: volunteers
    });
  } catch (error) {
    next(error);
  }
}

async function updateVolunteerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updated = await VolunteerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error('Volunteer application not found.');
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteVolunteer(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await VolunteerApplication.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404);
      throw new Error('Volunteer application not found.');
    }

    res.json({
      success: true,
      message: 'Volunteer application deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createVolunteerApplication,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer
};