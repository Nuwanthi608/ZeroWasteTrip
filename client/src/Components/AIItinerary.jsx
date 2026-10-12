import React, { useState } from 'react';

// Bank of distinct activities for each day to ensure unique itinerary generation
const uniqueDayActivities = [
  {
    morning: "Arrival, eco-lodge check-in, and a guided orientation walk focusing on local flora and fauna conservation.",
    afternoon: "Farm-to-table organic lunch utilizing locally sourced ingredients with zero single-use plastics.",
    evening: "Relaxing sunset mindfulness walk along community-protected nature paths with low-emission transit."
  },
  {
    morning: "Early morning wildlife spotting or bird watching tour with a certified local eco-guide.",
    afternoon: "Zero-waste picnic experience using reusable stainless steel containers and bamboo cutlery.",
    evening: "Interactive workshop on local sustainability practices and traditional handicrafts."
  },
  {
    morning: "Adventure trek along certified eco-trails emphasizing habitat preservation and clean-up.",
    afternoon: "Traditional herbal tea tasting and light organic refreshments at a community-run eco-cafe.",
    evening: "Stargazing and peaceful campfire gathering observing strict 'Leave No Trace' principles."
  },
  {
    morning: "Scenic bicycle tour exploring traditional villages, local farming methods, and heritage sites.",
    afternoon: "Plant-based cooking session learning regional recipes with zero-waste kitchen habits.",
    evening: "Reflective evening session at a scenic eco-viewpoint, logging trip carbon offsets."
  },
  {
    morning: "Community conservation project visit or tree-planting initiative supporting regional biodiversity.",
    afternoon: "Local artisan market visit to purchase authentic hand-crafted eco-friendly souvenirs.",
    evening: "Farewell dinner celebrating sustainable gastronomy and local cultural heritage."
  }
];

function AIItinerary({ destination, tripType, days }) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateItinerary = () => {
    setLoading(true);
    setTimeout(() => {
      const generatedDays = [];
      const numDays = Math.max(1, parseInt(days) || 1);
      const safeDest = destination ? destination.trim() : 'Destination';
      const safeStyle = tripType || 'General Trip';

      for (let i = 1; i <= numDays; i++) {
        // Cycle through the unique activities array based on day index
        const activityObj = uniqueDayActivities[(i - 1) % uniqueDayActivities.length];

        generatedDays.push({
          day: i,
          title: `Day ${i}: Eco Exploration & Zero-Waste Adventure in ${safeDest}`,
          morning: `${activityObj.morning} [${safeStyle} Focus]`,
          afternoon: `${activityObj.afternoon}`,
          evening: `${activityObj.evening}`
        });
      }

      setItinerary(generatedDays);
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e8eee9', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#1b5e20', margin: '0 0 10px 0', fontSize: '26px', fontWeight: '800' }}>🤖 AI-Powered Eco-Itinerary Generator</h2>
        <p style={{ color: '#718096', fontSize: '15px', margin: 0 }}>
          Generate a custom day-by-day sustainable travel itinerary for <strong>{destination || 'your destination'}</strong> ({tripType || 'General'}).
        </p>
        <button
          onClick={handleGenerateItinerary}
          disabled={loading}
          style={{
            marginTop: '18px',
            background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '30px',
            fontWeight: '800',
            fontSize: '16px',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 6px 18px rgba(2,136,209,0.3)'
          }}
        >
          {loading ? '⏳ Generating AI Itinerary...' : '✨ Generate AI Eco-Itinerary'}
        </button>
      </div>

      {itinerary && (
        <div style={{ display: 'block', width: '100%' }}>
          {itinerary.map((dayItem) => (
            <div key={dayItem.day} style={{ background: '#f7fafc', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
              <h4 style={{ color: '#2e7d32', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800', textAlign: 'left' }}>
                🌿 {dayItem.title}
              </h4>
              
              <p style={{ margin: '8px 0', fontSize: '15px', color: '#2d3748', textAlign: 'left', lineHeight: '1.6' }}>
                <strong style={{ color: '#2e7d32', display: 'inline-block', width: '110px' }}>☀️ Morning:</strong> 
                <span style={{ color: '#2d3748' }}>{dayItem.morning}</span>
              </p>
              
              <p style={{ margin: '8px 0', fontSize: '15px', color: '#2d3748', textAlign: 'left', lineHeight: '1.6' }}>
                <strong style={{ color: '#2e7d32', display: 'inline-block', width: '110px' }}>🌤️ Afternoon:</strong> 
                <span style={{ color: '#2d3748' }}>{dayItem.afternoon}</span>
              </p>
              
              <p style={{ margin: '8px 0', fontSize: '15px', color: '#2d3748', textAlign: 'left', lineHeight: '1.6' }}>
                <strong style={{ color: '#2e7d32', display: 'inline-block', width: '110px' }}>🌙 Evening:</strong> 
                <span style={{ color: '#2d3748' }}>{dayItem.evening}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIItinerary;