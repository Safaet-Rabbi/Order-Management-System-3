const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ['In Transit', 'Delivered', 'Pending'],
      default: 'Pending',
    },
    deliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
