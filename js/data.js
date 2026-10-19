/**
 * D-TEL Cellular & Accessories Hub - Initial Data Seed & Storage Engine
 * ICT2142 E-Business Systems Project
 * Featuring 100% Genuine Original Brands & Verified Budget / Standard Grade Catalog
 * Realistic Sri Lankan Market Prices (LKR)
 */

const BRAND_META = {
  "Apple": { name: "Apple", logo: "images/logo_apple.svg", icon: "fab fa-apple", color: "#ffffff", bg: "rgba(255,255,255,0.15)" },
  "apple": { name: "Apple", logo: "images/logo_apple.svg", icon: "fab fa-apple", color: "#ffffff", bg: "rgba(255,255,255,0.15)" },
  "Samsung": { name: "Samsung", logo: "images/logo_samsung.svg", icon: "fas fa-mobile-alt", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
  "samsung": { name: "Samsung", logo: "images/logo_samsung.svg", icon: "fas fa-mobile-alt", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
  "Xiaomi": { name: "Xiaomi", logo: "images/logo_xiaomi.svg", icon: "fas fa-bolt", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  "xiaomi": { name: "Xiaomi", logo: "images/logo_xiaomi.svg", icon: "fas fa-bolt", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  "Google": { name: "Google", logo: "images/logo_google.svg", icon: "fab fa-google", color: "#34a853", bg: "rgba(52,168,83,0.15)" },
  "google": { name: "Google", logo: "images/logo_google.svg", icon: "fab fa-google", color: "#34a853", bg: "rgba(52,168,83,0.15)" },
  "Anker": { name: "Anker", logo: "images/logo_anker.svg", icon: "fas fa-bolt", color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  "anker": { name: "Anker", logo: "images/logo_anker.svg", icon: "fas fa-bolt", color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  "Baseus": { name: "Baseus", logo: "images/logo_baseus.svg", icon: "fas fa-charging-station", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
  "baseus": { name: "Baseus", logo: "images/logo_baseus.svg", icon: "fas fa-charging-station", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
  "ESR": { name: "ESR", icon: "fas fa-shield-alt", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  "esr": { name: "ESR", icon: "fas fa-shield-alt", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  "JBL": { name: "JBL", icon: "fas fa-volume-up", color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
  "jbl": { name: "JBL", icon: "fas fa-volume-up", color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
  "Spigen": { name: "Spigen", icon: "fas fa-shield-virus", color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
  "spigen": { name: "Spigen", icon: "fas fa-shield-virus", color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
  "Sony": { name: "Sony", icon: "fas fa-headphones-alt", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "sony": { name: "Sony", icon: "fas fa-headphones-alt", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "Generic": { name: "Budget / Generic", icon: "fas fa-tags", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  "generic": { name: "Budget / Generic", icon: "fas fa-tags", color: "#10b981", bg: "rgba(16,185,129,0.15)" }
};

function normalizeBrand(brand) {
  if (!brand) return "Generic";
  const str = String(brand).trim();
  const lower = str.toLowerCase();
  const brandCanonicalMap = {
    'apple': 'Apple',
    'samsung': 'Samsung',
    'xiaomi': 'Xiaomi',
    'google': 'Google',
    'anker': 'Anker',
    'baseus': 'Baseus',
    'esr': 'ESR',
    'jbl': 'JBL',
    'spigen': 'Spigen',
    'sony': 'Sony',
    'generic': 'Generic',
    'budget': 'Generic'
  };
  if (brandCanonicalMap[lower]) return brandCanonicalMap[lower];
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getBrandMeta(brand) {
  const norm = normalizeBrand(brand);
  return BRAND_META[norm] || BRAND_META[String(brand).trim().toLowerCase()] || { name: norm, icon: "fas fa-tag", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" };
}

const CATEGORY_BRANDS = {
  "Smartphones": ["Apple", "Samsung", "Xiaomi", "Google"],
  "Chargers": ["Apple", "Samsung", "Xiaomi", "Anker", "Baseus", "Generic"],
  "Audio": ["Apple", "Samsung", "Sony", "JBL", "Anker", "Generic"],
  "Power": ["Baseus", "Anker", "Xiaomi", "Generic"],
  "Covers": ["Apple", "Samsung", "ESR", "Spigen", "Baseus", "Generic"],
  "Accessories": ["Apple", "Samsung", "Anker", "Baseus", "ESR", "Spigen", "Generic"]
};

const GLASS_TIERS = [
  { id: "Super D", name: "Super D (Best Quality / 9H Curved Privacy)", badge: "👑 Super D 9H", desc: "Top Curved Privacy & High Impact 9H Glass", rank: 1 },
  { id: "HD+", name: "HD+ (High Quality / Ultra-Clear)", badge: "⭐ HD+ Clear", desc: "Ultra-Clear High Definition 9H Glass", rank: 2 },
  { id: "MTB", name: "MTB (Budget / Matte Anti-Glare)", badge: "🛡️ MTB Standard", desc: "Anti-Fingerprint Matte Budget Glass", rank: 3 }
];

const CATEGORY_DETAILS = {
  "All": {
    name: "All Mobile & Tech Collection",
    badge: "Full Store Catalog",
    icon: "fas fa-th-large",
    tagline: "Explore Sri Lanka's leading catalog of genuine smartphones, fast chargers, tempered glass, audio gear, power banks, and budget accessories.",
    highlight: "100% Genuine Original & Budget-Friendly Range • Islandwide Express Delivery • Official Warranty Supported",
    stats: { items: "45+ Products", warranty: "Up to 1 Year", delivery: "1-2 Days Express", rating: "4.9 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(59, 130, 246, 0.15))",
    border: "rgba(6, 182, 212, 0.35)"
  },
  "Smartphones": {
    name: "Flagship & Budget Smartphones",
    badge: "Official & Budget Series",
    icon: "fas fa-mobile-alt",
    tagline: "Latest Apple iPhone, Samsung Galaxy, Google Pixel, and Xiaomi Redmi phones with authentic Sri Lankan market prices.",
    highlight: "TRCSL Approved • Official Warranty • 0% Credit Card Installments Available",
    stats: { items: "8 Models (Original & Budget)", warranty: "1 Year Official", delivery: "Same-Day Colombo/Matara", rating: "4.9 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.20), rgba(99, 102, 241, 0.18))",
    border: "rgba(56, 189, 248, 0.35)"
  },
  "Chargers": {
    name: "Fast GaN Chargers & Economical Cables",
    badge: "Original & Budget 20W - 65W",
    icon: "fas fa-bolt",
    tagline: "Genuine Apple, Samsung, Anker, and Baseus GaN fast adapters alongside low-cost replacement chargers & cables.",
    highlight: "ActiveShield Safety • Super Fast Charge 2.0 • Low-Cost Replacement Options",
    stats: { items: "12 Chargers & Cables", warranty: "1-12 Months", delivery: "Islandwide Dispatch", rating: "4.8 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.20), rgba(239, 68, 68, 0.18))",
    border: "rgba(245, 158, 11, 0.35)"
  },
  "Covers": {
    name: "Screen Protectors & Protective Armor Cases",
    badge: "Super D / HD+ / Budget MTB",
    icon: "fas fa-shield-alt",
    tagline: "Ranked 9H tempered glass tiers (Super D Privacy, HD+ Clear, MTB Budget) & Spigen, ESR armor & clear gel cases.",
    highlight: "Military Drop Defense • 28° Spy Privacy Filter • Budget Soft Silicone Cases",
    stats: { items: "8 Armor & Glass Items", warranty: "Guaranteed Fit", delivery: "Fast Islandwide", rating: "4.9 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.20), rgba(168, 85, 247, 0.18))",
    border: "rgba(244, 63, 94, 0.35)"
  },
  "Audio": {
    name: "Wireless Earbuds, Headphones & Speakers",
    badge: "Original ANC & Budget TWS",
    icon: "fas fa-headphones",
    tagline: "Original Apple AirPods Pro, Sony ANC headphones, JBL speakers alongside low-cost TWS wireless earbuds.",
    highlight: "High-Resolution Audio • Active Noise Cancelling • Budget Wireless Earbuds",
    stats: { items: "9 Audio Devices", warranty: "Up to 1 Year", delivery: "Safe Doorstep Delivery", rating: "4.9 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.20), rgba(236, 72, 153, 0.18))",
    border: "rgba(168, 85, 247, 0.35)"
  },
  "Power": {
    name: "High-Capacity & Budget Power Banks",
    badge: "10000 - 24000mAh",
    icon: "fas fa-battery-full",
    tagline: "Ultra-fast portable battery packs with digital LED displays, 22.5W - 140W PD charging & affordable pocket chargers.",
    highlight: "Smart Digital Power Display • Dual Fast Charge • Pocket-Friendly Prices",
    stats: { items: "8 Power Bank Models", warranty: "6-12 Months", delivery: "Islandwide Delivery", rating: "4.8 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.20), rgba(6, 182, 212, 0.18))",
    border: "rgba(16, 185, 129, 0.35)"
  },
  "Accessories": {
    name: "Essential Tech, Car Mounts & Smart Hubs",
    badge: "Premium & Budget Essentials",
    icon: "fas fa-plug",
    tagline: "MagSafe magnetic car phone mounts, 7-in-1 multi-port hubs, Apple AirTags, ring holders & camera lens armor.",
    highlight: "Premium Aluminum Alloy • Low-Cost Phone Mounts • Camera Lens Protectors",
    stats: { items: "8 Everyday Essentials", warranty: "3-12 Months", delivery: "Islandwide Delivery", rating: "4.9 ★ Rating" },
    gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.20), rgba(16, 185, 129, 0.18))",
    border: "rgba(234, 179, 8, 0.35)"
  }
};

const INITIAL_PRODUCTS = [
  // =========================================================================
  // 1. SMARTPHONES (8 Products: Flagships + Budget/Low-Cost Series)
  // =========================================================================
  {
    id: "prod_001",
    name: "Apple iPhone 15 Pro Max (256GB Natural Titanium)",
    category: "Smartphones",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    qualityGrade: "Original",
    price: 385000,
    oldPrice: 415000,
    stock: 8,
    connector: "USB-C",
    screenSize: "6.7 inch Super Retina XDR",
    specs: "A17 Pro 3nm Chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB 3.0",
    image: "images/iphone_15_pro.png",
    rating: 4.9,
    reviewsCount: 42,
    badge: "👑 100% Original Apple",
    description: "100% Original Apple Flagship forged in aerospace-grade titanium with breakthrough A17 Pro chip and official TRCSL registration."
  },
  {
    id: "prod_020",
    name: "Samsung Galaxy S24 Ultra 5G (256GB Titanium Gray)",
    category: "Smartphones",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    qualityGrade: "Original",
    price: 315000,
    oldPrice: 340000,
    stock: 7,
    connector: "USB-C",
    screenSize: "6.8 inch Flat QHD+ AMOLED 2X",
    specs: "Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included",
    image: "images/hero_slide_2.jpg",
    rating: 4.9,
    reviewsCount: 51,
    badge: "👑 100% Original Samsung",
    description: "Original Samsung Galaxy flagship with Galaxy AI capabilities, 200MP quad camera system, flat display, and built-in S-Pen."
  },
  {
    id: "prod_008",
    name: "Xiaomi 14 Ultra (512GB Leica Quad Edition)",
    category: "Smartphones",
    brand: "Xiaomi",
    model: "Xiaomi 14 Ultra",
    qualityGrade: "Original",
    price: 265000,
    oldPrice: 290000,
    stock: 4,
    connector: "USB-C",
    screenSize: "6.73 inch WQHD+ AMOLED",
    specs: "Leica Quad 50MP 1-inch Sensor, Snapdragon 8 Gen 3, 90W HyperCharge, Ceramic Back",
    image: "images/xiaomi_14_ultra.svg",
    rating: 4.8,
    reviewsCount: 19,
    badge: "👑 100% Original Xiaomi",
    description: "Authentic Xiaomi optical flagship engineered in partnership with Leica, 50MP quad sensors, and ultra-fast 90W charging."
  },
  {
    id: "prod_009",
    name: "Google Pixel 9 Pro XL 5G (256GB Obsidian)",
    category: "Smartphones",
    brand: "Google",
    model: "Pixel 9 Pro XL",
    qualityGrade: "Original",
    price: 285000,
    oldPrice: 310000,
    stock: 5,
    connector: "USB-C",
    screenSize: "6.8 inch Super Actua Display",
    specs: "Google Tensor G4, Built-in Gemini AI Pro, 50MP Triple Camera with 30X Super Res Zoom",
    image: "images/hero_slide_1.jpg",
    rating: 4.9,
    reviewsCount: 28,
    badge: "👑 100% Original Google",
    description: "Google's flagship device powered by Tensor G4 and on-device Gemini AI with incredible computational photography."
  },
  {
    id: "prod_021",
    name: "Apple iPhone 15 Plus (128GB Blue Dynamic Island)",
    category: "Smartphones",
    brand: "Apple",
    model: "iPhone 15 Plus",
    qualityGrade: "Original",
    price: 245000,
    oldPrice: 270000,
    stock: 9,
    connector: "USB-C",
    screenSize: "6.7 inch Super Retina XDR",
    specs: "A16 Bionic Chip, Dynamic Island, 48MP Main Camera with 2X Telephoto, 26h Video Battery",
    image: "images/hero_slide_3.jpg",
    rating: 4.8,
    reviewsCount: 33,
    badge: "👑 100% Original Apple",
    description: "Original Apple iPhone 15 Plus featuring Dynamic Island, 48MP main camera, USB-C, and incredible multi-day battery endurance."
  },
  {
    id: "prod_036",
    name: "Samsung Galaxy A05s (128GB / 6GB RAM - Budget Edition)",
    category: "Smartphones",
    brand: "Samsung",
    model: "Galaxy A05s",
    qualityGrade: "Budget",
    price: 42500,
    oldPrice: 48000,
    stock: 14,
    connector: "USB-C",
    screenSize: "6.7 inch 90Hz FHD+ Display",
    specs: "50MP Triple Camera, Snapdragon 680, 5000mAh Battery, 25W Fast Charge, Side Fingerprint",
    image: "images/samsung_s27_ultra.jpg",
    rating: 4.6,
    reviewsCount: 45,
    badge: "🏷️ Budget / Low-Cost",
    description: "Affordable Samsung Galaxy smartphone providing great daily performance with 50MP camera, 90Hz smooth screen, and 5000mAh battery."
  },
  {
    id: "prod_037",
    name: "Xiaomi Redmi 13C (128GB / 6GB RAM - Budget Value Series)",
    category: "Smartphones",
    brand: "Xiaomi",
    model: "Redmi 13C",
    qualityGrade: "Budget",
    price: 36900,
    oldPrice: 42000,
    stock: 16,
    connector: "USB-C",
    screenSize: "6.74 inch 90Hz Dot Display",
    specs: "50MP AI Dual Camera, MediaTek Helio G85, 5000mAh Battery, 18W Fast Charging",
    image: "images/xiaomi_14_ultra.svg",
    rating: 4.5,
    reviewsCount: 38,
    badge: "🏷️ Budget / Low-Cost",
    description: "Best budget everyday smartphone featuring 50MP AI camera, 6.74-inch large display, and long-lasting 5000mAh power."
  },
  {
    id: "prod_038",
    name: "Google Pixel 8a 5G (128GB Bay Blue - High Value Grade)",
    category: "Smartphones",
    brand: "Google",
    model: "Pixel 8a",
    qualityGrade: "High Grade",
    price: 148000,
    oldPrice: 165000,
    stock: 6,
    connector: "USB-C",
    screenSize: "6.1 inch Actua 120Hz OLED",
    specs: "Google Tensor G3, Google AI Features, 64MP Dual Camera, 7 Years OS Updates",
    image: "images/hero_slide_1.jpg",
    rating: 4.8,
    reviewsCount: 22,
    badge: "⭐ High Value Grade",
    description: "High-value compact smartphone delivering flagship Google Tensor G3 camera performance and AI smarts at a moderate price point."
  },

  // =========================================================================
  // 2. CHARGERS & CABLES (11 Products: Genuine Brand + Budget Series)
  // =========================================================================
  {
    id: "prod_011",
    name: "Apple Original 20W USB-C Fast Power Adapter",
    category: "Chargers",
    brand: "Apple",
    model: "MHJE3ZP/A",
    qualityGrade: "Original",
    wattage: "20W",
    connector: "USB-C",
    price: 5800,
    oldPrice: 6800,
    stock: 35,
    screenSize: "N/A",
    specs: "Original Apple 20W Power Delivery, 50% Charge in 30 Mins for iPhone 16 / 15 / 14 / 13",
    image: "images/apple_20w_adapter.jpg",
    rating: 4.9,
    reviewsCount: 112,
    badge: "👑 100% Original Apple",
    description: "Genuine Apple 20W USB‑C Power Adapter delivers fast, efficient charging with full factory warranty and authentic Apple serial number."
  },
  {
    id: "prod_017",
    name: "Samsung 25W Super Fast Type-C Wall Adapter (Original)",
    category: "Chargers",
    brand: "Samsung",
    model: "EP-TA800",
    qualityGrade: "Original",
    wattage: "25W",
    connector: "USB-C",
    price: 4800,
    oldPrice: 5800,
    stock: 28,
    screenSize: "N/A",
    specs: "25W Super Fast Charging, PD 3.0 PPS, Type-C Output for Galaxy A, M & S Series",
    image: "images/samsung_45w_charger.jpg",
    rating: 4.8,
    reviewsCount: 53,
    badge: "👑 100% Original Samsung",
    description: "Original Samsung 25W Power Delivery wall charger with intelligent PPS thermal regulation."
  },
  {
    id: "prod_012",
    name: "Samsung 45W Super Fast Charger 2.0 (with 5A Cable)",
    category: "Chargers",
    brand: "Samsung",
    model: "EP-T4510",
    qualityGrade: "Original",
    wattage: "45W",
    connector: "USB-C",
    price: 8500,
    oldPrice: 9900,
    stock: 18,
    screenSize: "N/A",
    specs: "45W Super Fast Charging 2.0, GaN Tech, Includes 5A Heavy Duty Type-C Cable",
    image: "images/samsung_45w_charger.jpg",
    rating: 4.9,
    reviewsCount: 78,
    badge: "👑 100% Original Samsung",
    description: "Get your Galaxy S24 Ultra and Galaxy Tab powered up at maximum speed with authentic Samsung 45W Super Fast Charge 2.0 tech."
  },
  {
    id: "prod_003",
    name: "Anker 65W GaNPrime 3-Port Fast Wall Charger",
    category: "Chargers",
    brand: "Anker",
    model: "Anker 735 GaNPrime 65W",
    qualityGrade: "Original",
    wattage: "65W",
    connector: "USB-C",
    price: 9500,
    oldPrice: 11500,
    stock: 25,
    screenSize: "N/A",
    specs: "65W GaN III Fast Tech, Dual USB-C + USB-A Ports, ActiveShield 2.0 Protection",
    image: "images/anker_65w_gan.jpg",
    rating: 4.9,
    reviewsCount: 89,
    badge: "👑 100% Original Anker",
    description: "Ultra-compact high-speed charger capable of powering your laptop, smartphone, and tablet simultaneously with PowerIQ 4.0 dynamic allocation."
  },
  {
    id: "prod_010",
    name: "Baseus 65W GaN3 Pro 3-Port Fast Wall Adapter",
    category: "Chargers",
    brand: "Baseus",
    model: "GaN3 Pro 65W",
    qualityGrade: "High Grade",
    wattage: "65W",
    connector: "USB-C",
    price: 7800,
    oldPrice: 9200,
    stock: 20,
    screenSize: "N/A",
    specs: "65W Max Multi-Port, Dual Type-C + USB-A, BPS II Smart Power Allocation",
    image: "images/baseus_65w_gan.jpg",
    rating: 4.8,
    reviewsCount: 64,
    badge: "⭐ High Grade GaN",
    description: "High-grade GaN3 fast adapter for rapid simultaneous charging of laptops, iPhones, and Android smartphones."
  },
  {
    id: "prod_026",
    name: "Anker 511 Nano 30W PIQ 3.0 Ultra-Compact Fast Charger",
    category: "Chargers",
    brand: "Anker",
    model: "Anker Nano 30W (511)",
    qualityGrade: "Original",
    wattage: "30W",
    connector: "USB-C",
    price: 5200,
    oldPrice: 6200,
    stock: 30,
    screenSize: "N/A",
    specs: "30W High-Speed Output, 70% Smaller than Standard 30W, PowerIQ 3.0 & ActiveShield",
    image: "images/anker_nano_30w.jpg",
    rating: 4.9,
    reviewsCount: 84,
    badge: "👑 100% Original Anker",
    description: "Pocket-sized authentic Anker 30W fast charger with ActiveShield thermal sensors."
  },
  {
    id: "prod_039",
    name: "Apple Compatible 20W Fast USB-C Adapter (Budget / Standard Grade)",
    category: "Chargers",
    brand: "Apple",
    model: "Standard 20W PD",
    qualityGrade: "Budget",
    wattage: "20W",
    connector: "USB-C",
    price: 1650,
    oldPrice: 2400,
    stock: 50,
    screenSize: "N/A",
    specs: "20W Power Delivery, Standard Grade PCB, Compatible with iPhone 11-16 & iPads",
    image: "images/apple_20w_adapter.jpg",
    rating: 4.3,
    reviewsCount: 65,
    badge: "🏷️ Budget / Low-Cost",
    description: "Standard grade economical 20W USB-C fast charger adapter. Pocket-friendly budget replacement charger for daily fast charging."
  },
  {
    id: "prod_040",
    name: "Samsung Compatible 25W Type-C Fast Adapter (Budget / Economy Grade)",
    category: "Chargers",
    brand: "Samsung",
    model: "Standard 25W SFC",
    qualityGrade: "Budget",
    wattage: "25W",
    connector: "USB-C",
    price: 1450,
    oldPrice: 2100,
    stock: 40,
    screenSize: "N/A",
    specs: "25W Fast Charging Support, Standard Circuit, Type-C Output for Galaxy Series",
    image: "images/samsung_45w_charger.jpg",
    rating: 4.2,
    reviewsCount: 41,
    badge: "🏷️ Budget / Low-Cost",
    description: "Economical standard grade 25W fast charger adapter compatible with Samsung Galaxy A & S series phones."
  },
  {
    id: "prod_041",
    name: "Xiaomi 18W Quick Fast Wall Adapter (Budget / Standard Grade)",
    category: "Chargers",
    brand: "Xiaomi",
    model: "MDY-08-ES",
    qualityGrade: "Budget",
    wattage: "20W",
    connector: "USB-C",
    price: 1250,
    oldPrice: 1800,
    stock: 35,
    screenSize: "N/A",
    specs: "18W Quick Charge 3.0, Over-Voltage Protection, Lightweight Travel Plug",
    image: "images/chargers.jpeg",
    rating: 4.4,
    reviewsCount: 29,
    badge: "🏷️ Budget / Low-Cost",
    description: "Budget-friendly 18W QC3.0 quick charging plug suitable for Xiaomi, Redmi, and other Android mobile devices."
  },
  {
    id: "prod_018",
    name: "Anker PowerLine+ 100W Braided Type-C to Type-C Cable (2m)",
    category: "Chargers",
    brand: "Anker",
    model: "PowerLine+ III 100W",
    qualityGrade: "Original",
    wattage: "65W",
    connector: "USB-C",
    price: 2800,
    oldPrice: 3500,
    stock: 45,
    screenSize: "N/A",
    specs: "100W PD Fast Charging, Double-Braided Heavy Duty Nylon, 35000+ Bend Lifespan",
    image: "images/anker_cable_100w.jpg",
    rating: 4.9,
    reviewsCount: 95,
    badge: "👑 100% Original Anker",
    description: "Heavy-duty double-braided nylon USB-C charging cable capable of delivering up to 100W high-speed power."
  },
  {
    id: "prod_042",
    name: "Standard 1m USB-C Fast Charging Data Cable (Budget Grade)",
    category: "Chargers",
    brand: "Generic",
    model: "Standard USB-C 1m",
    qualityGrade: "Budget",
    wattage: "20W",
    connector: "USB-C",
    price: 450,
    oldPrice: 750,
    stock: 120,
    screenSize: "N/A",
    specs: "3A Fast Charging, 480Mbps Data Sync, Flexible PVC Jacket, Universal USB-C",
    image: "images/cat-chargers.svg",
    rating: 4.3,
    reviewsCount: 88,
    badge: "🏷️ Budget / Low-Cost",
    description: "Low-cost standard PVC Type-C cable for quick everyday charging and reliable data transfer."
  },
  {
    id: "prod_043",
    name: "Standard 1m Lightning to USB Cable for iPhone (Budget Grade)",
    category: "Chargers",
    brand: "Apple",
    model: "Lightning USB 1m",
    qualityGrade: "Budget",
    wattage: "20W",
    connector: "Lightning",
    price: 550,
    oldPrice: 850,
    stock: 90,
    screenSize: "N/A",
    specs: "2.4A Fast Charge, Data Sync, Compatible with iPhone 6 to 14 Series",
    image: "images/cat-chargers.svg",
    rating: 4.2,
    reviewsCount: 62,
    badge: "🏷️ Budget / Low-Cost",
    description: "Affordable budget Lightning cable for iPhones and iPads, ideal as a replacement or spare car cable."
  },

  // =========================================================================
  // 3. COVERS & SCREEN PROTECTORS (7 Products: Super D, HD+, MTB & Cases)
  // =========================================================================
  {
    id: "prod_007",
    name: "Super D 9H Privacy & Curved Edge Tempered Glass (Best Quality)",
    category: "Covers",
    brand: "ESR",
    qualityGrade: "Original",
    qualityTier: "Super D",
    tierRank: 1,
    model: "Super D Series",
    price: 1650,
    oldPrice: 2200,
    stock: 50,
    connector: "N/A",
    screenSize: "Available for all iPhone & Samsung models",
    specs: "Top Tier: 9H Diamond Strength, 28° Spy Privacy Angle, Anti-Static Dust Proof, 3D Curved Edge",
    image: "images/tempered_glass.svg",
    rating: 5.0,
    reviewsCount: 94,
    badge: "👑 Super D (Best Quality)",
    description: "The highest quality screen protector on the market. Military-grade 9H shatter resistance with anti-peeping privacy shield and 3D curved fit."
  },
  {
    id: "prod_013",
    name: "HD+ Ultra-Clear 9H Tempered Glass Shield (High Quality)",
    category: "Covers",
    brand: "ESR",
    qualityGrade: "High Grade",
    qualityTier: "HD+",
    tierRank: 2,
    model: "HD+ Clarity Series",
    price: 850,
    oldPrice: 1200,
    stock: 45,
    connector: "N/A",
    screenSize: "Available for iPhone, Samsung, Xiaomi",
    specs: "High Quality Tier: 99.9% Optical Clarity, 9H Anti-Scratch, Oleophobic Anti-Fingerprint, Smooth Touch",
    image: "images/cat-tempered.svg",
    rating: 4.8,
    reviewsCount: 62,
    badge: "⭐ HD+ (High Quality)",
    description: "High-definition ultra-clear tempered glass designed to preserve full display brilliance with advanced 9H scratch resistance."
  },
  {
    id: "prod_014",
    name: "MTB Matte Anti-Glare Tough Glass Protector (Budget Friendly)",
    category: "Covers",
    brand: "Generic",
    qualityGrade: "Budget",
    qualityTier: "MTB",
    tierRank: 3,
    model: "MTB Gaming Series",
    price: 550,
    oldPrice: 850,
    stock: 65,
    connector: "N/A",
    screenSize: "Universal Smartphone Fit",
    specs: "Standard Tier: Matte Anti-Glare Finish, Smooth Gaming Touch, Anti-Oil Smudge Coating, Budget Friendly",
    image: "images/tempered_glass.svg",
    rating: 4.6,
    reviewsCount: 39,
    badge: "🏷️ MTB (Budget Standard)",
    description: "Standard quality matte-finished tempered glass engineered for mobile gamers to eliminate glare and resist finger sweat at low cost."
  },
  {
    id: "prod_022",
    name: "Spigen Ultra Hybrid MagFit Clear Shockproof Case",
    category: "Covers",
    brand: "Spigen",
    qualityGrade: "Original",
    model: "Ultra Hybrid MagFit",
    price: 4500,
    oldPrice: 5800,
    stock: 20,
    connector: "MagSafe Compatible",
    screenSize: "iPhone 15 Pro / Galaxy S24 Ultra",
    specs: "Air Cushion Technology, Anti-Yellowing Clear Back, Strong MagSafe Magnetic Connection",
    image: "images/magsafe_case.svg",
    rating: 4.9,
    reviewsCount: 48,
    badge: "👑 100% Original Spigen",
    description: "Crystal-clear shock-absorbing case with built-in magnetic ring, certified military-grade drop defense, and long-lasting clarity."
  },
  {
    id: "prod_023",
    name: "ESR HaloLock Kickstand Shockproof Armor Case",
    category: "Covers",
    brand: "ESR",
    qualityGrade: "Original",
    model: "HaloLock Classic Kickstand",
    price: 3800,
    oldPrice: 4800,
    stock: 16,
    connector: "MagSafe Compatible",
    screenSize: "iPhone 15 / 14 / Galaxy S24",
    specs: "Built-in Zinc-Alloy Camera Guard Kickstand, Strong 1500g Magnetic Lock, Shock-Absorbing Corners",
    image: "images/magsafe_case.svg",
    rating: 4.8,
    reviewsCount: 37,
    badge: "👑 100% Original ESR",
    description: "Versatile armor case featuring an integrated camera-protecting kickstand for adjustable portrait and landscape viewing."
  },
  {
    id: "prod_004",
    name: "MagSafe European Leather Case for iPhone 15 / 16",
    category: "Covers",
    brand: "Apple",
    qualityGrade: "High Grade",
    model: "iPhone 15 / 16 Pro",
    price: 2800,
    oldPrice: 3600,
    stock: 15,
    connector: "MagSafe Compatible",
    screenSize: "Fits 6.1 / 6.7 inch",
    specs: "Premium European Leather Texture, Built-in MagSafe Array, Raised Camera Lip Protection",
    image: "images/magsafe_case.jpg",
    rating: 4.7,
    reviewsCount: 24,
    badge: "⭐ High Quality Grade",
    description: "High-grade premium leather finish case designed with built-in MagSafe magnet array and soft microfiber interior."
  },
  {
    id: "prod_044",
    name: "Ultra-Clear Slim TPU Flexible Gel Case (Budget Protection)",
    category: "Covers",
    brand: "Generic",
    model: "Clear TPU Gel",
    qualityGrade: "Budget",
    price: 380,
    oldPrice: 650,
    stock: 150,
    connector: "Universal",
    screenSize: "All Smartphone Models Available",
    specs: "0.8mm Ultra-Thin Shock Gel, Non-Slip Grip, Raised Lip Screen & Camera Guard, Crystal Transparency",
    image: "images/magsafe_case.svg",
    rating: 4.4,
    reviewsCount: 72,
    badge: "🏷️ Budget / Low-Cost",
    description: "Everyday transparent lightweight silicone TPU protective case with anti-scratch coating and slim pocket profile."
  },

  // =========================================================================
  // 4. AUDIO & WIRELESS (7 Products: Flagship ANC + Low-Cost Earbuds & Speakers)
  // =========================================================================
  {
    id: "prod_005",
    name: "Apple AirPods Pro (2nd Gen) with USB-C Case",
    category: "Audio",
    brand: "Apple",
    model: "AirPods Pro Gen 2",
    qualityGrade: "Original",
    price: 64500,
    oldPrice: 72000,
    stock: 12,
    connector: "USB-C / Wireless",
    screenSize: "N/A",
    specs: "H2 Chip, 2X Active Noise Cancellation, Personalized Spatial Audio, MagSafe Charging",
    image: "images/airpods_pro.png",
    rating: 4.9,
    reviewsCount: 110,
    badge: "👑 100% Original Apple",
    description: "100% Authentic Apple AirPods Pro with H2 chip, adaptive audio, transparency mode, and spatial sound."
  },
  {
    id: "prod_024",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    category: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    qualityGrade: "Original",
    price: 88000,
    oldPrice: 98000,
    stock: 6,
    connector: "Bluetooth 5.2 / 3.5mm / USB-C",
    screenSize: "N/A",
    specs: "Industry Leading ANC with 8 Microphones, Auto NC Optimizer, 30-Hour Battery, LDAC Hi-Res Audio",
    image: "images/sony_wh1000xm5.svg",
    rating: 5.0,
    reviewsCount: 68,
    badge: "👑 100% Original Sony",
    description: "The gold standard in noise cancellation with two processors controlling eight microphones, magnificent sound quality, and LDAC audio."
  },
  {
    id: "prod_015",
    name: "JBL Flip 6 Waterproof Bluetooth Speaker",
    category: "Audio",
    brand: "JBL",
    model: "Flip 6",
    qualityGrade: "Original",
    price: 28500,
    oldPrice: 34000,
    stock: 9,
    connector: "Bluetooth 5.1 / USB-C",
    screenSize: "N/A",
    specs: "2-Way Speaker System, Deep Bass, IP67 Waterproof & Dustproof, 12-Hour Playtime",
    image: "images/hero_slide_4.jpg",
    rating: 4.8,
    reviewsCount: 47,
    badge: "👑 100% Original JBL",
    description: "Original JBL Flip 6 delivering powerful JBL Original Pro Sound with punchy racetrack woofer and separate tweeter."
  },
  {
    id: "prod_025",
    name: "Samsung Galaxy Buds 2 Pro (360 Audio / ANC)",
    category: "Audio",
    brand: "Samsung",
    model: "Galaxy Buds 2 Pro",
    qualityGrade: "Original",
    price: 34500,
    oldPrice: 42000,
    stock: 14,
    connector: "Bluetooth 5.3 / USB-C / Qi Wireless",
    screenSize: "N/A",
    specs: "24-bit Hi-Fi Studio Sound, Intelligent ANC with 3 High SNR Mics, 360 Audio Dolby Atmos, IPX7 Water Resistant",
    image: "images/galaxy_buds2_pro.svg",
    rating: 4.8,
    reviewsCount: 39,
    badge: "👑 100% Original Samsung",
    description: "Ergonomic earbuds delivering 24-bit Hi-Fi sound for a quality listening experience, smart voice detect, and enhanced 360 Audio."
  },
  {
    id: "prod_026_audio",
    name: "Anker Soundcore Life Q30 Hybrid ANC Headphones",
    category: "Audio",
    brand: "Anker",
    model: "Soundcore Life Q30",
    qualityGrade: "High Grade",
    price: 16500,
    oldPrice: 19500,
    stock: 18,
    connector: "Bluetooth 5.0 / NFC / USB-C",
    screenSize: "N/A",
    specs: "Advanced Hybrid Active Noise Cancelling (3 Modes), Hi-Res Audio Certified, 40-Hour ANC Battery",
    image: "images/sony_wh1000xm5.svg",
    rating: 4.8,
    reviewsCount: 82,
    badge: "⭐ High Value ANC",
    description: "Enjoy certified Hi-Res sound with customized multi-mode active noise cancelling and ultra-plush protein leather earcups."
  },
  {
    id: "prod_045",
    name: "Pro Wireless TWS Bluetooth Earbuds (Budget Edition / Air-Pods Style)",
    category: "Audio",
    brand: "Generic",
    model: "TWS Pro-4",
    qualityGrade: "Budget",
    price: 2250,
    oldPrice: 3500,
    stock: 80,
    connector: "Bluetooth 5.3 / Lightning",
    screenSize: "N/A",
    specs: "True Wireless Bluetooth 5.3, Touch Sensor Controls, Charging Case, Built-in Mic for Calls, 4h Battery",
    image: "images/airpods_pro.png",
    rating: 4.3,
    reviewsCount: 64,
    badge: "🏷️ Budget / Low-Cost",
    description: "Standard wireless Bluetooth 5.3 earbuds with touch controls, compact charging case, mic for calls, and 4-hour battery."
  },
  {
    id: "prod_046",
    name: "Mini Portable Wireless Bluetooth Speaker (Budget Edition / JBL Go Style)",
    category: "Audio",
    brand: "Generic",
    model: "Mini Go Bass",
    qualityGrade: "Budget",
    price: 1950,
    oldPrice: 2800,
    stock: 45,
    connector: "Bluetooth 5.0 / USB / TF Card",
    screenSize: "N/A",
    specs: "Punchy Bass, Compact Pocket Size, FM Radio + TF Card Support, 5-Hour Rechargeable Battery",
    image: "images/hero_slide_4.jpg",
    rating: 4.4,
    reviewsCount: 52,
    badge: "🏷️ Budget / Low-Cost",
    description: "Pocket-sized wireless Bluetooth speaker with punchy sound, FM radio, TF card and USB playback, 5-hour battery life."
  },

  // =========================================================================
  // 5. POWER BANKS (6 Products: High Output + Budget Portable Power)
  // =========================================================================
  {
    id: "prod_030",
    name: "Anker PowerCore 737 24000mAh 140W GaN Power Bank",
    category: "Power",
    brand: "Anker",
    model: "Anker 737 (PowerCore 24K)",
    qualityGrade: "Original",
    price: 24500,
    oldPrice: 28500,
    stock: 6,
    connector: "Dual USB-C & USB-A",
    screenSize: "N/A",
    specs: "140W Ultra-Powerful Two-Way Fast Charge, Smart Color Digital Display, GaNPrime 24,000mAh Battery",
    image: "images/power_bank.svg",
    rating: 5.0,
    reviewsCount: 29,
    badge: "👑 100% Original Anker",
    description: "Equipped with Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or deliver 140W ultra-fast output."
  },
  {
    id: "prod_016",
    name: "Anker 10000mAh Magnetic MagGo Power Bank (Kickstand)",
    category: "Power",
    brand: "Anker",
    model: "Anker 633 MagGo",
    qualityGrade: "Original",
    price: 12500,
    oldPrice: 14800,
    stock: 11,
    connector: "MagSafe / USB-C",
    screenSize: "N/A",
    specs: "10000mAh Wireless Charging, Strong Magnet Snap, Built-in Foldable Kickstand, 20W PD Wired",
    image: "images/power_bank.svg",
    rating: 4.9,
    reviewsCount: 35,
    badge: "👑 100% Original Anker",
    description: "Snap and go! Powerful 10000mAh wireless portable charger with integrated stand for hands-free viewing while charging."
  },
  {
    id: "prod_029",
    name: "Xiaomi 20000mAh 50W HyperCharge Power Bank 3 Pro",
    category: "Power",
    brand: "Xiaomi",
    model: "Mi 50W Power Bank",
    qualityGrade: "Original",
    price: 8200,
    oldPrice: 9800,
    stock: 12,
    connector: "USB-C & Dual USB-A",
    screenSize: "N/A",
    specs: "50W MAX Fast Charge, 3-Port Output, Low-Current Charging for Earbuds, High Quality Lithium-ion Polymer",
    image: "images/power_bank.jpeg",
    rating: 4.8,
    reviewsCount: 38,
    badge: "👑 100% Original Xiaomi",
    description: "High-speed 50W fast charging power bank capable of flash charging Xiaomi flagships, iPhones, and Nintendo Switch."
  },
  {
    id: "prod_006",
    name: "Baseus 20000mAh 22.5W Fast Power Bank with LED",
    category: "Power",
    brand: "Baseus",
    model: "Universal Power Bank",
    qualityGrade: "High Grade",
    price: 6800,
    oldPrice: 8200,
    stock: 15,
    connector: "USB-C & Micro USB",
    screenSize: "N/A",
    specs: "20000mAh Capacity, Digital LED Battery % Display, Dual USB Output, PD 3.0 & SCP 22.5W",
    image: "images/power_bank.jpeg",
    rating: 4.8,
    reviewsCount: 56,
    badge: "⭐ High Grade Baseus",
    description: "Massive 20000mAh portable charger with LED digital status readout, perfect for long travels and multi-device emergencies."
  },
  {
    id: "prod_047",
    name: "Xiaomi Redmi 10000mAh Dual-USB Fast Power Bank (Budget Edition)",
    category: "Power",
    brand: "Xiaomi",
    model: "Redmi PowerBank 10K",
    qualityGrade: "Budget",
    price: 3450,
    oldPrice: 4500,
    stock: 35,
    connector: "Type-C & Micro-USB",
    screenSize: "N/A",
    specs: "10,000mAh High-Density Li-Po, Dual USB-A Output (2.6A), 12-Layer Advanced Circuit Protection",
    image: "images/power_bank.jpeg",
    rating: 4.6,
    reviewsCount: 48,
    badge: "🏷️ Budget / Low-Cost",
    description: "Slim, travel-friendly 10,000mAh portable power bank with dual USB-A ports, Type-C & Micro-USB inputs and 12-layer circuit protection."
  },
  {
    id: "prod_048",
    name: "Baseus 10000mAh Mini Pocket Power Bank (Budget Series)",
    category: "Power",
    brand: "Baseus",
    model: "Mini Q 10K",
    qualityGrade: "Budget",
    price: 3850,
    oldPrice: 4800,
    stock: 25,
    connector: "USB-C & USB-A",
    screenSize: "N/A",
    specs: "10000mAh Palm-Sized Body, 15W Rapid Charging, 4-Stage LED Battery Level Indicator",
    image: "images/baseus_blade.svg",
    rating: 4.5,
    reviewsCount: 31,
    badge: "🏷️ Budget / Low-Cost",
    description: "Compact 10000mAh pocket battery pack with LED power indicators and smart overcharge safety."
  },

  // =========================================================================
  // 6. ACCESSORIES & GEAR (7 Products: Original Brands + Low-Cost Essentials)
  // =========================================================================
  {
    id: "prod_035",
    name: "Apple AirTag 4-Pack Precision Finding Tracker",
    category: "Accessories",
    brand: "Apple",
    model: "MX542ZM/A",
    qualityGrade: "Original",
    price: 24500,
    oldPrice: 28000,
    stock: 10,
    connector: "Bluetooth / UWB",
    screenSize: "N/A",
    specs: "Ultra Wideband Precision Finding, Apple Find My Network, IP67 Water & Dust Resistance, 1-Year CR2032 Battery",
    image: "images/airtag_pack.svg",
    rating: 5.0,
    reviewsCount: 75,
    badge: "👑 100% Original Apple",
    description: "Keep track of and find your keys, wallet, luggage, and backpack in the Apple Find My app with ultra-wideband precision."
  },
  {
    id: "prod_031",
    name: "ESR HaloLock Magnetic Wireless Car Charger Mount",
    category: "Accessories",
    brand: "ESR",
    model: "HaloLock Wireless Car Mount",
    qualityGrade: "Original",
    price: 5800,
    oldPrice: 6900,
    stock: 20,
    connector: "USB-C to MagSafe 15W",
    screenSize: "Universal Smartphone MagSafe",
    specs: "Strong Magnetic Lock (2,300g force), Fast 15W Wireless Charging, 360° Air Vent & Dash Mount",
    image: "images/esr_car_mount.svg",
    rating: 4.9,
    reviewsCount: 61,
    badge: "👑 100% Original ESR",
    description: "Fast wireless charging magnetic car mount designed for iPhone 12/13/14/15/16 series with ultra-secure vent clip."
  },
  {
    id: "prod_032",
    name: "Anker 7-in-1 USB-C Multi-Port Hub Adapter",
    category: "Accessories",
    brand: "Anker",
    model: "Anker 341 USB-C Hub",
    qualityGrade: "Original",
    price: 8900,
    oldPrice: 10500,
    stock: 14,
    connector: "USB-C",
    screenSize: "N/A",
    specs: "4K@30Hz HDMI, 100W Power Delivery In, SD & microSD Card Slots, 3x High-Speed USB-A Ports",
    image: "images/anker_hub.svg",
    rating: 4.8,
    reviewsCount: 43,
    badge: "👑 100% Original Anker",
    description: "Massive expansion hub with 4K HDMI, pass-through 100W PD charging, SD card reader, and high-speed data transfer."
  },
  {
    id: "prod_034",
    name: "Spigen Optik Pro Camera Lens Protector (2-Pack)",
    category: "Accessories",
    brand: "Spigen",
    model: "Optik Pro Lens Glass",
    qualityGrade: "Original",
    price: 2800,
    oldPrice: 3500,
    stock: 25,
    connector: "N/A",
    screenSize: "iPhone 15 Pro / Galaxy S24 Ultra",
    specs: "9H Hardness Tempered Glass, Aluminum Alloy Metal Ring, Anti-Reflective Night Flash Coating",
    image: "images/cat-other.svg",
    rating: 4.9,
    reviewsCount: 36,
    badge: "👑 100% Original Spigen",
    description: "Individual camera lens protection rings with premium aluminum border and high transparency 9H diamond-grade glass."
  },
  {
    id: "prod_049",
    name: "360° Rotating Magnetic Ring Kickstand & Phone Grip (Budget Grade)",
    category: "Accessories",
    brand: "Generic",
    model: "Metal Ring Holder",
    qualityGrade: "Budget",
    price: 450,
    oldPrice: 750,
    stock: 85,
    connector: "Universal Adhesive / Magnetic",
    screenSize: "Universal Smartphone",
    specs: "Zinc Alloy Metal Ring, 360° Free Rotation + 180° Fold, Desktop Kickstand Mode, Car Magnetic Mount Compatible",
    image: "images/cat-other.svg",
    rating: 4.5,
    reviewsCount: 57,
    badge: "🏷️ Budget / Low-Cost",
    description: "Ultra-slim metal finger ring grip and desktop kickstand for easy one-handed holding and hands-free video watching."
  },
  {
    id: "prod_050",
    name: "Car Air Vent Gravity Phone Mount Holder (Budget Grade)",
    category: "Accessories",
    brand: "Generic",
    model: "Gravity Auto-Lock 360",
    qualityGrade: "Budget",
    price: 850,
    oldPrice: 1400,
    stock: 60,
    connector: "Universal Air Vent Clip",
    screenSize: "4.7 to 7.0 inch Phones",
    specs: "Auto-Clamp Gravity Linkage, One-Hand Drop & Lock, Anti-Scratch Silicone Padding, 360 Swivel Ball",
    image: "images/esr_car_mount.svg",
    rating: 4.4,
    reviewsCount: 49,
    badge: "🏷️ Budget / Low-Cost",
    description: "Automatic gravity clamp car vent phone holder made of durable ABS, holds 4.7 to 7.0 inch smartphones securely."
  },
  {
    id: "prod_051",
    name: "HD Camera Lens Glass Protector Ring (Budget Grade)",
    category: "Accessories",
    brand: "Generic",
    model: "Standard Lens Shield",
    qualityGrade: "Budget",
    price: 350,
    oldPrice: 600,
    stock: 110,
    connector: "N/A",
    screenSize: "Universal iPhone & Samsung Bump",
    specs: "9H Optical Glass, Anti-Scratch, High Transparency, Flash Hole Cutout",
    image: "images/cat-other.svg",
    rating: 4.3,
    reviewsCount: 33,
    badge: "🏷️ Budget / Low-Cost",
    description: "9H optical glass camera lens protector preventing everyday dust, drops, and scratches on smartphone camera bumps."
  }
];

// Initialize Storage Engine with realistic Sri Lankan prices and budget tiers
function initStorage() {
  const currentVer = "v15_sri_lanka_realistic_prices_and_budget_tier";
  const stored = localStorage.getItem("tz_products");
  let prods = [];
  try {
    prods = stored ? JSON.parse(stored) : [];
  } catch (e) {
    prods = [];
  }

  // Force full refresh if version doesn't match or catalog is outdated
  if (localStorage.getItem("tz_version") !== currentVer || !prods || prods.length < 35) {
    try {
      localStorage.removeItem("tz_cart");
      localStorage.removeItem("tz_cart_1");
      localStorage.removeItem("tz_cart_user_1");
      localStorage.removeItem("tz_cart_guest");
      localStorage.removeItem("tz_wishlist");
    } catch(e) {}

    const sanitizedInitial = INITIAL_PRODUCTS.map(p => ({
      ...p,
      brand: typeof normalizeBrand === 'function' ? normalizeBrand(p.brand) : p.brand
    }));
    localStorage.setItem("tz_products", JSON.stringify(sanitizedInitial));
    localStorage.setItem("tz_version", currentVer);
    prods = sanitizedInitial;
  } else if (prods && Array.isArray(prods) && prods.length > 0) {
    let changed = false;
    prods = prods.map(p => {
      if (p.brand) {
        const norm = typeof normalizeBrand === 'function' ? normalizeBrand(p.brand) : p.brand;
        if (p.brand !== norm) {
          p.brand = norm;
          changed = true;
        }
      }
      return p;
    });
    if (changed) {
      localStorage.setItem("tz_products", JSON.stringify(prods));
    }
  }

  if (!localStorage.getItem("tz_orders")) {
    const seedOrders = [
      {
        id: "ORD-9021",
        date: "2026-08-15T14:30:00.000Z",
        customerName: "Kasun Perera",
        phone: "+94 77 123 4567",
        address: "No. 45, Station Road, Matara",
        items: [
          { id: "prod_011", name: "Apple Original 20W USB-C Fast Power Adapter", price: 5800, qty: 1 }
        ],
        total: 5800,
        paymentMethod: "Cash on Delivery",
        status: "Completed"
      }
    ];
    localStorage.setItem("tz_orders", JSON.stringify(seedOrders));
  }
  if (!localStorage.getItem("tz_user")) {
    localStorage.setItem("tz_user", JSON.stringify(null));
  }
}

// Data Access API
const StorageDB = {
  getProducts: function() {
    initStorage();
    // Auto-invalidate old or corrupted browser cache to ensure all smartphones render
    if (localStorage.getItem("tz_data_ver") !== "v4_smartphones_fixed") {
      localStorage.setItem("tz_products", JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem("tz_data_ver", "v4_smartphones_fixed");
    }
    let prods = [];
    try {
      prods = JSON.parse(localStorage.getItem("tz_products")) || [];
    } catch(e) {
      prods = [];
    }
    if (!prods || prods.length < 35) {
      prods = INITIAL_PRODUCTS;
      localStorage.setItem("tz_products", JSON.stringify(INITIAL_PRODUCTS));
    }
    let modified = false;
    const catMap = { 1: "Smartphones", 2: "Chargers", 3: "Covers", 4: "Audio", 5: "Power", 6: "Accessories" };
    prods = prods.map(p => {
      if (!p.name && p.product_name) { p.name = p.product_name; modified = true; }
      if (!p.category) {
        if (p.category_name) {
          p.category = p.category_name;
        } else if (p.category_id && catMap[p.category_id]) {
          p.category = catMap[p.category_id];
        } else {
          p.category = "Smartphones";
        }
        modified = true;
      }
      if (!p.category_name) { p.category_name = p.category; modified = true; }
      if (!p.id && p.product_id) { p.id = 'prod_' + p.product_id; modified = true; }
      if (p.price && typeof p.price === 'string') { p.price = parseFloat(p.price); modified = true; }
      if (p.stock !== undefined && typeof p.stock === 'string') { p.stock = parseInt(p.stock); modified = true; }
      if (p.brand) {
        const norm = typeof normalizeBrand === 'function' ? normalizeBrand(p.brand) : p.brand;
        if (p.brand !== norm) {
          p.brand = norm;
          modified = true;
        }
      }
      return p;
    });
    if (modified) {
      try {
        localStorage.setItem("tz_products", JSON.stringify(prods));
      } catch(e) {}
    }
    return prods;
  },
  saveProducts: function(products) {
    if (Array.isArray(products)) {
      products.forEach(p => {
        if (p && p.brand && typeof normalizeBrand === 'function') {
          p.brand = normalizeBrand(p.brand);
        }
      });
    }
    localStorage.setItem("tz_products", JSON.stringify(products));
  },
  getProductById: function(id) {
    if (!id) return null;
    const strId = String(id).trim();
    const allProds = this.getProducts();
    
    // 1. Direct exact ID match
    let found = allProds.find(p => p.id === strId || p.id == id);
    if (found) return found;

    // 2. Match numericId
    found = allProds.find(p => p.numericId && (p.numericId == strId || String(p.numericId) === strId));
    if (found) return found;

    // 3. Match numeric digits from id string
    const num = parseInt(strId.replace(/[^0-9]/g, ''));
    if (!isNaN(num)) {
      found = allProds.find(p => {
        const pNum = parseInt(String(p.id).replace(/[^0-9]/g, '')) || p.numericId;
        return pNum === num;
      });
      if (found) return found;
    }

    // 4. Fallback search in INITIAL_PRODUCTS
    if (typeof INITIAL_PRODUCTS !== 'undefined') {
      found = INITIAL_PRODUCTS.find(p => p.id === strId || p.id == id || (p.numericId && p.numericId == strId));
      if (found) return found;
    }

    return null;
  },
  saveProduct: function(productData) {
    if (productData && productData.brand && typeof normalizeBrand === 'function') {
      productData.brand = normalizeBrand(productData.brand);
    }
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productData.id || (productData.numericId && p.numericId == productData.numericId));
    if (index >= 0) {
      products[index] = { ...products[index], ...productData };
    } else {
      if (!productData.id) {
        productData.id = productData.numericId ? `prod_${productData.numericId}` : "prod_" + Date.now();
      }
      products.unshift(productData);
    }
    this.saveProducts(products);
    return productData;
  },
  deleteProduct: function(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
  },

  // Helper to get active user unique identifier (strictly keyed by email)
  getActiveUserId: function() {
    try {
      const user = JSON.parse(localStorage.getItem("tz_user"));
      if (user) {
        if (user.email && typeof user.email === 'string' && user.email.trim()) {
          return user.email.trim().toLowerCase();
        }
        if (user.username && typeof user.username === 'string' && user.username.trim()) {
          return user.username.trim().toLowerCase();
        }
        if (user.user_id || user.id) {
          return 'uid_' + String(user.user_id || user.id).trim();
        }
      }
    } catch(e) {}
    return null;
  },

  // Dynamic storage keys strictly per user email / account
  getCartKey: function() {
    const uid = this.getActiveUserId();
    return uid ? `tz_cart_user_${uid}` : "tz_cart_guest";
  },

  getWishlistKey: function() {
    const uid = this.getActiveUserId();
    return uid ? `tz_wishlist_user_${uid}` : "tz_wishlist_guest";
  },

  // Cart API (Strictly User-scoped)
  getCart: function() {
    initStorage();
    const key = this.getCartKey();
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) || [];
      }
    } catch(e) {}
    return [];
  },
  saveCart: function(cart) {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(cart || []));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
    if (typeof window.updateHeaderCounters === 'function') {
      window.updateHeaderCounters();
    }
  },
  addToCart: function(productId, qty = 1) {
    const cart = this.getCart();
    let product = this.getProductById(productId);
    
    // Fallback if product lookup fails
    if (!product) {
      if (typeof productId === 'object' && productId !== null) {
        product = productId;
      } else {
        const all = this.getProducts();
        product = all[0] || { id: String(productId), name: "Mobile Accessory", price: 1500, image: "images/cat-chargers.svg", brand: "D-TEL" };
      }
    }
    
    const prodId = product.id || String(productId);
    
    // Safety check: do not add out of stock products to cart
    if (product) {
      const isOos = (product.stock !== undefined && product.stock !== null && parseInt(product.stock) <= 0) ||
                    product.status === 'out_of_stock' ||
                    (typeof product.status === 'string' && product.status.toLowerCase().includes('out'));
      if (isOos) {
        console.warn('Cannot add out-of-stock product to cart:', product.name);
        return false;
      }
    }

    const existing = cart.find(item => item.productId === prodId || item.id === prodId || item.productId === productId || item.id === productId);
    if (existing) {
      existing.qty = (parseInt(existing.qty) || 1) + qty;
      existing.name = product.name || existing.name;
      existing.price = Number(product.price) || existing.price;
      existing.image = product.image || existing.image;
    } else {
      cart.push({
        id: prodId,
        productId: prodId,
        name: product.name || "Mobile Product",
        price: Number(product.price) || 0,
        image: product.image || "images/cat-chargers.svg",
        brand: product.brand || 'D-TEL',
        qty: qty
      });
    }
    this.saveCart(cart);
  },
  updateCartQty: function(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(item => item.productId !== productId && item.id !== productId);
    } else {
      const item = cart.find(item => item.productId === productId || item.id === productId);
      if (item) item.qty = qty;
    }
    this.saveCart(cart);
  },
  removeFromCart: function(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId && item.id !== productId);
    this.saveCart(cart);
  },
  clearCart: function() {
    this.saveCart([]);
  },

  // Wishlist API (User-scoped)
  getWishlist: function() {
    initStorage();
    const key = this.getWishlistKey();
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch(e) {}
    return [];
  },
  saveWishlist: function(wishlist) {
    const key = this.getWishlistKey();
    localStorage.setItem(key, JSON.stringify(wishlist || []));
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: wishlist }));
  },
  toggleWishlist: function(productId) {
    let wishlist = this.getWishlist();
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    this.saveWishlist(wishlist);
    return wishlist.includes(productId);
  },

  // Orders API
  getAllOrders: function() {
    initStorage();
    return JSON.parse(localStorage.getItem("tz_orders")) || [];
  },
  getOrders: function() {
    initStorage();
    // If admin is active, return all orders
    try {
      const user = JSON.parse(localStorage.getItem("tz_user"));
      if (user && (user.role === 'admin' || user.email === 'dtel@gmail.com')) {
        return this.getAllOrders();
      }
    } catch(e) {}

    const uid = this.getActiveUserId();
    const allOrders = this.getAllOrders();
    if (uid) {
      return allOrders.filter(o => !o.userId || String(o.userId).toLowerCase() === uid);
    }
    return allOrders;
  },
  saveOrders: function(orders) {
    localStorage.setItem("tz_orders", JSON.stringify(orders || []));
  },
  addOrder: function(orderData) {
    const uid = this.getActiveUserId();
    const allOrders = this.getAllOrders();
    if (!orderData.id) {
      orderData.id = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    }
    if (!orderData.date) {
      orderData.date = new Date().toISOString();
    }
    if (uid && !orderData.userId) {
      orderData.userId = uid;
    }
    allOrders.unshift(orderData);
    this.saveOrders(allOrders);
    
    // Decrement stock
    const products = this.getProducts();
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = products.find(p => p.id === item.id || p.id === item.productId || (item.product_id && (p.numericId == item.product_id || p.id == item.product_id)));
        if (prod) {
          const q = parseInt(item.qty || item.quantity) || 1;
          prod.stock = Math.max(0, prod.stock - q);
        }
      });
      this.saveProducts(products);
    }
    return orderData;
  },

  // User API
  getUser: function() {
    initStorage();
    try {
      return JSON.parse(localStorage.getItem("tz_user"));
    } catch(e) {
      return null;
    }
  },
  setUser: function(user) {
    localStorage.setItem("tz_user", JSON.stringify(user));
    // Clear temporary guest storage so items don't bleed across different email sign-ins
    try {
      localStorage.removeItem("tz_cart_guest");
      localStorage.removeItem("tz_wishlist_guest");
      localStorage.removeItem("tz_cart");
    } catch(e) {}

    window.dispatchEvent(new CustomEvent("userUpdated", { detail: user }));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    window.dispatchEvent(new CustomEvent("wishlistUpdated"));
    if (typeof window.updateHeaderCounters === 'function') {
      window.updateHeaderCounters();
    }
  },
  getStoreSettings: function() {
    initStorage();
    const defaults = {
      name: "D-TEL Cellular",
      tagline: "Genuine Smartphones & Premium Accessories Hub",
      phone: "070 194 8371",
      whatsapp: "0701948371",
      email: "dtel@gmail.com",
      address: "2nd Road, Piliyandala, Sri Lanka",
      city: "Piliyandala",
      hours: "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: 10:00 AM - 6:00 PM",
      mapQuery: "Piliyandala, Sri Lanka"
    };
    try {
      const stored = localStorage.getItem("tz_store_settings");
      if (stored) {
        return { ...defaults, ...JSON.parse(stored) };
      }
    } catch(e) {}
    return defaults;
  },
  saveStoreSettings: function(settings) {
    const current = this.getStoreSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem("tz_store_settings", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("storeSettingsUpdated", { detail: updated }));
    if (typeof window.applyStoreSettingsToDOM === 'function') {
      window.applyStoreSettingsToDOM();
    }
    return updated;
  }
};

// Global Header Cart & Wishlist Counter Synchronizer
window.updateHeaderCounters = function() {
  try {
    const cart = typeof StorageDB !== 'undefined' ? StorageDB.getCart() : [];
    const totalCount = cart.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);
    
    document.querySelectorAll(".cart-count-num").forEach(el => {
      el.textContent = totalCount;
    });
    document.querySelectorAll(".cart-badge-count").forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? "inline-flex" : "none";
    });
    const checkoutCount = document.getElementById("checkoutCartCount");
    if (checkoutCount) {
      checkoutCount.textContent = totalCount;
    }
  } catch (e) {
    console.error("Error in updateHeaderCounters:", e);
  }
};

// Initialize immediately & listen for events
initStorage();
if (typeof window !== 'undefined') {
  window.addEventListener("DOMContentLoaded", window.updateHeaderCounters);
  window.addEventListener("cartUpdated", window.updateHeaderCounters);
  window.addEventListener("userUpdated", window.updateHeaderCounters);
  window.addEventListener("storage", window.updateHeaderCounters);
  window.updateHeaderCounters();
}
