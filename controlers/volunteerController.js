const Volunteer = require("../models/volunteer");

// CREATE VOLUNTEER
exports.createVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      skills,
      availability,
      address,
      motivation,
    } = req.body;

    const volunteer = new Volunteer({
      fullName,
      email,
      phone,
      skills: skills ? skills.split(",") : [],
      availability,
      address,
      motivation,
      image: req.file ? req.file.path : null,
    });

    await volunteer.save();

    res.status(201).json({
      message: "Volunteer application submitted",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL VOLUNTEERS
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE VOLUNTEER
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE STATUS (Admin use)
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteVolunteer = async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
