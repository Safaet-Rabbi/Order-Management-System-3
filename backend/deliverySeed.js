const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Delivery.deleteMany();

    const adminUser = await User.findOne({ isAdmin: true });
    const customers = await Customer.find({});
    const products = await Product.find({});

    const sampleOrders = [
      {
        user: adminUser._id,
        customer: customers[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
          },
          {
            product: products[1]._id,
            quantity: 2,
          },
        ],
        total: products[0].price + products[1].price * 2,
        shippingMethod: 'Standard',
      },
      {
        user: adminUser._id,
        customer: customers[1]._id,
        items: [
          {
            product: products[2]._id,
            quantity: 3,
          },
        ],
        total: products[2].price * 3,
        shippingMethod: 'Express',
      },
    ];

    const createdOrders = await Order.insertMany(sampleOrders);

    const sampleDeliveries = createdOrders.map((order) => {
      return { order: order._id };
    });

    await Delivery.insertMany(sampleDeliveries);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Delivery.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
