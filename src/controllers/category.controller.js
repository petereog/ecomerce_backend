const Category = require('../models/Category');

// CREATE category (admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      const err = new Error('Category already exists');
      err.statusCode = 400;
      return next(err);
    }

    const category = await Category.create({ name, image });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// GET all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    next(err);
  }
};

// UPDATE category (admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// DELETE category (admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};