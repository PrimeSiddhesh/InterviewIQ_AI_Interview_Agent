# 🚀 InterviewIQ: AI-Powered Interview Agent

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**InterviewIQ** is an advanced AI-driven mock interview platform designed to help job seekers prepare for real-world interviews. By analyzing your resume and understanding your specific role, experience level, and skills, the AI agent conducts a realistic, timed interview and provides immediate, actionable feedback on your answers using the powerful **Google Gemini API**.

This project showcases a complete Full-Stack architecture with AI integration, demonstrating proficiency in modern web development, API design, and AI utilization.

---

## 🔄 Project Architecture & User Flow

Understanding the core flow of the application demonstrates the complexity and state management handled in this project:

1. **Authentication & Onboarding**: 
   - User signs up/logs in securely.
   - User is granted an initial set of credits.
2. **Resume Upload & Parsing**: 
   - Candidate uploads their resume in PDF format. 
   - The server parses the PDF text and sends it to the Gemini API to extract key information (Role, Experience, Skills, Projects) into structured JSON.
3. **Interview Configuration**: 
   - Candidate confirms the extracted details and selects the interview mode.
4. **Dynamic Question Generation**: 
   - The backend constructs a highly detailed prompt containing the candidate's profile and requests exactly 5 progressive questions (Easy to Hard) from the Gemini API.
5. **The Interview Experience**: 
   - Candidate is presented with questions one by one.
   - A strict timer is enforced (e.g., 60s for easy, 120s for hard). 
   - The candidate submits their answer before the timer runs out.
6. **Real-Time AI Evaluation**: 
   - Each answer is sent back to Gemini API alongside the original question and candidate's profile.
   - Gemini evaluates the response and returns a score and constructive feedback.
7. **Performance Analytics & Report**: 
   - Once completed, the candidate views a detailed dashboard with Recharts visualizations.
   - Candidate can download a comprehensive PDF report of their interview performance using jsPDF.
8. **Monetization (Credits)**: 
   - When credits run low, users can purchase more via the integrated Razorpay payment gateway.

---

## ✨ Key Features (Wow Factors for Recruiters)

### 📄 1. Intelligent Resume Parsing (PDF)
- Users can upload their resumes in PDF format.
- The backend utilizes `pdfjs-dist` to read the document and the **Gemini AI model** to smartly extract structured data: **Role, Experience, Projects, and Skills**.
- *Impact:* Demonstrates the ability to process unstructured file data and convert it into a structured format using AI.

### 🧠 2. Dynamic, Context-Aware Question Generation
- Gone are the days of static question banks. InterviewIQ uses advanced prompt engineering (via the **Gemini API**) to generate exactly 5 highly relevant interview questions.
- **Progressive Difficulty:** The interview intelligently scales: Question 1 & 2 (Easy) → Question 3 & 4 (Medium) → Question 5 (Hard).
- Questions are strictly tailored to the candidate's uploaded resume details, mimicking a real human interviewer.
- *Impact:* Highlights strong prompt engineering skills and integration with Large Language Models (LLMs).

### ⏱️ 3. Real-time AI Answer Evaluation
- Users submit their answers under strict time limits.
- The **Gemini API** evaluates the submitted answers against the generated questions, assigning a **Score** and providing detailed **Constructive Feedback**.
- *Impact:* Shows ability to build complex, stateful flows where AI acts as an evaluator based on defined rubrics.

### 💳 4. Credit-Based Economy & Monetization
- Incorporates a fully functional credit system. Users consume credits (e.g., 50 credits per interview).
- Integrated with **Razorpay** for seamless payment processing to top up credits.
- *Impact:* Demonstrates an understanding of SaaS monetization models, third-party payment gateway integration, and transaction handling.

### 📊 5. Comprehensive Analytics & Reporting
- Visualizes interview performance over time using **Recharts**.
- Users can download their complete interview performance reports as beautifully formatted PDFs using **jsPDF** and **jspdf-autotable**.
- *Impact:* Proves ability to handle client-side document generation and complex data visualization.

### 🎨 6. Premium User Interface & Experience
- Built with **React**, **Vite**, and **TailwindCSS** for a highly responsive, modern design.
- Uses **Framer Motion** for smooth, micro-animations that make the app feel alive and premium.
- State management handled efficiently using **Redux Toolkit**.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS v4
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Animations:** Framer Motion (`motion`)
- **Charting:** Recharts
- **PDF Generation:** jsPDF
- **Routing:** React Router v7

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **AI Integration:** Google Gemini API
- **Authentication:** JSON Web Tokens (JWT)
- **File Handling:** Multer (for PDF uploads)
- **Payments:** Razorpay

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Razorpay Account (for payment API keys)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/PrimeSiddhesh/InterviewIQ_AI_Interview_Agent.git
cd InterviewIQ_AI_Interview_Agent
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the necessary environment variables:
```env
PORT=...
MONGODB_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```
Start the server:
```bash
npm run dev
```

### 3. Setup the Frontend (Client)
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:<YOUR_BACKEND_PORT>
```
Start the client:
```bash
npm run dev
```

---

## 💡 Why This Project Stands Out (For Interviewers)

1. **End-to-End Execution:** This isn't just a basic CRUD app. It combines file processing, AI orchestration, real-time evaluation, payment processing, and document generation into one cohesive product.
2. **AI as a Core Feature, Not an Afterthought:** The AI isn't just a chatbot; it actively parses documents, personalizes content, and evaluates user input dynamically via Gemini.
3. **Production-Ready Concerns:** Handles edge cases like timeouts, empty inputs, token limits, and secure transactions (Razorpay).
4. **Modern UI/UX:** The use of Tailwind and Framer Motion shows a strong eye for design and user experience, which is crucial for modern web development roles.

---
*Built to crack interviews, by cracking interviews.*
