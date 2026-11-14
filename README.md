# IdentityFirst (NeoID) — Dignity Through Identity

> **A privacy-first digital identity and welfare access platform empowering unhoused individuals to obtain verifiable ID cards without residential address proof.**

---

## 📋 Overview

**IdentityFirst** bridges the documentation gap for unhoused populations who are routinely excluded from essential government and welfare services—such as healthcare, emergency shelters, and food distribution—due to the lack of permanent address proof.

Built with a **React + Vite** frontend and an **Express + MongoDB** backend, the platform enables beneficiaries and field volunteers to generate cryptographically secure, verifiable digital ID cards while keeping sensitive biometric and photo data strictly on the client side.

### ✨ Key Features

- **Address-Free Digital ID Issuance:** Generates unique, verifiable ID numbers on the server using cryptographically secure randomness without requiring residential address proof.
- **Privacy-by-Design Architecture:** Photos and biometric identifiers never leave the user's browser and are never transmitted to or stored on the backend.
- **Consent-Gated Public Verification:** Public ID lookup (`GET /api/verify/:idNumber`) exposes only validity status, issue date, and an explicitly consented masked cardholder name.
- **Secure Donation Processing:** Integrates Razorpay one-time INR donations with server-side signature verification and idempotent webhook handling (`payment.captured` & `order.paid`).
- **Hardened API Security:** Enforces server-side input validation, request payload size limits, strict CORS origin allowlisting, token-protected admin lookups, and per-IP rate limiting across submission and verification routes.
- **Community & Volunteer Intake:** Validated contact and volunteer registration pipelines with real-time UI error handling.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript/JavaScript, Vite, Tailwind CSS |
| **Backend** | Node.js (v22+), Express.js, RESTful APIs |
| **Database** | MongoDB / MongoDB Atlas |
| **Payments & Webhooks** | Razorpay Checkout & Signed Webhooks |
| **Deployment** | Vercel (Frontend), Render (Backend / Full-Stack Blueprint) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** `v22.0.0` or higher
- **MongoDB** instance (local MongoDB server or a [MongoDB Atlas](https://mongodb.com) cluster)
- *(Optional)* **Razorpay Test Credentials** to test donation flows locally

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/abiraisingh/id-for-all-cards]
   cd id-for-all-cards
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` and populate the required values:
   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Description |
   | :--- | :---: | :--- |
   | `PORT` | No | Express API port (defaults to `3001` in dev) |
   | `MONGODB_URI` | **Yes** | MongoDB connection string (API exits on startup if missing/unreachable) |
   | `ADMIN_API_TOKEN` | **Yes** | Long, cryptographically random secret token for admin routes |
   | `CORS_ORIGINS` | Prod | Comma-separated list of allowed frontend origins (no trailing slashes) |
   | `VITE_API_BASE_URL` | Split Deploy | Public backend origin when frontend is hosted separately (e.g., Vercel) |
   | `RAZORPAY_KEY_ID` | Optional | Razorpay API Key ID (test or live) |
   | `RAZORPAY_KEY_SECRET` | Optional | Razorpay API Key Secret |
   | `RAZORPAY_WEBHOOK_SECRET` | Optional | Secret used to verify Razorpay webhook signatures |

4. **Run the development servers**
   - **Full-Stack (Frontend + API):**
     ```bash
     npm run dev
     ```
     Open **`http://localhost:8080`**. Vite automatically proxies `/api` requests to Express on port `3001`.
   - **Frontend Only:**
     ```bash
     npm run dev:frontend
     ```
     *(Note: API-backed forms and verification require the Express process to be running.)*

5. **Production Build & Start**
   ```bash
   npm run build
   npm start
   ```
   `npm start` launches Express in production mode, serving both the REST API and the compiled frontend bundle.

---

## 📡 API Reference

All submission endpoints validate payloads on the server, restrict request body sizes, and enforce per-IP rate limits.

### System & Health

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Reports API health and MongoDB connection readiness. |

### Digital ID Cards & Verification

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/id-cards` | Public (Rate-Limited) | Creates an ID card record after separate explicit consent for storage and masked-name display. Generates a cryptographically secure ID number server-side. |
| `GET` | `/api/verify/:idNumber` | Public (Rate-Limited) | Checks card validity and issue date, returning a masked name if consented. Never exposes full name, DOB, contact info, address, or photos. |
| `GET` | `/api/admin/id-cards/:idNumber` | Admin (`Bearer` Token) | Returns the complete stored record for authorized administrators. |

### Donations (Razorpay)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/donations/status` | Public | Reports whether Razorpay checkout is active and configured. |
| `POST` | `/api/donations` | Public (Rate-Limited) | Initializes a one-time INR donation and creates a Razorpay order. |
| `POST` | `/api/donations/verify` | Public | Verifies the Razorpay checkout signature and confirms payment capture before marking as paid. |
| `POST` | `/api/webhooks/razorpay` | Razorpay Webhook | Processes signed `payment.captured` and `order.paid` events so payments are recorded even if the donor closes checkout early. |

### Outreach & Volunteering

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public (Rate-Limited) | Validates and stores a contact inquiry. *(No public read endpoint exists.)* |
| `POST` | `/api/volunteer` | Public (Rate-Limited) | Validates and stores a volunteer application. *(No public read endpoint exists.)* |

---

## ☁️ Deployment Guide

This repository includes a `render.yaml` Blueprint for deploying on **Render** (either as a unified full-stack service or paired with **Vercel** for the frontend).

### 1. Database Setup (MongoDB Atlas)
1. Provision a **MongoDB Atlas** cluster.
2. Create a dedicated database user with least-privilege read/write access to the application database.
3. Configure **Atlas Network Access** to allow connections from your Render service's outbound IP addresses.

### 2. Backend Deployment (Render)
1. Create a **Render Blueprint** from this repository, or configure a Node Web Service manually:
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
2. Configure environment variables in Render:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `ADMIN_API_TOKEN`: A strong, randomly generated secret string.
   - `CORS_ORIGINS`: Comma-separated exact public frontend origins without paths or trailing slashes (e.g., `https://vercel.app`).

### 3. Split Frontend Deployment (Vercel — Optional)
If hosting the frontend separately on Vercel instead of serving it from Express:
1. Set `VITE_API_BASE_URL` in Vercel's Production environment variables to your Render service origin without `/api` or a trailing slash (e.g., `https://onrender.com`). *(Leave empty if using same-origin hosting on Render.)*
2. Redeploy the Vercel project so Vite embeds the API origin at build time.

### 4. Payment Webhooks (Razorpay)
1. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` as secret environment variables in Render.
2. In your Razorpay Dashboard, register `https://<your-render-service>/api/webhooks/razorpay` for **`payment.captured`** and **`order.paid`** events using the exact same webhook secret.
3. Validate end-to-end checkout in Razorpay **Test Mode** before switching to live credentials.

---

## 🔒 Data Governance & Privacy Policy

IdentityFirst is engineered around strict data minimization and informed consent:

- **Zero Server-Side Biometrics:** Beneficiary photos and biometric IDs remain strictly in the browser and are never sent to or persisted by the Express API.
- **Granular Consent Tracking:** ID records are stored only after explicit user consent for record storage and separate explicit consent for public masked-name display. Consent timestamps and policy versions are logged alongside records.
- **Minimal Public Exposure:** Public verification endpoints never leak full names, birth dates, contact details, or addresses.
- **Protected Admin Access:** Full record retrieval requires the `ADMIN_API_TOKEN` bearer credential and should only be invoked from trusted server-side tools. Contact and volunteer submissions have no public read endpoints.

---


## 👤 Author

Abirai Singh

