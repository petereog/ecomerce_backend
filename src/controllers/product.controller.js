const Product = require('../models/Product');

// CREATE product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    const product = await Product.create({
      name, description, price, category, stock, images,
      seller: req.user.id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// GET all products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).populate('seller', 'username email');
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// GET single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'username email');
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// UPDATE product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      const err = new Error('Not authorized to update this product');
      err.statusCode = 403;
      return next(err);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      const err = new Error('Not authorized to delete this product');
      err.statusCode = 403;
      return next(err);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};