import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseUrl = 'https://diligent-encouragement-production.up.railway.app/api';

      // Fetch dashboard stats
      const statsResponse = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDashboardStats(statsData);
      }

      // Fetch users
      const usersResponse = await fetch(`${baseUrl}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch all listings
      const listingsResponse = await fetch(`${baseUrl}/admin/listings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        setListings(listingsData.listings || []);
      }

      // Fetch payments
      const paymentsResponse = await fetch(`${baseUrl}/admin/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.payments || []);
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const handleListingAction = async (listingId, action) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = 'https://diligent-encouragement-production.up.railway.app/api';
      
      let endpoint, method = 'PUT';
      
      if (action === 'approve') {
        endpoint = `${baseUrl}/listings/${listingId}/approve`;
      } else if (action === 'reject') {
        endpoint = `${baseUrl}/admin/listings/${listingId}/reject`;
      } else if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        endpoint = `${baseUrl}/listings/${listingId}`;
        method = 'DELETE';
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Listing ${action}d successfully` });
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error(`Failed to ${action} listing`);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const StatCard = ({ title, value, icon, color = '#667eea' }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: `3px solid ${color}20`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          fontSize: '2rem',
          background: `${color}20`,
          padding: '0.75rem',
          borderRadius: '12px'
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>
            {value || 0}
          </h3>
          <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
            {title}
          </p>
        </div>
      </div>
    </div>
  );

  const UserRow = ({ user }) => (
    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{user.email}</td>
      <td style={{ padding: '1rem' }}>
        <span style={{
          background: user.role === 'admin' ? '#ef4444' : user.role === 'seller' ? '#10b981' : '#3b82f6',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {user.role.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '1rem' }}>
        {user.is_admin ? (
          <span style={{
            background: '#f59e0b',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '15px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            ADMIN
          </span>
        ) : (
          <span style={{ color: '#64748b' }}>User</span>
        )}
      </td>
      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        {new Date(user.created_at).toLocaleDateString()}
      </td>
    </tr>
  );

  const ListingRow = ({ listing }) => (
    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
      <td style={{ padding: '1rem', fontSize: '0.9rem', maxWidth: '200px' }}>
        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{listing.title}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{listing.seller_email}</div>
      </td>
      <td style={{ padding: '1rem' }}>
        <span style={{
          background: listing.listing_type === 'auction' ? '#8b5cf6' : '#10b981',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {listing.listing_type === 'auction' ? 'AUCTION' : 'FIXED PRICE'}
        </span>
      </td>
      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
        {listing.price ? `$${listing.price}` : `$${listing.starting_bid} (bid)`}
      </td>
      <td style={{ padding: '1rem' }}>
        <span style={{
          background: listing.status === 'approved' ? '#10b981' : 
                     listing.status === 'pending' ? '#f59e0b' : '#ef4444',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {listing.status.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '1rem' }}>
        {listing.status === 'pending' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleListingAction(listing.id, 'approve')}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleListingAction(listing.id, 'reject')}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Reject
            </button>
          </div>
        )}
        <button
          onClick={() => handleListingAction(listing.id, 'delete')}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginTop: listing.status === 'pending' ? '0.5rem' : '0'
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  const PaymentRow = ({ payment }) => (
    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{payment.listing_title}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Order #{payment.id.slice(0, 8)}</div>
      </td>
      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{payment.buyer_email}</td>
      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{payment.seller_email}</td>
      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
        ${payment.amount}
      </td>
      <td style={{ padding: '1rem' }}>
        <span style={{
          background: payment.status === 'completed' ? '#10b981' : 
                     payment.status === 'pending' ? '#f59e0b' : '#ef4444',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '15px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {payment.status.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        {new Date(payment.created_at).toLocaleDateString()}
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
            🛠️ Admin Dashboard
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
            Manage your Nivolo marketplace
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard', count: null },
              { id: 'users', label: '👥 Users', count: users.length },
              { id: 'listings', label: '📝 Listings', count: listings.length },
              { id: 'payments', label: '💳 Payments', count: payments.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  border: 'none',
                  background: activeTab === tab.id ? '#667eea' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#64748b',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: activeTab === tab.id ? '12px 0 0 0' : '0'
                }}
              >
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2rem' }}>
            {activeTab === 'dashboard' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                  Platform Statistics
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <StatCard title="Total Users" value={dashboardStats.total_users} icon="👥" color="#3b82f6" />
                  <StatCard title="Total Listings" value={dashboardStats.total_listings} icon="📝" color="#10b981" />
                  <StatCard title="Pending Listings" value={dashboardStats.pending_listings} icon="⏳" color="#f59e0b" />
                  <StatCard title="Approved Listings" value={dashboardStats.approved_listings} icon="✅" color="#10b981" />
                  <StatCard title="Total Orders" value={dashboardStats.total_orders} icon="🛒" color="#8b5cf6" />
                  <StatCard title="Total Revenue" value={`$${dashboardStats.total_revenue || 0}`} icon="💰" color="#ef4444" />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                  All Users ({users.length})
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Admin</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => <UserRow key={user.id} user={user} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                  All Listings ({listings.length})
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Title & Seller</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Price</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(listing => <ListingRow key={listing.id} listing={listing} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '2rem' }}>
                  All Payments ({payments.length})
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Item & Order</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Buyer</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Seller</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => <PaymentRow key={payment.id} payment={payment} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;