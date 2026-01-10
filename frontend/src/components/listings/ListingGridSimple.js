import React from 'react';

const ListingGridSimple = () => {
  const sampleListings = [
    {
      id: 1,
      title: 'Vintage Camera Collection',
      description: 'Rare collection of vintage cameras including a 1960s Leica M3, Canon AE-1, and Nikon F.',
      currentBid: 450,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      timeLeft: '2d 14h'
    },
    {
      id: 2,
      title: 'Art Deco Lamp',
      description: 'Beautiful vintage Art Deco table lamp from the 1920s. Brass base with geometric glass shade.',
      currentBid: 89,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      timeLeft: '1d 6h'
    },
    {
      id: 3,
      title: 'MacBook Pro 2019',
      description: 'MacBook Pro 16-inch, 2019 model. Intel Core i7, 16GB RAM, 512GB SSD.',
      currentBid: 800,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      timeLeft: '5d 8h'
    }
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Marketplace</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {sampleListings.map((listing) => (
          <div key={listing.id} style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={listing.image}
                alt={listing.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {listing.timeLeft}
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{listing.title}</h3>
              <p style={{ 
                margin: '0 0 16px 0', 
                color: '#666', 
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {listing.description}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Current bid</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c5aa0' }}>
                    ${listing.currentBid}
                  </div>
                </div>
                <button style={{
                  background: '#2c5aa0',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingGridSimple;