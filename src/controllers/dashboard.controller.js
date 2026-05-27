const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const recentOrders = await Order.find()
      .populate('user', 'username email')
      .sort('-createdAt')
      .limit(5);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};