export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  rating: number;
  reviewCount: number;
  category: string;
  slug: string;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  specifications: { [key: string]: string };
  features: string[];
  tags: string[];
  options: Array<{
    id: string;
    name: string;
    variants: Array<{
      id: string;
      name: string;
      value: string;
      price?: number;
      inStock: boolean;
    }>;
  }>;
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Premium Organic Snacks',
    description: `Our premium organic snacks collection features the finest quality ingredients sourced from certified organic farms. Perfect for healthy snacking, outdoor adventures, or sharing with family and friends.

This nutritious collection includes:
• Organic nuts and seeds for protein and healthy fats
• Organic dried fruits for natural sweetness
• No artificial preservatives or additives
• Gluten-free and vegan-friendly options
• Carefully selected for maximum freshness and flavor

Sourced from certified organic farms and packaged in our Falls Church facility to ensure maximum freshness. Each batch is carefully inspected for quality and taste.

Perfect for:
- Outdoor adventures and hiking
- Office snacking
- Pre/post workout fuel
- Adding to yogurt or oatmeal
- Sharing with family and friends`,
    price: 12.99,
    originalPrice: 15.99,
    images: [
      {
        id: '1',
        url: '/Snacks.jpg',
        alt: 'Premium Organic Snacks - Main View'
      },
      {
        id: '2',
        url: '/Snacks02.jpg',
        alt: 'Premium Organic Snacks - Variety'
      }
    ],
    rating: 4.8,
    reviewCount: 127,
    category: 'Snacks',
    slug: 'premium-organic-snacks',
    badge: 'Best Seller',
    inStock: true,
    stockCount: 25,
    specifications: {
      'Weight': '8 oz (227g)',
      'Ingredients': 'Organic nuts, seeds, dried fruits',
      'Shelf Life': '12 months',
      'Storage': 'Cool, dry place',
      'Certifications': 'USDA Organic, Non-GMO'
    },
    features: [
      '100% Organic ingredients',
      'No artificial preservatives',
      'Gluten-free',
      'Vegan-friendly',
      'High in protein and fiber'
    ],
    tags: ['organic', 'healthy', 'snacks', 'nuts', 'dried-fruit'],
    options: [
      {
        id: 'size',
        name: 'Size',
        variants: [
          { id: 'small', name: 'Small', value: '4 oz', inStock: true },
          { id: 'medium', name: 'Medium', value: '8 oz', inStock: true },
          { id: 'large', name: 'Large', value: '16 oz', price: 22.99, inStock: true }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Elegant Home Decor',
    description: `Transform your living space with our elegant home decor collection. Each piece is carefully selected for its beauty, quality, and ability to enhance your home's atmosphere.

Our home decor features:
• Handcrafted ceramics and pottery
• Unique artistic pieces
• Premium materials and finishes
• Timeless designs that complement any style
• Locally sourced when possible

Perfect for:
- Living room centerpieces
- Kitchen and dining room accents
- Bedroom decoration
- Office spaces
- Gift giving`,
    price: 32.99,
    images: [
      {
        id: '1',
        url: '/decor.jpg',
        alt: 'Elegant Home Decor - Main View'
      }
    ],
    rating: 4.9,
    reviewCount: 89,
    category: 'Decor',
    slug: 'elegant-home-decor',
    badge: 'Featured',
    inStock: true,
    stockCount: 12,
    specifications: {
      'Material': 'Ceramic, Wood, Metal',
      'Dimensions': 'Varies by piece',
      'Care': 'Dust with soft cloth',
      'Origin': 'Handcrafted locally'
    },
    features: [
      'Handcrafted quality',
      'Unique designs',
      'Durable materials',
      'Easy to clean',
      'Versatile styling'
    ],
    tags: ['decor', 'home', 'handmade', 'ceramic', 'artistic'],
    options: [
      {
        id: 'style',
        name: 'Style',
        variants: [
          { id: 'modern', name: 'Modern', value: 'Contemporary design', inStock: true },
          { id: 'classic', name: 'Classic', value: 'Traditional design', inStock: true },
          { id: 'rustic', name: 'Rustic', value: 'Farmhouse style', inStock: false }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Stylish Women\'s Fashion',
    description: `Discover our curated collection of stylish women's fashion that combines comfort, quality, and contemporary design. Each piece is selected to help you express your unique style.

Our fashion collection includes:
• Comfortable and stylish clothing
• Quality fabrics and construction
• Versatile pieces for any occasion
• Trendy designs with timeless appeal
• Sustainable and ethical sourcing

Perfect for:
- Professional settings
- Casual everyday wear
- Special occasions
- Weekend outings
- Building a versatile wardrobe`,
    price: 49.99,
    originalPrice: 59.99,
    images: [
      {
        id: '1',
        url: '/Fashion_women.jpg',
        alt: 'Stylish Women\'s Fashion - Main View'
      }
    ],
    rating: 4.9,
    reviewCount: 156,
    category: 'Fashion',
    slug: 'stylish-womens-fashion',
    badge: 'New',
    inStock: true,
    stockCount: 18,
    specifications: {
      'Sizes': 'XS, S, M, L, XL',
      'Material': 'Cotton blend, Polyester',
      'Care': 'Machine wash cold',
      'Fit': 'Regular fit'
    },
    features: [
      'Comfortable fit',
      'Quality materials',
      'Versatile styling',
      'Easy care',
      'Sustainable sourcing'
    ],
    tags: ['fashion', 'women', 'clothing', 'style', 'comfortable'],
    options: [
      {
        id: 'size',
        name: 'Size',
        variants: [
          { id: 'xs', name: 'XS', value: 'Extra Small', inStock: true },
          { id: 's', name: 'S', value: 'Small', inStock: true },
          { id: 'm', name: 'M', value: 'Medium', inStock: true },
          { id: 'l', name: 'L', value: 'Large', inStock: true },
          { id: 'xl', name: 'XL', value: 'Extra Large', inStock: false }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        variants: [
          { id: 'black', name: 'Black', value: 'Classic Black', inStock: true },
          { id: 'white', name: 'White', value: 'Pure White', inStock: true },
          { id: 'navy', name: 'Navy', value: 'Navy Blue', inStock: true }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Handcrafted Designer Bag',
    description: `Our handcrafted designer bags combine functionality with style. Each bag is carefully made by skilled artisans using premium materials and traditional techniques.

Features of our designer bags:
• Premium leather and fabric materials
• Handcrafted with attention to detail
• Functional design with multiple compartments
• Durable construction for everyday use
• Unique designs that stand out

Perfect for:
- Daily commuting
- Professional meetings
- Shopping trips
- Travel and adventures
- Special occasions`,
    price: 34.99,
    images: [
      {
        id: '1',
        url: '/Bag01.jpg',
        alt: 'Handcrafted Designer Bag - Main View'
      },
      {
        id: '2',
        url: '/Bag02.jpg',
        alt: 'Handcrafted Designer Bag - Alternative Style'
      }
    ],
    rating: 4.8,
    reviewCount: 67,
    category: 'Bags',
    slug: 'handcrafted-designer-bag',
    inStock: true,
    stockCount: 8,
    specifications: {
      'Material': 'Premium leather, Canvas',
      'Dimensions': '12" x 8" x 4"',
      'Compartments': 'Multiple pockets',
      'Closure': 'Zipper, Magnetic snap',
      'Care': 'Spot clean only'
    },
    features: [
      'Handcrafted quality',
      'Premium materials',
      'Multiple compartments',
      'Durable construction',
      'Unique design'
    ],
    tags: ['bags', 'handmade', 'leather', 'designer', 'accessories'],
    options: [
      {
        id: 'color',
        name: 'Color',
        variants: [
          { id: 'brown', name: 'Brown', value: 'Rich Brown Leather', inStock: true },
          { id: 'black', name: 'Black', value: 'Classic Black', inStock: true },
          { id: 'tan', name: 'Tan', value: 'Natural Tan', inStock: false }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Premium Quality Shoes',
    description: `Step out in style with our premium quality shoes. Designed for comfort and durability, these shoes are perfect for any occasion.

Our shoe collection features:
• Premium materials and construction
• Comfortable fit for all-day wear
• Stylish designs for any occasion
• Durable soles and quality craftsmanship
• Available in multiple sizes and colors

Perfect for:
- Professional settings
- Casual everyday wear
- Special events
- Walking and light exercise
- Building a versatile shoe collection`,
    price: 79.99,
    originalPrice: 89.99,
    images: [
      {
        id: '1',
        url: '/Shoes.jpg',
        alt: 'Premium Quality Shoes - Main View'
      }
    ],
    rating: 4.7,
    reviewCount: 94,
    category: 'Fashion',
    slug: 'premium-quality-shoes',
    badge: 'Popular',
    inStock: true,
    stockCount: 15,
    specifications: {
      'Sizes': '6-12 (US)',
      'Material': 'Leather, Synthetic',
      'Sole': 'Rubber, Non-slip',
      'Care': 'Clean with damp cloth',
      'Fit': 'True to size'
    },
    features: [
      'Premium materials',
      'Comfortable fit',
      'Durable construction',
      'Non-slip sole',
      'Versatile styling'
    ],
    tags: ['shoes', 'footwear', 'leather', 'comfortable', 'durable'],
    options: [
      {
        id: 'size',
        name: 'Size',
        variants: [
          { id: '6', name: '6', value: 'US Size 6', inStock: true },
          { id: '7', name: '7', value: 'US Size 7', inStock: true },
          { id: '8', name: '8', value: 'US Size 8', inStock: true },
          { id: '9', name: '9', value: 'US Size 9', inStock: true },
          { id: '10', name: '10', value: 'US Size 10', inStock: true },
          { id: '11', name: '11', value: 'US Size 11', inStock: false },
          { id: '12', name: '12', value: 'US Size 12', inStock: true }
        ]
      }
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getRelatedProducts(currentProductId: string, category: string, limit: number = 4): Product[] {
  return products
    .filter(product => product.id !== currentProductId && product.category === category)
    .slice(0, limit);
}
