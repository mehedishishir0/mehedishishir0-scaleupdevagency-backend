const Project = require("../model/project");


// Add Project
exports.addProject = async (req, res) => {
    try {
        const { name, figmaLink, websiteLink, adminLink, category } = req.body;

        const project = await Project.create({
            name,
            figmaLink,
            websiteLink,
            adminLink,
            category,
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add project", error });
    }
};

// Get Projects with Pagination, Search & Category Filter
// exports.getProjects = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const search = req.query.search || "";
//         const category = req.query.category || "All";

//         const query = {};

//         // If category is not "All", filter by category
//         if (category && category !== "All") {
//             query.category = category;
//         }

//         // If search exists, search in both name and category
//         if (search) {
//             query.$or = [
//                 { name: { $regex: search, $options: "i" } },
//                 { category: { $regex: search, $options: "i" } }
//             ];
//         }

//         const total = await Project.countDocuments(query);

//         const projects = await Project.find(query)
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         res.status(200).json({
//             success: true,
//             data: projects,
//             pagination: {
//                 total,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit),
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to fetch projects", error });
//     }
// };

exports.getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const category = req.query.category || "All";

        const query = {};

        // Filter by category if not "All"
        if (category && category !== "All") {
            query.category = category;
        }

        // Word-based search in name or category
        if (search) {
            const words = search.trim().split(/\s+/).filter(Boolean);

            query.$and = words.map((word) => ({
                $or: [
                    { name: { $regex: word, $options: "i" } },
                    { category: { $regex: word, $options: "i" } },
                ],
            }));
        }

        const total = await Project.countDocuments(query);

        const projects = await Project.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

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


// Get Single Project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch project", error });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    try {
        const { name, figmaLink, websiteLink, adminLink, category } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, figmaLink, websiteLink, adminLink, category },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update project", error });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete project", error });
    }
};
