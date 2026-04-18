/**
 * Product Collection Seeder
 *
 * Usage:  npx ts-node -r tsconfig-paths/register src/seeder/product.seeder.ts
 *
 * This script will:
 *  1. Connect to the MongoDB instance defined in .env
 *  2. Drop existing products, categories, sub-categories and brands collections
 *  3. Seed categories, sub-categories and brands
 *  4. Seed 25 product documents that reference the created categories / brands
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import mongoose, { Types } from 'mongoose';

/* ------------------------------------------------------------------ */
/*  Mongoose Schemas (lightweight mirrors of the NestJS schemas)      */
/* ------------------------------------------------------------------ */

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    imageCover: { type: String, required: true },
    images: { type: [String] },
    sold: { type: Number, default: 0 },
    price: { type: Number, required: true },
    priceAfterDiscount: { type: Number },
    colors: { type: [String] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    ratingsAverage: { type: Number, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

const CategoryModel = mongoose.model('Category', CategorySchema);
const SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);
const BrandModel = mongoose.model('Brand', BrandSchema);
const ProductModel = mongoose.model('Product', ProductSchema);

/* ------------------------------------------------------------------ */
/*  Seed Data                                                         */
/* ------------------------------------------------------------------ */

const categoriesData = [
  { name: 'Electronics' },
  { name: 'Fashion' },
  { name: 'Home & Kitchen' },
  { name: 'Sports & Outdoors' },
  { name: 'Books' },
  { name: 'Health & Beauty' },
];

const subCategoriesData = [
  // Electronics sub-categories
  { name: 'Smartphones', categoryName: 'Electronics' },
  { name: 'Laptops', categoryName: 'Electronics' },
  { name: 'Audio', categoryName: 'Electronics' },
  // Fashion sub-categories
  { name: 'Men Clothing', categoryName: 'Fashion' },
  { name: 'Women Clothing', categoryName: 'Fashion' },
  { name: 'Shoes', categoryName: 'Fashion' },
  // Home & Kitchen sub-categories
  { name: 'Kitchen Appliances', categoryName: 'Home & Kitchen' },
  { name: 'Furniture', categoryName: 'Home & Kitchen' },
  // Sports sub-categories
  { name: 'Fitness Equipment', categoryName: 'Sports & Outdoors' },
  { name: 'Outdoor Gear', categoryName: 'Sports & Outdoors' },
];

const brandsData = [
  { name: 'Apple' },
  { name: 'Samsung' },
  { name: 'Nike' },
  { name: 'Adidas' },
  { name: 'Sony' },
  { name: 'IKEA' },
  { name: 'Philips' },
  { name: 'The North Face' },
  { name: 'Levi\'s' },
  { name: 'Penguin Books' },
];

/**
 * Build product seed data. Receives category/subCategory/brand maps
 * so we can reference real ObjectIds.
 */
function buildProducts(
  catMap: Record<string, Types.ObjectId>,
  subCatMap: Record<string, Types.ObjectId>,
  brandMap: Record<string, Types.ObjectId>,
) {
  return [
    // ── Electronics ──────────────────────────────────────────────
    {
      title: 'iPhone 16 Pro Max 256GB',
      description:
        'The latest Apple flagship smartphone with A18 Pro chip, titanium design, 48MP camera system, and all-day battery life.',
      quantity: 50,
      imageCover: 'https://placehold.co/600x600?text=iPhone+16+Pro+Max',
      images: [
        'https://placehold.co/600x600?text=iPhone+16+Side',
        'https://placehold.co/600x600?text=iPhone+16+Back',
      ],
      sold: 120,
      price: 42999,
      colors: ['#4B4F58', '#F5F5DC', '#1C1C1E', '#FFFFFF'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Smartphones'],
      brand: brandMap['Apple'],
      ratingsAverage: 4.8,
      ratingsQuantity: 312,
    },
    {
      title: 'Samsung Galaxy S25 Ultra',
      description:
        'Premium Samsung flagship with Snapdragon 8 Elite processor, S-Pen support, 200MP camera, and stunning Dynamic AMOLED display.',
      quantity: 40,
      imageCover: 'https://placehold.co/600x600?text=Galaxy+S25+Ultra',
      images: [
        'https://placehold.co/600x600?text=Galaxy+S25+Front',
        'https://placehold.co/600x600?text=Galaxy+S25+Camera',
      ],
      sold: 85,
      price: 38999,
      colors: ['#1C1C1E', '#C0C0C0', '#4169E1'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Smartphones'],
      brand: brandMap['Samsung'],
      ratingsAverage: 4.6,
      ratingsQuantity: 198,
    },
    {
      title: 'MacBook Pro 16-inch M4 Pro',
      description:
        'Apple MacBook Pro powered by the M4 Pro chip with 18GB unified memory, Liquid Retina XDR display, and up to 22 hours battery.',
      quantity: 25,
      imageCover: 'https://placehold.co/600x600?text=MacBook+Pro+16',
      images: [],
      sold: 64,
      price: 89999,
      colors: ['#1C1C1E', '#C0C0C0'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Laptops'],
      brand: brandMap['Apple'],
      ratingsAverage: 4.9,
      ratingsQuantity: 87,
    },
    {
      title: 'Samsung Galaxy Book4 Ultra',
      description:
        'High-performance laptop with Intel Core Ultra 9 processor, 16-inch AMOLED display, NVIDIA RTX 4070, ideal for creators.',
      quantity: 15,
      imageCover: 'https://placehold.co/600x600?text=Galaxy+Book4+Ultra',
      images: [],
      sold: 22,
      price: 74999,
      priceAfterDiscount: 69999,
      colors: ['#2F4F4F'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Laptops'],
      brand: brandMap['Samsung'],
      ratingsAverage: 4.3,
      ratingsQuantity: 41,
    },
    {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description:
        'Industry-leading noise cancelling headphones with exceptional sound quality, 30-hour battery life, and ultra-comfortable design.',
      quantity: 100,
      imageCover: 'https://placehold.co/600x600?text=Sony+WH1000XM5',
      images: [
        'https://placehold.co/600x600?text=Sony+XM5+Case',
      ],
      sold: 230,
      price: 11999,
      priceAfterDiscount: 9999,
      colors: ['#1C1C1E', '#C0C0C0', '#1E3A5F'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Audio'],
      brand: brandMap['Sony'],
      ratingsAverage: 4.7,
      ratingsQuantity: 540,
    },
    {
      title: 'Apple AirPods Pro 2nd Generation',
      description:
        'Active noise cancellation earbuds with adaptive audio, personalized spatial audio, USB-C charging case, and up to 6 hours listening.',
      quantity: 200,
      imageCover: 'https://placehold.co/600x600?text=AirPods+Pro+2',
      images: [],
      sold: 410,
      price: 8999,
      colors: ['#FFFFFF'],
      category: catMap['Electronics'],
      subCategory: subCatMap['Audio'],
      brand: brandMap['Apple'],
      ratingsAverage: 4.6,
      ratingsQuantity: 892,
    },

    // ── Fashion ──────────────────────────────────────────────────
    {
      title: 'Nike Air Max 270 React',
      description:
        'Lightweight and breathable Nike sneakers combining two of the best Nike technologies for a super-soft, ultra-comfortable ride.',
      quantity: 80,
      imageCover: 'https://placehold.co/600x600?text=Nike+Air+Max+270',
      images: [
        'https://placehold.co/600x600?text=Nike+270+Side',
        'https://placehold.co/600x600?text=Nike+270+Sole',
      ],
      sold: 190,
      price: 5499,
      priceAfterDiscount: 4299,
      colors: ['#1C1C1E', '#FFFFFF', '#FF4500'],
      category: catMap['Fashion'],
      subCategory: subCatMap['Shoes'],
      brand: brandMap['Nike'],
      ratingsAverage: 4.5,
      ratingsQuantity: 320,
    },
    {
      title: 'Adidas Ultraboost Light Running Shoes',
      description:
        'High-performance running shoes with BOOST midsole cushioning, Primeknit+ upper, and Continental rubber outsole for superior grip.',
      quantity: 60,
      imageCover: 'https://placehold.co/600x600?text=Adidas+Ultraboost',
      images: [],
      sold: 145,
      price: 6299,
      colors: ['#1C1C1E', '#FFFFFF', '#4169E1'],
      category: catMap['Fashion'],
      subCategory: subCatMap['Shoes'],
      brand: brandMap['Adidas'],
      ratingsAverage: 4.4,
      ratingsQuantity: 215,
    },
    {
      title: 'Levi\'s 501 Original Fit Jeans',
      description:
        'The iconic straight-fit jean that started it all. Made with premium cotton denim, button fly, and a classic silhouette that never goes out of style.',
      quantity: 150,
      imageCover: 'https://placehold.co/600x600?text=Levis+501+Jeans',
      images: [
        'https://placehold.co/600x600?text=Levis+501+Back',
      ],
      sold: 310,
      price: 2499,
      colors: ['#00008B', '#4682B4', '#1C1C1E'],
      category: catMap['Fashion'],
      subCategory: subCatMap['Men Clothing'],
      brand: brandMap['Levi\'s'],
      ratingsAverage: 4.3,
      ratingsQuantity: 478,
    },
    {
      title: 'Nike Dri-FIT Running T-Shirt',
      description:
        'Lightweight performance t-shirt with moisture-wicking Dri-FIT technology, mesh back panel for ventilation, and relaxed athletic fit.',
      quantity: 200,
      imageCover: 'https://placehold.co/600x600?text=Nike+DRI-FIT+Tshirt',
      images: [],
      sold: 520,
      price: 1199,
      priceAfterDiscount: 899,
      colors: ['#1C1C1E', '#FFFFFF', '#FF6347', '#4682B4'],
      category: catMap['Fashion'],
      subCategory: subCatMap['Men Clothing'],
      brand: brandMap['Nike'],
      ratingsAverage: 4.2,
      ratingsQuantity: 650,
    },
    {
      title: 'Adidas Essentials Hoodie Women',
      description:
        'Cozy fleece-lined hoodie for women with a relaxed fit, kangaroo pocket, and ribbed cuffs. Perfect for layering during cooler weather.',
      quantity: 90,
      imageCover: 'https://placehold.co/600x600?text=Adidas+Essentials+Hoodie',
      images: [],
      sold: 175,
      price: 1899,
      colors: ['#FFC0CB', '#808080', '#1C1C1E', '#FFFFFF'],
      category: catMap['Fashion'],
      subCategory: subCatMap['Women Clothing'],
      brand: brandMap['Adidas'],
      ratingsAverage: 4.4,
      ratingsQuantity: 287,
    },

    // ── Home & Kitchen ───────────────────────────────────────────
    {
      title: 'Philips 3200 Series Espresso Machine',
      description:
        'Fully automatic espresso machine with LatteGo milk system, intuitive touch display, 5 coffee varieties, and ceramic grinders for perfect taste.',
      quantity: 20,
      imageCover: 'https://placehold.co/600x600?text=Philips+Espresso+3200',
      images: [
        'https://placehold.co/600x600?text=Philips+3200+Detail',
      ],
      sold: 38,
      price: 24999,
      priceAfterDiscount: 21999,
      colors: ['#1C1C1E', '#C0C0C0'],
      category: catMap['Home & Kitchen'],
      subCategory: subCatMap['Kitchen Appliances'],
      brand: brandMap['Philips'],
      ratingsAverage: 4.5,
      ratingsQuantity: 73,
    },
    {
      title: 'Philips Air Fryer XXL Premium',
      description:
        'The largest Philips Airfryer with Fat Removal technology, rapid air technology for healthier frying, and digital touchscreen with smart presets.',
      quantity: 35,
      imageCover: 'https://placehold.co/600x600?text=Philips+Air+Fryer+XXL',
      images: [],
      sold: 92,
      price: 9999,
      priceAfterDiscount: 8499,
      colors: ['#1C1C1E'],
      category: catMap['Home & Kitchen'],
      subCategory: subCatMap['Kitchen Appliances'],
      brand: brandMap['Philips'],
      ratingsAverage: 4.6,
      ratingsQuantity: 167,
    },
    {
      title: 'IKEA KALLAX Shelf Unit 4x4',
      description:
        'Versatile shelving unit with 16 cube compartments. Perfect as a room divider, bookcase, or storage solution. Easy to assemble with included hardware.',
      quantity: 45,
      imageCover: 'https://placehold.co/600x600?text=IKEA+KALLAX+4x4',
      images: [
        'https://placehold.co/600x600?text=KALLAX+Detail',
        'https://placehold.co/600x600?text=KALLAX+Room',
      ],
      sold: 210,
      price: 4999,
      colors: ['#FFFFFF', '#8B4513', '#1C1C1E'],
      category: catMap['Home & Kitchen'],
      subCategory: subCatMap['Furniture'],
      brand: brandMap['IKEA'],
      ratingsAverage: 4.1,
      ratingsQuantity: 534,
    },
    {
      title: 'IKEA MALM Bed Frame Queen',
      description:
        'Clean-lined queen bed frame with storage drawers underneath. High headboard provides comfortable support for sitting up and reading in bed.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=IKEA+MALM+Bed',
      images: [],
      sold: 155,
      price: 12999,
      colors: ['#FFFFFF', '#8B4513', '#808080'],
      category: catMap['Home & Kitchen'],
      subCategory: subCatMap['Furniture'],
      brand: brandMap['IKEA'],
      ratingsAverage: 4.0,
      ratingsQuantity: 310,
    },
    {
      title: 'Samsung Smart Refrigerator Family Hub',
      description:
        'WiFi-enabled smart refrigerator with a 21.5-inch touchscreen, internal cameras, meal planning features, and energy-efficient inverter compressor.',
      quantity: 10,
      imageCover: 'https://placehold.co/600x600?text=Samsung+Smart+Fridge',
      images: [],
      sold: 12,
      price: 64999,
      colors: ['#C0C0C0', '#1C1C1E'],
      category: catMap['Home & Kitchen'],
      subCategory: subCatMap['Kitchen Appliances'],
      brand: brandMap['Samsung'],
      ratingsAverage: 4.4,
      ratingsQuantity: 28,
    },

    // ── Sports & Outdoors ────────────────────────────────────────
    {
      title: 'Nike Metcon 9 Training Shoes',
      description:
        'The ultimate training shoe with a wide, flat heel for stability during lifts, flexible forefoot for sprints, and durable rubber outsole.',
      quantity: 55,
      imageCover: 'https://placehold.co/600x600?text=Nike+Metcon+9',
      images: [],
      sold: 88,
      price: 4799,
      colors: ['#1C1C1E', '#FFFFFF', '#32CD32'],
      category: catMap['Sports & Outdoors'],
      subCategory: subCatMap['Fitness Equipment'],
      brand: brandMap['Nike'],
      ratingsAverage: 4.5,
      ratingsQuantity: 195,
    },
    {
      title: 'Adidas Performance Resistance Bands Set',
      description:
        'Complete set of 3 resistance bands with varying resistance levels. Ideal for strength training, stretching, and rehabilitation exercises.',
      quantity: 300,
      imageCover: 'https://placehold.co/600x600?text=Adidas+Resistance+Bands',
      images: [],
      sold: 430,
      price: 999,
      priceAfterDiscount: 799,
      colors: ['#FF4500', '#4169E1', '#1C1C1E'],
      category: catMap['Sports & Outdoors'],
      subCategory: subCatMap['Fitness Equipment'],
      brand: brandMap['Adidas'],
      ratingsAverage: 4.2,
      ratingsQuantity: 710,
    },
    {
      title: 'The North Face Borealis Backpack',
      description:
        'Durable and versatile 28L daypack with a dedicated laptop compartment, FlexVent suspension system, and water-resistant fabric for everyday adventures.',
      quantity: 70,
      imageCover: 'https://placehold.co/600x600?text=TNF+Borealis+Backpack',
      images: [
        'https://placehold.co/600x600?text=Borealis+Interior',
      ],
      sold: 265,
      price: 3499,
      colors: ['#1C1C1E', '#006400', '#4682B4'],
      category: catMap['Sports & Outdoors'],
      subCategory: subCatMap['Outdoor Gear'],
      brand: brandMap['The North Face'],
      ratingsAverage: 4.6,
      ratingsQuantity: 420,
    },
    {
      title: 'The North Face Thermoball Eco Jacket',
      description:
        'Lightweight, packable synthetic insulation jacket made from recycled materials. Provides warmth even when wet, perfect for hiking and travel.',
      quantity: 40,
      imageCover: 'https://placehold.co/600x600?text=TNF+Thermoball+Jacket',
      images: [],
      sold: 78,
      price: 7499,
      priceAfterDiscount: 5999,
      colors: ['#1C1C1E', '#006400', '#8B0000'],
      category: catMap['Sports & Outdoors'],
      subCategory: subCatMap['Outdoor Gear'],
      brand: brandMap['The North Face'],
      ratingsAverage: 4.5,
      ratingsQuantity: 132,
    },

    // ── Books ────────────────────────────────────────────────────
    {
      title: 'Clean Code by Robert C. Martin',
      description:
        'A handbook of agile software craftsmanship. Learn to write clean, maintainable code through practical examples and expert guidance from Uncle Bob.',
      quantity: 500,
      imageCover: 'https://placehold.co/600x600?text=Clean+Code+Book',
      images: [],
      sold: 890,
      price: 1299,
      colors: [],
      category: catMap['Books'],
      brand: brandMap['Penguin Books'],
      ratingsAverage: 4.7,
      ratingsQuantity: 1240,
    },
    {
      title: 'The Pragmatic Programmer',
      description:
        'Your journey to mastery. A timeless classic covering topics from personal responsibility to architectural techniques for keeping code flexible.',
      quantity: 400,
      imageCover: 'https://placehold.co/600x600?text=Pragmatic+Programmer',
      images: [],
      sold: 720,
      price: 1499,
      colors: [],
      category: catMap['Books'],
      brand: brandMap['Penguin Books'],
      ratingsAverage: 4.8,
      ratingsQuantity: 980,
    },
    {
      title: 'Atomic Habits by James Clear',
      description:
        'An easy and proven way to build good habits and break bad ones. Discover the system that helps you get 1% better every day with compound growth.',
      quantity: 600,
      imageCover: 'https://placehold.co/600x600?text=Atomic+Habits',
      images: [],
      sold: 1500,
      price: 899,
      priceAfterDiscount: 699,
      colors: [],
      category: catMap['Books'],
      brand: brandMap['Penguin Books'],
      ratingsAverage: 4.9,
      ratingsQuantity: 2100,
    },

    // ── Health & Beauty ──────────────────────────────────────────
    {
      title: 'Philips Sonicare DiamondClean Toothbrush',
      description:
        'Premium sonic electric toothbrush with 5 brushing modes, smart pressure sensor, elegant charging glass, and USB travel case for on-the-go use.',
      quantity: 75,
      imageCover: 'https://placehold.co/600x600?text=Sonicare+DiamondClean',
      images: [],
      sold: 160,
      price: 5999,
      priceAfterDiscount: 4999,
      colors: ['#FFFFFF', '#FFC0CB', '#1C1C1E'],
      category: catMap['Health & Beauty'],
      brand: brandMap['Philips'],
      ratingsAverage: 4.4,
      ratingsQuantity: 345,
    },
    {
      title: 'Philips Lumea IPL Hair Removal Device',
      description:
        'At-home IPL hair removal system with SmartSkin sensor, over 450,000 flashes, and 4 attachments for body, face, bikini, and underarms.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=Philips+Lumea+IPL',
      images: [
        'https://placehold.co/600x600?text=Lumea+Attachments',
      ],
      sold: 55,
      price: 14999,
      priceAfterDiscount: 12499,
      colors: ['#FFFFFF', '#FFD700'],
      category: catMap['Health & Beauty'],
      brand: brandMap['Philips'],
      ratingsAverage: 4.3,
      ratingsQuantity: 112,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Main Seeder Logic                                                 */
/* ------------------------------------------------------------------ */

async function seed() {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error('❌  MONGODB_URL is not defined in .env');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB …');
  await mongoose.connect(mongoUrl);
  console.log('✅  Connected!\n');

  // ── 1. Drop existing data ──────────────────────────────────────
  console.log('🗑️   Dropping existing collections …');
  await ProductModel.deleteMany({});
  await SubCategoryModel.deleteMany({});
  await CategoryModel.deleteMany({});
  await BrandModel.deleteMany({});
  console.log('    Done.\n');

  // ── 2. Seed Categories ─────────────────────────────────────────
  console.log('📂  Seeding categories …');
  const categories = await CategoryModel.insertMany(categoriesData);
  const catMap: Record<string, Types.ObjectId> = {};
  for (const cat of categories) {
    catMap[cat.name] = cat._id as Types.ObjectId;
  }
  console.log(`    Inserted ${categories.length} categories.\n`);

  // ── 3. Seed Sub-Categories ─────────────────────────────────────
  console.log('📁  Seeding sub-categories …');
  const subCatsToInsert = subCategoriesData.map((sc) => ({
    name: sc.name,
    category: catMap[sc.categoryName],
  }));
  const subCategories = await SubCategoryModel.insertMany(subCatsToInsert);
  const subCatMap: Record<string, Types.ObjectId> = {};
  for (const sc of subCategories) {
    subCatMap[sc.name] = sc._id as Types.ObjectId;
  }
  console.log(`    Inserted ${subCategories.length} sub-categories.\n`);

  // ── 4. Seed Brands ─────────────────────────────────────────────
  console.log('🏷️   Seeding brands …');
  const brands = await BrandModel.insertMany(brandsData);
  const brandMap: Record<string, Types.ObjectId> = {};
  for (const brand of brands) {
    brandMap[brand.name] = brand._id as Types.ObjectId;
  }
  console.log(`    Inserted ${brands.length} brands.\n`);

  // ── 5. Seed Products ───────────────────────────────────────────
  console.log('📦  Seeding products …');
  const productsData = buildProducts(catMap, subCatMap, brandMap);
  const products = await ProductModel.insertMany(productsData);
  console.log(`    Inserted ${products.length} products.\n`);

  // ── Summary ────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════');
  console.log('  🌱  Seeding complete!');
  console.log(`  • Categories:      ${categories.length}`);
  console.log(`  • Sub-Categories:  ${subCategories.length}`);
  console.log(`  • Brands:          ${brands.length}`);
  console.log(`  • Products:        ${products.length}`);
  console.log('═══════════════════════════════════════════');

  await mongoose.disconnect();
  console.log('\n🔌  Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('❌  Seeder failed:', err);
  process.exit(1);
});
