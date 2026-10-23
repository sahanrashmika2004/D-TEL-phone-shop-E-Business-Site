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
    {
        "id": "prod_1",
        "numericId": 1,
        "name": "Apple iPhone 15 Pro Max (256GB Natural Titanium)",
        "product_name": "Apple iPhone 15 Pro Max (256GB Natural Titanium)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Apple",
        "model": "iPhone 15 Pro Max",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 385000,
        "oldPrice": 415000,
        "original_price": 415000,
        "offer_price": 385000,
        "is_offer": 1,
        "stock": 8,
        "specs": "A17 Pro 3nm Chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB 3.0",
        "image": "images/uploads/prod_1792470134_040f1e9b.jpeg",
        "image_2": "images/uploads/prod_1792470128_e56424d0.jpeg",
        "image_3": "images/uploads/prod_1792470139_1e282266.jpeg",
        "image2": "images/uploads/prod_1792470128_e56424d0.jpeg",
        "image3": "images/uploads/prod_1792470139_1e282266.jpeg",
        "rating": 4.9,
        "reviewsCount": 42,
        "badge": "\ud83d\udd25 SPECIAL OFFER",
        "description": "A17 Pro 3nm chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB-C 3.0",
        "status": "active"
    },
    {
        "id": "prod_2",
        "numericId": 2,
        "name": "Samsung Galaxy S24 Ultra 5G (256GB Titanium)",
        "product_name": "Samsung Galaxy S24 Ultra 5G (256GB Titanium)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Samsung",
        "model": "Galaxy S24 Ultra",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 315000,
        "oldPrice": 340000,
        "original_price": 340000,
        "offer_price": 315000,
        "is_offer": 1,
        "stock": 7,
        "specs": "Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included",
        "image": "images/uploads/prod_1792470589_9502d738.jpeg",
        "image_2": "images/uploads/prod_1792470594_107e84ed.jpeg",
        "image_3": "images/uploads/prod_1792470598_2f59a610.jpeg",
        "image2": "images/uploads/prod_1792470594_107e84ed.jpeg",
        "image3": "images/uploads/prod_1792470598_2f59a610.jpeg",
        "rating": 4.9,
        "reviewsCount": 51,
        "badge": "\ud83d\udd25 SPECIAL OFFER",
        "description": "Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included",
        "status": "active"
    },
    {
        "id": "prod_3",
        "numericId": 3,
        "name": "Xiaomi 14 Ultra (512GB Leica Quad Edition)",
        "product_name": "Xiaomi 14 Ultra (512GB Leica Quad Edition)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Xiaomi",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 265000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 4,
        "specs": "",
        "image": "images/uploads/prod_1792470702_09560ac5.jpg",
        "image_2": "images/uploads/prod_1792470707_163f2c3f.jpeg",
        "image_3": "images/uploads/prod_1792470711_2044e827.jpeg",
        "image2": "images/uploads/prod_1792470707_163f2c3f.jpeg",
        "image3": "images/uploads/prod_1792470711_2044e827.jpeg",
        "rating": 4.8,
        "reviewsCount": 19,
        "badge": "\ud83d\udc51 100% Original Xiaomi",
        "description": "Leica Quad 50MP 1-inch Sensor, Snapdragon 8 Gen 3, 90W HyperCharge, Ceramic Back",
        "status": "active"
    },
    {
        "id": "prod_4",
        "numericId": 4,
        "name": "Google Pixel 9 Pro XL 5G (256GB Obsidian)",
        "product_name": "Google Pixel 9 Pro XL 5G (256GB Obsidian)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Google",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 285000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 5,
        "specs": "",
        "image": "images/uploads/prod_1792470873_36543271.jpg",
        "image_2": "images/uploads/prod_1792470877_1495b4c9.jpeg",
        "image_3": "images/uploads/prod_1792470881_e2f80d18.jpeg",
        "image2": "images/uploads/prod_1792470877_1495b4c9.jpeg",
        "image3": "images/uploads/prod_1792470881_e2f80d18.jpeg",
        "rating": 4.9,
        "reviewsCount": 28,
        "badge": "\ud83d\udc51 100% Original Google",
        "description": "Google Tensor G4, Built-in Gemini AI Pro, 50MP Triple Camera with 30X Super Res Zoom",
        "status": "active"
    },
    {
        "id": "prod_5",
        "numericId": 5,
        "name": "Apple iPhone 15 Plus (128GB Blue Dynamic Island)",
        "product_name": "Apple iPhone 15 Plus (128GB Blue Dynamic Island)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 245000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 9,
        "specs": "",
        "image": "images/uploads/prod_1792470967_7eb88d91.jpeg",
        "image_2": "images/uploads/prod_1792470971_2ef15921.jpeg",
        "image_3": "images/uploads/prod_1792470976_353b2847.jpg",
        "image2": "images/uploads/prod_1792470971_2ef15921.jpeg",
        "image3": "images/uploads/prod_1792470976_353b2847.jpg",
        "rating": 4.8,
        "reviewsCount": 33,
        "badge": "\ud83d\udc51 100% Original Apple",
        "description": "A16 Bionic Chip, Dynamic Island, 48MP Main Camera with 2X Telephoto, 26h Video Battery",
        "status": "active"
    },
    {
        "id": "prod_6",
        "numericId": 6,
        "name": "Samsung Galaxy A05s (128GB / 6GB RAM - Budget Edition)",
        "product_name": "Samsung Galaxy A05s (128GB / 6GB RAM - Budget Edition)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Samsung",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 42500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 0,
        "specs": "Display: 6.7\" FHD+ (1080\u00d72400) PLS LCD, 90Hz  \n\nProcessor: Qualcomm Snapdragon 680 (6nm)  \n\nMemory & Storage: 4GB / 6GB \n\nRAM; 64GB / 128GB storage (MicroSD up to 1TB) \n\nCameras: 50MP Main + 2MP Macro + 2MP Depth rear; 13MP Front \n\nBattery & Fast Charge: 5,000 mAh, 25W Fast Charging (USB-C)  \n\nKey Extras: Side Fingerprint Sensor, 3.5mm Headphone Jack, 4G LTE",
        "image": "images/uploads/prod_1792471061_01ab87bd.jpeg",
        "image_2": "images/uploads/prod_1792471065_b02e3caf.jpeg",
        "image_3": "images/uploads/prod_1792471069_4b80d0e6.jpeg",
        "image2": "images/uploads/prod_1792471065_b02e3caf.jpeg",
        "image3": "images/uploads/prod_1792471069_4b80d0e6.jpeg",
        "rating": 4.6,
        "reviewsCount": 45,
        "badge": "\ud83d\udc51 100% Budget Samsung",
        "description": "50MP Triple Camera, Snapdragon 680, 5000mAh Battery, 25W Fast Charge, 90Hz FHD+",
        "status": "out_of_stock"
    },
    {
        "id": "prod_7",
        "numericId": 7,
        "name": "Xiaomi Redmi 13C (128GB / 6GB RAM - Budget Value Phone)",
        "product_name": "Xiaomi Redmi 13C (128GB / 6GB RAM - Budget Value Phone)",
        "category": "Smartphones",
        "category_name": "Smartphones",
        "category_id": 1,
        "brand": "Xiaomi",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 36900,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 15,
        "specs": "",
        "image": "images/uploads/prod_1792471320_4b19663d.jpeg",
        "image_2": "images/uploads/prod_1792471325_92b7d9b8.jpeg",
        "image_3": "images/uploads/prod_1792471330_6ebedba3.jpeg",
        "image2": "images/uploads/prod_1792471325_92b7d9b8.jpeg",
        "image3": "images/uploads/prod_1792471330_6ebedba3.jpeg",
        "rating": 4.5,
        "reviewsCount": 38,
        "badge": "\ud83d\udc51 100% Budget Xiaomi",
        "description": "50MP AI Dual Camera, MediaTek Helio G85, 5000mAh Battery, 18W Fast Charging",
        "status": "active"
    },
    {
        "id": "prod_8",
        "numericId": 8,
        "name": "Apple Original 20W USB-C Fast Power Adapter",
        "product_name": "Apple Original 20W USB-C Fast Power Adapter",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": "20W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 5800,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 28,
        "specs": "",
        "image": "images/uploads/prod_1792471433_7783ba26.jpg",
        "image_2": "images/uploads/prod_1792471439_9491b9df.jpeg",
        "image_3": "images/uploads/prod_1792471443_3cd8f058.jpg",
        "image2": "images/uploads/prod_1792471439_9491b9df.jpeg",
        "image3": "images/uploads/prod_1792471443_3cd8f058.jpg",
        "rating": 4.9,
        "reviewsCount": 112,
        "badge": "\ud83d\udc51 100% Original Apple",
        "description": "Original Apple 20W Power Delivery, Fast 50% Charge in 30 Mins for iPhone 15 / 16",
        "status": "active"
    },
    {
        "id": "prod_9",
        "numericId": 9,
        "name": "Samsung 25W Super Fast Type-C Wall Adapter (Original)",
        "product_name": "Samsung 25W Super Fast Type-C Wall Adapter (Original)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Samsung",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": "25W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 4800,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 28,
        "specs": "",
        "image": "images/uploads/prod_1792471562_b9c78507.jpeg",
        "image_2": "images/uploads/prod_1792471568_61786b75.jpeg",
        "image_3": "images/uploads/prod_1792471574_fa9b31db.jpg",
        "image2": "images/uploads/prod_1792471568_61786b75.jpeg",
        "image3": "images/uploads/prod_1792471574_fa9b31db.jpg",
        "rating": 4.8,
        "reviewsCount": 53,
        "badge": "\ud83d\udc51 100% Original Samsung",
        "description": "25W Super Fast Charging, PD 3.0 PPS, Type-C Output for Galaxy A & S Series",
        "status": "active"
    },
    {
        "id": "prod_10",
        "numericId": 10,
        "name": "Samsung 45W Super Fast Charger 2.0 (with 5A Cable)",
        "product_name": "Samsung 45W Super Fast Charger 2.0 (with 5A Cable)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Samsung",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": "45W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 8500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 18,
        "specs": "",
        "image": "images/uploads/prod_1792471812_20291a67.jpeg",
        "image_2": "images/uploads/prod_1792471796_93404834.jpeg",
        "image_3": "images/uploads/prod_1792471805_cfa6a99a.jpeg",
        "image2": "images/uploads/prod_1792471796_93404834.jpeg",
        "image3": "images/uploads/prod_1792471805_cfa6a99a.jpeg",
        "rating": 4.9,
        "reviewsCount": 78,
        "badge": "\ud83d\udc51 100% Original Samsung",
        "description": "45W Super Fast Charging 2.0, GaN Tech, Includes 5A 1.8m C-to-C Cable",
        "status": "active"
    },
    {
        "id": "prod_11",
        "numericId": 11,
        "name": "Anker 65W GaNPrime 3-Port Fast Wall Charger",
        "product_name": "Anker 65W GaNPrime 3-Port Fast Wall Charger",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Anker",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": "65W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 9500,
        "oldPrice": 11500,
        "original_price": 11500,
        "offer_price": 9500,
        "is_offer": 1,
        "stock": 25,
        "specs": "",
        "image": "images/uploads/prod_1792471965_67ae5c84.jpg",
        "image_2": "images/uploads/prod_1792522899_a4e05969.jpeg",
        "image_3": "images/uploads/prod_1792471987_56057d39.jpg",
        "image2": "images/uploads/prod_1792522899_a4e05969.jpeg",
        "image3": "images/uploads/prod_1792471987_56057d39.jpg",
        "rating": 4.9,
        "reviewsCount": 89,
        "badge": "🔥 SPECIAL OFFER",
        "description": "65W Max Output, GaN III Fast Tech, Dual USB-C + USB-A Ports, Compact Folding Plug",
        "status": "active"
    },
    {
        "id": "prod_12",
        "numericId": 12,
        "name": "Apple Compatible 20W Fast Charger Adapter (Budget Grade)",
        "product_name": "Apple Compatible 20W Fast Charger Adapter (Budget Grade)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": "20W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1750,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 50,
        "specs": "",
        "image": "images/uploads/prod_1792472184_621918dd.jpg",
        "image_2": "images/uploads/prod_1792472190_840ff818.jpeg",
        "image_3": "images/uploads/prod_1792472196_8093803d.jpeg",
        "image2": "images/uploads/prod_1792472190_840ff818.jpeg",
        "image3": "images/uploads/prod_1792472196_8093803d.jpeg",
        "rating": 4.3,
        "reviewsCount": 65,
        "badge": "\ud83d\udc51 100% Budget Apple",
        "description": "Standard Foxconn grade 20W USB-C PD power adapter. Pocket-friendly budget replacement charger.",
        "status": "active"
    },
    {
        "id": "prod_13",
        "numericId": 13,
        "name": "Samsung Fast 25W Type-C Travel Adapter (Budget Grade)",
        "product_name": "Samsung Fast 25W Type-C Travel Adapter (Budget Grade)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Samsung",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": "25W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1450,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 40,
        "specs": "",
        "image": "images/uploads/prod_1792472338_ed7735ff.png",
        "image_2": "images/uploads/prod_1792472344_fe4e6dda.jpeg",
        "image_3": "images/uploads/prod_1792472350_3eb43e30.jpeg",
        "image2": "images/uploads/prod_1792472344_fe4e6dda.jpeg",
        "image3": "images/uploads/prod_1792472350_3eb43e30.jpeg",
        "rating": 4.2,
        "reviewsCount": 41,
        "badge": "\ud83d\udc51 100% Budget Samsung",
        "description": "Economical standard grade 25W fast charger adapter compatible with Galaxy devices.",
        "status": "active"
    },
    {
        "id": "prod_14",
        "numericId": 14,
        "name": "UGREEN Standard 1m USB-C Fast Charging Data Cable (Budget Grade)",
        "product_name": "UGREEN Standard 1m USB-C Fast Charging Data Cable (Budget Grade)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "UGREEN",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 20,
        "specs": "Feature   \t               Technical Specification\n\nPower Delivery\t- Up to 60W Max Fast Charging support\n\nMaterial Finish\t- Flexible, durable White TPE rubber jacket\n\nInterface Configuration       - Male USB-C to USB-C connectors\n\nCable Length          - Standard 1 Meter (3.3 feet)\nProduct Model        - Certified UGREEN ED029 lineu",
        "image": "images/uploads/prod_1792472651_12191822.jpg",
        "image_2": "images/uploads/prod_1792472657_42b39828.jpeg",
        "image_3": "images/uploads/prod_1792472664_1b74e303.jpeg",
        "image2": "images/uploads/prod_1792472657_42b39828.jpeg",
        "image3": "images/uploads/prod_1792472664_1b74e303.jpeg",
        "rating": 4.4,
        "reviewsCount": 32,
        "badge": "\ud83d\udc51 100% Budget UGREEN",
        "description": "The UGREEN ED029 USB-C to USB-C Cable (1m) combines budget-friendly pricing with high-speed 60W Max Power Delivery to fast-charge your smartphones, tablets, and laptops.\nIts 1-meter length ensures a clutter-free setup perfect for desks, nightstands, or travel. Built with a highly flexible white TPE rubber jacket, it easily absorbs everyday twists and bends while providing a snug, reliable fit for all standard Type-C devices and chargers.",
        "status": "active"
    },
    {
        "id": "prod_15",
        "numericId": 15,
        "name": "Standard apple 1m Lightning to USB Cable for iPhone (Budget Grade)",
        "product_name": "Standard apple 1m Lightning to USB Cable for iPhone (Budget Grade)",
        "category": "Chargers",
        "category_name": "Chargers",
        "category_id": 2,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Lightning",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 550,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 50,
        "specs": "This 1-meter (3.3 feet) Lightning to USB-A cable is a budget-friendly option made for older iPhone, iPad, and iPod models. It features a standard USB 2.0 Type-A connector that plugs easily into older charging bricks and laptops. It supports standard charging up to 5V / 2.4A (12W) and data transfer speeds up to 480 Mbps, but it does not support modern fast charging. The outer layer is made of basic PVC plastic, which is less durable than premium braided nylon options. Additionally, because it is a budget grade, it may lack official Apple MFi certification, which can sometimes cause an \"Accessory Not Supported\" warning on your device",
        "image": "images/uploads/prod_1792474041_fbd42153.webp",
        "image_2": "images/uploads/prod_1792474044_b80a72ec.jpeg",
        "image_3": "images/uploads/prod_1792474047_f8c7f1a4.jpeg",
        "image2": "images/uploads/prod_1792474044_b80a72ec.jpeg",
        "image3": "images/uploads/prod_1792474047_f8c7f1a4.jpeg",
        "rating": 4.3,
        "reviewsCount": 50,
        "badge": "\ud83d\udc51 100% Budget Apple",
        "description": "This is a 1-meter (3.3 feet) Lightning to USB-A cable designed for charging and syncing older Apple devices like iPhones and iPads. It features a standard rectangular USB-A connector on one end for older wall chargers or laptops, and a reversible 8-pin Lightning connector on the other end.\nBuilt with a simple PVC plastic jacket, this budget-grade cable supports standard charging speeds up to 12W (5V/2.4A) and basic data transfer speeds up to 480 Mbps. It does not support modern USB-PD fast charging. Since it is a low-cost, generic option, it may lack official Apple MFi certification, meaning your device could occasionally show an \"Accessory Not Supported\" warning message.",
        "status": "active"
    },
    {
        "id": "prod_16",
        "numericId": 16,
        "name": "Super D 9H Privacy & Curved Edge Tempered Glass (Best Quality)",
        "product_name": "Super D 9H Privacy & Curved Edge Tempered Glass (Best Quality)",
        "category": "Covers",
        "category_name": "Covers",
        "category_id": 3,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": "Super D",
        "quality_tier": "Super D",
        "tierRank": 1,
        "tier_rank": 1,
        "price": 1650,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 50,
        "specs": "",
        "image": "images/uploads/prod_1792474625_1d2c6e9e.jpeg",
        "image_2": "images/uploads/prod_1792474629_5c37dbd8.webp",
        "image_3": "images/uploads/prod_1792474634_9ea8c837.jpeg",
        "image2": "images/uploads/prod_1792474629_5c37dbd8.webp",
        "image3": "images/uploads/prod_1792474634_9ea8c837.jpeg",
        "rating": 5,
        "reviewsCount": 94,
        "badge": "\ud83d\udc51 Super D",
        "description": "Top Tier: 9H Diamond Strength, 28\u00b0 Spy Privacy Angle, Anti-Static Dust Proof, 3D Curved Edge",
        "status": "active"
    },
    {
        "id": "prod_17",
        "numericId": 17,
        "name": "HD+ Ultra-Clear 9H Tempered Glass Shield (High Quality)",
        "product_name": "HD+ Ultra-Clear 9H Tempered Glass Shield (High Quality)",
        "category": "Covers",
        "category_name": "Covers",
        "category_id": 3,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "High Grade",
        "quality_grade": "High Grade",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": "HD+",
        "quality_tier": "HD+",
        "tierRank": 2,
        "tier_rank": 2,
        "price": 850,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 45,
        "specs": "",
        "image": "images/uploads/prod_1792477438_e9112735.jpeg",
        "image_2": "images/uploads/prod_1792477442_92b07f66.jpeg",
        "image_3": "images/uploads/prod_1792477445_88ef34d1.jpg",
        "image2": "images/uploads/prod_1792477442_92b07f66.jpeg",
        "image3": "images/uploads/prod_1792477445_88ef34d1.jpg",
        "rating": 4.8,
        "reviewsCount": 62,
        "badge": "\ud83d\udc51 HD+",
        "description": "High Quality Tier: 99.9% Optical Clarity, 9H Anti-Scratch, Oleophobic Anti-Fingerprint",
        "status": "active"
    },
    {
        "id": "prod_18",
        "numericId": 18,
        "name": "MTB Matte Anti-Glare Tough Glass Protector (Budget Friendly)",
        "product_name": "MTB Matte Anti-Glare Tough Glass Protector (Budget Friendly)",
        "category": "Covers",
        "category_name": "Covers",
        "category_id": 3,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": "MTB",
        "quality_tier": "MTB",
        "tierRank": 3,
        "tier_rank": 3,
        "price": 550,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 65,
        "specs": "",
        "image": "images/uploads/prod_1792477722_41d964dc.jpeg",
        "image_2": "images/uploads/prod_1792477726_ac665b41.jpeg",
        "image_3": "images/uploads/prod_1792477730_1582bea8.jpg",
        "image2": "images/uploads/prod_1792477726_ac665b41.jpeg",
        "image3": "images/uploads/prod_1792477730_1582bea8.jpg",
        "rating": 4.6,
        "reviewsCount": 39,
        "badge": "\ud83d\udc51 MTB",
        "description": "Standard Tier: Matte Anti-Glare Finish, Smooth Gaming Touch, Anti-Oil Smudge Coating",
        "status": "active"
    },
    {
        "id": "prod_19",
        "numericId": 19,
        "name": "Spigen Ultra Hybrid MagFit Clear Shockproof Case",
        "product_name": "Spigen Ultra Hybrid MagFit Clear Shockproof Case",
        "category": "Covers",
        "category_name": "Covers",
        "category_id": 3,
        "brand": "Spigen",
        "model": "Apple iPhone Models  \u2022 iPhone 17 Series: iPhone 17, iPhone 17 Pro, iPhone 17 Pro Max, iPhone 17 Air",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "MagSafe Compatible",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 20,
        "specs": "",
        "image": "images/uploads/prod_1792507724_b9b06736.jpg",
        "image_2": "images/uploads/prod_1792507730_aa0ffe51.webp",
        "image_3": "images/uploads/prod_1792507844_018ddc8f.webp",
        "image2": "images/uploads/prod_1792507730_aa0ffe51.webp",
        "image3": "images/uploads/prod_1792507844_018ddc8f.webp",
        "rating": 4.9,
        "reviewsCount": 48,
        "badge": "\ud83d\udc51 100% Original Spigen",
        "description": "Air Cushion Technology, Anti-Yellowing Clear Back, Strong MagSafe Magnetic Connection",
        "status": "active"
    },
    {
        "id": "prod_20",
        "numericId": 20,
        "name": "Ultra-Clear Slim TPU Flexible Gel Case (Budget Protection)",
        "product_name": "Ultra-Clear Slim TPU Flexible Gel Case (Budget Protection)",
        "category": "Covers",
        "category_name": "Covers",
        "category_id": 3,
        "brand": "Generic",
        "model": "Brand\tEligible Device Series Apple\tiPhone 16 / 15 / 14 / 13 series and SE models Samsung\tGalaxy S26 ",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 380,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 150,
        "specs": "",
        "image": "images/uploads/prod_1792508620_017f38e0.jpg",
        "image_2": "images/uploads/prod_1792508626_f909e0ad.jpg",
        "image_3": "images/uploads/prod_1792508652_9ee814ac.jpeg",
        "image2": "images/uploads/prod_1792508626_f909e0ad.jpg",
        "image3": "images/uploads/prod_1792508652_9ee814ac.jpeg",
        "rating": 4.4,
        "reviewsCount": 55,
        "badge": "\ud83d\udc51 100% Budget Generic",
        "description": "0.8mm Ultra-Thin Shock Gel, Non-Slip Grip, Raised Lip Screen & Camera Guard",
        "status": "active"
    },
    {
        "id": "prod_21",
        "numericId": 21,
        "name": "Apple AirPods Pro (2nd Gen) with USB-C Case",
        "product_name": "Apple AirPods Pro (2nd Gen) with USB-C Case",
        "category": "Audio",
        "category_name": "Audio",
        "category_id": 4,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 64500,
        "oldPrice": 72000,
        "original_price": 72000,
        "offer_price": 64500,
        "is_offer": 1,
        "stock": 12,
        "specs": "",
        "image": "images/uploads/prod_1792508871_1700c793.png",
        "image_2": "images/uploads/prod_1792508879_ba5c3a38.jpeg",
        "image_3": "images/uploads/prod_1792508885_b8be9063.jpeg",
        "image2": "images/uploads/prod_1792508879_ba5c3a38.jpeg",
        "image3": "images/uploads/prod_1792508885_b8be9063.jpeg",
        "rating": 4.9,
        "reviewsCount": 98,
        "badge": "🔥 SPECIAL OFFER",
        "description": "H2 Chip, 2X Active Noise Cancellation, Personalized Spatial Audio, MagSafe Charging",
        "status": "active"
    },
    {
        "id": "prod_22",
        "numericId": 22,
        "name": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
        "product_name": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
        "category": "Audio",
        "category_name": "Audio",
        "category_id": 4,
        "brand": "Sony",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 85000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 6,
        "specs": "",
        "image": "images/uploads/prod_1792509077_e736b96a.jpeg",
        "image_2": "images/uploads/prod_1792509082_43f40963.jpeg",
        "image_3": "images/uploads/prod_1792509087_5bef7e43.jpg",
        "image2": "images/uploads/prod_1792509082_43f40963.jpeg",
        "image3": "images/uploads/prod_1792509087_5bef7e43.jpg",
        "rating": 4.9,
        "reviewsCount": 76,
        "badge": "\ud83d\udc51 100% Original Sony",
        "description": "Industry Leading ANC with 8 Microphones, Auto NC Optimizer, 30-Hour Battery, LDAC",
        "status": "active"
    },
    {
        "id": "prod_23",
        "numericId": 23,
        "name": "JBL Flip 6 Waterproof Bluetooth Speaker",
        "product_name": "JBL Flip 6 Waterproof Bluetooth Speaker",
        "category": "Audio",
        "category_name": "Audio",
        "category_id": 4,
        "brand": "JBL",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 28500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 9,
        "specs": "",
        "image": "images/uploads/prod_1792509214_bbb41fd9.jpg",
        "image_2": "images/uploads/prod_1792509220_6e07f002.jpeg",
        "image_3": "images/uploads/prod_1792509226_afb3fc12.jpeg",
        "image2": "images/uploads/prod_1792509220_6e07f002.jpeg",
        "image3": "images/uploads/prod_1792509226_afb3fc12.jpeg",
        "rating": 4.8,
        "reviewsCount": 84,
        "badge": "\ud83d\udc51 100% Original JBL",
        "description": "2-Way Speaker System, Deep Bass, IP67 Waterproof & Dustproof, 12-Hour Playtime",
        "status": "active"
    },
    {
        "id": "prod_24",
        "numericId": 24,
        "name": "Pro Wireless TWS Bluetooth Earbuds (Budget Edition / Air-Pods Style)",
        "product_name": "Pro Wireless TWS Bluetooth Earbuds (Budget Edition / Air-Pods Style)",
        "category": "Audio",
        "category_name": "Audio",
        "category_id": 4,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Lightning",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 2250,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 80,
        "specs": "",
        "image": "images/uploads/prod_1792517808_505bee35.jpeg",
        "image_2": "images/uploads/prod_1792517812_f30db169.jpeg",
        "image_3": "images/uploads/prod_1792517816_872899a7.jpeg",
        "image2": "images/uploads/prod_1792517812_f30db169.jpeg",
        "image3": "images/uploads/prod_1792517816_872899a7.jpeg",
        "rating": 4.3,
        "reviewsCount": 62,
        "badge": "\ud83d\udc51 100% Budget Generic",
        "description": "True Wireless Bluetooth 5.3, Touch Sensor Controls, Charging Case, Mic for Calls",
        "status": "active"
    },
    {
        "id": "prod_25",
        "numericId": 25,
        "name": "JBL Mini Portable Wireless Bluetooth Speaker (Budget Edition)",
        "product_name": "JBL Mini Portable Wireless Bluetooth Speaker (Budget Edition)",
        "category": "Audio",
        "category_name": "Audio",
        "category_id": 4,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Micro USB",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1950,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 45,
        "specs": "",
        "image": "images/uploads/prod_1792517971_3a1f37f9.jpg",
        "image_2": "images/uploads/prod_1792517974_419e9631.jpeg",
        "image_3": "images/uploads/prod_1792517977_4dd8ea1b.jpg",
        "image2": "images/uploads/prod_1792517974_419e9631.jpeg",
        "image3": "images/uploads/prod_1792517977_4dd8ea1b.jpg",
        "rating": 4.4,
        "reviewsCount": 44,
        "badge": "\ud83d\udc51 100% Budget Generic",
        "description": "Punchy Bass, Compact Pocket Size, FM Radio + TF Card Support, 5-Hour Battery",
        "status": "active"
    },
    {
        "id": "prod_26",
        "numericId": 26,
        "name": "Anker 10000mAh Magnetic MagGo Power Bank (Kickstand)",
        "product_name": "Anker 10000mAh Magnetic MagGo Power Bank (Kickstand)",
        "category": "Power",
        "category_name": "Power",
        "category_id": 5,
        "brand": "Anker",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": "20W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 12500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 11,
        "specs": "",
        "image": "images/uploads/prod_1792518207_9ff072b2.jpeg",
        "image_2": "images/uploads/prod_1792518181_6107a58f.webp",
        "image_3": "images/uploads/prod_1792518188_56afa877.jpeg",
        "image2": "images/uploads/prod_1792518181_6107a58f.webp",
        "image3": "images/uploads/prod_1792518188_56afa877.jpeg",
        "rating": 4.9,
        "reviewsCount": 68,
        "badge": "\ud83d\udc51 100% Original Anker",
        "description": "10000mAh Wireless Charging, Strong Magnet Snap, Built-in Foldable Kickstand, 20W PD Wired",
        "status": "active"
    },
    {
        "id": "prod_27",
        "numericId": 27,
        "name": "Xiaomi 20000mAh 50W HyperCharge Power Bank 3 Pro",
        "product_name": "Xiaomi 20000mAh 50W HyperCharge Power Bank 3 Pro",
        "category": "Power",
        "category_name": "Power",
        "category_id": 5,
        "brand": "Xiaomi",
        "model": "",
        "qualityGrade": "High Grade",
        "quality_grade": "High Grade",
        "wattage": "45W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 8200,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 12,
        "specs": "",
        "image": "images/uploads/prod_1792518490_e7f2400d.jpg",
        "image_2": "images/uploads/prod_1792518494_b81f6c06.jpeg",
        "image_3": "images/uploads/prod_1792518498_3b0c17fe.webp",
        "image2": "images/uploads/prod_1792518494_b81f6c06.jpeg",
        "image3": "images/uploads/prod_1792518498_3b0c17fe.webp",
        "rating": 4.8,
        "reviewsCount": 52,
        "badge": "\ud83d\udc51 100% High Grade Xiaomi",
        "description": "50W MAX Fast Charge, 3-Port Output, Low-Current Charging for Earbuds",
        "status": "active"
    },
    {
        "id": "prod_28",
        "numericId": 28,
        "name": "Baseus 20000mAh 22.5W Fast Power Bank with LED",
        "product_name": "Baseus 20000mAh 22.5W Fast Power Bank with LED",
        "category": "Power",
        "category_name": "Power",
        "category_id": 5,
        "brand": "Baseus",
        "model": "",
        "qualityGrade": "High Grade",
        "quality_grade": "High Grade",
        "wattage": "25W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 6800,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 15,
        "specs": "",
        "image": "images/uploads/prod_1792518656_6e6c09b7.webp",
        "image_2": "images/uploads/prod_1792518659_ea8516ab.jpeg",
        "image_3": "images/uploads/prod_1792518662_6f7cc740.webp",
        "image2": "images/uploads/prod_1792518659_ea8516ab.jpeg",
        "image3": "images/uploads/prod_1792518662_6f7cc740.webp",
        "rating": 4.7,
        "reviewsCount": 47,
        "badge": "\ud83d\udc51 100% High Grade Baseus",
        "description": "20000mAh Capacity, Digital LED Battery % Display, Dual USB Output, PD 3.0 & SCP 22.5W",
        "status": "active"
    },
    {
        "id": "prod_29",
        "numericId": 29,
        "name": "Xiaomi Redmi 10000mAh Dual-USB Fast Power Bank (Budget Edition)",
        "product_name": "Xiaomi Redmi 10000mAh Dual-USB Fast Power Bank (Budget Edition)",
        "category": "Power",
        "category_name": "Power",
        "category_id": 5,
        "brand": "Xiaomi",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": "20W",
        "connector": "Micro USB",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 3450,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 30,
        "specs": "",
        "image": "images/uploads/prod_1792518790_7ffdbbc3.jpeg",
        "image_2": "images/uploads/prod_1792518795_49d56924.jpeg",
        "image_3": "images/uploads/prod_1792518799_b2519076.jpg",
        "image2": "images/uploads/prod_1792518795_49d56924.jpeg",
        "image3": "images/uploads/prod_1792518799_b2519076.jpg",
        "rating": 4.4,
        "reviewsCount": 39,
        "badge": "\ud83d\udc51 100% Budget Xiaomi",
        "description": "10,000mAh Li-Po, Dual USB-A Output (2.6A), 12-Layer Advanced Circuit Protection",
        "status": "active"
    },
    {
        "id": "prod_30",
        "numericId": 30,
        "name": "Baseus 30W 10000mAh Mini Pocket Power Bank (Budget Series)",
        "product_name": "Baseus 30W 10000mAh Mini Pocket Power Bank (Budget Series)",
        "category": "Power",
        "category_name": "Power",
        "category_id": 5,
        "brand": "Baseus",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": "30W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 4000,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 25,
        "specs": "e Baseus 30W 10000mAh Power Bank upgrades performance with faster 30W two-way fast charging (Power Delivery 3.0), an integrated built-in USB-C cable, and a real-time LED digital battery display.",
        "image": "images/uploads/prod_1792518998_681e80a3.jpeg",
        "image_2": "images/uploads/prod_1792519001_54e4bacb.webp",
        "image_3": "images/uploads/prod_1792519004_20908f19.jpeg",
        "image2": "images/uploads/prod_1792519001_54e4bacb.webp",
        "image3": "images/uploads/prod_1792519004_20908f19.jpeg",
        "rating": 4.6,
        "reviewsCount": 35,
        "badge": "\ud83d\udc51 100% Budget Baseus",
        "description": "10000mAh Palm-Sized Body, 15W Rapid Charging, 4-Stage LED Battery Level Indicator",
        "status": "active"
    },
    {
        "id": "prod_31",
        "numericId": 31,
        "name": "Apple AirTag 4-Pack Precision Finding Tracker",
        "product_name": "Apple AirTag 4-Pack Precision Finding Tracker",
        "category": "Accessories",
        "category_name": "Accessories",
        "category_id": 6,
        "brand": "Apple",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 24500,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 3,
        "specs": "",
        "image": "images/uploads/prod_1792519247_2630169b.jpeg",
        "image_2": "images/uploads/prod_1792519251_9ce275ec.jpeg",
        "image_3": "images/uploads/prod_1792519254_3d8e6264.jpeg",
        "image2": "images/uploads/prod_1792519251_9ce275ec.jpeg",
        "image3": "images/uploads/prod_1792519254_3d8e6264.jpeg",
        "rating": 4.9,
        "reviewsCount": 105,
        "badge": "\ud83d\udc51 100% Original Apple",
        "description": "Ultra Wideband Precision Finding, Apple Find My Network, IP67 Water & Dust Resistance",
        "status": "active"
    },
    {
        "id": "prod_32",
        "numericId": 32,
        "name": "ESR HaloLock Magnetic Wireless Car Charger Mount",
        "product_name": "ESR HaloLock Magnetic Wireless Car Charger Mount",
        "category": "Accessories",
        "category_name": "Accessories",
        "category_id": 6,
        "brand": "ESR",
        "model": "",
        "qualityGrade": "High Grade",
        "quality_grade": "High Grade",
        "wattage": "20W",
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 5800,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 20,
        "specs": "",
        "image": "images/uploads/prod_1792519409_0313ebf2.jpg",
        "image_2": "images/uploads/prod_1792519412_b8246917.jpeg",
        "image_3": "images/uploads/prod_1792519416_31dfeda3.jpeg",
        "image2": "images/uploads/prod_1792519412_b8246917.jpeg",
        "image3": "images/uploads/prod_1792519416_31dfeda3.jpeg",
        "rating": 4.8,
        "reviewsCount": 43,
        "badge": "\ud83d\udc51 100% High Grade ESR",
        "description": "Strong Magnetic Lock (2,300g force), Fast 15W Wireless Charging, 360\u00b0 Air Vent & Dash Mount",
        "status": "active"
    },
    {
        "id": "prod_33",
        "numericId": 33,
        "name": "Anker 7-in-1 USB-C Multi-Port Hub Adapter",
        "product_name": "Anker 7-in-1 USB-C Multi-Port Hub Adapter",
        "category": "Accessories",
        "category_name": "Accessories",
        "category_id": 6,
        "brand": "Anker",
        "model": "",
        "qualityGrade": "Original",
        "quality_grade": "Original",
        "wattage": null,
        "connector": "USB-C",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 8900,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 14,
        "specs": "",
        "image": "images/uploads/prod_1792519536_2030b7fa.jpg",
        "image_2": "images/uploads/prod_1792519539_93d17c8c.jpeg",
        "image_3": "images/uploads/prod_1792519542_3c67ab85.jpeg",
        "image2": "images/uploads/prod_1792519539_93d17c8c.jpeg",
        "image3": "images/uploads/prod_1792519542_3c67ab85.jpeg",
        "rating": 4.8,
        "reviewsCount": 58,
        "badge": "\ud83d\udc51 100% Original Anker",
        "description": "4K@30Hz HDMI, 100W Power Delivery In, SD & microSD Card Slots, 3x High-Speed USB-A Ports",
        "status": "active"
    },
    {
        "id": "prod_34",
        "numericId": 34,
        "name": "360\u00b0 Rotating Magnetic Ring Kickstand & Phone Grip (Budget Grade)",
        "product_name": "360\u00b0 Rotating Magnetic Ring Kickstand & Phone Grip (Budget Grade)",
        "category": "Accessories",
        "category_name": "Accessories",
        "category_id": 6,
        "brand": "Generic",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 1800,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 85,
        "specs": "",
        "image": "images/uploads/prod_1792519861_e279326a.jpg",
        "image_2": "images/uploads/prod_1792519853_302bff23.jpg",
        "image_3": "images/uploads/prod_1792519857_ed1ae6ab.jpg",
        "image2": "images/uploads/prod_1792519853_302bff23.jpg",
        "image3": "images/uploads/prod_1792519857_ed1ae6ab.jpg",
        "rating": 4.5,
        "reviewsCount": 67,
        "badge": "\ud83d\udc51 100% Budget Generic",
        "description": "Zinc Alloy Metal Ring, 360\u00b0 Free Rotation + 180\u00b0 Fold, Desktop Kickstand Mode",
        "status": "active"
    },
    {
        "id": "prod_35",
        "numericId": 35,
        "name": "UGREEN Car Air Vent Gravity Phone Mount Holder (Budget Grade)",
        "product_name": "UGREEN Car Air Vent Gravity Phone Mount Holder (Budget Grade)",
        "category": "Accessories",
        "category_name": "Accessories",
        "category_id": 6,
        "brand": "UGREEN",
        "model": "",
        "qualityGrade": "Budget",
        "quality_grade": "Budget",
        "wattage": null,
        "connector": "Universal",
        "qualityTier": null,
        "quality_tier": null,
        "tierRank": 99,
        "tier_rank": 99,
        "price": 2850,
        "oldPrice": null,
        "original_price": null,
        "offer_price": null,
        "is_offer": 0,
        "stock": 25,
        "specs": "",
        "image": "images/uploads/prod_1792520016_fdc20a1f.jpg",
        "image_2": "images/uploads/prod_1792520021_5f7f4cc2.jpeg",
        "image_3": "images/uploads/prod_1792520026_860c40b7.jpeg",
        "image2": "images/uploads/prod_1792520021_5f7f4cc2.jpeg",
        "image3": "images/uploads/prod_1792520026_860c40b7.jpeg",
        "rating": 4.4,
        "reviewsCount": 49,
        "badge": "\ud83d\udc51 100% Budget UGREEN",
        "description": "Auto-Clamp Gravity Linkage, One-Hand Drop & Lock, Anti-Scratch Silicone Padding",
        "status": "active"
    }
];

function initStorage() {
  const currentVer = "v17_special_offers_red_styled";
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
    if (localStorage.getItem("tz_data_ver") !== "v5_rich_db_images_synced") {
      localStorage.setItem("tz_products", JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem("tz_data_ver", "v5_rich_db_images_synced");
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
    const totalPrice = cart.reduce((sum, item) => sum + ((parseFloat(item.price) || 0) * (parseInt(item.qty) || 1)), 0);
    
    document.querySelectorAll(".cart-count-num").forEach(el => {
      el.textContent = totalCount;
    });
    document.querySelectorAll(".cart-badge-count").forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? "inline-flex" : "none";
    });
    const headerCartTotal = document.getElementById("headerCartTotal");
    if (headerCartTotal) {
      headerCartTotal.textContent = `Rs. ${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    const wishlist = typeof StorageDB !== 'undefined' ? StorageDB.getWishlist() : [];
    const wishlistCount = wishlist.length;
    document.querySelectorAll(".wishlist-badge-count-text").forEach(el => {
      el.textContent = wishlistCount;
    });
    document.querySelectorAll(".wishlist-badge-count").forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? "inline-flex" : "none";
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
