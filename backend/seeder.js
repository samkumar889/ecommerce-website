const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const products = [
  {
    name: 'AquaGuard Classic RO',
    description: 'Basic 5-stage RO water purifier with sediment, carbon, and RO filters',
    price: 4999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20classic%20RO%20water%20purifier%20white%20kitchen%20appliance%20product%20photo&image_size=square_hd',
    stock: 50,
    category: 'RO Purifier'
  },
  {
    name: 'AquaGuard Premium RO+UV',
    description: 'Advanced RO+UV+UF purification with digital display and filter change alerts',
    price: 9999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20premium%20RO%20UV%20water%20purifier%20modern%20design%20digital%20display%20product%20shot&image_size=square_hd',
    stock: 30,
    category: 'RO+UV Purifier'
  },
  {
    name: 'AquaGuard Compact',
    description: 'Space-saving gravity-based water purifier perfect for small kitchens and offices',
    price: 3499,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20compact%20gravity%20water%20purifier%20small%20size%20kitchen%20countertop&image_size=square_hd',
    stock: 40,
    category: 'Gravity Purifier'
  },
  {
    name: 'AquaGuard Elite Pro',
    description: 'Top-of-the-line RO+UV+UF+Mineral purifier with pH balancing and smart connectivity',
    price: 14999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20elite%20premium%20water%20purifier%20luxury%20design%20smart%20features%20product%20photography&image_size=square_hd',
    stock: 20,
    category: 'RO+UV+UF+Mineral'
  },
  {
    name: 'AquaGuard Nano',
    description: 'Portable water purifier bottle for travel and outdoor use',
    price: 2499,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20portable%20water%20purifier%20bottle%20travel%20outdoor%20product%20photo&image_size=square_hd',
    stock: 35,
    category: 'Portable'
  },
  {
    name: 'AquaGuard Copper+',
    description: 'RO purifier with copper infusion for healthy mineral water',
    price: 11999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20copper%20water%20purifier%20RO%20with%20copper%20infusion%20product%20image&image_size=square_hd',
    stock: 25,
    category: 'RO+Copper'
  }
];

const importData = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Sample products imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
