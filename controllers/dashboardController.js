const Project = require("../model/projectModel");
const Category = require("../model/categoryModel");
const Profile = require("../model/profileModel");
const User = require("../model/useModel"); // your user model

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalProfiles = await Profile.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalProjects,
                totalUsers,
                totalCategories,
                totalProfiles
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: error.message
        });
    }
};


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Get monthly project count
// Get monthly project count
exports.getMonthlyProjectStats = async (req, res) => {
    try {
        // Get year from query param or default to current year
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Start and end date for the year
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

        // Aggregate projects by month
        const projects = await Project.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // group by month number
                    totalProjects: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 } // sort by month
            }
        ]);

        // Map to all months, fill 0 if no projects
        const data = monthNames.map((month, index) => {
            const monthData = projects.find(p => p._id === index + 1);
            return {
                month,
                totalProjects: monthData ? monthData.totalProjects : 0
            };
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly project stats",
            error: error.message
        });
    }
};