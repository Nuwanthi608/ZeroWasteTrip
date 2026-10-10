import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoImg from './assets/logo.jpg';
import homeBgImg from './assets/home.jpg';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authMode, setAuthMode] = useState('login');
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [tripType, setTripType] = useState('Camping');
  const [days, setDays] = useState(1);
  const [members, setMembers] = useState(1);
  const [items, setItems] = useState([]);
  const [plasticEstimate, setPlasticEstimate] = useState(0);
  const [tripsHistory, setTripsHistory] = useState([]);
  
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  useEffect(() => {
    fetchTripsHistory();
    loadDefaultItems('Camping');
  }, []);

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

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const isLengthValid = password.length >= 5;
    return hasUpperCase && hasLowerCase && isLengthValid;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(passwordInput)) {
      alert('⚠️ Password must be at least 5 characters long and contain both uppercase (A-Z) and lowercase (a-z) letters.');
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
      } else {
        await axios.post('http://localhost:5000/api/login', {
          email: emailInput,
          password: passwordInput
        });
        setIsLoggedIn(true);
        setUserEmail(emailInput);
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
    navigate('/');
  };

  const handleDashboardClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('🔒 Access Denied: Please log in or register before accessing the Trip Dashboard!');
      navigate('/');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/trips', {
        trip_type: tripType,
        days: days,
        members: members
      });

      await loadDefaultItems(tripType);
      setPlasticEstimate(days * members * 2);
      fetchTripsHistory();

      scrollToSection('packing-section');
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

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      
      {/* 🌟 Fixed Sticky Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 9999, background: '#1b5e20', color: 'white', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          <img src={logoImg} alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
          <span>ZeroWaste Trip Planner</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', padding: '6px 14px', borderRadius: '6px', background: location.pathname === '/' ? '#2e7d32' : 'transparent' }}>
            Home
          </Link>

          {location.pathname === '/dashboard' && isLoggedIn && (
            <>
              <span onClick={() => scrollToSection('planner-section')} style={{ color: 'white', cursor: 'pointer', fontWeight: '600' }}>Plan Trip</span>
              <span onClick={() => scrollToSection('packing-section')} style={{ color: 'white', cursor: 'pointer', fontWeight: '600' }}>Packing List</span>
              <span onClick={() => scrollToSection('history-section')} style={{ color: 'white', cursor: 'pointer', fontWeight: '600' }}>Trip History</span>
            </>
          )}
          
          {location.pathname !== '/dashboard' && (
            <Link to="/dashboard" onClick={handleDashboardClick} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', background: '#144517', padding: '6px 14px', borderRadius: '6px' }}>
              Trip Dashboard 🔒
            </Link>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <div style={{ 
            backgroundImage: `linear-gradient(rgba(15, 40, 15, 0.75), rgba(15, 40, 15, 0.75)), url(${homeBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100vw',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px'
          }}>
            <div style={{ width: '100%', maxWidth: '1300px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '50px' }}>
              
              <div style={{ flex: '1 1 500px', color: 'white' }}>
                <h1 style={{ fontSize: '52px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px' }}>
                  Travel Green, <br />Leave No Plastic Behind.
                </h1>
                <p style={{ fontSize: '20px', lineHeight: '1.6', color: '#e8f5e9', marginBottom: '35px' }}>
                  Welcome to ZeroWaste Trip Planner. Join our eco-friendly community to plan sustainable adventures, track plastic reduction, and manage custom eco-packing checklists!
                </p>
                <button onClick={() => { if(isLoggedIn) navigate('/dashboard'); else alert('🔒 Access Denied: Please log in or register before entering the dashboard!'); }} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                  {isLoggedIn ? 'Go to Dashboard 🚀' : 'Log In to Access 🔒'}
                </button>
              </div>

              <div style={{ flex: '0 1 420px', background: 'rgba(255, 255, 255, 0.98)', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', color: '#333' }}>
                {isLoggedIn ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
                    <h2 style={{ color: '#1b5e20', margin: '0 0 10px 0' }}>You are Logged In!</h2>
                    <p style={{ color: '#555', marginBottom: '20px' }}>Logged in as: <strong>{userEmail}</strong></p>
                    <button onClick={() => navigate('/dashboard')} style={{ width: '100%', background: '#2e7d32', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
                      Open Dashboard
                    </button>
                    <button onClick={handleLogout} style={{ width: '100%', background: '#f5f5f5', color: '#333', border: '1px solid #ccc', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '25px' }}>
                      <button onClick={() => setAuthMode('login')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: authMode === 'login' ? '3px solid #2e7d32' : 'none', fontWeight: 'bold', color: authMode === 'login' ? '#2e7d32' : '#777', cursor: 'pointer', fontSize: '17px' }}>
                        Login
                      </button>
                      <button onClick={() => setAuthMode('register')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: authMode === 'register' ? '3px solid #2e7d32' : 'none', fontWeight: 'bold', color: authMode === 'register' ? '#2e7d32' : '#777', cursor: 'pointer', fontSize: '17px' }}>
                        Register
                      </button>
                    </div>

                    <form onSubmit={handleAuthSubmit}>
                      <h3 style={{ marginTop: 0, color: '#1b5e20', fontSize: '22px' }}>{authMode === 'login' ? 'Welcome Back 👋' : 'Create Account 🌱'}</h3>
                      
                      {authMode === 'register' && (
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Full Name</label>
                          <input type="text" placeholder="John Doe" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                      )}

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Email Address</label>
                        <input type="email" placeholder="user@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                      </div>

                      <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Password</label>
                        <input type="password" placeholder="Min 5 chars (e.g. Abc12)" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        <small style={{ color: '#666', fontSize: '12px' }}>* Minimum 5 characters, includes uppercase (A-Z) & lowercase (a-z) letters.</small>
                      </div>

                      <button type="submit" style={{ width: '100%', background: '#2e7d32', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer' }}>
                        {authMode === 'login' ? 'Log In to Dashboard' : 'Register Account'}
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>
          </div>
        } />

        <Route path="/dashboard" element={
          <div style={{ width: '100vw', maxWidth: '1200px', margin: '40px auto', padding: '0 30px', boxSizing: 'border-box', flex: 1 }}>
            
            <div id="planner-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px' }}>✨ Plan a New Sustainable Trip</h2>
              <form onSubmit={handleGenerateTrip}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Trip Type:</label>
                  <select value={tripType} onChange={(e) => { setTripType(e.target.value); loadDefaultItems(e.target.value); }} style={{ padding: '12px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option value="Camping">Camping</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Beach">Beach Trip</option>
                    <option value="Safari">Wildlife Safari</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Number of Days:</label>
                  <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={{ padding: '12px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Number of Members:</label>
                  <input type="number" min="1" value={members} onChange={(e) => setMembers(e.target.value)} style={{ padding: '12px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>

                <button type="submit" style={{ background: '#2e7d32', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '17px' }}>
                  Generate Zero-Waste Plan & Packing List
                </button>
              </form>
            </div>

            {plasticEstimate > 0 && (
              <div style={{ background: '#e8f5e9', padding: '25px', borderRadius: '12px', marginBottom: '30px', borderLeft: '6px solid #2e7d32' }}>
                <h3 style={{ color: '#1b5e20', margin: '0 0 10px 0' }}>🌍 Environmental Impact & Waste Reduction</h3>
                <p style={{ margin: 0, color: '#2e7d32', fontSize: '17px' }}>
                  By choosing reusable gear, this trip will prevent approximately <strong>{plasticEstimate} single-use plastic items</strong> from harming nature!
                </p>
              </div>
            )}

            <div id="packing-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px' }}>🎒 Recommended Reusable Packing List</h2>
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item.id} onClick={() => toggleCheck(item.id)} style={{ background: item.checked ? '#f1f8e9' : '#fff', padding: '14px 18px', margin: '10px 0', border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#888' : '#222' }}>
                    <span style={{ fontWeight: '500' }}>{item.checked ? '✅ ' : '🔲 '} {item.item_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ background: '#e0f7fa', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', color: '#006064', fontWeight: '600' }}>{item.category}</span>
                      <button onClick={(e) => handleDeleteItem(item.id, e)} title="Delete Item" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}>
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleAddCustomItem} style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '25px' }}>
                <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>➕ Add Custom Item to List</h4>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} style={{ padding: '12px', flex: 2, borderRadius: '6px', border: '1px solid #ccc' }} />
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ padding: '12px', flex: 1, borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option value="General">General</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Dining">Dining</option>
                    <option value="Camping Gear">Camping Gear</option>
                    <option value="Personal Care">Personal Care</option>
                  </select>
                  <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
                </div>
              </form>
            </div>

            <div id="history-section" style={{ background: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h2 style={{ color: '#1b5e20', marginTop: 0, fontSize: '26px' }}>📜 Previous Trips History</h2>
              {tripsHistory.length === 0 ? (
                <p style={{ color: '#777' }}>No saved trips yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', textAlign: 'left', color: '#333' }}>
                        <th style={{ padding: '14px', borderBottom: '2px solid #ddd' }}>ID</th>
                        <th style={{ padding: '14px', borderBottom: '2px solid #ddd' }}>Trip Type</th>
                        <th style={{ padding: '14px', borderBottom: '2px solid #ddd' }}>Days</th>
                        <th style={{ padding: '14px', borderBottom: '2px solid #ddd' }}>Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripsHistory.map((trip) => (
                        <tr key={trip.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '14px', color: '#555' }}>{trip.id}</td>
                          <td style={{ padding: '14px', fontWeight: '500', color: '#333' }}>{trip.trip_type}</td>
                          <td style={{ padding: '14px', color: '#555' }}>{trip.days}</td>
                          <td style={{ padding: '14px', color: '#555' }}>{trip.members}</td>
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

      {/* Footer */}
      <footer style={{ background: '#103714', color: '#cfd8dc', textAlign: 'center', padding: '25px 20px', marginTop: 'auto', width: '100%' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>🌱 ZeroWaste Trip Planner — Protect Nature, Travel Responsibly.</p>
        <p style={{ margin: 0, fontSize: '13px', color: '#90a4ae' }}>© 2026 All Rights Reserved. Built with React, Node.js & MySQL.</p>
      </footer>

    </div>
  );
}

export default App;