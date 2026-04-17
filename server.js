// ============================================================
//  Luxury Estates — Express Backend (FIXED VERSION)
//  Run: npm install && nodemon server.js
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── In-Memory Data Store ──────────────────────────────────────
const properties = [
  {
    id: 1,
    title: 'Oceanfront Cliff Villa',
    address: '123 Ocean Drive, Malibu, CA',
    city: 'Malibu', state: 'CA', zip: '90265',
    price: 2450000,
    beds: 4, baths: 3, sqft: 3200,
    status: 'For Sale', type: 'Villa', built: 2018,
    image: 'villa-exterior.png',
    images: ['villa-exterior.png', 'Card-1.jpg', 'Card-2.jpg', 'property2.jpg'],
    description: 'Luxury oceanfront villa in Malibu.',
    features: ['Infinity pool', 'Ocean view', 'Smart home'],
    lat: 34.0259, lng: -118.7798,
    agentId: 1
  },
  {
    id: 2,
    title: 'Manhattan Luxury Penthouse',
    address: '500 Fifth Avenue, New York, NY',
    city: 'New York', state: 'NY', zip: '10110',
    price: 3850000,
    beds: 3, baths: 3.5, sqft: 2800,
    status: 'For Sale', type: 'Penthouse', built: 2015,
    image: 'property2.jpg',
    images: ['property2.jpg', 'Card-2.jpg', 'Card-3.jpg'],
    description: 'Luxury penthouse in NYC.',
    features: ['Skyline view', 'Terrace', 'Concierge'],
    lat: 40.7549, lng: -73.9840,
    agentId: 2
  }
];

const agents = [
  {
    id: 1,
    name: 'John Smith',
    title: 'Senior Agent',
    phone: '(310) 555-0199',
    email: 'john@luxuryestates.com',
    photo: 'agent1.jpg',
    bio: 'Luxury real estate expert'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'Lead Agent',
    phone: '(310) 555-0188',
    email: 'sarah@luxuryestates.com',
    photo: 'agent2.jpg',
    bio: 'High-end property specialist'
  }
];

const inquiries = [];
const subscribers = [];

// ── API: Properties ───────────────────────────────────────────
app.get('/api/properties', (req, res) => {
  let result = [...properties];

  const { city, type, minPrice, maxPrice, beds, sort, search } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.zip.includes(q)
    );
  }

  if (city) result = result.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (type) result = result.filter(p => p.type.toLowerCase() === type.toLowerCase());
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (beds) result = result.filter(p => p.beds >= Number(beds));

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'newest') result.sort((a, b) => b.built - a.built);

  res.json({ success: true, count: result.length, data: result });
});

// ── API: Single Property ──────────────────────────────────────
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === Number(req.params.id));

  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const agent = agents.find(a => a.id === property.agentId) || null;

  res.json({
    success: true,
    data: { ...property, agent }
  });
});

// ── API: Agents ───────────────────────────────────────────────
app.get('/api/agents', (req, res) => {
  res.json({ success: true, data: agents });
});

// ── API: Contact Form ─────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message, propertyId } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const inquiry = {
    id: inquiries.length + 1,
    firstName,
    lastName,
    email,
    phone: phone || '',
    message,
    propertyId: propertyId || null,
    createdAt: new Date().toISOString()
  };

  inquiries.push(inquiry);

  console.log('New Inquiry:', inquiry);

  res.json({
    success: true,
    message: 'Inquiry submitted successfully',
    data: inquiry
  });
});

// ── API: Newsletter ───────────────────────────────────────────
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const exists = subscribers.find(s => s.email === email);
  if (exists) {
    return res.json({ success: true, message: 'Already subscribed' });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });

  res.json({ success: true, message: 'Subscribed successfully' });
});

// ── API: Stats ────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalProperties: properties.length,
      totalInquiries: inquiries.length,
      totalSubscribers: subscribers.length,
      avgPrice: Math.round(properties.reduce((a, b) => a + b.price, 0) / properties.length)
    }
  });
});

// ── FIXED CATCH-ALL ROUTE (IMPORTANT) ─────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏡 Luxury Estates backend running at http://localhost:${PORT}`);
  console.log('API ready 🚀');
});
