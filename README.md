# 📱 Jenext Mobile - Website Setup Guide

## Files Inside This Package

```
jenext-mobile/
├── index.html      ← Main Website (Customer facing)
├── admin.html      ← Admin Panel
├── server.js       ← Node.js Backend API
├── package.json    ← Node.js dependencies
└── README.md       ← This file
```

---

## 🚀 Quick Start (Frontend Only - No Backend Needed)

Just open `index.html` in any browser — it works standalone!
- WhatsApp button connects directly to 0718986024
- Contact form sends message via WhatsApp
- All shop info is displayed

---

## 🔧 Admin Panel

Open `admin.html` in browser.

**Login credentials:**
- Username: `admin`
- Password: `jenext2024`

**Admin features:**
- 📊 Dashboard with stats
- 📱 Add / Edit / Delete phones
- 💬 View & manage customer inquiries
- 🔧 Track repair jobs (Add / Update status)

---

## ⚙️ Backend Setup (Optional - for real database)

### Requirements
- Node.js (v18+) — Download: https://nodejs.org

### Steps
```bash
# 1. Open terminal in this folder
cd jenext-mobile

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Server runs at: **http://localhost:3001**

### API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/phones | Get all phones |
| GET | /api/phones/featured | Get featured phones |
| POST | /api/inquiries | Submit inquiry |
| POST | /api/admin/login | Admin login |
| GET | /api/admin/phones | Admin - all phones |
| POST | /api/admin/phones | Admin - add phone |
| PUT | /api/admin/phones/:id | Admin - edit phone |
| DELETE | /api/admin/phones/:id | Admin - delete phone |
| GET | /api/admin/inquiries | Admin - all inquiries |
| GET | /api/admin/repairs | Admin - all repairs |
| POST | /api/admin/repairs | Admin - add repair |
| PUT | /api/admin/repairs/:id | Admin - update repair |
| GET | /api/admin/stats | Admin - dashboard stats |

---

## 🌐 Hosting Options

### Free Hosting (Frontend)
- **Netlify**: Drag & drop `index.html` + `admin.html` at netlify.com
- **GitHub Pages**: Upload to GitHub, enable Pages

### Backend Hosting
- **Railway.app** (Free tier): Deploy `server.js`
- **Render.com** (Free tier): Connect GitHub repo

---

## 🔑 Change Admin Password

In `server.js`, find line:
```javascript
password: bcrypt.hashSync('jenext2024', 10)
```
Replace `jenext2024` with your new password.

---

## 📞 Shop Contact Info
- **Hotline**: 0452 266 084
- **WhatsApp**: 0718 986 024
- **Address**: 24/A Hindurangala, Kiriella

---

*Built for Jenext Mobile, Kiriella* 🇱🇰
