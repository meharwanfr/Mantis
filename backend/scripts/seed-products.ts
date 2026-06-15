import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SECRET_API_KEY = process.env.SUPABASE_SECRET_API_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_API_KEY);

const products = [
  {
    id: 'xiaomi-scooter-4-pro',
    title: 'Xiaomi Mi Electric Scooter 4 Pro',
    description: 'The Xiaomi Mi Electric Scooter 4 Pro features a 700W motor, 45km range, 10-inch tubeless tires, and foldable design. Includes smart BMS battery management, regenerative braking, and companion app connectivity for speed modes, locking, and firmware updates.',
    tags: ['scooter', 'electric', 'xiaomi', 'personal-transport', 'battery-powered'],
    status: 'Processed',
  },
  {
    id: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with Sony\'s Integrated Processor V1. Features 30-hour battery life, crystal-clear hands-free calling, Adaptive Sound Control, and multipoint connection. Lightweight design at 250g with soft-fit leather headband.',
    tags: ['headphones', 'audio', 'sony', 'noise-cancelling', 'wireless', 'bluetooth'],
    status: 'Processed',
  },
  {
    id: 'canon-eos-r50',
    title: 'Canon EOS R50 Mirrorless Camera',
    description: 'Compact mirrorless camera with 24.2MP APS-C CMOS sensor, DIGIC X processor, and 4K video recording. Features Dual Pixel CMOS AF II, 15fps continuous shooting, vari-angle touchscreen, and advanced subject detection for people, animals, and vehicles.',
    tags: ['camera', 'canon', 'mirrorless', 'photography', '4k-video'],
    status: 'Processed',
  },
  {
    id: 'dyson-v15-detect',
    title: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Powerful cordless vacuum with laser slim crevice tool that reveals microscopic dust. Features Piezo sensor that counts and displays particles, Auto-Ramping suction, Hyperdymium motor, up to 60 minutes runtime, and LCD screen showing real-time performance data.',
    tags: ['vacuum', 'dyson', 'cordless', 'home-appliance', 'cleaning'],
    status: 'Processed',
  },
  {
    id: 'apple-airpods-pro-2',
    title: 'Apple AirPods Pro (2nd Generation)',
    description: 'Adaptive Audio automatically adjusts noise control. Features Active Noise Cancellation, Transparency mode, Personalized Spatial Audio with dynamic head tracking, touch volume control, and up to 6 hours of listening time with a single charge.',
    tags: ['earbuds', 'apple', 'audio', 'wireless', 'noise-cancelling'],
    status: 'Processed',
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Premium smartphone with Snapdragon 8 Gen 3 processor, 12GB RAM, 200MP camera system with 100x Space Zoom, built-in S Pen, 5000mAh battery, and Galaxy AI features including Live Translate, Chat Assist, and Circle to Search.',
    tags: ['smartphone', 'samsung', 'android', 'mobile', 'galaxy-ai'],
    status: 'Processed',
  },
  {
    id: 'macbook-pro-m3-max',
    title: 'Apple MacBook Pro 16" M3 Max',
    description: 'Powerful laptop with M3 Max chip featuring up to 16-core CPU, 40-core GPU, up to 128GB unified memory, 22-hour battery life, stunning 16.2-inch Liquid Retina XDR display, and advanced thermal management system.',
    tags: ['laptop', 'apple', 'macbook', 'professional', 'm3-max'],
    status: 'Processed',
  },
  {
    id: 'bose-quietcomfort-ultra',
    title: 'Bose QuietComfort Ultra Headphones',
    description: 'Immersive audio with Bose Immersive Audio and CustomTune technology that automatically calibrates sound to your ears. Features world-class noise cancellation, 24-hour battery life, comfortable design with luxurious materials, and SimpleSync connectivity.',
    tags: ['headphones', 'bose', 'audio', 'noise-cancelling', 'wireless'],
    status: 'Processed',
  },
  {
    id: 'lg-oled-c4-65',
    title: 'LG OLED C4 65" 4K Smart TV',
    description: 'Self-lit OLED display with α9 AI Processor Gen7, perfect blacks, 100% color volume, Dolby Vision, Dolby Atmos, 120Hz refresh rate, NVIDIA G-SYNC compatible, and webOS smart platform with built-in streaming apps.',
    tags: ['tv', 'lg', 'oled', '4k', 'home-entertainment'],
    status: 'Processed',
  },
  {
    id: 'roomba-j9-plus',
    title: 'iRobot Roomba j9+ Robot Vacuum',
    description: 'Self-emptying robot vacuum with PrecisionVision navigation, P.O.O.P. guarantee to avoid pet waste, 80-day capacity self-emptying base, 4-stage cleaning system, automatic carpet boost, and smart mapping with room-specific cleaning preferences.',
    tags: ['vacuum', 'irobot', 'robot', 'smart-home', 'cleaning'],
    status: 'Processed',
  },
  {
    id: 'nintendo-switch-oled',
    title: 'Nintendo Switch OLED Model',
    description: '7-inch OLED screen with vivid colors and high contrast, wide adjustable stand, enhanced audio, 64GB internal storage, dock with wired LAN port, and support for all Joy-Con controllers and Nintendo Switch software.',
    tags: ['gaming', 'nintendo', 'switch', 'portable', 'console'],
    status: 'Processed',
  },
  {
    id: 'go-pro-hero-12-black',
    title: 'GoPro HERO12 Black',
    description: '5.3K video at 60fps, 27MP photos, HyperSmooth 6.0 stabilization with 360-degree horizon lock, HDR photo and video, waterproof to 33ft, Wi-Fi 6, Bluetooth 5.2, and dual 1.4-inch screens for easy framing.',
    tags: ['camera', 'gopro', 'action-camera', '5k-video', 'waterproof'],
    status: 'Processed',
  },
  {
    id: 'nest-learning-thermostat-4',
    title: 'Google Nest Learning Thermostat (4th Gen)',
    description: 'Smart thermostat that learns your schedule and programs itself. Features Nest Renew with clean energy features, borderless display with Farsight, auto-schedule, remote control via Google Home app, energy-saving reports, and compatibility with most HVAC systems.',
    tags: ['thermostat', 'google', 'smart-home', 'energy', 'hvac'],
    status: 'Processed',
  },
  {
    id: 'dji-mini-4-pro',
    title: 'DJI Mini 4 Pro Drone',
    description: 'Ultra-light foldable drone under 249g with 4K/100fps video, 48MP photo, omnidirectional obstacle sensing, ActiveTrack 360, true vertical shooting, O4 FHD video transmission up to 20km, and 34-minute max flight time.',
    tags: ['drone', 'dji', 'camera', 'aerial', '4k-video'],
    status: 'Processed',
  },
  {
    id: 'kindle-paperwhite-signature',
    title: 'Amazon Kindle Paperwhite Signature Edition',
    description: '6.8-inch display with 300ppi, auto-adjusting warm light, wireless charging, 32GB storage, waterproof (IPX8), USB-C, and weeks-long battery life. The worlds best-selling e-reader with glare-free display that reads like real paper.',
    tags: ['ereader', 'amazon', 'kindle', 'reading', 'waterproof'],
    status: 'Processed',
  },
];

async function seed() {
  console.log('Seeding products...');
  for (const product of products) {
    const { error } = await supabase.from('products').upsert(product, { onConflict: 'id' });
    if (error) {
      console.error(`Failed to seed ${product.id}: ${error.message}`);
    } else {
      console.log(`✓ ${product.title}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
