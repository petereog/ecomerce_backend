const Address = require('../models/Address');

// GET all addresses
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json({ success: true, count: addresses.length, addresses });
  } catch (err) {
    next(err);
  }
};

// ADD address
exports.addAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, zipCode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user.id,
      label, street, city, state, zipCode, country, isDefault,
    });

    res.status(201).json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

// UPDATE address
exports.updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      const err = new Error('Address not found');
      err.statusCode = 404;
      return next(err);
    }

    if (address.user.toString() !== req.user.id) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, address: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE address
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      const err = new Error('Address not found');
      err.statusCode = 404;
      return next(err);
    }

    if (address.user.toString() !== req.user.id) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }

    await address.deleteOne();
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
};

// SET default address
exports.setDefaultAddress = async (req, res, next) => {
  try {
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
    const address = await Address.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });
    if (!address) {
      const err = new Error('Address not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};
