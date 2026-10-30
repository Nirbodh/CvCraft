# CVCraft — Free CV & Resume Generator

**CVCraft** is a complete, full-stack CV and resume generator designed to run 100% free without paid third-party APIs, watermarks, or subscriptions.

---

## 🌟 Key Features

1. **Guest Mode & User Accounts**
   - **Guest Mode:** Create, import, edit, and download A4 PDFs without registering. Automatic browser draft persistence prevents data loss on reload.
   - **User Accounts:** Register with email and password (salted bcrypt hashing), log in, and manage multiple CVs with private ownership isolation.

2. **5 Distinctive Designer Templates**
   - **Modern:** Contemporary geometric typography, colored vertical accents, and clean timeline markers.
   - **Classic:** Ivy-League centered headline with refined serif typography, double hairline dividers.
   - **Minimal:** Swiss modernist 2-column editorial grid with generous whitespace.
   - **Professional:** Corporate structured layout with executive tinted sidebar.
   - **ATS-Friendly:** Standardized single-column flow engineered for 100% ATS parser compatibility.

3. **Deterministic Free Writing Engine**
   - **Factual Summaries:** Generates professional summaries strictly using the user's job title, real years of experience, and skills. Never hallucinates or invents credentials.
   - **Action Verb Bank:** Curated action verbs categorized across Leadership, Engineering, Optimization, Analysis, and Strategy.
   - **Sentence Optimizer:** Analyzes accomplishment bullets using the STAR framework, flags passive voice, and substitutes weak phrases (e.g., &ldquo;worked on&rdquo; &rarr; &ldquo;developed &amp; maintained&rdquo;).

4. **Document Importer (PDF, DOCX, TXT)**
   - Extracts candidate name, contact details, summary, work experience, education, and skills.
   - Verification review screen allows users to inspect and adjust extracted fields before populating the CV.
   - Scanned PDF detection informs users if optical OCR is needed.

5. **Pixel-Perfect A4 Vector PDF Export**
   - Formatted for standard A4 paper dimensions (210mm &times; 297mm).
   - Clean browser print stylesheet strips all UI chrome and produces selectable, watermark-free vector output.

6. **Database Architecture**
   - **Production:** MongoDB Atlas Free cluster via Mongoose schemas (`User` and `CV`).
   - **Zero-Config Local:** Transparent built-in persistent storage fallback (`.data/cvcraft_store.json`), allowing registration and saving to work out-of-the-box without initial Atlas setup.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js REST API
- **Authentication:** JWT (JSON Web Tokens), bcryptjs password hashing
- **Database:** MongoDB Atlas Free, Mongoose (with local persistent fallback)
- **Document Parsing:** Mammoth.js (DOCX), File API (TXT), PDF parser bridge

---

## 🚀 Local Development Guide

### Prerequisites
- Node.js 18+ installed
- npm or bun

### Windows PowerShell Commands

```powershell
# 1. Clone repository & navigate to directory
cd cv-generator-free

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
Copy-Item .env.example .env

# 4. Start the full-stack development server
npm run dev
```

### Linux / macOS Commands

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment
cp .env.example .env

# 3. Start development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## ☁️ MongoDB Atlas Free Setup Instructions

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register a free account.
2. Create an **M0 Free Shared Cluster** (Free forever, 512MB storage).
3. Under **Security &rarr; Database Access**, create a user (e.g. `cvcraft_admin`) and secure password.
4. Under **Security &rarr; Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) for hosting on cloud providers like Render.
5. In the **Databases** view, click **Connect** &rarr; **Drivers (Node.js)**.
6. Copy the connection string and paste it into `.env`:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/cvcraft?retryWrites=true&w=majority"
   ```
7. Restart the server. CVCraft will automatically connect to MongoDB Atlas.

---

## 📦 Production Deployment (Render)

### Deploy as a Single Web Service

1. Push your repository to **GitHub**.
2. Log in to [render.com](https://render.com) and click **New + &rarr; Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `JWT_SECRET`: *(A long, random secret key)*
   - `MONGODB_URI`: *(Your MongoDB Atlas connection string)*
6. Click **Deploy Web Service**.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/health` | Service and Database Status | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Sign in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/cvs` | List all CVs for the authenticated user | Yes |
| `POST` | `/api/cvs` | Create a new CV document | Yes |
| `GET` | `/api/cvs/:id` | Retrieve single CV (ownership verified) | Yes |
| `PUT` | `/api/cvs/:id` | Update CV (ownership verified) | Yes |
| `DELETE` | `/api/cvs/:id` | Delete CV (ownership verified) | Yes |
| `POST` | `/api/extract` | Extract resume data from PDF/DOCX/TXT | No |

---

## 🔒 Security & Reliability

- **Bcrypt Hashing:** Passwords are never stored in plain text.
- **JWT Authorization:** Bearer tokens verified via Express middleware.
- **Strict User Isolation:** Every read, update, and delete operation on a CV verifies `userId === req.user.id`.
- **Payload Limits:** Maximum file upload payload enforced at 5MB.
- **Sanitized Errors:** Internal database credentials and stack traces are withheld from client responses.

---

## 🧪 Verification & Test Plan

1. **Guest CV Creation:** Open app, edit fields, switch templates, customize colors. Verify real-time updates.
2. **PDF Export:** Click &ldquo;Download A4 PDF&rdquo; &rarr; verify print preview strips navigation, buttons, and formats to 210mm &times; 297mm.
3. **Document Extraction:** Upload a `.docx`, `.pdf`, or `.txt` file &rarr; verify the review screen displays parsed fields.
4. **Registration & Login:** Register with an email and password &rarr; sign out &rarr; sign in &rarr; confirm JWT session restoration.
5. **Ownership Check:** Attempting to fetch or update another user&apos;s CV returns a 404/401 response.
