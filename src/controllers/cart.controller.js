const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images');
    if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// ADD to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    if (product.stock < quantity) {
      const err = new Error('Not enough stock');
      err.statusCode = 400;
      return next(err);
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// REMOVE from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      const err = new Error('Cart not found');
      err.statusCode = 404;
      return next(err);
    }

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// CLEAR cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};