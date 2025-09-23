# 🚀 Node.js Express App  

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)  
[![Docker Build](https://img.shields.io/badge/docker-ready-blue?logo=docker)](https://www.docker.com/)  
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)  
[![Build Status](https://img.shields.io/github/actions/workflow/status/flaseen/node-express/ci.yml?branch=main)](https://github.com/flaseen/node-express/actions)  
[![GitHub issues](https://img.shields.io/github/issues/flaseen/node-express)](https://github.com/flaseen/node-express/issues)  
[![GitHub stars](https://img.shields.io/github/stars/flaseen/node-express?style=social)](https://github.com/flaseen/node-express/stargazers)  

A simple **Node.js + Express.js** starter project. This application provides a RESTful API and can be run locally or inside a Docker Container.

---

## 📦 Features
- Versioned RESTful API
- Environment variables via `.env`
- CI/CD Integration using GitHub, Jenkins & Docker

---

## 🛠️ Installation
```bash
git clone https://github.com/flaseen/node-express.git
cd your-repo
npm install
```

---

## ▶️ Running the App
```bash
npm start
```
By default, the server runs on **http://localhost:3000**  

With Nodemon (hot reload in dev):  
```bash
npm run dev
```

---

## 🌍 API Endpoints

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/api/v1/`       | Welcome message           |
| GET    | `/api/v1/health` | App Health check endpoint |

---

## ⚙️ Environment Variables
Create a `.env` file in the project root:  
```env
APP_PORT=3000
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:3000,https://staging.example.com,https://app.example.com
API_VERSION=v1
```

---

## 🐳 Run with Docker
```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d --build
```

---

## 🧪 Testing
```bash
npm test
```

---

## 📂 Project Structure
```
.
├── src/
│   ├── index.js        # App entry point
│   ├── routes/         # Express routes
│   └── controllers/    # Route handlers
├── .env.example
├── .dockerignore
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Jenkinsfile
├── package-lock.json
├── package.json
├── LICENSE
└── README.md
```

---

## 📜 License
MIT License – feel free to use this boilerplate for your projects.  