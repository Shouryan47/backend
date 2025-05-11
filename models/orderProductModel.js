const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    productDetails: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
    paymentDetails: {
      paymentId: {
        type: String,
        default: '',
      },
      payment_method_type: {
        type: [String],
        default: [],
      },
      payment_status: {
        type: String,
        default: '',
      },
    },
    // Optional: store shipping info if available
    shipping: {
      address: Object,
      name: String,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
