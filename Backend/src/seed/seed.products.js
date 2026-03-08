/**
 * ─────────────────────────────────────────────────────────────────
 *  ECOMM — Product Seed Script
 *  Place this file in your Backend/ folder and run:
 *
 *    node seed.products.js
 *
 *  Requires: MONGODB_URL in your .env file
 *  Inserts 60 products across 8 categories directly into MongoDB.
 *  Skips products that already exist (by name). Safe to re-run.
 * ─────────────────────────────────────────────────────────────────
 */

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

// ── Minimal inline schema (matches your product.model.js exactly) ─
const ProductModel = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      name:        { type: String, required: true, unique: true },
      description: { type: String, required: true, lowercase: true },
      price:       { type: Number, required: true },
      salePrice:   { type: Number, required: true },
      images: [{
        url:       { type: String, required: true },
        asset_id:  { type: String, required: true },
        public_id: { type: String, required: true },
        _id: false,
      }],
      category:       { type: String, required: true },
      brand:          { type: String, required: true },
      stock:          { type: Number, required: true, default: 50 },
      averageReviews: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
  )
);

// ── Helper: fake cloudinary fields so schema validates ────────────
let _c = 0;
const img = (url) => ({
  url,
  asset_id:  `seed_asset_${++_c}`,
  public_id: `products/seed_${_c}`,
});

// ── 60 Products across 8 categories ──────────────────────────────
const PRODUCTS = [

  // ═══════════════════════════════════
  //  CATEGORY: vegetables
  // ═══════════════════════════════════
  {
    name: "Fresh Spinach 250g", category: "vegetables", brand: "FarmFresh",
    price: 40, salePrice: 30, stock: 80, averageReviews: 4.3,
    description: "tender baby spinach leaves, freshly harvested and washed. rich in iron and vitamins.",
    images: [img("https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80")],
  },
  {
    name: "Red Tomatoes 1kg", category: "vegetables", brand: "FarmFresh",
    price: 60, salePrice: 45, stock: 120, averageReviews: 4.5,
    description: "juicy ripe red tomatoes. perfect for curries, salads, and sauces. locally sourced.",
    images: [img("https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&q=80")],
  },
  {
    name: "Fresh Carrots 1kg", category: "vegetables", brand: "OrganicGreens",
    price: 50, salePrice: 38, stock: 150, averageReviews: 4.4,
    description: "crunchy orange carrots, freshly harvested. high in beta carotene and dietary fiber.",
    images: [img("https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80")],
  },
  {
    name: "Green Bell Pepper 500g", category: "vegetables", brand: "FarmFresh",
    price: 70, salePrice: 55, stock: 90, averageReviews: 4.1,
    description: "crisp fresh green capsicum. low in calories, rich in vitamin c. great for stir fries.",
    images: [img("https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80")],
  },
  {
    name: "Sweet Corn 2 Pack", category: "vegetables", brand: "FarmFresh",
    price: 50, salePrice: 40, stock: 100, averageReviews: 4.2,
    description: "tender sweet corn cobs, freshly picked. perfect for grilling, boiling, or salads.",
    images: [img("https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80")],
  },
  {
    name: "Fuji Apples 6 Pack", category: "vegetables", brand: "FreshWorld",
    price: 180, salePrice: 149, stock: 60, averageReviews: 4.7,
    description: "sweet and crunchy fuji apples, imported. naturally sweet with a crisp texture.",
    images: [img("https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80")],
  },
  {
    name: "Yellow Bananas Dozen", category: "vegetables", brand: "TropicFarm",
    price: 60, salePrice: 50, stock: 200, averageReviews: 4.6,
    description: "fresh ripe bananas, naturally sweet. great for smoothies, snacks, and desserts.",
    images: [img("https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80")],
  },
  {
    name: "Watermelon 2-3kg", category: "vegetables", brand: "TropicFarm",
    price: 120, salePrice: 89, stock: 40, averageReviews: 4.8,
    description: "sweet juicy watermelon, perfect summer fruit. seedless variety, hand picked.",
    images: [img("https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: dairy
  // ═══════════════════════════════════
  {
    name: "Amul Butter 500g", category: "dairy", brand: "Amul",
    price: 260, salePrice: 245, stock: 150, averageReviews: 4.8,
    description: "rich and creamy pasteurised butter made from fresh cream. perfect for cooking and spreading.",
    images: [img("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80")],
  },
  {
    name: "Mother Dairy Full Cream Milk 1L", category: "dairy", brand: "Mother Dairy",
    price: 68, salePrice: 68, stock: 300, averageReviews: 4.5,
    description: "fresh full cream standardised milk, rich in calcium and protein. pasteurised for safety.",
    images: [img("https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80")],
  },
  {
    name: "Amul Dahi 400g", category: "dairy", brand: "Amul",
    price: 55, salePrice: 50, stock: 200, averageReviews: 4.6,
    description: "thick and creamy curd set fresh daily. made from full cream milk with live cultures.",
    images: [img("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80")],
  },
  {
    name: "Farm Fresh Eggs 12 Pack", category: "dairy", brand: "Country Eggs",
    price: 95, salePrice: 85, stock: 250, averageReviews: 4.7,
    description: "fresh brown eggs from free-range hens. rich in protein and omega-3 fatty acids.",
    images: [img("https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80")],
  },
  {
    name: "Amul Processed Cheese Slices 200g", category: "dairy", brand: "Amul",
    price: 120, salePrice: 105, stock: 120, averageReviews: 4.5,
    description: "creamy processed cheese slices, perfect for sandwiches, burgers, and snacks.",
    images: [img("https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80")],
  },
  {
    name: "Britannia Brown Bread 400g", category: "dairy", brand: "Britannia",
    price: 45, salePrice: 40, stock: 180, averageReviews: 4.3,
    description: "soft and wholesome brown bread made with whole wheat flour. no artificial colours.",
    images: [img("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80")],
  },
  {
    name: "Kellogg's Corn Flakes 500g", category: "dairy", brand: "Kelloggs",
    price: 220, salePrice: 195, stock: 80, averageReviews: 4.2,
    description: "crispy corn flakes fortified with vitamins and minerals. a wholesome breakfast.",
    images: [img("https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=400&q=80")],
  },
  {
    name: "Nestle Yogurt Strawberry 80g", category: "dairy", brand: "Nestle",
    price: 30, salePrice: 25, stock: 300, averageReviews: 4.4,
    description: "smooth and creamy strawberry yogurt with real fruit bits. a delicious healthy snack.",
    images: [img("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: munchies
  // ═══════════════════════════════════
  {
    name: "Lay's Classic Salted 80g", category: "munchies", brand: "Lays",
    price: 30, salePrice: 28, stock: 500, averageReviews: 4.4,
    description: "thin and crispy potato chips with a perfect hint of salt. the original since 1932.",
    images: [img("https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80")],
  },
  {
    name: "Haldiram's Aloo Bhujia 400g", category: "munchies", brand: "Haldirams",
    price: 130, salePrice: 110, stock: 300, averageReviews: 4.6,
    description: "authentic rajasthani aloo bhujia, crispy and spicy. the perfect tea-time snack.",
    images: [img("https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80")],
  },
  {
    name: "Pringles Original 107g", category: "munchies", brand: "Pringles",
    price: 190, salePrice: 165, stock: 200, averageReviews: 4.6,
    description: "perfectly seasoned potato crisps in the iconic can. once you pop you can't stop.",
    images: [img("https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80")],
  },
  {
    name: "Oreo Original Biscuits 300g", category: "munchies", brand: "Oreo",
    price: 120, salePrice: 99, stock: 350, averageReviews: 4.8,
    description: "classic chocolate sandwich biscuits with a rich cream filling. twist, lick, dunk!",
    images: [img("https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=80")],
  },
  {
    name: "Cadbury Dairy Milk 40g", category: "munchies", brand: "Cadbury",
    price: 40, salePrice: 40, stock: 500, averageReviews: 4.9,
    description: "smooth and creamy milk chocolate with the finest cocoa. the original since 1905.",
    images: [img("https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80")],
  },
  {
    name: "Parle-G Biscuits 800g", category: "munchies", brand: "Parle",
    price: 80, salePrice: 70, stock: 600, averageReviews: 4.7,
    description: "india's most loved glucose biscuits. crispy, light and delicious with tea or milk.",
    images: [img("https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80")],
  },
  {
    name: "Maggi Nutri-Licious Pazzta 75g", category: "munchies", brand: "Maggi",
    price: 25, salePrice: 20, stock: 400, averageReviews: 4.1,
    description: "wheat pasta snack with a tangy masala flavour. baked not fried for a healthier bite.",
    images: [img("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80")],
  },
  {
    name: "Kit Kat 4 Finger 41.5g", category: "munchies", brand: "Nestle",
    price: 50, salePrice: 45, stock: 450, averageReviews: 4.7,
    description: "crispy wafer fingers covered in smooth milk chocolate. have a break, have a kit kat.",
    images: [img("https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: drinks
  // ═══════════════════════════════════
  {
    name: "Coca-Cola 1.25L", category: "drinks", brand: "Coca-Cola",
    price: 80, salePrice: 70, stock: 400, averageReviews: 4.5,
    description: "the world's favourite cola drink. ice-cold refreshment with the original cola taste.",
    images: [img("https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80")],
  },
  {
    name: "Tropicana Orange Juice 1L", category: "drinks", brand: "Tropicana",
    price: 130, salePrice: 110, stock: 200, averageReviews: 4.4,
    description: "100% pure squeezed orange juice with no added sugar or preservatives.",
    images: [img("https://images.unsplash.com/photo-1534353473418-4cfa0d1f5514?w=400&q=80")],
  },
  {
    name: "Red Bull Energy Drink 250ml", category: "drinks", brand: "Red Bull",
    price: 125, salePrice: 110, stock: 300, averageReviews: 4.3,
    description: "energy drink with caffeine, taurine, and b-vitamins. gives you wings.",
    images: [img("https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80")],
  },
  {
    name: "Sprite Lemon Lime 2L", category: "drinks", brand: "Sprite",
    price: 90, salePrice: 75, stock: 350, averageReviews: 4.4,
    description: "crisp, clear, refreshing lemon-lime flavoured drink with zero caffeine.",
    images: [img("https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80")],
  },
  {
    name: "Paperboat Aamras 200ml", category: "drinks", brand: "Paperboat",
    price: 30, salePrice: 25, stock: 500, averageReviews: 4.7,
    description: "thick authentic aamras made from real alphonso mangoes. traditional taste.",
    images: [img("https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80")],
  },
  {
    name: "Bisleri Mineral Water 1L", category: "drinks", brand: "Bisleri",
    price: 20, salePrice: 20, stock: 1000, averageReviews: 4.2,
    description: "pure, safe and refreshing mineral water from natural underground sources.",
    images: [img("https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80")],
  },
  {
    name: "Minute Maid Pulpy Orange 1L", category: "drinks", brand: "Minute Maid",
    price: 110, salePrice: 90, stock: 220, averageReviews: 4.3,
    description: "refreshing orange drink with real orange pulp and bursting orange flavour.",
    images: [img("https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80")],
  },
  {
    name: "Monster Energy 473ml", category: "drinks", brand: "Monster",
    price: 150, salePrice: 130, stock: 250, averageReviews: 4.4,
    description: "powerful energy drink with 160mg caffeine. unleash the beast.",
    images: [img("https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: instant
  // ═══════════════════════════════════
  {
    name: "Maggi 2-Minute Noodles 12 Pack", category: "instant", brand: "Maggi",
    price: 180, salePrice: 156, stock: 400, averageReviews: 4.7,
    description: "india's most loved instant noodles with the iconic masala tastemaker. ready in 2 minutes.",
    images: [img("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80")],
  },
  {
    name: "Yippee Magic Masala Noodles 4 Pack", category: "instant", brand: "Yippee",
    price: 60, salePrice: 52, stock: 350, averageReviews: 4.4,
    description: "long and smooth noodles with a tangy masala flavour. non-sticky texture.",
    images: [img("https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80")],
  },
  {
    name: "MTR Dal Makhani Ready to Eat 300g", category: "instant", brand: "MTR",
    price: 115, salePrice: 99, stock: 200, averageReviews: 4.3,
    description: "restaurant-style creamy dal makhani. ready in 3 minutes. no preservatives.",
    images: [img("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80")],
  },
  {
    name: "Nissin Cup Noodles Chicken 70g", category: "instant", brand: "Nissin",
    price: 35, salePrice: 30, stock: 600, averageReviews: 4.2,
    description: "quick-cook cup noodles with rich chicken flavour soup. ready in 3 minutes.",
    images: [img("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80")],
  },
  {
    name: "Knorr Tomato Soup 500g", category: "instant", brand: "Knorr",
    price: 185, salePrice: 160, stock: 150, averageReviews: 4.5,
    description: "rich and tangy tomato soup mix. just add water and milk for a comforting bowl.",
    images: [img("https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80")],
  },
  {
    name: "Haldiram's Gulab Jamun 500g", category: "instant", brand: "Haldirams",
    price: 145, salePrice: 125, stock: 180, averageReviews: 4.6,
    description: "soft and spongy gulab jamun soaked in rose-flavoured sugar syrup. ready to serve.",
    images: [img("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80")],
  },
  {
    name: "Sunfeast Pasta Treat 70g", category: "instant", brand: "Sunfeast",
    price: 25, salePrice: 20, stock: 400, averageReviews: 4.0,
    description: "durum wheat pasta with a rich tomato and herb seasoning. ready in 10 minutes.",
    images: [img("https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: tea
  // ═══════════════════════════════════
  {
    name: "Tata Tea Gold 500g", category: "tea", brand: "Tata Tea",
    price: 260, salePrice: 235, stock: 200, averageReviews: 4.6,
    description: "premium blend of assam and darjeeling teas. strong, aromatic with a golden colour.",
    images: [img("https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80")],
  },
  {
    name: "Nescafe Classic Coffee 100g", category: "tea", brand: "Nescafe",
    price: 280, salePrice: 250, stock: 180, averageReviews: 4.5,
    description: "rich smooth instant coffee made from 100% pure roasted arabica beans.",
    images: [img("https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80")],
  },
  {
    name: "Lipton Green Tea 25 Bags", category: "tea", brand: "Lipton",
    price: 160, salePrice: 140, stock: 250, averageReviews: 4.4,
    description: "refreshing green tea with a natural light flavour. rich in antioxidants.",
    images: [img("https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&q=80")],
  },
  {
    name: "Bru Instant Coffee 200g", category: "tea", brand: "Bru",
    price: 230, salePrice: 210, stock: 160, averageReviews: 4.3,
    description: "smooth, rich and aromatic instant coffee blend. perfect for filter coffee lovers.",
    images: [img("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80")],
  },
  {
    name: "Tetley Black Tea 100 Bags", category: "tea", brand: "Tetley",
    price: 340, salePrice: 299, stock: 140, averageReviews: 4.4,
    description: "full-bodied classic black tea from the finest estates. perfect morning brew.",
    images: [img("https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80")],
  },
  {
    name: "Sleepy Owl Cold Brew Coffee 270ml", category: "tea", brand: "Sleepy Owl",
    price: 180, salePrice: 155, stock: 120, averageReviews: 4.7,
    description: "smooth low-acidity cold brew coffee. steeped for 12 hours. ready to drink.",
    images: [img("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80")],
  },
  {
    name: "Wagh Bakri Premium Tea 500g", category: "tea", brand: "Wagh Bakri",
    price: 245, salePrice: 220, stock: 190, averageReviews: 4.6,
    description: "premium quality tea leaves from the finest gardens of assam. strong and flavorful.",
    images: [img("https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: cleaning
  // ═══════════════════════════════════
  {
    name: "Vim Dishwash Liquid 750ml", category: "cleaning", brand: "Vim",
    price: 130, salePrice: 110, stock: 300, averageReviews: 4.5,
    description: "powerful dishwash liquid with lemon extracts. cuts through tough grease and grime.",
    images: [img("https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80")],
  },
  {
    name: "Ariel Matic Powder 2kg", category: "cleaning", brand: "Ariel",
    price: 430, salePrice: 375, stock: 200, averageReviews: 4.6,
    description: "advanced laundry detergent for front and top load washing machines. removes 25 stains.",
    images: [img("https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80")],
  },
  {
    name: "Harpic Power Plus Toilet Cleaner 500ml", category: "cleaning", brand: "Harpic",
    price: 130, salePrice: 112, stock: 250, averageReviews: 4.4,
    description: "powerful toilet cleaning liquid. kills 99.9% germs and removes tough limescale.",
    images: [img("https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80")],
  },
  {
    name: "Lizol Surface Disinfectant 1L", category: "cleaning", brand: "Lizol",
    price: 200, salePrice: 175, stock: 220, averageReviews: 4.5,
    description: "surface disinfectant floor cleaner. kills 99.9% germs and leaves a fresh fragrance.",
    images: [img("https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=400&q=80")],
  },
  {
    name: "Surf Excel Easy Wash 1kg", category: "cleaning", brand: "Surf Excel",
    price: 195, salePrice: 170, stock: 280, averageReviews: 4.4,
    description: "detergent powder with quick dissolving formula for superior stain removal.",
    images: [img("https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80")],
  },
  {
    name: "Colin Glass Cleaner Spray 500ml", category: "cleaning", brand: "Colin",
    price: 160, salePrice: 135, stock: 180, averageReviews: 4.3,
    description: "streak-free glass cleaner. perfect for windows, mirrors, and glass surfaces.",
    images: [img("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80")],
  },

  // ═══════════════════════════════════
  //  CATEGORY: personal
  // ═══════════════════════════════════
  {
    name: "Dove Body Wash 500ml", category: "personal", brand: "Dove",
    price: 340, salePrice: 299, stock: 200, averageReviews: 4.7,
    description: "deeply moisturising body wash with 1/4 moisturising cream. leaves skin soft and smooth.",
    images: [img("https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80")],
  },
  {
    name: "Pantene Pro-V Shampoo 340ml", category: "personal", brand: "Pantene",
    price: 320, salePrice: 280, stock: 180, averageReviews: 4.5,
    description: "pro-vitamin enriched shampoo for smooth, strong, and shiny hair.",
    images: [img("https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80")],
  },
  {
    name: "Colgate MaxFresh Toothpaste 150g", category: "personal", brand: "Colgate",
    price: 120, salePrice: 99, stock: 400, averageReviews: 4.6,
    description: "cooling crystals toothpaste with peppermint flavour for long-lasting fresh breath.",
    images: [img("https://images.unsplash.com/photo-1559589688-6ba6beafe1e7?w=400&q=80")],
  },
  {
    name: "Nivea Men Face Wash 100ml", category: "personal", brand: "Nivea",
    price: 190, salePrice: 165, stock: 220, averageReviews: 4.4,
    description: "deep cleaning face wash for men. removes excess oil, dirt and impurities effectively.",
    images: [img("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80")],
  },
  {
    name: "Gillette Mach3 Razor", category: "personal", brand: "Gillette",
    price: 250, salePrice: 220, stock: 300, averageReviews: 4.6,
    description: "3-blade razor with lubrastrip for a close, comfortable shave. ergonomic handle.",
    images: [img("https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&q=80")],
  },
  {
    name: "Himalaya Neem Face Wash 200ml", category: "personal", brand: "Himalaya",
    price: 175, salePrice: 150, stock: 280, averageReviews: 4.5,
    description: "purifying neem face wash with turmeric. controls acne and removes excess oil.",
    images: [img("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80")],
  },
  {
    name: "Pears Pure Gentle Soap 125g", category: "personal", brand: "Pears",
    price: 60, salePrice: 52, stock: 500, averageReviews: 4.5,
    description: "transparent glycerine soap with natural oils. gentle on skin, dermatologically tested.",
    images: [img("https://images.unsplash.com/photo-1602532305019-3dbbd482dae9?w=400&q=80")],
  },
];

// ── Run seed ──────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URL;
  console.log(uri)
  if (!uri) {
    console.error("❌  MONGODB_URL not found in .env");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("✅  Connected\n");

  let inserted = 0;
  let skipped  = 0;

  for (const product of PRODUCTS) {
    const exists = await ProductModel.findOne({ name: product.name });
    if (exists) {
      console.log(`  ⏭   Skip  : ${product.name}`);
      skipped++;
    } else {
      await ProductModel.create(product);
      console.log(`  ✅  Added : ${product.name}`);
      inserted++;
    }
  }

  const total = await ProductModel.countDocuments();
  console.log(`\n🎉  Done — ${inserted} inserted, ${skipped} skipped.`);
  console.log(`📦  Total products in DB: ${total}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});