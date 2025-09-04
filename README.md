# Resume Platform 🚀

A comprehensive full-stack web application for creating, managing, and exporting professional resumes with multiple templates, AI-powered suggestions, and analytics.

## ✨ Features

- **🔐 User Authentication**: Secure JWT-based login and registration
- **🎨 Multiple Templates**: 4 professional resume templates (Modern, Classic, Creative, Minimal)
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **📊 Analytics Dashboard**: Track resume performance with visual analytics
- **📄 PDF Export**: Generate and download professional PDF resumes
- **💡 AI Suggestions**: Smart content suggestions for resume sections
- **🔄 Version Control**: Track multiple versions of your resumes
- **⚡ Real-time Preview**: Live preview while building your resume
- **🎯 Multi-step Builder**: Intuitive form with progress tracking
- **📈 Performance Tracking**: Resume views, downloads, and analytics

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Vite 4.4.5** - Fast development server and build tool
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Chart.js** - Beautiful charts for analytics

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database with MongoDB Memory Server for development
- **Mongoose 7.0.0** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **PDF-lib** - Professional PDF generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/roudraghosal/Resume-Platform.git
cd Resume-Platform
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**

Create `.env` files in both directories:

**Backend `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

### 🏃‍♂️ Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🎨 Resume Templates

### 1. **Modern Template** 🎨
- Gradient header with colorful sections
- Emoji icons for visual appeal
- Contemporary design with smooth styling

### 2. **Classic Template** 📋
- Traditional professional layout
- Clean typography and structured sections
- Perfect for corporate environments

### 3. **Creative Template** ✨
- Sidebar layout with gradients
- Modern styling with creative flair
- Ideal for creative professionals

### 4. **Minimal Template** 🎯
- Clean centered design
- Thin typography and spacious layout
- Minimalist approach for maximum impact

## Setup & Run Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

## 📁 Project Structure

```
Resume-Platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware  
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   └── templates/  # Resume templates
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main App component
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Resumes  
- `GET /api/resume` - Get all user resumes
- `POST /api/resume` - Create new resume
- `GET /api/resume/:id` - Get specific resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume
- `GET /api/resume/:id/pdf` - Download resume as PDF

### Suggestions
- `POST /api/suggestion/skills` - Get skill suggestions
- `POST /api/suggestion/experience` - Get experience suggestions

## 🚀 Deployment

### Frontend (Vercel)
- Connect GitHub repository to Vercel
- Set environment variables
- Auto-deploy on push to main

### Backend (Render)  
- Connect GitHub repository to Render
- Set environment variables
- Use MongoDB Atlas for production

## 👨‍💻 Author

**Roudra Ghosal**
- GitHub: [@roudraghosal](https://github.com/roudraghosal)

---

⭐ **Star this project if you found it helpful!** ⭐
