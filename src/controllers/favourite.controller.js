const Favourite = require('../models/Favourite');

// GET favourites
exports.getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.findOne({ user: req.user.id }).populate('products', 'name price images category');
    if (!favourites) return res.json({ success: true, products: [] });
    res.json({ success: true, products: favourites.products });
  } catch (err) {
    next(err);
  }
};

// ADD to favourites
exports.addToFavourites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    let favourites = await Favourite.findOne({ user: req.user.id });

    if (!favourites) {
      favourites = await Favourite.create({ user: req.user.id, products: [productId] });
    } else {
      if (favourites.products.includes(productId)) {
        const err = new Error('Product already in favourites');
        err.statusCode = 400;
        return next(err);
      }
      favourites.products.push(productId);
      await favourites.save();
    }

    res.json({ success: true, message: 'Added to favourites', favourites });
  } catch (err) {
    next(err);
  }
};

// REMOVE from favourites
exports.removeFromFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.findOne({ user: req.user.id });
    if (!favourites) {
      const err = new Error('Favourites not found');
      err.statusCode = 404;
      return next(err);
    }

    favourites.products = favourites.products.filter(p => p.toString() !== req.params.productId);
    await favourites.save();

    res.json({ success: true, message: 'Removed from favourites', favourites });
  } catch (err) {
    next(err);
  }
};