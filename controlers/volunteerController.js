const Volunteer = require("../models/volunteer.js");

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

    // CHECK EXISTING EMAIL
    const existingVolunteer = await Volunteer.findOne({ email });

    if (existingVolunteer) {
      return res.status(400).json({
        message: "Volunteer already exists",
      });
    }

    // HANDLE IMAGE
    let image = "";

    if (req.file) {
      image = req.file.path;
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      phone,
      skills: typeof skills === "string" ? skills.split(",") : skills,

      availability,
      address,
      motivation,
      image,
    });

    res.status(201).json({
      message: "Volunteer application submitted",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL VOLUNTEERS
exports.getVolunteers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // FILTER BY STATUS
    if (status) {
      query.status = status;
    }

    // SEARCH
    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Volunteer.countDocuments(query);

    res.status(200).json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      volunteers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE VOLUNTEER
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.status(200).json(volunteer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE STATUS
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    volunteer.status = status;

    await volunteer.save();

    res.status(200).json({
      message: `Volunteer ${status} successfully`,
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// APPROVE VOLUNTEER
exports.approveVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      message: "Volunteer approved",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REJECT VOLUNTEER
exports.rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true },
    );

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      message: "Volunteer rejected",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE VOLUNTEER
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
