// ============================================================
//  Luxury Estates — Express Backend
//  Run: npm install && node server.js
//  Then open: http://localhost:3000
// ============================================================

const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serves HTML/CSS/JS/images

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
    description: 'Stunning contemporary villa perched on Malibu cliffs with breathtaking Pacific Ocean views. This architectural masterpiece features floor-to-ceiling windows, open-concept living, a chef\'s kitchen with Sub-Zero appliances, and a master suite with a private terrace. Outside, enjoy the infinity pool, spa, and direct beach trail access.',
    features: ['Oceanfront location','Infinity pool & spa','Chef\'s kitchen','3-car garage','Smart home system','Private beach access','Home theatre','Wine cellar'],
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
    description: 'Iconic penthouse atop Fifth Avenue with sweeping views of Central Park and the Manhattan skyline. Designed by a world-renowned architect, this residence features custom Italian marble, designer finishes throughout, a private rooftop terrace, and concierge service.',
    features: ['360° skyline views','Private rooftop terrace','Concierge & doorman','Italian marble floors','Custom chef\'s kitchen','Private elevator','2 parking spaces','Storage unit'],
    lat: 40.7549, lng: -73.9840,
    agentId: 2
  },
  {
    id: 3,
    title: 'Waterfront Modern Estate',
    address: '45 Lake Shore Drive, Miami, FL',
    city: 'Miami', state: 'FL', zip: '33101',
    price: 5200000,
    beds: 5, baths: 4.5, sqft: 4500,
    status: 'For Sale', type: 'Estate', built: 2020,
    image: 'property3.jpg',
    images: ['property3.jpg', 'Card-1.jpg', 'villa-exterior.png'],
    description: 'Extraordinary waterfront estate with private deep-water dock, panoramic bay views, and resort-style outdoor living. The open-plan interior features soaring ceilings, gallery walls, and seamless indoor-outdoor flow through retractable glass walls.',
    features: ['Private deep-water dock','Boat lift','Resort-style pool','Outdoor summer kitchen','Smart home automation','5-car garage','Guest house','Putting green'],
    lat: 25.7617, lng: -80.1918,
    agentId: 1
  },
  {
    id: 4,
    title: 'Historic Back Bay Mansion',
    address: '77 Commonwealth Ave, Boston, MA',
    city: 'Boston', state: 'MA', zip: '02116',
    price: 4500000,
    beds: 6, baths: 5, sqft: 5800,
    status: 'For Sale', type: 'Mansion', built: 1895,
    image: 'property4.jpg',
    images: ['property4.jpg', 'property2.jpg', 'Card-3.jpg'],
    description: 'Magnificent Victorian-era mansion on the prestigious Commonwealth Avenue Mall. Meticulously restored with every modern luxury, this landmark property retains its original ornate plasterwork, stained glass, and carved mahogany staircases while adding contemporary comforts throughout.',
    features: ['Historic landmark','Original period details','Restored grand staircase','Gourmet kitchen addition','Home gym & spa','Formal gardens','Carriage house / 2-car garage','Original stained glass'],
    lat: 42.3505, lng: -71.0779,
    agentId: 3
  },
  {
    id: 5,
    title: 'Mountain Cliff Retreat',
    address: '789 Summit Ridge, Aspen, CO',
    city: 'Aspen', state: 'CO', zip: '81611',
    price: 1850000,
    beds: 4, baths: 3, sqft: 2900,
    status: 'For Sale', type: 'Retreat', built: 2019,
    image: 'property5.jpg',
    images: ['property5.jpg', 'Card-1.jpg', 'property3.jpg'],
    description: 'Dramatic modern retreat cantilevered over Aspen\'s most coveted ridge, offering unobstructed views of the Elk Mountains. Floor-to-ceiling glass walls dissolve the boundary between inside and out, delivering an incomparable alpine living experience year-round.',
    features: ['Cliff-edge infinity pool','Panoramic mountain views','Heated floors throughout','Ski-in/ski-out access','Outdoor hot tub','Gourmet kitchen','Home theatre','2-car heated garage'],
    lat: 39.1911, lng: -106.8175,
    agentId: 2
  },
  {
    id: 6,
    title: 'Sunset Oceanfront Villa',
    address: '321 Beachfront Ave, Malibu, CA',
    city: 'Malibu', state: 'CA', zip: '90265',
    price: 6800000,
    beds: 5, baths: 5, sqft: 5200,
    status: 'For Sale', type: 'Villa', built: 2021,
    image: 'property6.jpg',
    images: ['property6.jpg', 'villa-exterior.png', 'Card-2.jpg'],
    description: 'The ultimate Malibu trophy property. Perched above the Pacific with direct beach access, this ultra-modern villa was designed by a Pritzker Prize–winning architect. Features include a sculptural infinity pool, home automation, a 3,000-bottle wine cellar, and unobstructed sunset views from every room.',
    features: ['Direct beach access','Sculptural infinity pool','Architect-designed','3,000-bottle wine cellar','Full home automation','Elevator','4-car garage','Outdoor cinema'],
    lat: 34.0359, lng: -118.6892,
    agentId: 1
  }
];

const agents = [
  { id: 1, name: 'John Smith',  title: 'Founder & Senior Luxury Agent', phone: '(310) 555-0199', email: 'john@luxuryestates.com', photo: 'wmremove-transformed.jpeg', bio: 'With 20+ years in the luxury market, John has closed over $1.2B in sales.' },
  { id: 2, name: 'Sarah Johnson', title: 'Lead Agent, Beverly Hills', phone: '(310) 555-0188', email: 'sarah@luxuryestates.com', photo: 'wmremove-transformed.jpeg', bio: 'Specialist in Beverly Hills and Bel Air estates with a remarkable client portfolio.' },
  { id: 3, name: 'Michael Chen', title: 'Luxury Specialist, East Coast', phone: '(617) 555-0177', email: 'michael@luxuryestates.com', photo: 'wmremove-transformed.jpeg', bio: 'Michael\'s expertise spans historic properties to contemporary masterpieces.' }
];

const inquiries   = [];   // In-memory store
const subscribers = [];   // In-memory store

// ── API: Properties ───────────────────────────────────────────
// GET /api/properties?city=&type=&minPrice=&maxPrice=&beds=&sort=
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
  if (city)     result = result.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (type)     result = result.filter(p => p.type.toLowerCase() === type.toLowerCase());
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (beds)     result = result.filter(p => p.beds >= Number(beds));

  if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'newest')     result.sort((a, b) => b.built - a.built);

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/properties/:id
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === Number(req.params.id));
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

  const agent = agents.find(a => a.id === property.agentId) || agents[0];
  res.json({ success: true, data: { ...property, agent } });
});

// ── API: Agents ───────────────────────────────────────────────
app.get('/api/agents', (req, res) => {
  res.json({ success: true, data: agents });
});

// ── API: Contact Form ─────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, inquiryType, message, propertyId } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const inquiry = {
    id: inquiries.length + 1,
    firstName, lastName, email, phone: phone || '',
    inquiryType: inquiryType || 'General Question',
    message, propertyId: propertyId || null,
    createdAt: new Date().toISOString()
  };
  inquiries.push(inquiry);

  console.log(`[INQUIRY] New inquiry from ${firstName} ${lastName} <${email}>`);
  res.json({ success: true, message: `Thank you ${firstName}! We'll respond within 24 hours.`, data: inquiry });
});

// ── API: Newsletter ───────────────────────────────────────────
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
  }
  if (subscribers.find(s => s.email === email)) {
    return res.json({ success: true, message: 'You\'re already subscribed!' });
  }
  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  console.log(`[NEWSLETTER] New subscriber: ${email}`);
  res.json({ success: true, message: 'Subscribed! You\'ll be first to know about new listings.' });
});

// ── Stats ─────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalProperties: properties.length,
      totalInquiries:  inquiries.length,
      totalSubscribers: subscribers.length,
      avgPrice: Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length)
    }
  });
});

// ── Catch-all: serve index ────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏡 Luxury Estates backend running at http://localhost:${PORT}`);
  console.log(`   API endpoints:`);
  console.log(`   GET  /api/properties`);
  console.log(`   GET  /api/properties/:id`);
  console.log(`   GET  /api/agents`);
  console.log(`   POST /api/contact`);
  console.log(`   POST /api/newsletter\n`);
});