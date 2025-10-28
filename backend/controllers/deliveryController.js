const asyncHandler = require('express-async-handler');
const Delivery = require('../models/Delivery');

// @desc    Update delivery status of an order
// @route   PUT /api/deliveries/:id/status
// @access  Private/Admin
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { deliveryStatus, deliveryDate } = req.body;

  const delivery = await Delivery.findById(req.params.id);

  if (delivery) {
    delivery.deliveryStatus = deliveryStatus || delivery.deliveryStatus;
    if (deliveryStatus === 'Delivered' && !delivery.deliveryDate) {
      delivery.deliveryDate = deliveryDate ? new Date(deliveryDate) : new Date();
    } else if (deliveryStatus !== 'Delivered') {
      delivery.deliveryDate = undefined; // Clear delivery date if not delivered
    }

    console.log('before save', delivery);
    const updatedDelivery = await delivery.save();
    console.log('after save', updatedDelivery);
    res.json(updatedDelivery);
  } else {
    res.status(404);
    throw new Error('Delivery not found');
  }
});

// @desc    Get all orders for delivery tracking
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find({}).populate({
    path: 'order',
    populate: [
      { path: 'customer', select: 'name' },
      { path: 'items.product', select: 'name' }
    ],
  });
  res.json(deliveries);
});

module.exports = {
  updateDeliveryStatus,
  getDeliveries,
};