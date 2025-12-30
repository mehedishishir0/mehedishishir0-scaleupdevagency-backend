const Profile = require("../model/profileModel");

// Add Profile
exports.addProfile = async (req, res) => {
    try {
        const { name } = req.body;

        const existing = await Profile.findOne({ name });
        if (existing) return res.status(400).json({ success: false, message: "Profile already exists" });

        const profile = await Profile.create({ name });
        res.status(201).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add profile", error });
    }
};

// Get All Profiles
exports.getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: profiles });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch profiles", error });
    }
};

// Get Single Profile
exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch profile", error });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update profile", error });
    }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.status(200).json({ success: true, message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete profile", error });
    }
};
