// const Project = require("../model/projectModel");
// const Category = require("../model/categoryModel");
// const Profile = require("../model/profileModel");

// // Add Project
// exports.addProject = async (req, res) => {
//     try {
//         const { name, figmaLink, websiteLink, adminLink, category, profile, orderId } = req.body;

//         if (!name || !figmaLink || !websiteLink || !adminLink || !category || !profile || !orderId) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }
//         // Validate category
//         const categoryExists = await Category.findById(category);
//         if (!categoryExists) {
//             return res.status(400).json({ success: false, message: "Invalid category ID" });
//         }

//         // Validate profile
//         const profileExists = await Profile.findById(profile);
//         if (!profileExists) {
//             return res.status(400).json({ success: false, message: "Invalid profile ID" });
//         }

//         const project = await Project.create({
//             name,
//             figmaLink,
//             websiteLink,
//             adminLink,
//             category,
//             profile,
//             orderId
//         });

//         // Populate category and profile before sending response
//         await project.populate([
//             { path: "category", select: "name" },
//             { path: "profile", select: "name" }
//         ]);


//         res.status(201).json({ success: true, data: project });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Failed to add project", error });
//     }
// };

// // Get Projects with search, filtering, pagination
// exports.getProjects = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const search = req.query.search || "";
//         const categoryFilter = req.query.category || "All";

//         const query = {};

//         // Filter by category if provided
//         if (categoryFilter && categoryFilter !== "All") {
//             query.category = categoryFilter;
//         }

//         // Fetch projects and populate category & profile
//         let projects = await Project.find(query)
//             .populate("category", "name")
//             .populate("profile", "name")
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         const total = await Project.countDocuments(query);

//         // Word-based search on project name, orderId, category name, or profile name
//         if (search) {
//             const words = search.trim().split(/\s+/).filter(Boolean);
//             projects = projects.filter(project =>
//                 words.every(word =>
//                     project.name.toLowerCase().includes(word.toLowerCase()) ||
//                     project.orderId.toLowerCase().includes(word.toLowerCase()) ||
//                     (project.category && project.category.name.toLowerCase().includes(word.toLowerCase())) ||
//                     (project.profile && project.profile.name.toLowerCase().includes(word.toLowerCase()))
//                 )
//             );
//         }

//         res.status(200).json({
//             success: true,
//             data: projects,
//             pagination: {
//                 total,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit),
//                 hasPrevPage: page > 1,
//                 hasNextPage: page < Math.ceil(total / limit),
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Failed to fetch projects", error });
//     }
// };

// // Get single project by ID
// exports.getProjectById = async (req, res) => {
//     try {
//         const project = await Project.findById(req.params.id)
//             .populate("category", "name")
//             .populate("profile", "name");

//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         res.status(200).json({ success: true, data: project });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Failed to fetch project", error });
//     }
// };

// // Update Project
// exports.updateProject = async (req, res) => {
//     try {
//         const { name, figmaLink, websiteLink, adminLink, category, profile, orderId } = req.body;

//         // Validate category
//         const categoryExists = await Category.findById(category);
//         if (!categoryExists) {
//             return res.status(400).json({ success: false, message: "Invalid category ID" });
//         }

//         // Validate profile
//         const profileExists = await Profile.findById(profile);
//         if (!profileExists) {
//             return res.status(400).json({ success: false, message: "Invalid profile ID" });
//         }

//         const project = await Project.findByIdAndUpdate(
//             req.params.id,
//             { name, figmaLink, websiteLink, adminLink, category, profile, orderId },
//             { new: true, runValidators: true }
//         ).populate("category", "name").populate("profile", "name");

//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         res.status(200).json({ success: true, data: project });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Failed to update project", error });
//     }
// };

// // Delete Project
// exports.deleteProject = async (req, res) => {
//     try {
//         const project = await Project.findByIdAndDelete(req.params.id);

//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         res.status(200).json({ success: true, message: "Project deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Failed to delete project", error });
//     }
// };




const Project = require("../model/projectModel");
const Category = require("../model/categoryModel");
const Profile = require("../model/profileModel");

// Add Project
exports.addProject = async (req, res) => {
    try {
        const { name, figmaLink, websiteLink, adminLink, type, category, profile, orderId } = req.body;

        if (!name || !figmaLink || !websiteLink || !adminLink || !type || !category || !profile || !orderId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate type
        if (!["web", "app"].includes(type)) {
            return res.status(400).json({ success: false, message: "Type must be either 'web' or 'app'" });
        }

        // Validate category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(400).json({ success: false, message: "Invalid category ID" });

        // Validate profile
        const profileExists = await Profile.findById(profile);
        if (!profileExists) return res.status(400).json({ success: false, message: "Invalid profile ID" });

        const project = await Project.create({
            name,
            figmaLink,
            websiteLink,
            adminLink,
            type,
            category,
            profile,
            orderId
        });

        await project.populate([
            { path: "category", select: "name" },
            { path: "profile", select: "name" }
        ]);

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add project", error });
    }
};

// Get Projects with search, filtering, pagination
exports.getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const categoryFilter = req.query.category || "All";
        const typeFilter = req.query.type || "All";

        const query = {};

        if (categoryFilter && categoryFilter !== "All") query.category = categoryFilter;
        if (typeFilter && typeFilter !== "All") query.type = typeFilter;

        let projects = await Project.find(query)
            .populate("category", "name")
            .populate("profile", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Project.countDocuments(query);

        if (search) {
            const words = search.trim().split(/\s+/).filter(Boolean);
            projects = projects.filter(project =>
                words.every(word =>
                    project.name.toLowerCase().includes(word.toLowerCase()) ||
                    project.orderId.toLowerCase().includes(word.toLowerCase()) ||
                    (project.category && project.category.name.toLowerCase().includes(word.toLowerCase())) ||
                    (project.profile && project.profile.name.toLowerCase().includes(word.toLowerCase()))
                )
            );
        }

        res.status(200).json({
            success: true,
            data: projects,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasPrevPage: page > 1,
                hasNextPage: page < Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch projects", error });
    }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("category", "name")
            .populate("profile", "name");

        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch project", error });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    try {
        const { name, figmaLink, websiteLink, adminLink, type, category, profile, orderId } = req.body;

        if (!["web", "app"].includes(type)) {
            return res.status(400).json({ success: false, message: "Type must be either 'web' or 'app'" });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(400).json({ success: false, message: "Invalid category ID" });

        const profileExists = await Profile.findById(profile);
        if (!profileExists) return res.status(400).json({ success: false, message: "Invalid profile ID" });

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, figmaLink, websiteLink, adminLink, type, category, profile, orderId },
            { new: true, runValidators: true }
        ).populate("category", "name").populate("profile", "name");

        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update project", error });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete project", error });
    }
};
