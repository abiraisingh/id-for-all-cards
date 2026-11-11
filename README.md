# IdentityFirst

IdentityFirst is a React/Vite site served by an Express API. MongoDB stores contact messages, volunteer applications, donation pledges, and consented ID-card records.

## Run locally

Requirements: Node.js 22 or newer and a MongoDB database (local MongoDB or MongoDB Atlas).

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `ADMIN_API_TOKEN`. To enable donations locally, also set Razorpay test credentials and a webhook secret.
3. Run `npm run dev` to start the frontend and API together. `npm run dev:frontend` starts only Vite; API-backed forms require the API process.
4. Open `http://localhost:8080`. The Vite server proxies `/api` requests to Express on port 3001.

For production, `npm run build` builds the frontend and `npm start` starts Express, which serves both the API and the built site. Set `PORT`, `MONGODB_URI`, and `ADMIN_API_TOKEN` in the environment. The API exits on startup if MongoDB is not configured or cannot be reached.

## API

- `GET /api/health` reports API and database readiness.
- `POST /api/contact` saves a validated contact message.
- `POST /api/volunteer` saves a validated volunteer application.
- `GET /api/donations/status` reports whether Razorpay checkout is configured.
- `POST /api/donations` creates a one-time INR donation and a Razorpay order. The donation is marked paid only after the backend verifies the payment signature and confirms the captured payment with Razorpay.
- `POST /api/donations/verify` verifies the Razorpay checkout response. `POST /api/webhooks/razorpay` processes signed captured-payment notifications so successful payments can still be recorded if the donor closes checkout before returning. Do not trust client-side payment success alone.
- `POST /api/id-cards` creates a card record after separate explicit consent to store card details and display the masked name publicly. Card numbers are generated on the server using cryptographically secure randomness. Photos and biometric IDs are never sent to or stored by the API.
- `GET /api/verify/:idNumber` publicly checks card status and issue date and returns a masked cardholder name; it never exposes full name, birth date, contact details, photo, or address.
- `GET /api/admin/id-cards/:idNumber` returns a full stored record only to authorized administrators. Keep the bearer token secret and use it only in server-side tools.

All submission routes validate input on the server, limit request size, and apply per-IP rate limits. Public verification is also rate-limited. The forms display errors when a submission fails instead of reporting false success.

## Render deployment

The included `render.yaml` configures a single Node web service that builds the frontend, serves it from Express, and uses `/api/health` as its health check.

1. Create a MongoDB Atlas database and a database user with only the required database access.
2. Create a Render Blueprint from this repository, or create a Node web service with build command `npm ci && npm run build` and start command `npm start`.
3. Set `MONGODB_URI`, a long random `ADMIN_API_TOKEN`, and Razorpay test/live `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` as secret environment variables in Render. Do not commit credentials. Configure Atlas Network Access to permit connections from the service's outbound IP addresses.
4. In Razorpay, register `https://<your-render-service>/api/webhooks/razorpay` as a webhook for `payment.captured` and `order.paid`, and use the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
5. After deployment, verify `https://<your-render-service>/api/health` reports a connected database.

## Data and privacy

After separate explicit consent to storage and public masked-name display, ID-card records store name, guardian name, birth date, contact and address fields, status, and consent timestamps/versions. Photos and biometric IDs remain in the browser and are not sent to this API. Public verification exposes validity, issue date, and (with consent) a masked name; full record lookup requires the admin token. Contact and volunteer records contain personal contact details. Donation pledge records contain the amount and frequency, and may contain donor contact details unless the donor selects anonymous. Restrict access to the MongoDB database and establish an appropriate retention/deletion policy before collecting real submissions.

Recurring donations are not enabled. New donation records store the amount, frequency, and payment references but not donor contact details; older pledge records may contain those details. The amount examples on the donation page are illustrative rather than fixed allocations. The API has no public endpoint for reading contact or volunteer submissions.
