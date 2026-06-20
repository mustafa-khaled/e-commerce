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
    slug: { type: String, required: true, unique: true },
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
    isActive: { type: Boolean, default: true },
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
  { name: 'Office' },
  { name: 'Keyboards' },
  { name: 'Gaming Keyboards' },
  { name: 'Keycaps' },
  { name: 'Switches' },
  { name: 'Accessories' },
];

const subCategoriesData = [
  // Office sub-categories
  { name: 'Wireless Keyboards', categoryName: 'Office' },
  { name: 'Mechanical Keyboards', categoryName: 'Office' },
  { name: 'Ergonomic Keyboards', categoryName: 'Office' },
  // Keyboards (General) sub-categories
  { name: 'Full Size', categoryName: 'Keyboards' },
  { name: 'Tenkeyless (TKL)', categoryName: 'Keyboards' },
  { name: 'Compact (60%/65%)', categoryName: 'Keyboards' },
  // Gaming Keyboards sub-categories
  { name: 'RGB Gaming', categoryName: 'Gaming Keyboards' },
  { name: 'Optical Switches', categoryName: 'Gaming Keyboards' },
  // Keycaps sub-categories
  { name: 'PBT Keycaps', categoryName: 'Keycaps' },
  { name: 'ABS Keycaps', categoryName: 'Keycaps' },
];

const brandsData = [
  { name: 'Keychron' },
  { name: 'Logitech' },
  { name: 'Razer' },
  { name: 'Ducky' },
  { name: 'Corsair' },
  { name: 'Drop' },
  { name: 'Akko' },
  { name: 'Wooting' },
  { name: 'Glorious' },
  { name: 'Filco' },
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function withSlug(products: Record<string, unknown>[]) {
  return products.map((p) => ({
    ...p,
    slug: slugify(p.title as string),
    sku: slugify(p.title as string).toUpperCase().slice(0, 20),
    isActive: true,
    trackInventory: true,
    baseCurrency: 'EGP',
    translations: {
      ar: { title: p.title, description: p.description },
      en: { title: p.title, description: p.description },
    },
  }));
}

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
    // ── Office Keyboards ─────────────────────────────────────────
    {
      title: 'Keychron Q5 Pro QMK/VIA Wireless Custom Keyboard',
      description:
        'Premium 96% layout wireless mechanical keyboard with full aluminum body, hot-swappable switches, QMK/VIA support, and Bluetooth 5.1.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=Keychron+Q5+Pro',
      images: ['https://placehold.co/600x600?text=Keychron+Q5+Side'],
      sold: 45,
      price: 8999,
      colors: ['#1C1C1E', '#C0C0C0'],
      category: catMap['Office'],
      subCategory: subCatMap['Wireless Keyboards'],
      brand: brandMap['Keychron'],
    },
    {
      title: 'Logitech MX Mechanical Wireless Keyboard',
      description:
        'Full-size wireless mechanical keyboard with Logitech Flow, dual-mode Bluetooth/2.4GHz, backlighting, and tactile switches for productivity.',
      quantity: 50,
      imageCover: 'https://placehold.co/600x600?text=Logitech+MX+Mechanical',
      images: [],
      sold: 120,
      price: 5499,
      priceAfterDiscount: 4999,
      colors: ['#1C1C1E', '#C0C0C0'],
      category: catMap['Office'],
      subCategory: subCatMap['Mechanical Keyboards'],
      brand: brandMap['Logitech'],
    },
    {
      title: 'Filco Majestouch 2 Convertible 2',
      description:
        'Japanese-crafted tenkeyless mechanical keyboard with Cherry MX switches, dual Bluetooth/USB, and legendary build quality for serious typists.',
      quantity: 20,
      imageCover: 'https://placehold.co/600x600?text=Filco+Majestouch+2',
      images: [],
      sold: 35,
      price: 7499,
      colors: ['#1C1C1E', '#FFFFFF'],
      category: catMap['Office'],
      subCategory: subCatMap['Ergonomic Keyboards'],
      brand: brandMap['Filco'],
    },
    {
      title: 'Logitech Ergo K860 Wireless Split Keyboard',
      description:
        'Ergonomically designed split keyboard with curved keyframe, premium palm rest, and adjustable tilt legs for reduced wrist strain.',
      quantity: 25,
      imageCover: 'https://placehold.co/600x600?text=Logitech+Ergo+K860',
      images: ['https://placehold.co/600x600?text=Ergo+K860+Angle'],
      sold: 68,
      price: 4599,
      colors: ['#1C1C1E'],
      category: catMap['Office'],
      subCategory: subCatMap['Ergonomic Keyboards'],
      brand: brandMap['Logitech'],
    },

    // ── Keyboards (General) ──────────────────────────────────────
    {
      title: 'Ducky One 3 Mini V2 60% Mechanical Keyboard',
      description:
        'Award-winning 60% mechanical keyboard with dual-layer foam dampening, Cherry MX switches, and PBT double-shot keycaps in a compact form.',
      quantity: 40,
      imageCover: 'https://placehold.co/600x600?text=Ducky+One+3+Mini',
      images: [],
      sold: 95,
      price: 4299,
      colors: ['#FFFFFF', '#1C1C1E', '#4682B4'],
      category: catMap['Keyboards'],
      subCategory: subCatMap['Compact (60%/65%)'],
      brand: brandMap['Ducky'],
    },
    {
      title: 'Keychron V1 QMK Custom Mechanical Keyboard',
      description:
        '75% layout custom mechanical keyboard with rotary encoder, hot-swappable sockets, south-facing RGB, and QMK/VIA programmability.',
      quantity: 35,
      imageCover: 'https://placehold.co/600x600?text=Keychron+V1',
      images: ['https://placehold.co/600x600?text=Keychron+V1+RGB'],
      sold: 78,
      price: 3599,
      priceAfterDiscount: 3299,
      colors: ['#1C1C1E', '#4169E1'],
      category: catMap['Keyboards'],
      subCategory: subCatMap['Tenkeyless (TKL)'],
      brand: brandMap['Keychron'],
    },
    {
      title: 'Drop CTRL Mechanical Keyboard TKL',
      description:
        'Premium tenkeyless mechanical keyboard with an aluminum frame, per-key RGB, hot-swap switches, and USB-C connectivity.',
      quantity: 25,
      imageCover: 'https://placehold.co/600x600?text=Drop+CTRL+TKL',
      images: [],
      sold: 52,
      price: 6999,
      colors: ['#C0C0C0', '#1C1C1E'],
      category: catMap['Keyboards'],
      subCategory: subCatMap['Full Size'],
      brand: brandMap['Drop'],
    },
    {
      title: 'Akko 3068B Plus 65% Wireless Keyboard',
      description:
        'Affordable 65% wireless mechanical keyboard with Akko CS switches, PBT keycaps, Bluetooth 5.0, and a sleek compact design.',
      quantity: 60,
      imageCover: 'https://placehold.co/600x600?text=Akko+3068B+Plus',
      images: [],
      sold: 150,
      price: 2199,
      priceAfterDiscount: 1899,
      colors: ['#FFFFFF', '#FFC0CB', '#4169E1'],
      category: catMap['Keyboards'],
      subCategory: subCatMap['Compact (60%/65%)'],
      brand: brandMap['Akko'],
    },

    // ── Gaming Keyboards ─────────────────────────────────────────
    {
      title: 'Wooting 60HE+ Hall Effect Gaming Keyboard',
      description:
        'The fastest gaming keyboard on the market with Lekker magnetic switches, 0.1mm actuation, rapid trigger, and per-key RGB.',
      quantity: 20,
      imageCover: 'https://placehold.co/600x600?text=Wooting+60HE+Plus',
      images: ['https://placehold.co/600x600?text=Wooting+60HE+RGB'],
      sold: 200,
      price: 8999,
      colors: ['#1C1C1E', '#FFFFFF'],
      category: catMap['Gaming Keyboards'],
      subCategory: subCatMap['RGB Gaming'],
      brand: brandMap['Wooting'],
    },
    {
      title: 'Razer Huntsman V3 Pro TKL Analog Keyboard',
      description:
        'Tournament-ready TKL keyboard with Razer analog optical switches, adjustable actuation, rapid trigger mode, and doubleshot PBT keycaps.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=Razer+Huntsman+V3',
      images: [],
      sold: 88,
      price: 7499,
      colors: ['#1C1C1E', '#32CD32'],
      category: catMap['Gaming Keyboards'],
      subCategory: subCatMap['Optical Switches'],
      brand: brandMap['Razer'],
    },
    {
      title: 'Corsair K70 RGB Pro Mini Wireless 60%',
      description:
        'Compact 60% gaming keyboard with hyper-fast 8000Hz polling, Corsair OPX optical switches, and SLIPSTREAM wireless technology.',
      quantity: 35,
      imageCover: 'https://placehold.co/600x600?text=Corsair+K70+Pro+Mini',
      images: ['https://placehold.co/600x600?text=K70+Pro+Mini+RGB'],
      sold: 65,
      price: 6499,
      colors: ['#1C1C1E', '#C0C0C0'],
      category: catMap['Gaming Keyboards'],
      subCategory: subCatMap['RGB Gaming'],
      brand: brandMap['Corsair'],
    },
    {
      title: 'Ducky One 3 SF RGB Gaming Keyboard',
      description:
        '65% gaming keyboard with Cherry MX RGB switches, dual-layer foam, PBT keycaps, and per-key RGB backlighting.',
      quantity: 45,
      imageCover: 'https://placehold.co/600x600?text=Ducky+One+3+SF',
      images: [],
      sold: 110,
      price: 4999,
      colors: ['#1C1C1E', '#FFFFFF'],
      category: catMap['Gaming Keyboards'],
      subCategory: subCatMap['RGB Gaming'],
      brand: brandMap['Ducky'],
    },

    // ── Keycaps ──────────────────────────────────────────────────
    {
      title: 'Drop + Matt3o MT3 Susuwatari Keycap Set',
      description:
        'High-profile MT3 sculpted keycap set in PBT with dye-sub legends. Retro-inspired design with a distinctive scooped profile for comfortable typing.',
      quantity: 15,
      imageCover: 'https://placehold.co/600x600?text=MT3+Susuwatari',
      images: ['https://placehold.co/600x600?text=MT3+Susuwatari+Detail'],
      sold: 42,
      price: 3499,
      colors: ['#1C1C1E', '#C0C0C0', '#FFFFFF'],
      category: catMap['Keycaps'],
      subCategory: subCatMap['PBT Keycaps'],
      brand: brandMap['Drop'],
    },
    {
      title: 'Akko ASA Profile PBT Keycaps Set',
      description:
        'Vibrant ASA profile PBT keycap set with dye-sub legends. Comes in multiple colorways including Neon, Salty, and Matcha.',
      quantity: 40,
      imageCover: 'https://placehold.co/600x600?text=Akko+ASA+Keycaps',
      images: [],
      sold: 180,
      price: 1499,
      colors: ['#32CD32', '#FF69B4', '#00CED1'],
      category: catMap['Keycaps'],
      subCategory: subCatMap['PBT Keycaps'],
      brand: brandMap['Akko'],
    },
    {
      title: 'Glorious GPBT Gradient Keycap Set',
      description:
        'Premium PBT keycap set with gradient fade design, thick 1.5mm walls, and shine-through legends for RGB backlighting.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=GPBT+Gradient',
      images: [],
      sold: 75,
      price: 1799,
      colors: ['#FF4500', '#4169E1', '#9370DB'],
      category: catMap['Keycaps'],
      subCategory: subCatMap['ABS Keycaps'],
      brand: brandMap['Glorious'],
    },
    {
      title: 'Ducky Joker PBT Double-Shot Keycaps',
      description:
        'Cherry profile PBT double-shot keycap set with playful joker-themed colorway. Compatible with standard ANSI and ISO layouts.',
      quantity: 25,
      imageCover: 'https://placehold.co/600x600?text=Ducky+Joker+Keycaps',
      images: [],
      sold: 55,
      price: 2599,
      colors: ['#800080', '#32CD32', '#FFFFFF'],
      category: catMap['Keycaps'],
      subCategory: subCatMap['PBT Keycaps'],
      brand: brandMap['Ducky'],
    },

    // ── Switches ─────────────────────────────────────────────────
    {
      title: 'Gateron Milky Yellow Switches (Pack of 35)',
      description:
        'Smooth linear switches with a milky bottom housing for a deeper sound signature. 50g actuation force, perfect for both gaming and typing.',
      quantity: 100,
      imageCover: 'https://placehold.co/600x600?text=Gateron+Milky+Yellow',
      images: ['https://placehold.co/600x600?text=Gateron+Switches+Detail'],
      sold: 320,
      price: 899,
      colors: [],
      category: catMap['Switches'],
      brand: brandMap['Keychron'],
    },
    {
      title: 'Cherry MX Red RGB Switches (Pack of 35)',
      description:
        'The original linear switch from Cherry. Smooth keystroke with 45g actuation, transparent housing for RGB, and legendary German reliability.',
      quantity: 80,
      imageCover: 'https://placehold.co/600x600?text=Cherry+MX+Red',
      images: [],
      sold: 210,
      price: 1199,
      colors: [],
      category: catMap['Switches'],
      brand: brandMap['Ducky'],
    },
    {
      title: 'Akko CS Matcha Latte V3 Switches (Pack of 45)',
      description:
        'Pre-lubed linear switches with a POM stem, 55g actuation, and a deep creamy sound. Excellent budget switch for custom builds.',
      quantity: 120,
      imageCover: 'https://placehold.co/600x600?text=Akko+Matcha+Latte',
      images: [],
      sold: 450,
      price: 699,
      priceAfterDiscount: 599,
      colors: [],
      category: catMap['Switches'],
      brand: brandMap['Akko'],
    },
    {
      title: 'Glorious Lynx Linear Switches (Pack of 35)',
      description:
        'Smooth factory-lubed linear switches with a short 3.6mm travel distance, 50g actuation, and a unique lynx-purple stem.',
      quantity: 60,
      imageCover: 'https://placehold.co/600x600?text=Glorious+Lynx',
      images: [],
      sold: 140,
      price: 999,
      colors: [],
      category: catMap['Switches'],
      brand: brandMap['Glorious'],
    },

    // ── Accessories ──────────────────────────────────────────────
    {
      title: 'Glorious GMMK Pro Custom Mechanical Keyboard',
      description:
        'Premium 75% custom keyboard kit with a CNC aluminum body, rotary encoder, gasket mount, and hot-swap PCB. Fully customizable.',
      quantity: 10,
      imageCover: 'https://placehold.co/600x600?text=Glorious+GMMK+Pro',
      images: ['https://placehold.co/600x600?text=GMMK+Pro+Build'],
      sold: 35,
      price: 7499,
      colors: ['#1C1C1E', '#C0C0C0', '#FFFFFF'],
      category: catMap['Accessories'],
      brand: brandMap['Glorious'],
    },
    {
      title: 'Keychron Wooden Palm Rest 60%',
      description:
        'Natural walnut wooden palm rest for 60% keyboards. Ergonomic angle with a smooth matte finish to complement your desk setup.',
      quantity: 50,
      imageCover: 'https://placehold.co/600x600?text=Keychron+Palm+Rest',
      images: [],
      sold: 88,
      price: 1299,
      colors: ['#8B4513'],
      category: catMap['Accessories'],
      brand: brandMap['Keychron'],
    },
    {
      title: 'Razer Strider Quartz Mousepad XXL',
      description:
        'Large desk-size hybrid mousepad with dual-textured surfaces for speed or control. Water-resistant coating and stitched edges for durability.',
      quantity: 45,
      imageCover: 'https://placehold.co/600x600?text=Razer+Strider+Quartz',
      images: [],
      sold: 65,
      price: 2499,
      colors: ['#FFC0CB'],
      category: catMap['Accessories'],
      brand: brandMap['Razer'],
    },
    {
      title: 'Logitech G733 Lightspeed Wireless Headset',
      description:
        'Lightweight wireless gaming headset with DTS Headphone:X 2.0 surround sound, Blue VO!CE mic technology, and 29-hour battery life.',
      quantity: 30,
      imageCover: 'https://placehold.co/600x600?text=Logitech+G733',
      images: ['https://placehold.co/600x600?text=G733+RGB'],
      sold: 92,
      price: 4999,
      priceAfterDiscount: 4499,
      colors: ['#FFFFFF', '#1C1C1E', '#9370DB'],
      category: catMap['Accessories'],
      brand: brandMap['Logitech'],
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
  await mongoose.connection.collection('reviews').deleteMany({});
  await SubCategoryModel.deleteMany({});
  await CategoryModel.deleteMany({});
  await BrandModel.deleteMany({});
  console.log('    Done.\n');

  // ── 2. Seed Categories ─────────────────────────────────────────
  console.log('📂  Seeding categories …');
  const categories = await CategoryModel.insertMany(categoriesData);
  const catMap: Record<string, Types.ObjectId> = {};
  for (const cat of categories) {
    catMap[cat.name] = cat._id;
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
    subCatMap[sc.name] = sc._id;
  }
  console.log(`    Inserted ${subCategories.length} sub-categories.\n`);

  // ── 4. Seed Brands ─────────────────────────────────────────────
  console.log('🏷️   Seeding brands …');
  const brands = await BrandModel.insertMany(brandsData);
  const brandMap: Record<string, Types.ObjectId> = {};
  for (const brand of brands) {
    brandMap[brand.name] = brand._id;
  }
  console.log(`    Inserted ${brands.length} brands.\n`);

  // ── 5. Seed Products ───────────────────────────────────────────
  console.log('📦  Seeding products …');
  const productsData = withSlug(buildProducts(catMap, subCatMap, brandMap));
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
