# Job Application Tracker - MERN Stack

A full-stack web application to help job seekers track and manage job applications intelligently.

## 📋 Features

### Core Features
- **Job Application Tracking**: Store company name, role, resume version, job description, and application date
- **Status Tracking**: Track application status (Applied, Interview, Rejected, Offer)
- **Multiple Sources**: Track applications from LinkedIn, Naukri, Indeed, Referral, Company Website
- **User Authentication**: Secure JWT-based authentication with email/password registration
- **Dashboard**: View all applications with filtering and statistics
- **Quick Actions**: Add, edit, update, and delete job applications

### Features
- Responsive design (Mobile, Tablet, Desktop)
- Real-time statistics (Total applications, Interviews, Offers)
- Filter applications by status
- Persistent user authentication
- Notes and job description storage
- Salary range tracking (optional)
- Interview date scheduling

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
JobTracker/
├── server/                     # Backend
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── JobApplication.js  # Job application schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── jobApplications.js # Job application routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Dependencies
│   └── server.js              # Entry point
│
└── client/                     # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js      # Navigation component
    │   │   └── JobCard.js     # Job card component
    │   ├── pages/
    │   │   ├── Login.js       # Login/Register page
    │   │   ├── Dashboard.js   # Main dashboard
    │   │   └── AddJob.js      # Add job application
    │   ├── services/
    │   │   └── api.js         # API client
    │   ├── context/
    │   │   └── AuthContext.js # Authentication context
    │   ├── App.js             # Main app component
    │   └── index.js           # Entry point
    ├── public/
    │   └── index.html         # HTML template
    ├── .env.example           # Environment variables template
    └── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_secure_secret_key
PORT=5000
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The app will open on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Job Applications
- `GET /api/job-applications` - Get all applications
- `POST /api/job-applications` - Create new application
- `GET /api/job-applications/:id` - Get single application
- `PUT /api/job-applications/:id` - Update application
- `DELETE /api/job-applications/:id` - Delete application
- `GET /api/job-applications/stats/summary` - Get statistics

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
1. User registers or logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent with each API request in the Authorization header
5. Server validates the token before processing requests

## 📱 Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Add Job**: Click "Add Job Application" and fill in the details
4. **Track Status**: Update the status of each application (Applied, Interview, Rejected, Offer)
5. **View Stats**: See your application statistics on the dashboard
6. **Filter**: Use status filters to view specific applications
7. **Delete**: Remove applications you no longer need

## 🎯 Future Features

- AI-powered job description analysis
- Interview preparation tips based on job description
- Salary predictions and market insights
- Email notifications for interview reminders
- Resume version management
- Bulk import from LinkedIn
- Export reports to CSV/PDF
- Advanced search and analytics
- Recruiter contact tracking
- Integration with calendar apps

## 📝 License

This project is open source and available under the MIT License.

## 💡 Tips

- Keep your job descriptions detailed for better future reference
- Use consistent resume version naming for easy tracking
- Update status immediately when you hear from recruiters
- Add notes about key points discussed in interviews
- Store salary expectations to compare offers

"# Job_Tracker" 
