# 🏎️ APEX-01 — Formula One Engineering Website

A premium Formula One engineering showcase website built with React, Vite, Three.js, GSAP, Express.js, and MongoDB.

**Live Demo:** https://f1-cars-dvhs.vercel.app/#/
**Repository:** https://github.com/shivakumar-dev-11/f1-cars

---

## 📌 Overview

APEX-01 is an interactive Formula One inspired web experience designed to showcase F1 car engineering, aerodynamics, mechanical systems, technical systems, driver legends, and performance data through a premium dark UI.

The project combines a cinematic frontend experience with backend API support for driver records, feedback submissions, and private viewing bookings.

---

## ✨ Key Features

* Premium Formula One dark theme UI
* Interactive 3D-inspired car experience
* Smooth scroll-based animations
* GSAP ScrollTrigger animations
* Three.js visual effects
* Canvas-based car frame sequence
* F1 engineering sections
* Mechanical systems page
* Technical systems page
* F1 evolution archive
* GOAT drivers page
* Driver data API
* Feedback submission system
* Private viewing booking form
* MongoDB database integration
* Responsive frontend layout
* Vercel-ready production build

---

## 🧱 Project Architecture

```txt
f1-cars/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── data/
│   │   │   └── siteData.js
│   │   ├── App.jsx
│   │   ├── main.js
│   │   ├── three-scene.js
│   │   ├── audio-controller.js
│   │   └── style.css
│   │
│   ├── index.html
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   ├── env.js
│   │   └── mongo.js
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   ├── driverRoutes.js
│   │   └── feedbackRoutes.js
│   │
│   ├── scripts/
│   │   └── seedDrivers.js
│   │
│   ├── index.js
│   └── seedData.js
│
├── api/
├── package.json
├── package-lock.json

```

---

## ⚙️ Technology Stack

| Layer           | Technology           |
| --------------- | -------------------- |
| Frontend        | React.js             |
| Build Tool      | Vite                 |
| Styling         | CSS3                 |
| 3D / Visuals    | Three.js             |
| Animation       | GSAP + ScrollTrigger |
| Backend         | Node.js + Express.js |
| Database        | MongoDB              |
| ODM             | Mongoose             |
| Deployment      | Vercel               |
| Version Control | Git + GitHub         |

---

## 🖥️ Frontend Pages

### Home

The main cinematic landing page with car visuals, scroll animations, engineering highlights, performance sections, audio toggle, specification modal, and booking modal.

### Evolution

Shows the evolution of Formula One cars across different eras including front-engine origins, rear-engine revolution, turbo power, hybrid efficiency, and modern ground effect.

### Mechanical

Explains important mechanical parts such as carbon monocoque, front wing, suspension, brake system, cooling package, power unit mounting, gearbox, rear wing, and diffuser.

### Technical

Covers technical Formula One systems such as aerodynamics, hybrid deployment, thermal management, tyre operating window, vehicle dynamics, and race control data.

### GOATs

Displays legendary Formula One drivers with records such as titles, wins, podiums, and pole positions. The page can load data from the backend API and falls back to static data if the API is unavailable.

---

## 🔌 Backend API

The backend is built with Express.js and MongoDB.

### API Endpoints

```txt
GET    /api/health
GET    /api/drivers
GET    /api/drivers/:slug
GET    /api/feedback
POST   /api/feedback
GET    /api/bookings
POST   /api/bookings
```

### API Purpose

| Endpoint             | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `/api/health`        | Checks backend and database status         |
| `/api/drivers`       | Returns F1 driver records                  |
| `/api/drivers/:slug` | Returns one driver by slug                 |
| `/api/feedback`      | Stores and lists record update suggestions |
| `/api/bookings`      | Stores and lists private viewing requests  |

---

## 🗄️ Database

The project uses MongoDB through Mongoose.

Database name:

```txt
apex01
```

Required environment variable:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=apex01
PORT=3001
```

---

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/shivakumar-dev-11/f1-cars.git
```

### 2. Move into the project folder

```bash
cd f1-cars
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The frontend runs on:

```txt
http://127.0.0.1:5173
```

### 5. Start the backend

```bash
npm run dev:api
```

The backend runs on:

```txt
http://127.0.0.1:3001
```

---

## 🌱 Seed Driver Data

To insert driver records into MongoDB:

```bash
npm run seed:drivers
```

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌍 Deployment

The project is deployed on Vercel.

For Vercel deployment, make sure the output directory is:

```txt
dist
```

The Vite build configuration already builds the frontend into the root `dist` folder.

---

## 📊 Performance Notes

* Uses Vite for fast development and optimized production builds
* Uses GSAP ScrollTrigger for smooth scroll animations
* Uses frame sequence rendering for cinematic car motion
* Uses dynamic import for home experience initialization
* Uses fallback driver data when backend API is unavailable
* Uses MongoDB for persistent driver, booking, and feedback data

---

## 🔮 Future Improvements

* Add real Formula One race calendar
* Add live F1 data integration
* Add team comparison dashboard
* Add driver profile detail pages
* Add admin dashboard for feedback and bookings
* Add authentication for admin access
* Improve mobile 3D performance
* Add CMS support for content updates
* Add race telemetry visualization
* Add car model rotation using real 3D assets

---

## 👨‍💻 Developer

**Shiva Kumar**
GitHub: https://github.com/shivakumar-dev-11

---

## 📄 License

This project is created for educational, portfolio, and demonstration purposes.

---

## ⭐ Support

If you like this project, give the repository a star on GitHub.
