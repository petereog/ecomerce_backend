const Review = require('../models/Review');
const Product = require('../models/Product');

// CREATE review
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      const err = new Error('You have already reviewed this product');
      err.statusCode = 400;
      return next(err);
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    // update product ratings
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.ratings = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();

    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

// GET reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'username avatar')
      .sort('-createdAt');
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};

// DELETE review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      const err = new Error('Review not found');
      err.statusCode = 404;
      return next(err);
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    await review.deleteOne();

    // update product ratings
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.numReviews = reviews.length;
    product.ratings = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    await product.save();

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};