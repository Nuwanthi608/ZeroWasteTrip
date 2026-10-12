import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function EcoAnalytics({ trips }) {
  // Aggregate monthly plastic reduction data from trip history
  const chartData = trips.slice(0, 6).reverse().map((trip) => ({
    destination: trip.destination || 'Trip',
    plasticSaved: trip.plastic_saved || (trip.days * trip.members * 2),
  }));

  const totalPlasticSaved = trips.reduce((acc, t) => acc + (t.plastic_saved || (t.days * t.members * 2)), 0);
  const totalCo2Prevented = (totalPlasticSaved * 0.08).toFixed(1); // Avg ~80g CO2 saved per single-use plastic item avoided

  return (
    <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>
        📊 Personal Eco-Impact & Waste Reduction Metrics
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', padding: '18px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#2e7d32' }}>{totalPlasticSaved}</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#276749', textTransform: 'uppercase' }}>Plastic Items Prevented 🍾</div>
        </div>

        <div style={{ background: '#e6fffa', border: '1px solid #b2f5ea', padding: '18px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#00796b' }}>{totalCo2Prevented} kg</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#234e52', textTransform: 'uppercase' }}>Est. CO₂ Emissions Saved 🌿</div>
        </div>

        <div style={{ background: '#f7fafc', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#2d3748' }}>{trips.length}</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Sustainable Trips Planned 🎒</div>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <h4 style={{ color: '#2d3748', margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>
        📈 Single-Use Plastic Saved per Destination:
      </h4>
      {chartData.length > 0 ? (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
              <XAxis dataKey="destination" stroke="#718096" fontSize={12} />
              <YAxis stroke="#718096" fontSize={12} />
              <Tooltip cursor={{ fill: '#f0fff4' }} />
              <Bar dataKey="plasticSaved" fill="#2e7d32" radius={[8, 8, 0, 0]} name="Plastic Saved (Items)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
          Plan your first trip to start generating eco analytics!
        </p>
      )}
    </div>
  );
}

export default EcoAnalytics;