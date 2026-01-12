const { db } = require('../config/database'); // db is a pg Pool
const { v4: uuidv4 } = require('uuid');

async function createSampleOrders() {
  console.log('Creating sample orders...');

  try {
    // Get user IDs
    const { rows: sellerRows } = await db.query(
      'SELECT id FROM users WHERE email = $1',
      ['seller@example.com']
    );
    const { rows: adminRows } = await db.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@nivolo.com']
    );

    const seller = sellerRows[0];
    const admin = adminRows[0];

    if (!seller || !admin) {
      console.error('Users not found');
      return;
    }

    // Get some listings
    const { rows: listings } = await db.query(
      'SELECT id, price, starting_bid FROM listings LIMIT 3'
    );

    if (!listings.length) {
      console.error('No listings found');
      return;
    }

    // Create sample orders
    const orders = [
      {
        id: uuidv4(),
        buyer_id: admin.id,
        listing_id: listings[0].id,
        order_type: 'purchase',
        amount: listings[0].price || listings[0].starting_bid,
        status: 'paid'
      },
      {
        id: uuidv4(),
        buyer_id: admin.id,
        listing_id: listings[1].id,
        order_type: 'auction_win',
        amount: (listings[1].price || listings[1].starting_bid) * 1.2,
        status: 'pending'
      }
    ];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      await db.query(
        `
        INSERT INTO orders (id, buyer_id, listing_id, order_type, amount, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        [order.id, order.buyer_id, order.listing_id, order.order_type, order.amount, order.status]
      );
      console.log(`Order ${i + 1} created successfully`);
    }

    console.log('✅ Sample orders created!');

  } catch (error) {
    console.error('❌ Error creating orders:', error);
  }
}

// Run if called directly
if (require.main === module) {
  createSampleOrders().then(() => process.exit(0));
}

module.exports = { createSampleOrders };
