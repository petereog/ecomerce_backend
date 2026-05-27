const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/favourites', require('./routes/favourite.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/addresses', require('./routes/address.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;