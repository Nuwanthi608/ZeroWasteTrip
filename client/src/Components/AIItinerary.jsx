import React, { useState } from 'react';

function AIItinerary({ destination, tripType, days }) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulated AI response engine tailored for Sri Lankan & global eco-destinations
  const handleGenerateAIItinerary = () => {
    if (!destination.trim()) {
      alert('Please enter a destination first!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const daysCount = parseInt(days) || 3;
      let generatedDays = [];

      for (let i = 1; i <= daysCount; i++) {
        generatedDays.push({
          day: i,
          title: `Day ${i}: Eco Exploration & Zero-Waste Adventure in ${destination}`,
          activities: [
            `Morning: Guided sustainable nature trail focusing on native flora.`,
            `Afternoon: Local organic farm-to-table lunch using zero single-use plastics.`,
            `Evening: Sunset mindfulness walk with carbon-neutral transit (${tripType}).`
          ]
        });
      }

      setItinerary(generatedDays);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>
        🤖 AI-Powered Eco-Itinerary Generator
      </h2>
      <p style={{ color: '#4a5568', fontSize: '15px', marginBottom: '20px' }}>
        Generate a dynamic, day-by-day green travel itinerary optimized for low carbon footprint and zero plastic waste.
      </p>

      <button
        type="button"
        onClick={handleGenerateAIItinerary}
        style={{
          background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
          color: 'white',
          border: 'none',
          padding: '14px 26px',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '15px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(2,136,209,0.3)',
          marginBottom: '20px'
        }}
      >
        {loading ? '🤖 AI is analyzing eco-routes...' : '✨ Generate AI Eco-Itinerary'}
      </button>

      {itinerary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '15px' }}>
          {itinerary.map((d) => (
            <div key={d.day} style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: '800', color: '#1b5e20', fontSize: '16px', marginBottom: '8px' }}>
                🌿 {d.title}
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4a5568', fontSize: '14px', lineHeight: '1.6' }}>
                {d.activities.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIItinerary;