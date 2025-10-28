const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const customers = require('./data/customers');
const Customer = require('./models/Customer');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Customer.deleteMany();

    const adminUser = await User.findOne({ isAdmin: true });

    const sampleCustomers = customers.map((customer) => {
      return { ...customer, user: adminUser._id };
    });

    await Customer.insertMany(sampleCustomers);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Customer.deleteMany();

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
