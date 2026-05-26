const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/error.middleware');


const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/favourites', require('./routes/favourite.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/addresses', require('./routes/address.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;