import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoImg from './assets/logo.jpg';
import homeBgImg from './assets/home.jpg';

// Knowledge base for location recommendations based on trip type
const destinationAttractions = {
  nuwaraeliya: {
    "Hiking & Trekking": [
      { name: 'Horton Plains & World\'s End', category: 'Eco Trail & Hiking' },
      { name: 'Single Tree Hill', category: 'Hiking Peak' },
      { name: 'Cone Forest Trail', category: 'Nature Walk' }
    ],
    "Camping": [
      { name: 'Horton Plains Campsite Zones', category: 'Wild Camping' },
      { name: 'Pedro Estate Camping Base', category: 'Nature Camp' }
    ],
    "Wellness & Spa Retreat": [
      { name: 'Gregory Lake Peaceful Walkways', category: 'Relaxation' },
      { name: 'Victoria Park Botanical Meditation', category: 'Wellness' }
    ],
    "Historical & Wonder Trip": [
      { name: 'Seetha Amman Temple', category: 'Historical Heritage' },
      { name: 'Hakgala Botanical Gardens', category: 'Historic Garden' }
    ]
  },
  kandy: {
    "Culture & Urban Exploration": [
      { name: 'Temple of the Sacred Tooth Relic', category: 'Heritage Site' },
      { name: 'Kandy National Museum', category: 'History & Culture' },
      { name: 'Kandy City Center & Cultural Show', category: 'Urban Heritage' }
    ],
    "Hiking & Trekking": [
      { name: 'Udawatta Kele Sanctuary', category: 'Forest Trek' },
      { name: 'Bahirawakanda Temple Hill Hike', category: 'Scenic Hill Climb' }
    ],
    "Wellness & Spa Retreat": [
      { name: 'Royal Botanical Gardens (Peradeniya)', category: 'Nature Healing' },
      { name: 'Kandy Lake Sunset Walk', category: 'Calm Environment' }
    ]
  },
  ella: {
    "Hiking & Trekking": [
      { name: 'Little Adam\'s Peak', category: 'Mountain Hiking' },
      { name: 'Ella Rock', category: 'Adventure Trail' }
    ],
    "Historical & Wonder Trip": [
      { name: 'Nine Arches Bridge', category: 'Colonial Architecture' },
      { name: 'Ravana Cave & Temple', category: 'Ancient Heritage' }
    ],
    "Beach Holiday": [
      { name: 'Ravana Ella Waterfall Pool', category: 'Natural Swimming' }
    ]
  },
  mirissa: {
    "Beach Holiday": [
      { name: 'Mirissa Main Beach', category: 'Sun & Ocean Swim' },
      { name: 'Secret Beach Mirissa', category: 'Private Cove' }
    ],
    "Island Hopping": [
      { name: 'Mirissa Eco Whale Watching Tour', category: 'Marine Adventure' },
      { name: 'Parrot Rock Island', category: 'Coastal View' }
    ],
    "Wellness & Spa Retreat": [
      { name: 'Coconut Tree Hill Yoga Spot', category: 'Meditation & Sunset' }
    ]
  }
};

const tripTypeDescriptions = {
  "Beach Holiday": "Focuses on sun, sand, ocean swimming, and eco-friendly coastal relaxation.",
  "Wellness & Spa Retreat": "Centers on yoga, meditation, nature detox programs, and mental rejuvenation.",
  "Staycation": "Exploring nearby scenic stays, local eco-resorts, and stress-free getaways.",
  "Camping": "Outdoor wilderness stay with tents, campfires, and leave-no-trace eco practices.",
  "Hiking & Trekking": "Active trail journeys, climbing mountains, and nature wilderness exploring.",
  "Road Trip": "Driving scenic routes at your own pace with eco-friendly carpooling habits.",
  "Wildlife Safari": "Exploring protected natural reserves and national parks to spot wildlife responsibly.",
  "Backpacking": "Budget-friendly, minimalist, long-term travel across multiple regions.",
  "City Break": "Fast-paced urban exploration centered on museums, architecture, and local culture.",
  "Historical & Wonder Trip": "Exploring UNESCO world heritage sites, ancient ruins, and cultural monuments.",
  "Culinary Tour": "Tasting local organic street food, regional dishes, and culinary workshops.",
  "Solo Trip": "Personal growth, self-reflection, and complete independent eco-traveling.",
  "Romantic Getaway": "Quiet cabin stays, eco-luxury resorts, and peaceful sunset cruises for couples.",
  "Family / Group Vacation": "Shared eco-friendly activities, group convenience, and sustainable bonding.",
  "Island Hopping": "Coastal boat travel across multiple islands, coral reef visits, and marine care."
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' || location.pathname === '/dashboard';
  });
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || 'user@zerowaste.lk');
  const [authMode, setAuthMode] = useState('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('Camping');
  const [days, setDays] = useState(1);
  const [members, setMembers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [budgetLevel, setBudgetLevel] = useState('Moderate Standard 🌿');
  const [transportMode, setTransportMode] = useState('Public Eco Transport / Train 🚂');

  const [generatedTrip, setGeneratedTrip] = useState(null);

  const [items, setItems] = useState([]);
  const [plasticEstimate, setPlasticEstimate] = useState(0);
  const [tripsHistory, setTripsHistory] = useState([]);
  
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    }
    fetchTripsHistory();
    loadDefaultItems('Camping');
  }, [location.pathname]);

  const fetchTripsHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trips');
      setTripsHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const loadDefaultItems = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/items/${type}`);
      const itemsWithCheck = response.data.map(item => ({ ...item, checked: false }));
      setItems(itemsWithCheck);
    } catch (err) {
      console.error('Error loading default items:', err);
    }
  };

  // Password Validation Rules (Maximum 5 Characters Limit)
  const isLengthValid = passwordInput.length > 0 && passwordInput.length <= 5;
  const hasUpper = /[A-Z]/.test(passwordInput);
  const hasLower = /[a-z]/.test(passwordInput);
  const hasNoNumbersOrSymbols = !/[^a-zA-Z]/.test(passwordInput);
  const isPasswordValid = isLengthValid && hasUpper && hasLower && hasNoNumbersOrSymbols;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (authMode === 'register' && !isPasswordValid) {
      alert('⚠️ Password violates the rules. Maximum length is 5 characters (Capital + Simple letters only).');
      return;
    }

    try {
      if (authMode === 'register') {
        await axios.post('http://localhost:5000/api/register', {
          name: nameInput,
          email: emailInput,
          password: passwordInput
        });
        alert('✅ Registration successful! Please log in with your credentials.');
        setAuthMode('login');
        setPasswordInput('');
      } else {
        await axios.post('http://localhost:5000/api/login', {
          email: emailInput,
          password: passwordInput
        });
        setIsLoggedIn(true);
        setUserEmail(emailInput);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', emailInput);
        setShowAuthModal(false);
        alert('🎉 Logged in successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setEmailInput('');
    setPasswordInput('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -95;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -95;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleOpenGoogleMaps = () => {
    if (!destination.trim()) {
      alert('Please enter a destination to search on Google Maps!');
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, '_blank');
  };

  const getFilteredAttractions = (destName) => {
    if (!destName || !destName.trim()) return null;
    const destKey = destName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let matchedPlaceKey = '';
    
    for (const key in destinationAttractions) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (destKey.includes(cleanKey) || cleanKey.includes(destKey)) {
        matchedPlaceKey = key;
        break;
      }
    }

    if (matchedPlaceKey && destinationAttractions[matchedPlaceKey]) {
      let allPlaces = [];
      const categories = destinationAttractions[matchedPlaceKey];
      for (const cat in categories) {
        allPlaces = allPlaces.concat(categories[cat]);
      }
      return allPlaces;
    }

    const capitalizedDest = destName.charAt(0).toUpperCase() + destName.slice(1);
    return [
      { name: `${capitalizedDest} Ancient Heritage & Historical Site`, category: 'Historical Heritage' },
      { name: `${capitalizedDest} Eco Nature Reserve & Park`, category: 'Nature & Wildlife' },
      { name: `${capitalizedDest} Cultural Center & Local Village`, category: 'Culture & Community' },
      { name: `${capitalizedDest} Scenic Viewpoint & Lake Trail`, category: 'Scenic Exploration' }
    ];
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      alert('Please enter a target destination for your trip!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/trips', {
        destination: destination,
        trip_type: tripType,
        days: days,
        members: members,
        start_date: startDate || null,
        budget_level: budgetLevel,
        transport_mode: transportMode
      });

      await loadDefaultItems(tripType);
      setPlasticEstimate(days * members * 2);

      setGeneratedTrip({
        destination: destination,
        tripType: tripType,
        days: days,
        members: members,
        startDate: startDate,
        budgetLevel: budgetLevel,
        transportMode: transportMode
      });

      fetchTripsHistory();

      setTimeout(() => {
        scrollToSection('results-section');
      }, 100);

    } catch (err) {
      console.error('Error generating trip:', err);
      alert('Failed to connect to backend server.');
    }
  };

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddCustomItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/items', {
        item_name: newItemName,
        category: newCategory,
        item_type: tripType
      });
      setNewItemName('');
      await loadDefaultItems(tripType);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const liveAttractions = getFilteredAttractions(destination);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, boxSizing: 'border-box', backgroundColor: '#f4f8f5' }}>
      
      {/* High Visibility Green Navigation Bar */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 99999, 
        background: '#1b5e20', 
        padding: '16px 70px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '100px', 
        boxSizing: 'border-box',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
        borderBottom: '4px solid #81c784'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '28px', fontWeight: '900', color: '#ffffff', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          <img src={logoImg} alt="Logo" style={{ width: '58px', height: '58px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }} />
          <span>ZeroWaste <span style={{ color: '#a5d6a7', fontWeight: '700', fontSize: '20px' }}>Trip Planner</span></span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
          <Link to="/" style={{ color: location.pathname === '/' ? '#a5d6a7' : '#ffffff', textDecoration: 'none', fontWeight: '800', fontSize: '18px', transition: 'all 0.2s' }}>
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <span onClick={() => scrollToSection('planner-section')} style={{ color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '18px' }}>Plan Trip</span>
              <span onClick={() => scrollToSection('packing-section')} style={{ color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '18px' }}>Packing List</span>
              <span onClick={() => scrollToSection('history-section')} style={{ color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '18px' }}>Trip History</span>
              <button onClick={handleLogout} style={{ background: '#e53935', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 14px rgba(229,57,53,0.3)' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)} style={{ background: '#2e7d32', color: 'white', border: '2px solid #ffffff', padding: '12px 30px', borderRadius: '30px', fontWeight: '800', fontSize: '17px', cursor: 'pointer', boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }}>
              Get Started 🌱
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ marginTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ 
                width: '100%', 
                minHeight: '85vh', 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url(${homeBgImg})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '80px 80px 80px 40px', 
                boxSizing: 'border-box'
              }}>
                <div style={{ maxWidth: '620px', textAlign: 'left', color: '#ffffff', textShadow: '0 3px 12px rgba(0,0,0,0.85)', background: 'rgba(15, 36, 16, 0.65)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2e7d32', padding: '8px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    🌿 EMPOWERING ENVIRONMENTAL CONSERVATION
                  </div>
                  
                  <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1.15', margin: '0 0 20px 0', letterSpacing: '-1.5px', color: '#ffffff' }}>
                    Travel Green, <br />
                    <span style={{ color: '#a5d6a7', fontStyle: 'italic' }}>Leave No Plastic Behind.</span>
                  </h1>

                  <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#f1f8e9', marginBottom: '32px', fontWeight: '500' }}>
                    Plan eco-friendly journeys, reduce single-use plastic waste, and create custom sustainable packing checklists effortlessly!
                  </p>

                  <button onClick={() => { if(isLoggedIn) navigate('/dashboard'); else setShowAuthModal(true); }} style={{ background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '16px 42px', borderRadius: '35px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}>
                    {isLoggedIn ? 'Explore Dashboard 🚀' : 'Start Planning Free 🌱'}
                  </button>

                </div>
              </div>

              <div style={{ width: '100%', backgroundColor: '#eef6f0', padding: '70px 40px', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                  
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f2410', margin: '0 0 12px 0' }}>How ZeroWaste Trip Planner Transforms Your Travel</h2>
                    <p style={{ fontSize: '17px', color: '#526052', maxWidth: '620px', margin: '0 auto' }}>
                      Designed to give you seamless, stress-free journeys while protecting Sri Lanka's beautiful natural landscapes.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    
                    <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #deebdf', textAlign: 'left' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>📍</div>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1b5e20', marginBottom: '12px' }}>Smart Destination Discovery</h3>
                      <p style={{ color: '#617262', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Discover curated eco-attractions for Hiking, Camping, Beach & Cultural trips in Nuwara Eliya, Kandy, Ella, Mirissa & more.</p>
                    </div>

                    <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #deebdf', textAlign: 'left' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>🎒</div>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1b5e20', marginBottom: '12px' }}>Zero-Waste Packing Engine</h3>
                      <p style={{ color: '#617262', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Never forget reusable water bottles, bamboo cutlery, or eco-toiletries with personalized category-wise checklists.</p>
                    </div>

                    <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #deebdf', textAlign: 'left' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>📊</div>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1b5e20', marginBottom: '12px' }}>Plastic Reduction Tracker</h3>
                      <p style={{ color: '#617262', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Instantly calculate how many single-use plastic bottles & packaging items you prevent on every single trip you take!</p>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          } />

          <Route path="/dashboard" element={
            <div style={{ width: '100%', maxWidth: '1150px', margin: '30px auto', padding: '0 20px', boxSizing: 'border-box', flex: 1, color: '#2d3748' }}>
              
              <div id="planner-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e8eee9' }}>
                <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px', fontWeight: '800', marginBottom: '22px', letterSpacing: '-0.5px' }}>✨ Plan a New Sustainable Trip</h2>
                <form onSubmit={handleGenerateTrip}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '15px' }}>Destination Location:</label>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <input 
                        type="text" 
                        placeholder="Enter destination (e.g. Kandy, Nuwara Eliya, Ella, Mirissa, Polonnaruwa)" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        required 
                        style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }} 
                      />
                      <button 
                        type="button" 
                        onClick={handleOpenGoogleMaps} 
                        style={{ background: '#1976d2', color: 'white', border: 'none', padding: '14px 22px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                      >
                        📍 Search Google Maps
                      </button>
                    </div>

                    {liveAttractions && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '16px', border: '1px solid #c6f6d5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                          <h4 style={{ color: '#1b5e20', margin: '0 0 14px 0', fontSize: '17px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📍 All Recommended Visiting Places in <u>{destination}</u>:
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                            {liveAttractions.map((place, idx) => (
                              <div key={idx} style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontWeight: '700', color: '#2e7d32', fontSize: '15px', marginBottom: '4px' }}>🌿 {place.name}</div>
                                <small style={{ color: '#718096', fontSize: '12px', fontWeight: '600' }}>Category: {place.category}</small>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                          <h4 style={{ color: '#1b5e20', margin: '0 0 14px 0', fontSize: '17px', fontWeight: '800' }}>🗺️ Location Map Preview: {destination}</h4>
                          <iframe
                            title="Destination Map Preview"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '12px' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '15px' }}>Trip Type & Travel Style:</label>
                    <select value={tripType} onChange={(e) => { setTripType(e.target.value); loadDefaultItems(e.target.value); }} style={{ padding: '14px 18px', width: '100%', borderRadius: '12px', border: '1px solid #cbd5e0', fontSize: '15px', backgroundColor: '#fff' }}>
                      <optgroup label="🏖️ Relaxation & Rejuvenation">
                        <option value="Beach Holiday">Beach Holiday</option>
                        <option value="Wellness & Spa Retreat">Wellness & Spa Retreat</option>
                        <option value="Staycation">Staycation</option>
                      </optgroup>
                      <optgroup label="🏕️ Adventure & Outdoors">
                        <option value="Camping">Camping</option>
                        <option value="Hiking & Trekking">Hiking & Trekking</option>
                        <option value="Road Trip">Road Trip</option>
                        <option value="Wildlife Safari">Wildlife Safari</option>
                        <option value="Backpacking">Backpacking</option>
                      </optgroup>
                      <optgroup label="🏛️ Culture & Urban Exploration">
                        <option value="City Break">City Break</option>
                        <option value="Historical & Wonder Trip">Historical & Wonder Trip</option>
                        <option value="Culinary Tour">Culinary Tour</option>
                      </optgroup>
                      <optgroup label="✨ Special Styles & Group Dynamics">
                        <option value="Solo Trip">Solo Trip</option>
                        <option value="Romantic Getaway">Romantic Getaway</option>
                        <option value="Family / Group Vacation">Family / Group Vacation</option>
                        <option value="Island Hopping">Island Hopping</option>
                      </optgroup>
                    </select>

                    {tripTypeDescriptions[tripType] && (
                      <div style={{ marginTop: '10px', background: '#f0fff4', color: '#276749', padding: '12px 18px', borderRadius: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #c6f6d5' }}>
                        💡 <strong>Traveler Focus:</strong> {tripTypeDescriptions[tripType]}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>Trip Start Date:</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '12px 16px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>Budget Level:</label>
                      <select value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value)} style={{ padding: '12px 16px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                        <option value="Eco Budget 🎒">Eco Budget 🎒</option>
                        <option value="Moderate Standard 🌿">Moderate Standard 🌿</option>
                        <option value="Luxury Eco-Resort ✨">Luxury Eco-Resort ✨</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>Transport Mode:</label>
                      <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)} style={{ padding: '12px 16px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                        <option value="Public Eco Transport / Train 🚂">Public Eco Transport / Train 🚂</option>
                        <option value="Electric Vehicle / Carpool ⚡">Electric Vehicle / Carpool ⚡</option>
                        <option value="Private Car / Van 🚗">Private Car / Van 🚗</option>
                        <option value="Hiking / Walking 🥾">Hiking / Walking 🥾</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>Number of Days:</label>
                    <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={{ padding: '12px 16px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px' }} />
                  </div>

                  <div style={{ marginBottom: '26px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#2d3748', fontSize: '14px' }}>Number of Members:</label>
                    <input type="number" min="1" value={members} onChange={(e) => setMembers(e.target.value)} style={{ padding: '12px 16px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px' }} />
                  </div>

                  <button type="submit" style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%', fontWeight: '800', fontSize: '17px', boxShadow: '0 4px 15px rgba(46,125,50,0.3)', letterSpacing: '0.3px' }}>
                    🚀 Generate Zero-Waste Plan & Packing List
                  </button>
                </form>
              </div>

              {generatedTrip && plasticEstimate > 0 && (
                <div id="results-section">
                  <div style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', padding: '30px', borderRadius: '16px', marginBottom: '30px', borderLeft: '8px solid #2e7d32', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ color: '#1b5e20', margin: '0 0 10px 0', fontSize: '22px', fontWeight: '800' }}>🌍 Environmental Impact & Waste Reduction</h3>
                    <p style={{ margin: 0, color: '#1b5e20', fontSize: '17px', lineHeight: '1.6' }}>
                      By choosing reusable gear and <strong>{generatedTrip.transportMode}</strong> for this <strong>{generatedTrip.tripType}</strong> to <strong>{generatedTrip.destination}</strong>, you will prevent approximately <strong style={{ fontSize: '20px', color: '#2e7d32' }}>{plasticEstimate} single-use plastic items</strong> from harming nature!
                    </p>
                  </div>
                </div>
              )}

              {/* Packing Section */}
              <div id="packing-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e8eee9' }}>
                <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px', fontWeight: '800', marginBottom: '20px' }}>🎒 Recommended Reusable Packing List ({tripType})</h2>
                
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {items.map((item) => (
                    <li key={item.id} onClick={() => toggleCheck(item.id)} style={{ background: item.checked ? '#f0fff4' : '#f7fafc', padding: '14px 18px', margin: '10px 0', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#a0aec0' : '#2d3748', transition: 'all 0.2s' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.checked ? '✅ ' : '🔲 '} {item.item_name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ background: '#e6fffa', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#234e52', fontWeight: '700' }}>{item.category}</span>
                        <button onClick={(e) => handleDeleteItem(item.id, e)} title="Delete Item" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.7 }}>
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleAddCustomItem} style={{ marginTop: '25px', borderTop: '2px solid #edf2f7', paddingTop: '20px' }}>
                  <h4 style={{ color: '#2d3748', margin: '0 0 14px 0', fontSize: '17px', fontWeight: '700' }}>➕ Add Custom Item to List</h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} style={{ padding: '12px 16px', flex: 2, borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px' }} />
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ padding: '12px 16px', flex: 1, borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px', backgroundColor: '#fff' }}>
                      <option value="General">General</option>
                      <option value="Hydration">Hydration</option>
                      <option value="Dining">Dining</option>
                      <option value="Camping Gear">Camping Gear</option>
                      <option value="Personal Care">Personal Care</option>
                    </select>
                    <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '12px 26px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Add</button>
                  </div>
                </form>
              </div>

              {/* History Section */}
              <div id="history-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e8eee9' }}>
                <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px', fontWeight: '800', marginBottom: '18px' }}>📜 Previous Trips History</h2>
                {tripsHistory.length === 0 ? (
                  <p style={{ color: '#a0aec0', fontSize: '15px' }}>No saved trips yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                      <thead>
                        <tr style={{ background: '#f7fafc', textAlign: 'left', color: '#4a5568' }}>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>ID</th>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>Destination</th>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>Trip Type</th>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>Start Date</th>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>Budget</th>
                          <th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '700' }}>Transport</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tripsHistory.map((trip) => (
                          <tr key={trip.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                            <td style={{ padding: '14px', color: '#718096', fontSize: '14px' }}>{trip.id}</td>
                            <td style={{ padding: '14px', fontWeight: '700', color: '#2e7d32', fontSize: '14px' }}>{trip.destination || 'N/A'}</td>
                            <td style={{ padding: '14px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>{trip.trip_type}</td>
                            <td style={{ padding: '14px', color: '#718096', fontSize: '14px' }}>{trip.start_date ? trip.start_date.split('T')[0] : 'N/A'}</td>
                            <td style={{ padding: '14px', color: '#718096', fontSize: '14px' }}>{trip.budget_level || 'Moderate'}</td>
                            <td style={{ padding: '14px', color: '#718096', fontSize: '14px' }}>{trip.transport_mode || 'Public'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          } />
        </Routes>
      </div>

      {/* Login Modal Popup */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', color: '#2d3748', width: '100%', maxWidth: '420px', padding: '35px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: '#f0f0f0', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            
            <div style={{ display: 'flex', borderBottom: '2px solid #edf2f7', marginBottom: '24px' }}>
              <button onClick={() => setAuthMode('login')} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: authMode === 'login' ? '3px solid #2e7d32' : 'none', fontWeight: '800', color: authMode === 'login' ? '#2e7d32' : '#a0aec0', cursor: 'pointer', fontSize: '16px' }}>
                Login
              </button>
              <button onClick={() => setAuthMode('register')} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: authMode === 'register' ? '3px solid #2e7d32' : 'none', fontWeight: '800', color: authMode === 'register' ? '#2e7d32' : '#a0aec0', cursor: 'pointer', fontSize: '16px' }}>
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              <h3 style={{ marginTop: 0, color: '#1b5e20', fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>{authMode === 'login' ? 'Welcome Back 👋' : 'Create Account 🌱'}</h3>
              
              {authMode === 'register' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#4a5568', textTransform: 'uppercase' }}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }} />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#4a5568', textTransform: 'uppercase' }}>Email Address</label>
                <input type="email" placeholder="user@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: '#4a5568', textTransform: 'uppercase' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="Max 5 letters (e.g. Abcde)" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: `1px solid ${authMode === 'register' && passwordInput.length > 0 && !isPasswordValid ? '#e53935' : '#cbd5e0'}`, 
                    fontSize: '15px', 
                    boxSizing: 'border-box' 
                  }} 
                />
                
                {/* Real-time Checklist with MAXIMUM 5 Characters */}
                {authMode === 'register' && (
                  <div style={{ marginTop: '8px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                    <div style={{ color: isLengthValid ? '#2e7d32' : '#e53935', fontWeight: '700', marginBottom: '4px' }}>
                      {isLengthValid ? '✅' : '❌'} Maximum 5 characters long (1 to 5)
                    </div>
                    <div style={{ color: hasUpper ? '#2e7d32' : '#e53935', fontWeight: '700', marginBottom: '4px' }}>
                      {hasUpper ? '✅' : '❌'} At least one uppercase letter (A-Z)
                    </div>
                    <div style={{ color: hasLower ? '#2e7d32' : '#e53935', fontWeight: '700', marginBottom: '4px' }}>
                      {hasLower ? '✅' : '❌'} At least one lowercase letter (a-z)
                    </div>
                    <div style={{ color: hasNoNumbersOrSymbols ? '#2e7d32' : '#e53935', fontWeight: '700' }}>
                      {hasNoNumbersOrSymbols ? '✅' : '❌'} NO numbers or symbols allowed
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={authMode === 'register' && !isPasswordValid}
                style={{ 
                  width: '100%', 
                  background: (authMode === 'register' && !isPasswordValid) ? '#a0aec0' : '#2e7d32', 
                  color: 'white', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  fontWeight: '800', 
                  fontSize: '16px', 
                  cursor: (authMode === 'register' && !isPasswordValid) ? 'not-allowed' : 'pointer', 
                  boxShadow: '0 5px 15px rgba(46,125,50,0.3)' 
                }}
              >
                {authMode === 'login' ? 'Log In to Dashboard' : 'Register Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modern Compact Footer */}
      <footer style={{ background: '#0a1d0b', color: '#8fa891', textAlign: 'center', padding: '30px 20px', marginTop: 'auto', width: '100%' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '700', fontSize: '15px', color: '#ffffff' }}>🌱 ZeroWaste Trip Planner — Protect Nature, Travel Responsibly.</p>
        <p style={{ margin: 0, fontSize: '13px', color: '#668068' }}>© 2026 All Rights Reserved. Built with React, Node.js & MySQL.</p>
      </footer>

    </div>
  );
}

export default App;