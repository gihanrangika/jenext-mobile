// =============================================
// JENEXT MOBILE - Backend Server (Node.js)
// =============================================
// Install: npm install express cors bcryptjs jsonwebtoken
// Run: node server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'jenext_secret_2024_change_this';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// IN-MEMORY DATABASE (Replace with MySQL/MongoDB)
// =============================================
let db = {
  admin: {
    username: 'admin',
    password: bcrypt.hashSync('jenext2024', 10), // Change this password!
    name: 'Jenext Admin'
  },
  phones: [
    { id: 1, name: 'Samsung Galaxy A55', brand: 'Samsung', model: 'A55', storage: '128GB', condition: 'new', price: 85000, warranty: '1 Year', stock: 3, image: '📱', description: 'Brand new sealed box', featured: true, createdAt: new Date().toISOString() },
    { id: 2, name: 'iPhone 15', brand: 'Apple', model: '15', storage: '128GB', condition: 'new', price: 195000, warranty: '1 Year', stock: 2, image: '📱', description: 'Brand new with box', featured: true, createdAt: new Date().toISOString() },
    { id: 3, name: 'Samsung S23', brand: 'Samsung', model: 'S23', storage: '256GB', condition: 'used', price: 95000, warranty: '3 Months', stock: 1, image: '📱', description: 'Used - excellent condition', featured: false, createdAt: new Date().toISOString() },
    { id: 4, name: 'Redmi Note 13', brand: 'Xiaomi', model: 'Note 13', storage: '128GB', condition: 'new', price: 45000, warranty: '1 Year', stock: 5, image: '📱', description: 'Brand new', featured: true, createdAt: new Date().toISOString() },
  ],
  inquiries: [
    { id: 1, name: 'Test Customer', phone: '0771234567', service: 'Display Replacement', message: 'Screen cracked, need repair', status: 'pending', createdAt: new Date().toISOString() }
  ],
  repairs: [
    { id: 1, customerName: 'Kamal Perera', customerPhone: '0771234567', deviceType: 'Mobile', deviceModel: 'Samsung A32', issue: 'Display broken', status: 'in-progress', estimatedCost: 4500, createdAt: new Date().toISOString() }
  ],
  nextId: { phones: 5, inquiries: 2, repairs: 2 }
};

// =============================================
// MIDDLEWARE - Auth Check
// =============================================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// =============================================
// PUBLIC ROUTES
// =============================================

// Get all available phones (public)
app.get('/api/phones', (req, res) => {
  const available = db.phones.filter(p => p.stock > 0);
  res.json({ success: true, data: available });
});

// Get featured phones
app.get('/api/phones/featured', (req, res) => {
  const featured = db.phones.filter(p => p.featured && p.stock > 0);
  res.json({ success: true, data: featured });
});

// Submit inquiry (public)
app.post('/api/inquiries', (req, res) => {
  const { name, phone, service, message } = req.body;
  if (!name || !phone || !service) return res.status(400).json({ error: 'Name, phone and service are required' });
  const inquiry = {
    id: db.nextId.inquiries++,
    name, phone, service, message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.inquiries.unshift(inquiry);
  res.json({ success: true, message: 'Inquiry submitted successfully!', data: inquiry });
});

// =============================================
// ADMIN AUTH
// =============================================

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== db.admin.username) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, db.admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username, name: db.admin.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, admin: { username, name: db.admin.name } });
});

// =============================================
// ADMIN - PHONES
// =============================================

app.get('/api/admin/phones', authMiddleware, (req, res) => {
  res.json({ success: true, data: db.phones });
});

app.post('/api/admin/phones', authMiddleware, (req, res) => {
  const { name, brand, model, storage, condition, price, warranty, stock, description, featured } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });
  const phone = {
    id: db.nextId.phones++,
    name, brand, model, storage, condition, price: Number(price),
    warranty, stock: Number(stock) || 1, description, featured: !!featured,
    image: '📱', createdAt: new Date().toISOString()
  };
  db.phones.unshift(phone);
  res.json({ success: true, message: 'Phone added!', data: phone });
});

app.put('/api/admin/phones/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.phones.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Phone not found' });
  db.phones[idx] = { ...db.phones[idx], ...req.body, id };
  res.json({ success: true, message: 'Phone updated!', data: db.phones[idx] });
});

app.delete('/api/admin/phones/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  db.phones = db.phones.filter(p => p.id !== id);
  res.json({ success: true, message: 'Phone deleted!' });
});

// =============================================
// ADMIN - INQUIRIES
// =============================================

app.get('/api/admin/inquiries', authMiddleware, (req, res) => {
  res.json({ success: true, data: db.inquiries });
});

app.put('/api/admin/inquiries/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.inquiries.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });
  db.inquiries[idx] = { ...db.inquiries[idx], ...req.body, id };
  res.json({ success: true, data: db.inquiries[idx] });
});

// =============================================
// ADMIN - REPAIRS
// =============================================

app.get('/api/admin/repairs', authMiddleware, (req, res) => {
  res.json({ success: true, data: db.repairs });
});

app.post('/api/admin/repairs', authMiddleware, (req, res) => {
  const repair = {
    id: db.nextId.repairs++,
    ...req.body,
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString()
  };
  db.repairs.unshift(repair);
  res.json({ success: true, message: 'Repair job added!', data: repair });
});

app.put('/api/admin/repairs/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.repairs.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Repair not found' });
  db.repairs[idx] = { ...db.repairs[idx], ...req.body, id };
  res.json({ success: true, data: db.repairs[idx] });
});

app.delete('/api/admin/repairs/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  db.repairs = db.repairs.filter(r => r.id !== id);
  res.json({ success: true, message: 'Repair job deleted!' });
});

// =============================================
// ADMIN - DASHBOARD STATS
// =============================================

app.get('/api/admin/stats', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      totalPhones: db.phones.length,
      totalStock: db.phones.reduce((sum, p) => sum + p.stock, 0),
      totalInquiries: db.inquiries.length,
      pendingInquiries: db.inquiries.filter(i => i.status === 'pending').length,
      totalRepairs: db.repairs.length,
      activeRepairs: db.repairs.filter(r => r.status === 'in-progress').length,
      pendingRepairs: db.repairs.filter(r => r.status === 'pending').length,
    }
  });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     JENEXT MOBILE - Backend Server    ║
  ║     Running on: http://localhost:${PORT}  ║
  ╚═══════════════════════════════════════╝
  
  Admin Login:  username: admin | password: jenext2024
  API Docs:     http://localhost:${PORT}/api
  `);
});

module.exports = app;
