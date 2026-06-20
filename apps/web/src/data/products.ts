export const data = [
  {
    id: 1,
    name: "Product 1",
    description: "Product 1 description",
    basePrice: 344,
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Product 2",
    description: "Product 2 description",
    basePrice: 34,
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Product 3",
    description: "Product 3 description",
    basePrice: 22,
    image:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=300&h=200&fit=crop",
  },
];

export const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const categoryNav = [
  "Keyboards",
  "Keycaps",
  "Switches",
  "Accessories",
];

export const categories = [
  { id: "office", label: "Office", description: "Productivity keyboards for work" },
  { id: "gaming", label: "Gaming", description: "High-performance gaming boards" },
  { id: "keycaps", label: "Keycaps", description: "Custom keycap sets" },
  { id: "switches", label: "Switches", description: "Mechanical switches" },
  { id: "accessories", label: "Accessories", description: "Cables, tools & more" },
];

export const featuredProducts = [
  {
    id: "1",
    category: "Keyboards",
    imageGradient: "from-teal-400 to-cyan-500",
    badge: "Best Seller",
    name: "Keychron Q5 Pro",
    description: "Premium 96% wireless mechanical keyboard with full aluminum body.",
    layout: "96%",
    switchType: "Hot-swappable",
    actuation: "3.5mm",
    price: 8999,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    category: "Gaming Keyboards",
    imageGradient: "from-blue-500 to-indigo-600",
    badge: "New",
    name: "Wooting 60HE+",
    description: "Fastest gaming keyboard with Lekker magnetic switches and rapid trigger.",
    layout: "60%",
    switchType: "Hall Effect",
    actuation: "0.1mm",
    price: 8999,
    rating: 4.9,
    reviewCount: 256,
  },
  {
    id: "3",
    category: "Keycaps",
    imageGradient: "from-purple-500 to-pink-500",
    name: "MT3 Susuwatari Keycaps",
    description: "High-profile PBT keycap set with a distinctive scooped profile.",
    layout: "ANSI",
    switchType: "Cherry MX",
    actuation: "N/A",
    price: 3499,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "4",
    category: "Switches",
    imageGradient: "from-amber-400 to-orange-500",
    badge: "Sale",
    name: "Gateron Milky Yellow",
    description: "Smooth linear switches with a deep creamy sound signature.",
    layout: "3-pin",
    switchType: "Linear",
    actuation: "50g",
    price: 899,
    rating: 4.6,
    reviewCount: 312,
  },
];

export const features = [
  { title: "Hot-Swappable", description: "Swap switches without soldering — customize your feel in seconds." },
  { title: "QMK/VIA Support", description: "Fully programmable with QMK and VIA firmware for endless customization." },
  { title: "Premium Build", description: "CNC aluminum cases, PBT keycaps, and gasket mount for a premium typing experience." },
];

export const stats = [
  { label: "Keyboards Sold", value: "12,000+" },
  { label: "Happy Customers", value: "8,500+" },
  { label: "Switch Variants", value: "150+" },
  { label: "Countries Shipped", value: "40+" },
];

export const testimonials = [
  { author: "Ahmed M.", quote: "The build quality is incredible. My first custom keyboard and I'm hooked!", role: "Enthusiast", rating: 5 },
  { author: "Sara K.", quote: "Fast shipping and amazing customer support. Will definitely buy again.", role: "Developer", rating: 5 },
  { author: "Omar H.", quote: "Best typing experience I've ever had. The Keychron Q1 is a game changer.", role: "Writer", rating: 4 },
];

export const faqs = [
  { question: "What is a hot-swappable keyboard?", answer: "A hot-swappable keyboard lets you change switches without soldering — just pull out the old ones and push in new ones." },
  { question: "How long does shipping take?", answer: "Domestic orders arrive in 3-5 business days. International shipping takes 7-14 business days." },
  { question: "Do you offer international shipping?", answer: "Yes, we ship to over 40 countries worldwide with tracking included." },
];
