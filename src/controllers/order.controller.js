const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { createNotification } = require('./notification.controller');

// CREATE order
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images');
    if (!cart || cart.items.length === 0) {
      const err = new Error('Cart is empty');
      err.statusCode = 400;
      return next(err);
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || '',
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: cart.totalPrice,
    });

    await Cart.findOneAndDelete({ user: req.user.id });

    await createNotification(
      req.user.id,
      'Order Placed Successfully',
      `Your order #${order._id} has been placed and is being processed.`,
      'order'
    );

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET my orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

// GET single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// UPDATE order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();

    await order.save();

    await createNotification(
      order.user,
      'Order Status Updated',
      `Your order #${order._id} is now ${order.orderStatus}.`,
      'delivery'
    );

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'username email').sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};