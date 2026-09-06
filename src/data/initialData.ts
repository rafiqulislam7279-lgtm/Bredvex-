import { Product, Category, SiteSettings, Order, ProductReview, Coupon } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'gadgets',
    name: 'Smart Gadgets',
    banglaName: 'স্মার্ট গ্যাজেটস',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    description: 'Smart watches, earphones, powerbanks & audio'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    banglaName: 'ফ্যাশন ও পোশাক',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    description: 'Premium clothing, panjabis, hoodies & streetwear'
  },
  {
    id: 'electronics',
    name: 'Computer & Tech',
    banglaName: 'কম্পিউটার ও টেক',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'Keyboards, wireless mice, webcams & desk gear'
  },
  {
    id: 'accessories',
    name: 'Leather & Accessories',
    banglaName: 'লেদার ও অ্যাক্সেসরিজ',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'Genuine leather wallets, belts, backpacks & shades'
  },
  {
    id: 'home',
    name: 'Home & Living',
    banglaName: 'হোম ও লিভিং',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    description: 'Aroma diffusers, smart lights & modern decor'
  },
  {
    id: 'lifestyle',
    name: 'Grooming & Care',
    banglaName: 'গ্রুমিং ও যত্ন',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Premium beard kits, organic oils & body essentials'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bvx-001',
    name: 'Bredvex Horizon Ultra Titanium Smartwatch',
    banglaName: 'হরাইজন আল্ট্রা টাইটানিয়াম স্মার্টওয়াচ',
    slug: 'bredvex-horizon-ultra-smartwatch',
    price: 3450,
    originalPrice: 4800,
    rating: 4.9,
    reviewsCount: 128,
    category: 'gadgets',
    description: 'Next-generation AMOLED HD display with military-grade titanium alloy casing. Features dynamic Bluetooth calling, 120+ sports tracking modes, 24/7 heart rate and SpO2 sensor, IP68 water resistance, and an incredible 7-day battery life.',
    features: [
      '1.96-inch AMOLED Vivid Always-On Display (1000 nits)',
      'Noise-free Bluetooth Calling with Dual Microphone',
      'IP68 Waterproof up to 30 meters',
      'Continuous Heart Rate, Blood Oxygen & Sleep Monitoring',
      '7 to 10 days battery endurance with magnetic fast charging'
    ],
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 28,
    isFeatured: true,
    isTrending: true,
    colors: ['Space Black', 'Silver Titanium', 'Midnight Blue'],
    tags: ['New Arrival', 'Best Seller', 'Official Warranty'],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'bvx-002',
    name: 'Bredvex SoundPulse ANC Wireless Earbuds',
    banglaName: 'সাউন্ডপালস নয়েজ ক্যানসেলিং ইয়ারবাডস',
    slug: 'soundpulse-anc-earbuds',
    price: 2190,
    originalPrice: 2950,
    rating: 4.8,
    reviewsCount: 94,
    category: 'gadgets',
    description: 'Immerse yourself in rich, studio-quality sound with 40dB Hybrid Active Noise Cancellation. Quad-mic ENC guarantees crystal clear voice calls even on busy Dhaka streets.',
    features: [
      '40dB Hybrid Active Noise Cancellation with Transparency Mode',
      '13mm Titanium Diaphragm Drivers for Deep Bass',
      'Low Latency 45ms Gaming Mode',
      'Up to 36 Hours Total Playback with USB-C Quick Charge',
      'Ergonomic featherlight fit with IPX5 sweat resistance'
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    isFeatured: true,
    isTrending: true,
    colors: ['Matte Black', 'Arctic White'],
    tags: ['ANC', 'Deep Bass'],
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'bvx-003',
    name: 'Handcrafted Genuine Leather Bi-Fold Wallet',
    banglaName: 'প্রিমিয়াম জেনুইন লেদার মানিব্যাগ',
    slug: 'genuine-leather-bifold-wallet',
    price: 1250,
    originalPrice: 1750,
    rating: 4.9,
    reviewsCount: 210,
    category: 'accessories',
    description: 'Expertly crafted from 100% full-grain Bangladeshi cowhide leather. Built-in RFID blocking fabric prevents electronic pickpocketing. Designed for seamless everyday sophistication.',
    features: [
      '100% Authentic Full Grain Cowhide Leather',
      'Advanced RFID Blocking Anti-Theft Shielding',
      'Holds 10+ cards, currency notes & Bangladeshi NID comfortably',
      'Reinforced precision stitching with smooth wax finish',
      'Includes premium gift box packaging'
    ],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606503837905-2435f3dfd9a6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    isFeatured: false,
    isTrending: true,
    colors: ['Cognac Brown', 'Obsidian Black', 'Vintage Tan'],
    tags: ['Genuine Leather', 'RFID Protected'],
    createdAt: '2026-02-28T09:00:00Z'
  },
  {
    id: 'bvx-004',
    name: 'Bredvex CyberBlade RGB Mechanical Keyboard',
    banglaName: 'সাইবারব্লেড আরজিবি মেকানিক্যাল কিবোর্ড',
    slug: 'cyberblade-rgb-mechanical-keyboard',
    price: 3890,
    originalPrice: 5200,
    rating: 4.9,
    reviewsCount: 76,
    category: 'electronics',
    description: 'Compact 75% layout hot-swappable mechanical keyboard equipped with custom pre-lubed Red linear switches, south-facing RGB lighting, and multi-mode wireless connectivity (Bluetooth 5.3, 2.4G & Type-C).',
    features: [
      'Pre-lubed Smooth Linear Red Switches (Hot-Swappable 5-Pin PCB)',
      'Tri-Mode Wireless: Bluetooth 5.3 + 2.4GHz + Detachable Type-C',
      'PBT Double-shot Keycaps resistant to shine and oil',
      'Gasket Mount structure with multi-layer acoustic dampening foam',
      '4000mAh long-lasting rechargeable battery'
    ],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    isFeatured: true,
    isTrending: false,
    colors: ['Carbon Black & Teal', 'Chalk White & Gray'],
    tags: ['Hot-Swap', 'Wireless', 'Gasket Mount'],
    createdAt: '2026-02-25T14:30:00Z'
  },
  {
    id: 'bvx-005',
    name: 'Royal Heritage Heavy Cotton Eid Panjabi',
    banglaName: 'রয়্যাল হেরিটেজ কটন লাক্সারি পাঞ্জাবি',
    slug: 'royal-heritage-luxury-panjabi',
    price: 2450,
    originalPrice: 3200,
    rating: 4.8,
    reviewsCount: 165,
    category: 'fashion',
    description: 'Tailored from 100% mercerized breathable organic cotton with refined geometric thread embroidery on the collar and placket. Impeccable fit ensuring breathability in warm Bangladeshi weather.',
    features: [
      '100% Premium Combed Mercerized Cotton fabric',
      'Hand-finished intricate minimalist collar embroidery',
      'Mother-of-pearl accent metal snap buttons',
      'Two side slit functional deep pockets',
      'Colorfast and pre-shrunk fabric wash guarantee'
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    isFeatured: true,
    isTrending: true,
    colors: ['Jet Black', 'Pearl White', 'Olive Green', 'Deep Navy'],
    sizes: ['M (40)', 'L (42)', 'XL (44)', 'XXL (46)'],
    tags: ['Festival Special', '100% Cotton'],
    createdAt: '2026-03-03T16:00:00Z'
  },
  {
    id: 'bvx-006',
    name: 'Nordic Ultrasonic Aromatherapy Mist Diffuser',
    banglaName: 'নর্ডিক আল্ট্রাসনিক অ্যারোমা ডিফিউজার',
    slug: 'nordic-aroma-mist-diffuser',
    price: 1590,
    originalPrice: 2200,
    rating: 4.7,
    reviewsCount: 88,
    category: 'home',
    description: 'Transform your bedroom or workspace into a serene sanctuary. Features ultra-quiet 2.4MHz ultrasonic cool mist atomization, realistic flame LED ambient light, and waterless auto shut-off protection.',
    features: [
      'Realistic Warm Flame Effect with 7-Color LED ambiance',
      'Whisper-quiet operation (<24dB) ideal for restful sleep',
      'Automatic safety power-off when water reservoir is empty',
      'Compatible with all therapeutic essential oils',
      '300ml capacity providing up to 8 hours of continuous mist'
    ],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    isFeatured: false,
    isTrending: true,
    colors: ['Matte Black', 'Snow White', 'Dark Walnut'],
    tags: ['Aromatherapy', 'Quiet Mist'],
    createdAt: '2026-02-20T12:00:00Z'
  },
  {
    id: 'bvx-007',
    name: 'Bredvex AeroPro 65W GaN Fast Charger',
    banglaName: 'অ্যারোপ্রো ৬৫ ওয়াট ফাস্ট চার্জার',
    slug: 'aeropro-65w-gan-fast-charger',
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 142,
    category: 'gadgets',
    description: 'Cutting-edge Gallium Nitride (GaN III) technology delivers ultra-compact size with maximum 65W charging output. Fast-charge laptops, MacBooks, iPads, iPhones, and Android phones simultaneously.',
    features: [
      '65W Super Fast Power Delivery (PD 3.0 & QC 4+)',
      '3-in-1 Triple Port: 2x USB-C + 1x USB-A ports',
      '50% smaller than traditional bulky laptop bricks',
      'Intelligent ActiveShield 2.0 temperature & surge protection',
      'Charges iPhone 15/16 and Samsung S24 to 60% in 28 mins'
    ],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    isFeatured: false,
    isTrending: true,
    colors: ['Space Gray', 'Pure White'],
    tags: ['GaN III', 'PD 65W'],
    createdAt: '2026-02-18T10:00:00Z'
  },
  {
    id: 'bvx-008',
    name: 'All-Day Minimalist Heavyweight Oversized Hoodie',
    banglaName: 'মিনিমালিস্ট হেভিওয়েট ওভারসাইজড হুডি',
    slug: 'minimalist-heavyweight-oversized-hoodie',
    price: 1650,
    originalPrice: 2200,
    rating: 4.8,
    reviewsCount: 119,
    category: 'fashion',
    description: 'Constructed from premium 380 GSM fleece cotton with brushed interior for supreme warmth and coziness. Relaxed drop-shoulder silhouette tailored for contemporary urban aesthetics.',
    features: [
      '380 GSM Ultra-Soft Brushed Fleece Cotton',
      'Structured double-layered hood with hidden drawstring',
      'Deep kangaroo pocket with reinforced bartack seams',
      'Ribbed cuffs and hem that retain elasticity after wash',
      'Unisex modern oversized drop-shoulder cut'
    ],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 32,
    isFeatured: true,
    isTrending: false,
    colors: ['Charcoal Gray', 'Mocha Brown', 'Pitch Black', 'Forest Green'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    tags: ['Winter Drop', '380 GSM'],
    createdAt: '2026-02-15T08:00:00Z'
  },
  {
    id: 'bvx-009',
    name: 'Bredvex Apex 4K Ultra-Stream Webcam with Ring Light',
    banglaName: 'অ্যাপেক্স ৪কে স্ট্রিমিং ওয়েবক্যাম',
    slug: 'apex-4k-webcam-ringlight',
    price: 4200,
    originalPrice: 5800,
    rating: 4.7,
    reviewsCount: 52,
    category: 'electronics',
    description: 'High-definition 4K 60FPS video clarity for professionals, streamers, and remote workers. Features an integrated touch-controlled LED beauty ring light, auto-focus, and dual AI noise-canceling mics.',
    features: [
      'Sony STARVIS CMOS sensor with 4K UHD @ 30FPS / 1080P @ 60FPS',
      'Adjustable 3-level Color Temperature Touch Ring Light',
      'AI Smart Auto-Focus with Fast Facial Tracking',
      'Integrated Magnetic Privacy Shutter slide',
      'Plug-and-play USB 3.0 compatible with Mac & Windows'
    ],
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    isFeatured: false,
    isTrending: false,
    colors: ['Matte Black'],
    tags: ['4K UHD', 'Stream Ready'],
    createdAt: '2026-02-10T15:00:00Z'
  },
  {
    id: 'bvx-010',
    name: 'Organic Beard & Hair Growth Care Box',
    banglaName: 'অর্গানিক বিয়ার্ড ও হেয়ার কেয়ার কিট',
    slug: 'organic-beard-hair-growth-kit',
    price: 1150,
    originalPrice: 1600,
    rating: 4.9,
    reviewsCount: 95,
    category: 'lifestyle',
    description: 'Formulated with 100% natural cold-pressed Argan oil, Jojoba oil, Biotin, and Redensyl. Nourishes beard follicles, eliminates itchiness, and stimulates fuller, thicker beard growth.',
    features: [
      'Enriched with Moroccan Argan Oil, Sweet Almond & Rosemary',
      'Zero parabens, sulfates, silicones or harmful chemicals',
      'Includes 50ml beard growth oil, beard balm & sandalwood pocket comb',
      'Invigorating subtle cedarwood and bergamot aroma',
      'Clinically tested for sensitive skin'
    ],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    isFeatured: false,
    isTrending: true,
    tags: ['100% Organic', 'Men Grooming'],
    createdAt: '2026-02-08T11:00:00Z'
  },
  {
    id: 'bvx-011',
    name: 'Bredvex ThermoGuard Double-Wall Smart Flask',
    banglaName: 'থার্মোগার্ড স্মার্ট এলইডি ফ্লাস্ক',
    slug: 'thermoguard-double-wall-smart-flask',
    price: 890,
    originalPrice: 1350,
    rating: 4.8,
    reviewsCount: 180,
    category: 'home',
    description: 'Keep beverages piping hot for 12 hours or icy cold for 24 hours. Features a smart LCD touch temperature display on the waterproof lid, food-grade 304 stainless steel interior, and detachable tea infuser.',
    features: [
      'Touch LED temperature screen on the lid (no charging required)',
      'Vacuum insulated double-wall 304 food-grade Stainless Steel',
      'Keeps hot up to 12 hrs / Cold up to 24 hrs',
      '500ml capacity with 100% leak-proof silicone seal',
      'Includes stainless steel fine mesh tea/fruit strainer'
    ],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    isFeatured: false,
    isTrending: true,
    colors: ['Matte Black', 'Emerald Green', 'Pastel Pink', 'Steel Silver'],
    tags: ['Smart Flask', 'Hot & Cold'],
    createdAt: '2026-02-05T09:00:00Z'
  },
  {
    id: 'bvx-012',
    name: 'Aviator Vintage Polarized Sunglasses',
    banglaName: 'ভিন্টেজ পোলারাইজড সানগ্লাস',
    slug: 'aviator-vintage-polarized-sunglasses',
    price: 1350,
    originalPrice: 1950,
    rating: 4.9,
    reviewsCount: 112,
    category: 'accessories',
    description: 'Timeless tear-drop aviator frames sculpted from durable ultralight stainless alloy. TAC polarized lenses provide UV400 maximum protection against harsh tropical glare.',
    features: [
      'UV400 9-Layer TAC Polarized Anti-Glare Lenses',
      'Lightweight corrosion-resistant stainless metal frame',
      'Soft silicone nose pads ensuring comfort during long wear',
      'Spring hinges with flex-fit adaptation for any face shape',
      'Comes with hard protective leather case and microfiber cloth'
    ],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 27,
    isFeatured: false,
    isTrending: false,
    colors: ['Gold / Forest Green', 'Silver / Gradient Smoke', 'All Gunmetal Black'],
    tags: ['UV400', 'Polarized'],
    createdAt: '2026-02-01T12:00:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'BREDVEX',
  tagline: 'Modern Bangladeshi Lifestyle & Tech Store',
  logoUrl: '',
  contactPhone: '+880 1711-223344',
  contactEmail: 'support@bredvex.com',
  address: 'Level 4, Plot 18, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  announcementText: '🔥 EID MEGA DEAL: Free Delivery all over Bangladesh on orders over ৳2,500! Use Voucher "BREDVEX10" for 10% OFF.',
  showAnnouncement: true,
  bkashNumber: '01711223344',
  bkashType: 'Merchant',
  nagadNumber: '01822334455',
  nagadType: 'Merchant',
  rocketNumber: '01933445566',
  rocketType: 'Personal',
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeDeliveryThreshold: 2500,
  heroHeadline: 'Curated Elegance & Smart Lifestyle Gadgets',
  heroSubheadline: 'Shop original electronics, luxury apparel, and daily essentials across Bangladesh with lightning-fast delivery and verified bKash & Nagad payments.',
  heroBadge: '🇧🇩 BANGLADESH NO. 1 LIFESTYLE & TECH STORE',
  heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
  facebookUrl: 'https://facebook.com',
  whatsappNumber: '+8801711223344',
  adminLoginId: 'admin',
  adminPassword: '123456',
  staffLoginId: 'staff',
  staffPassword: 'staff123',
  courierSettings: {
    autoBookOnOrder: false, // Can be toggled on by admin
    defaultCourier: 'zone_smart',
    steadfastEnabled: true,
    steadfastApiKey: '',
    steadfastSecretKey: '',
    steadfastSandbox: true,
    pathaoEnabled: true,
    pathaoClientId: '',
    pathaoClientSecret: '',
    pathaoUsername: '',
    pathaoPassword: '',
    pathaoStoreId: '',
    pathaoSandbox: true,
  },
  flashSale: {
    enabled: true,
    title: '⚡ Weekend Mega Flash Sale',
    subtitle: 'Flat 15% - 40% OFF across premium electronics & accessories',
    endTime: new Date(Date.now() + 42 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
    discountLabel: 'UP TO 40% OFF'
  },
  smsSettings: {
    enabled: true,
    provider: 'simulation',
    apiKey: '',
    senderId: 'BREDVEX',
    autoSendOnOrder: true,
    autoSendOnCourier: true
  }
};

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'bvx-001',
    userName: 'Rahim Chowdhury',
    userLocation: 'Dhanmondi, Dhaka',
    rating: 5,
    comment: 'Alhamdulillah onk valo smart watch. Display smooth ebong battery backup 7 days easily jay. Packaging khub sundor chilo!',
    createdAt: '2026-03-01T14:20:00Z',
    verifiedBuyer: true
  },
  {
    id: 'rev-2',
    productId: 'bvx-001',
    userName: 'Sharmin Akter',
    userLocation: 'Nasirabad, Chattogram',
    rating: 5,
    comment: 'AMOLED display ta oshadharon. Calling quality o besh clear. Fast delivery peyechi via Pathao Courier.',
    createdAt: '2026-03-02T10:15:00Z',
    verifiedBuyer: true
  },
  {
    id: 'rev-3',
    productId: 'bvx-002',
    userName: 'Tanvir Ahmed',
    userLocation: 'Sylhet Sadar',
    rating: 5,
    comment: 'ANC performance onk valo. Bass deep and punchy. Steadfast delivery khub fast chilo!',
    createdAt: '2026-03-03T16:45:00Z',
    verifiedBuyer: true
  },
  {
    id: 'rev-4',
    productId: 'bvx-003',
    userName: 'Saiful Islam',
    userLocation: 'Uttara, Dhaka',
    rating: 5,
    comment: 'Original cowhide leather er smell ta darun. Finishing ebong RFID protection perfect.',
    createdAt: '2026-03-04T11:30:00Z',
    verifiedBuyer: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BVX-7824',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Space Black'
      },
      {
        product: INITIAL_PRODUCTS[6],
        quantity: 1,
        selectedColor: 'Space Gray'
      }
    ],
    subtotal: 5300,
    shippingCost: 0,
    discountAmount: 530,
    couponCode: 'BREDVEX10',
    grandTotal: 4770,
    customerInfo: {
      name: 'Tanvir Hossain',
      phone: '01712987654',
      email: 'tanvir.dev@gmail.com',
      address: 'Apartment 5B, House 24, Road 7, Dhanmondi',
      city: 'Dhaka',
      district: 'Dhaka',
      zone: 'inside_dhaka',
      deliveryNotes: 'Please call before delivery'
    },
    paymentMethod: 'bkash',
    paymentStatus: 'verified',
    transactionId: '9K8J7H6G5F',
    paymentSenderNumber: '01712987654',
    status: 'shipped',
    trackingCourier: 'Steadfast Courier',
    trackingNumber: 'SF-992014',
    createdAt: '2026-03-04T10:15:00Z',
    updatedAt: '2026-03-04T14:30:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'BVX-7825',
    items: [
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 2,
        selectedColor: 'Jet Black',
        selectedSize: 'L (42)'
      }
    ],
    subtotal: 4900,
    shippingCost: 120,
    discountAmount: 0,
    grandTotal: 5020,
    customerInfo: {
      name: 'Nusrat Jahan',
      phone: '01819554433',
      email: 'nusrat.ctg@yahoo.com',
      address: 'Holding 82, GEC Circle, Nasirabad',
      city: 'Chittagong',
      district: 'Chattogram',
      zone: 'outside_dhaka',
      deliveryNotes: 'Deliver between 10am to 5pm'
    },
    paymentMethod: 'nagad',
    paymentStatus: 'verified',
    transactionId: 'NAG8371928',
    paymentSenderNumber: '01819554433',
    status: 'processing',
    trackingCourier: 'Pathao Courier',
    trackingNumber: 'PT-881290',
    createdAt: '2026-03-04T18:40:00Z',
    updatedAt: '2026-03-05T09:10:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'BVX-7826',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedColor: 'Cognac Brown'
      }
    ],
    subtotal: 1250,
    shippingCost: 60,
    discountAmount: 0,
    grandTotal: 1310,
    customerInfo: {
      name: 'Mohammad Farhan',
      phone: '01911882233',
      email: 'farhan.m@outlook.com',
      address: 'Plot 14, Sector 11, Uttara',
      city: 'Dhaka',
      district: 'Dhaka',
      zone: 'inside_dhaka'
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'pending',
    createdAt: '2026-03-05T08:20:00Z',
    updatedAt: '2026-03-05T08:20:00Z'
  }
];

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Comilla', 'Bogura', 'Kushtia', 'Jessore', 'Cox\'s Bazar', 'Noakhali',
  'Feni', 'Brahmanbaria', 'Tangail', 'Faridpur', 'Pabna', 'Dinajpur', 'Jamalpur'
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-101',
    code: 'BREDVEX10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    usageLimit: 500,
    timesUsed: 42,
    isActive: true,
    description: '10% Discount on all orders above ৳500 (Max ৳500 off)',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'cpn-102',
    code: 'EID2026',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscountAmount: 1000,
    usageLimit: 200,
    timesUsed: 67,
    isActive: true,
    description: 'Eid Celebration Special! 15% discount for orders above ৳1,000',
    createdAt: '2026-03-02T00:00:00Z'
  },
  {
    id: 'cpn-103',
    code: 'FIRSTBUY',
    discountType: 'percentage',
    discountValue: 5,
    minOrderAmount: 300,
    usageLimit: 1000,
    timesUsed: 89,
    isActive: true,
    description: 'Welcome reward for first-time buyers! 5% off',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'cpn-104',
    code: 'FLAT200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1500,
    usageLimit: 150,
    timesUsed: 23,
    isActive: true,
    description: 'Flat ৳200 discount on cart value over ৳1,500',
    createdAt: '2026-03-03T00:00:00Z'
  }
];

