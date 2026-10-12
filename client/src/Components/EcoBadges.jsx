import React from 'react';

function EcoBadges({ trips, ecoPoints }) {
  const totalPlasticSaved = trips.reduce((acc, t) => acc + (t.plastic_saved || (t.days * t.members * 2)), 0);
  const totalTrips = trips.length;

  // Badge criteria rules
  const badges = [
    {
      id: 1,
      name: 'Seedling Traveler 🌱',
      description: 'Completed your first sustainable trip planning.',
      unlocked: totalTrips >= 1,
      icon: '🌱'
    },
    {
      id: 2,
      name: 'Plastic Saver 🍾',
      description: 'Prevented over 10 single-use plastic items.',
      unlocked: totalPlasticSaved >= 10,
      icon: '🛡️'
    },
    {
      id: 3,
      name: 'Train Explorer 🚂',
      description: 'Planned 3 or more eco-friendly transport journeys.',
      unlocked: totalTrips >= 3,
      icon: '🚂'
    },
    {
      id: 4,
      name: 'Zero-Waste Master 🏆',
      description: 'Accumulated over 100 Eco Points through sustainable travel.',
      unlocked: ecoPoints >= 100 || totalPlasticSaved >= 25,
      icon: '🏆'
    }
  ];

  return (
    <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>
        🎮 Gamification & Eco-Badges
      </h2>
      <p style={{ color: '#4a5568', fontSize: '15px', marginBottom: '20px' }}>
        Unlock prestigious eco-badges as you plan sustainable trips and reduce plastic waste!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            style={{ 
              background: badge.unlocked ? '#f0fff4' : '#f7fafc', 
              border: `2px solid ${badge.unlocked ? '#68d391' : '#e2e8f0'}`, 
              padding: '20px', 
              borderRadius: '16px', 
              textAlign: 'center',
              opacity: badge.unlocked ? 1 : 0.6,
              boxShadow: badge.unlocked ? '0 4px 12px rgba(46,125,50,0.08)' : 'none'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{badge.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: badge.unlocked ? '#2e7d32' : '#718096', marginBottom: '6px' }}>
              {badge.name}
            </div>
            <div style={{ fontSize: '12px', color: '#4a5568', lineHeight: '1.4', marginBottom: '12px' }}>
              {badge.description}
            </div>
            <div style={{ 
              display: 'inline-block', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '11px', 
              fontWeight: '700', 
              background: badge.unlocked ? '#c6f6d5' : '#edf2f7', 
              color: badge.unlocked ? '#22543d' : '#718096' 
            }}>
              {badge.unlocked ? '✨ Unlocked' : '🔒 Locked'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EcoBadges;