const API_URL = 'https://diligent-encouragement-production.up.railway.app';

const demoProducts = [
  {
    title: "Vintage Leather Watch",
    description: "Beautiful vintage leather watch in excellent condition. Classic design with modern functionality.",
    price: 149.99,
    listing_type: 'fixed_price',
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: "Designer Sunglasses",
    description: "Premium designer sunglasses with UV protection. Stylish and durable.",
    price: 89.99,
    listing_type: 'fixed_price',
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation. Perfect sound quality.",
    price: 199.99,
    listing_type: 'fixed_price',
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: "Leather Handbag",
    description: "Elegant leather handbag with multiple compartments. Perfect for everyday use.",
    price: 249.99,
    listing_type: 'fixed_price',
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: "Running Shoes",
    description: "Comfortable running shoes with excellent support. Barely used, like new condition.",
    price: 79.99,
    listing_type: 'fixed_price',
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  },
  {
    title: "Acoustic Guitar",
    description: "Beautiful acoustic guitar with rich sound. Perfect for beginners and professionals.",
    starting_bid: 299.99,
    listing_type: 'auction',
    auction_end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'b694dd70-620b-4c25-a4a6-b32874270dfc',
    status: 'approved'
  }
];

async function seedViaAPI() {
  console.log('🌱 Starting to seed products via API...\n');
  
  for (const product of demoProducts) {
    try {
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        console.log(`✅ Created: ${product.title}`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${product.title} - ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${product.title}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Seeding complete!');
}

seedViaAPI();
