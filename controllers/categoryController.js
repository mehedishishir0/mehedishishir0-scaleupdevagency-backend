const Category = require("../model/categoryModel");
const Project = require("../model/projectModel");


// Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add category", error });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // sorted alphabetically
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch categories", error });
  }
};

exports.getCategoriesWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};

    // Search by category name
    if (search) {
      const words = search.trim().split(/\s+/).filter(Boolean);

      query.$and = words.map(word => ({
        name: { $regex: word, $options: "i" },
      }));
    }

    // Fetch categories
    const categories = await Category.find(query)
      .sort({ name: 1 }) // alphabetical
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error,
    });
  }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch category", error });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update category", error });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id

    // Check if any project uses this category
    const projectUsingCategory = await Project.findOne({ category: categoryId })
    if (projectUsingCategory) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. Some projects are using this category."
      })
    }

    // Delete category
    const category = await Category.findByIdAndDelete(categoryId)
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" })

    res.status(200).json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    })
  }
}