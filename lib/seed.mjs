import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'combo_shop.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Create tables ---
db.exec(`
  DROP TABLE IF EXISTS order_items;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS combo_items;
  DROP TABLE IF EXISTS combos;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE combos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percent REAL NOT NULL,
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE combo_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combo_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    total_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    combo_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// --- Categories ---
const insertCat = db.prepare(
  'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)'
);
const categories = [
  ['Gloves', 'gloves', 'Professional goalkeeper and outfield gloves for all weather conditions', '/images/gloves.jpg'],
  ['Shin Guards', 'shin-guards', 'Protective shin guards for training and match days', '/images/shin-guards.jpg'],
  ['Socks', 'socks', 'High-performance football socks with grip and cushioning', '/images/socks.jpg'],
  ['Caps & Headbands', 'caps-headbands', 'Football caps, headbands and head gear', '/images/caps.jpg'],
  ['Arm Sleeves & Bands', 'arm-sleeves-bands', 'Captain armbands, arm sleeves and wristbands', '/images/armbands.jpg'],
  ['Bags & Accessories', 'bags-accessories', 'Football bags, water bottles, towels and more', '/images/bags.jpg'],
];
const catIds = {};
for (const [name, slug, desc, img] of categories) {
  const r = insertCat.run(name, slug, desc, img);
  catIds[slug] = r.lastInsertRowid;
}

// --- Products (NPR pricing) ---
const insertProd = db.prepare(
  'INSERT INTO products (name, slug, description, price, category_id, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
const products = [
  // Gloves
  ['Pro Goalkeeper Gloves', 'pro-gk-gloves', 'Latex palm grip with finger protection spines. Match-ready quality.', 2500, catIds['gloves'], '/images/products/gk-gloves.jpg', 30],
  ['Training Gloves', 'training-gloves', 'Durable all-weather training gloves for daily practice.', 1200, catIds['gloves'], '/images/products/training-gloves.jpg', 50],
  ['Winter Outfield Gloves', 'winter-outfield-gloves', 'Thermal outfield gloves ideal for cold Himalayan weather.', 900, catIds['gloves'], '/images/products/winter-gloves.jpg', 40],

  // Shin Guards
  ['Elite Shin Guards', 'elite-shin-guards', 'Lightweight carbon fiber shin guards with ankle protection.', 1800, catIds['shin-guards'], '/images/products/elite-shinguards.jpg', 45],
  ['Youth Shin Guards', 'youth-shin-guards', 'Comfortable shin guards designed for junior players.', 800, catIds['shin-guards'], '/images/products/youth-shinguards.jpg', 60],
  ['Slip-in Shin Guards', 'slip-in-shin-guards', 'Minimalist slip-in design for freedom of movement.', 1100, catIds['shin-guards'], '/images/products/slip-shinguards.jpg', 35],

  // Socks
  ['Pro Grip Socks', 'pro-grip-socks', 'Anti-slip grip socks used by professional players.', 650, catIds['socks'], '/images/products/grip-socks.jpg', 100],
  ['Knee-High Match Socks', 'knee-high-match-socks', 'Official match-day knee-high socks. Multiple colors.', 450, catIds['socks'], '/images/products/knee-socks.jpg', 120],
  ['Training Ankle Socks', 'training-ankle-socks', 'Breathable ankle socks for training sessions.', 350, catIds['socks'], '/images/products/ankle-socks.jpg', 150],

  // Caps & Headbands
  ['Football Training Cap', 'football-training-cap', 'UV-protection training cap with moisture-wicking fabric.', 750, catIds['caps-headbands'], '/images/products/training-cap.jpg', 40],
  ['Performance Headband', 'performance-headband', 'Sweat-absorbing headband for intense matches.', 400, catIds['caps-headbands'], '/images/products/headband.jpg', 70],
  ['Skull Cap', 'skull-cap', 'Thermal skull cap for winter football in mountain regions.', 550, catIds['caps-headbands'], '/images/products/skull-cap.jpg', 35],

  // Arm Sleeves & Bands
  ['Captain Armband', 'captain-armband', 'Elastic captain armband — Nepal flag option available.', 350, catIds['arm-sleeves-bands'], '/images/products/captain-armband.jpg', 80],
  ['Compression Arm Sleeve', 'compression-arm-sleeve', 'UV-protection compression sleeve. Pair included.', 600, catIds['arm-sleeves-bands'], '/images/products/arm-sleeve.jpg', 55],
  ['Wristband Set', 'wristband-set', 'Pack of 2 absorbent cotton wristbands.', 250, catIds['arm-sleeves-bands'], '/images/products/wristbands.jpg', 90],

  // Bags & Accessories
  ['Football Boot Bag', 'football-boot-bag', 'Ventilated boot bag to keep your gear fresh.', 850, catIds['bags-accessories'], '/images/products/boot-bag.jpg', 40],
  ['Sports Water Bottle 750ml', 'sports-water-bottle', 'BPA-free squeeze bottle. Essential for Kathmandu valley heat.', 500, catIds['bags-accessories'], '/images/products/water-bottle.jpg', 60],
  ['Quick-Dry Sports Towel', 'quick-dry-towel', 'Microfiber quick-dry towel, compact and lightweight.', 450, catIds['bags-accessories'], '/images/products/towel.jpg', 55],
];
const prodIds = {};
for (const [name, slug, desc, price, catId, img, stock] of products) {
  const r = insertProd.run(name, slug, desc, price, catId, img, stock);
  prodIds[slug] = r.lastInsertRowid;
}

// --- Combos ---
const insertCombo = db.prepare(
  'INSERT INTO combos (name, slug, description, discount_percent, image_url) VALUES (?, ?, ?, ?, ?)'
);
const insertCI = db.prepare(
  'INSERT INTO combo_items (combo_id, product_id, quantity) VALUES (?, ?, ?)'
);

const combos = [
  {
    name: 'Match Day Essentials',
    slug: 'match-day-essentials',
    desc: 'Everything you need for match day — shin guards, grip socks, and a headband. Save big!',
    discount: 15,
    img: '/images/combos/match-day.jpg',
    items: [['elite-shin-guards', 1], ['pro-grip-socks', 1], ['performance-headband', 1]],
  },
  {
    name: 'Goalkeeper Pro Kit',
    slug: 'gk-pro-kit',
    desc: 'Pro goalkeeper gloves + knee-high socks + wristband set. Dominate the goal!',
    discount: 20,
    img: '/images/combos/gk-kit.jpg',
    items: [['pro-gk-gloves', 1], ['knee-high-match-socks', 1], ['wristband-set', 1]],
  },
  {
    name: "Captain's Bundle",
    slug: 'captains-bundle',
    desc: 'Lead your team in style — captain armband, compression sleeves, and grip socks.',
    discount: 18,
    img: '/images/combos/captain.jpg',
    items: [['captain-armband', 1], ['compression-arm-sleeve', 1], ['pro-grip-socks', 1]],
  },
  {
    name: 'Winter Training Pack',
    slug: 'winter-training-pack',
    desc: 'Stay warm during cold Nepali winters — skull cap, winter gloves, and training socks.',
    discount: 22,
    img: '/images/combos/winter.jpg',
    items: [['skull-cap', 1], ['winter-outfield-gloves', 1], ['training-ankle-socks', 2]],
  },
  {
    name: 'Youth Starter Kit',
    slug: 'youth-starter-kit',
    desc: 'Perfect for young footballers — shin guards, socks, water bottle, and a cap.',
    discount: 25,
    img: '/images/combos/youth.jpg',
    items: [['youth-shin-guards', 1], ['knee-high-match-socks', 1], ['sports-water-bottle', 1], ['football-training-cap', 1]],
  },
  {
    name: 'Training Gear Combo',
    slug: 'training-gear-combo',
    desc: 'Daily training essentials — training gloves, ankle socks, boot bag, and towel.',
    discount: 17,
    img: '/images/combos/training.jpg',
    items: [['training-gloves', 1], ['training-ankle-socks', 2], ['football-boot-bag', 1], ['quick-dry-towel', 1]],
  },
];

for (const c of combos) {
  const r = insertCombo.run(c.name, c.slug, c.desc, c.discount, c.img);
  const cid = r.lastInsertRowid;
  for (const [slug, qty] of c.items) {
    insertCI.run(cid, prodIds[slug], qty);
  }
}

console.log('✅ Database seeded successfully!');
console.log(`   ${categories.length} categories`);
console.log(`   ${products.length} products`);
console.log(`   ${combos.length} combos`);

db.close();
