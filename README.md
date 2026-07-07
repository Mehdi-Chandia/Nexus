# Nexus

Nexus is a full-stack platform that connects **entrepreneurs** and **investors**. Users can create role-specific profiles, browse potential matches, request and manage meetings, chat in real time, hop on a video call, share documents, and handle investment-related payments — all in one place.

**Live app:** https://nexus-lac-rho.vercel.app

---

## Features

- **Authentication** — email/password signup and login, secured with JWT
- **Two-Factor Login (OTP)** — a 6-digit code is emailed on every login and must be verified before a session is issued
- **Forgot / Reset Password** — secure, time-limited reset links sent via email
- **Role-Based Profiles** — separate profile completion flow and fields for entrepreneurs vs. investors
- **Dashboards** — dedicated dashboard views for each role, showing relevant matches, meetings, and activity
- **Meeting Requests** — request, accept, or reject meetings between investors and entrepreneurs
- **Real-Time Chat** — Socket.IO-powered messaging tied to a specific meeting/connection
- **Video Calls** — peer-to-peer video calls built with WebRTC
- **Document Sharing** — upload and view documents linked to a specific meeting, stored via Cloudinary
- **Payments** — Stripe integration for handling transactions, with a full transaction history on the dashboard
- **Notifications** — in-app notifications for meeting requests, responses, and other key events

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- React Hook Form
- Socket.IO Client
- Stripe.js
- Framer Motion, React Icons, React Toastify

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JWT for authentication
- Bcrypt for password hashing
- Joi for request validation
- Multer + Cloudinary for file uploads
- Brevo (transactional email API) for OTP and password-reset emails
- Stripe for payments

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
nexus/
├── backEnd/
│   ├── controllers/     # Route logic (auth, meetings, chat, documents, payments)
│   ├── models/          # Mongoose schemas (user, meeting, chat, document, transaction, notification, token)
│   ├── routes/          # Express route definitions
│   ├── middlewares/      # Auth middleware (JWT verification, token blacklist check)
│   ├── services/        # Email service (Brevo)
│   ├── validation/       # Joi schemas
│   ├── config/           # Cloudinary config
│   └── server.js         # App entry point
│
└── frontEnd/
    ├── src/
    │   ├── pages/         # Route-level pages (auth, chat, meetings, payments, static pages)
    │   ├── dashboard/      # Entrepreneur dashboard
    │   ├── investorDashboard/  # Investor dashboard
    │   ├── meeting/        # Meeting request flow
    │   ├── components/     # Shared UI components
    │   └── lib/            # API config
    ├── context/            # Auth context (global user state)
    └── vercel.json         # SPA rewrite config for client-side routing
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- Accounts/API keys for: Brevo, Cloudinary, Stripe

### Backend Setup
```bash
cd backEnd
npm install
```

Create a `.env` file in `backEnd/` with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

BREVO_API_KEY=your_brevo_api_key
EMAIL=your_verified_sender_email

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Run the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontEnd
npm install
```

Create a `.env` file in `frontEnd/` with:
```
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`, connecting to the backend at `http://localhost:3000`.

---

## Notes on Production Setup

- **Email delivery:** Uses Brevo's transactional email API (not SMTP), since most cloud hosts — including Render's free tier — block outbound SMTP ports (25/465/587). Brevo's sender email must be verified in the Brevo dashboard before emails will send.
- **Client-side routing:** `frontEnd/vercel.json` includes a rewrite rule so that refreshing on any nested route (e.g. `/dashboard`) correctly serves `index.html` instead of a 404, since Vercel doesn't know about React Router's client-side routes by default.
- **Cross-domain auth:** Frontend and backend are deployed on different domains (Vercel and Render). Cookie-based auth across different domains is subject to third-party cookie blocking in some browsers (Safari, Firefox, and Chrome in Incognito block it by default) — a Bearer-token-based auth flow is a known follow-up improvement to make this fully browser-independent.

---

## Daily Development Log

### Day 1
- Connected to MongoDB
- Created the user schema, controllers, and routes
- Implemented the token blacklist and auth middleware
- Tested APIs in Postman
- Configured Cloudinary and Multer for file handling

**In Progress:** Profile handling
**Challenges:** Handling two different user types (entrepreneur/investor) with different fields

---

### Day 2
- Built and successfully tested the profile-complete controller
- Created the meeting and notification models
- Built 5 meeting controllers, linking relevant notifications to the correct user in each response

**In Progress:** Meeting API testing — only one endpoint fully tested so far
**Challenges:** Linking meetings and notifications together while validating the correct user was a bit overwhelming

---

### Day 3
- Created the document and payment models; completed the document controllers
- Built all three controllers and their routes

**In Progress:** Payment logic — not started yet
**Challenges:** Linking documents to their scheduled meetings was the toughest part of the backend so far; used AI assistance to work through it

---

### Day 4
- Moved to the frontend after finishing and testing all backend controllers/APIs
- Built the Sign Up and Log In pages in React, with React Hook Form validation
- Added a show/hide password toggle and configured CORS on the backend to allow the frontend origin
- Connected the new pages to the backend and tested the calls

**In Progress:** Nothing blocking — lots more to build
**Challenges:** None — straightforward day

---

### Day 5
- Implemented 2FA/OTP: after login, a verification code is emailed and must be confirmed before a session is granted
- Added the relevant fields to the user model and built the OTP controllers; updated the login flow so the token is issued after OTP verification instead of right after password check
- Used Resend (free, simple) to send emails
- Implemented forgot password: added the reset-token fields to the user model, used the `crypto` module to generate reset tokens, and sent reset links via Resend
- Reset controller validates the token before allowing the password change
- Built the OTP verification and forgot-password pages and wired up their APIs

**In Progress:** Reset-password backend is done; frontend page still needed
**Challenges:** No major issues — mostly new territory and learning

---

### Day 6
- Finished the reset-password frontend page and wired up its API
- Started the core dashboard UI — built the sidebar with icons and navigation links

**In Progress:** Dashboard build
**Challenges:** None

---

### Day 7
- Completed the main dashboard section
- Created the Auth Context to store the logged-in user and share it across pages
- Added the logged-in-user handling and logout API
- Wired up the "get all users" API to show investors on the entrepreneur's dashboard

**In Progress:** Calling the remaining APIs to populate real dashboard data
**Challenges:** Fixed a bug where the auth context's initial `loading` state was `false`, which caused a refresh on the dashboard to redirect straight to login. Fixed by defaulting `loading` to `true` on mount, showing a loader until the user check resolves. Learned: never call state setters directly in the component body — only inside functions/effects.

---

### Day 8
- Built the complete-profile page (missed earlier in the flow)
- Built the create-meeting page for requesting meetings with investors
- Wired up meeting and notification APIs, storing them in state and filtering accepted meetings

**In Progress:** Meetings and notifications functionality
**Challenges:** After signup, the app redirected to complete-profile, but the auth context's `user` wasn't set yet at that point, bouncing the user back to sign up. Fixed by setting the user in context directly from the signup response instead of waiting on a separate fetch.

---

### Day 9
- Integrated the accept/reject meeting APIs
- Updated the dashboard UI to show real user data
- Built a separate investor dashboard, based on the existing entrepreneur dashboard layout, with AI assistance

**In Progress:** Notifications, then video calls and payment integration
**Challenges:** Nothing major

---

### Day 10
- Added role-based redirect logic so users land on the correct dashboard after login
- Set up Socket.IO (first time using it) on both frontend and backend, and confirmed basic messaging worked

**In Progress:** Getting Socket.IO working reliably with real users
**Challenges:** More unfamiliar than difficult — first time working with WebSockets

---

### Day 11
- Built the chat models, controllers, and routes for messages
- Connected sockets to real users and their meetings
- Built the chat page and wired up the previous-messages API
- Got real-time messaging fully working end-to-end

**In Progress:** Socket.IO refinement
**Challenges:** Error handling wasn't solid at first, which caused hard-to-trace bugs. Key takeaway: trace the full data flow end-to-end to pinpoint exactly where something breaks, rather than guessing.

---

### Day 12
- Completed video calling with WebRTC
- Made small but important updates to the investor dashboard
- Added the document upload page with a view of uploaded documents

**In Progress:** Entrepreneur-side dashboard (investor side is complete)
**Challenges:** WebRTC and Socket.IO together were difficult to fully understand — used AI assistance to work through the implementation

---

### Day 13
- Integrated Stripe on both frontend and backend
- Added transaction history to the dashboard
- Built the About and Contact pages
- Switched OTP email delivery from Resend to Nodemailer (Resend wasn't working at the time)

**In Progress:** Nothing blocking
**Challenges:** Relatively smooth day

---

### Day 14
- Deployed frontend to Vercel and backend to Render
- Diagnosed and fixed a hardcoded `localhost` URL in Auth Context that broke every page load in production
- Fixed cross-site cookie configuration (`secure`/`sameSite`) for the auth token
- Diagnosed that Render's free tier blocks outbound SMTP — migrated email sending off Nodemailer entirely
- Tried Resend's sandbox sender, hit its "verified recipients only" restriction without a custom domain
- Switched email delivery to Brevo (API-based, works without owning a domain, verified sender only)
- Added a `vercel.json` rewrite rule to fix 404s on refresh for client-side routes
- Added lazy loading (`React.lazy` + `Suspense`) across all routes to shrink the initial bundle size
- Identified that cookie-based auth across the Vercel/Render domain split gets blocked by third-party cookie policies in Incognito, Safari, and Firefox — noted as a follow-up to migrate to header-based (Bearer token) auth

**In Progress:** Migrating auth from cookies to Bearer tokens for full cross-browser reliability
**Challenges:** Most of today was infrastructure debugging rather than feature work — cold starts and SMTP blocking on Render's free tier, and cross-domain cookie behavior differing by browser, took a lot of trial and error to fully diagnose