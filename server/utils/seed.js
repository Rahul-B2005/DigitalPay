const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Biller = require('../models/Biller');

dotenv.config();
connectDB();

const billers = [
  // ---------------- Mobile recharge (prepaid packs) ----------------
  {
    name: 'Airtel Prepaid',
    category: 'mobile_recharge',
    icon: 'airtel',
    minAmount: 10,
    maxAmount: 3999,
    plans: [
      { price: 99, validity: '18 days', data: 'No data', calls: '100 mins', sms: '', description: 'Talktime' },
      { price: 179, validity: '24 days', data: '1GB total', calls: 'Unlimited', sms: '300 SMS', description: '' },
      { price: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular' },
      { price: 359, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 399, validity: '28 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 479, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 719, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value' },
      { price: 3359, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual' },
    ],
  },
  {
    name: 'Jio Prepaid',
    category: 'mobile_recharge',
    icon: 'jio',
    minAmount: 10,
    maxAmount: 3999,
    plans: [
      { price: 155, validity: '24 days', data: '1GB total', calls: 'Unlimited', sms: '300 SMS', description: '' },
      { price: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular' },
      { price: 349, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 666, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 889, validity: '84 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value' },
      { price: 3599, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual' },
    ],
  },
  {
    name: 'Vi Prepaid',
    category: 'mobile_recharge',
    icon: 'vi',
    minAmount: 10,
    maxAmount: 3999,
    plans: [
      { price: 99, validity: '20 days', data: 'No data', calls: '200 mins', sms: '', description: 'Talktime' },
      { price: 179, validity: '24 days', data: '1GB total', calls: 'Unlimited', sms: '300 SMS', description: '' },
      { price: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular' },
      { price: 379, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 459, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 699, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value' },
      { price: 3099, validity: '365 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual' },
    ],
  },
  {
    name: 'BSNL Prepaid',
    category: 'mobile_recharge',
    icon: 'bsnl',
    minAmount: 10,
    maxAmount: 2999,
    plans: [
      { price: 107, validity: '35 days', data: '2GB total', calls: 'Unlimited', sms: '100 SMS', description: '' },
      { price: 187, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular' },
      { price: 247, validity: '30 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 397, validity: '80 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: '' },
      { price: 599, validity: '110 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best value' },
      { price: 2399, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual' },
    ],
  },

  // ---------------- Electricity (variable, no fixed plans) ----------------
  { name: 'State Electricity Board', category: 'electricity', icon: 'electricity', minAmount: 50, maxAmount: 50000, plans: [] },
  { name: 'Tata Power', category: 'electricity', icon: 'electricity', minAmount: 50, maxAmount: 50000, plans: [] },
  { name: 'BSES Rajdhani', category: 'electricity', icon: 'electricity', minAmount: 50, maxAmount: 50000, plans: [] },
  { name: 'Adani Electricity', category: 'electricity', icon: 'electricity', minAmount: 50, maxAmount: 50000, plans: [] },

  // ---------------- DTH (subscription packs) ----------------
  {
    name: 'Tata Play DTH',
    category: 'dth',
    icon: 'dth',
    minAmount: 100,
    maxAmount: 5000,
    plans: [
      { price: 299, validity: '1 month', data: '150+ channels', calls: '', sms: '', description: 'Value pack' },
      { price: 449, validity: '1 month', data: '250+ channels', calls: '', sms: '', description: 'Popular' },
      { price: 699, validity: '1 month', data: '350+ channels + HD', calls: '', sms: '', description: 'Premium HD' },
      { price: 4999, validity: '12 months', data: '250+ channels', calls: '', sms: '', description: 'Annual saver' },
    ],
  },
  {
    name: 'Airtel Digital TV',
    category: 'dth',
    icon: 'dth',
    minAmount: 100,
    maxAmount: 5000,
    plans: [
      { price: 259, validity: '1 month', data: '140+ channels', calls: '', sms: '', description: 'Value pack' },
      { price: 399, validity: '1 month', data: '220+ channels', calls: '', sms: '', description: 'Popular' },
      { price: 649, validity: '1 month', data: '320+ channels + HD', calls: '', sms: '', description: 'Premium HD' },
      { price: 4599, validity: '12 months', data: '220+ channels', calls: '', sms: '', description: 'Annual saver' },
    ],
  },
  {
    name: 'Dish TV',
    category: 'dth',
    icon: 'dth',
    minAmount: 100,
    maxAmount: 5000,
    plans: [
      { price: 249, validity: '1 month', data: '130+ channels', calls: '', sms: '', description: 'Value pack' },
      { price: 379, validity: '1 month', data: '200+ channels', calls: '', sms: '', description: 'Popular' },
      { price: 599, validity: '1 month', data: '300+ channels + HD', calls: '', sms: '', description: 'Premium HD' },
    ],
  },

  // ---------------- Gas (cylinder booking prices, city-variable) ----------------
  {
    name: 'Indane Gas',
    category: 'gas',
    icon: 'gas',
    minAmount: 100,
    maxAmount: 3000,
    plans: [
      { price: 803, validity: '', data: '14.2kg cylinder', calls: '', sms: '', description: 'Domestic' },
      { price: 1786, validity: '', data: '19kg cylinder', calls: '', sms: '', description: 'Commercial' },
    ],
  },
  {
    name: 'HP Gas',
    category: 'gas',
    icon: 'gas',
    minAmount: 100,
    maxAmount: 3000,
    plans: [
      { price: 807, validity: '', data: '14.2kg cylinder', calls: '', sms: '', description: 'Domestic' },
      { price: 1795, validity: '', data: '19kg cylinder', calls: '', sms: '', description: 'Commercial' },
    ],
  },
  {
    name: 'Bharat Gas',
    category: 'gas',
    icon: 'gas',
    minAmount: 100,
    maxAmount: 3000,
    plans: [
      { price: 805, validity: '', data: '14.2kg cylinder', calls: '', sms: '', description: 'Domestic' },
      { price: 1790, validity: '', data: '19kg cylinder', calls: '', sms: '', description: 'Commercial' },
    ],
  },

  // ---------------- Water (variable, no fixed plans) ----------------
  { name: 'Municipal Water Board', category: 'water', icon: 'water', minAmount: 50, maxAmount: 5000, plans: [] },

  // ---------------- Broadband (monthly plans) ----------------
  {
    name: 'ACT Fibernet',
    category: 'broadband',
    icon: 'broadband',
    minAmount: 300,
    maxAmount: 5000,
    plans: [
      { price: 549, validity: '1 month', data: '40 Mbps, unlimited', calls: '', sms: '', description: 'Basic' },
      { price: 749, validity: '1 month', data: '100 Mbps, unlimited', calls: '', sms: '', description: 'Popular' },
      { price: 999, validity: '1 month', data: '200 Mbps, unlimited', calls: '', sms: '', description: 'Fast' },
      { price: 1499, validity: '1 month', data: '300 Mbps, unlimited', calls: '', sms: '', description: 'Pro' },
    ],
  },
  {
    name: 'JioFiber',
    category: 'broadband',
    icon: 'broadband',
    minAmount: 300,
    maxAmount: 5000,
    plans: [
      { price: 399, validity: '1 month', data: '30 Mbps, unlimited', calls: '', sms: '', description: 'Basic' },
      { price: 599, validity: '1 month', data: '100 Mbps, unlimited', calls: '', sms: '', description: 'Popular' },
      { price: 999, validity: '1 month', data: '250 Mbps, unlimited', calls: '', sms: '', description: 'Fast' },
      { price: 1499, validity: '1 month', data: '500 Mbps, unlimited', calls: '', sms: '', description: 'Pro' },
    ],
  },

  // ---------------- FASTag (variable top-up) ----------------
  { name: 'FASTag Recharge', category: 'fastag', icon: 'fastag', minAmount: 100, maxAmount: 10000, plans: [] },
];

const seed = async () => {
  try {
    await Biller.deleteMany();
    await Biller.insertMany(billers);
    console.log(
      `Billers seeded successfully (${billers.length} billers, ${billers.reduce(
        (n, b) => n + (b.plans?.length || 0),
        0
      )} plans)`
    );
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
