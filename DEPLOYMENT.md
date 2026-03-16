# JobTracker - Deployment Guide

Complete instructions for deploying JobTracker to production across different platforms.

---

## 📋 Pre-Deployment Checklist

- [ ] Update `JWT_SECRET` to a strong, random string
- [ ] Ensure MongoDB Atlas cluster is configured and accessible
- [ ] Update `NODE_ENV=production` in backend .env
- [ ] Verify all environment variables are set correctly
- [ ] Test locally with production build
- [ ] Review security configurations
- [ ] Set up SSL/HTTPS

---

## 🔧 Deployment Option 1: Render (Recommended for MERN)

### Backend Deployment on Render

1. **Create Render Account**
   - Visit https://render.com
   - Sign up/Login with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the JobTracker repo
   - Configure:
     - **Name:** `jobtracker-server`
     - **Root Directory:** `server`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`

3. **Set Environment Variables**
   - In Render dashboard, go to Environment
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_trackers
     JWT_SECRET=your-random-secret-key-here-min-32-chars
     NODE_ENV=production
     PORT=5000
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~2-3 minutes)
   - Note your backend URL: `https://jobtracker-server.onrender.com`

---

### Frontend Deployment on Vercel

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add New..." → "Project"
   - Select JobTracker repository
   - Configure:
     - **Framework:** React
     - **Root Directory:** `client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`

3. **Set Environment Variables in Vercel**
   - Create `.env.production` in `client/` folder:
     ```
     REACT_APP_API_URL=https://jobtracker-server.onrender.com/api
     ```
   - Or add in Vercel dashboard:
     - Project Settings → Environment Variables
     - Add `REACT_APP_API_URL` with value from Render backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://jobtracker-xxxxx.vercel.app`

---

## 🚀 Deployment Option 2: Heroku

### Backend on Heroku

1. **Prerequisites**
   - Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
   - Login: `heroku login`

2. **Create Heroku App**
   ```bash
   cd server
   heroku create jobtracker-server
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_trackers
   heroku config:set JWT_SECRET=your-random-secret-key-here
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

### Frontend on Netlify

1. **Build Locally**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy on Netlify**
   - Visit https://app.netlify.com
   - Drag and drop `build` folder
   - Set build settings:
     - Build Command: `npm run build`
     - Publish Directory: `build`

3. **Set Environment Variables**
   - Site Settings → Build & Deploy → Environment
   ```
   REACT_APP_API_URL=https://jobtracker-server.herokuapp.com/api
   ```

4. **Update CORS**
   - Add your Netlify domain to backend CORS in `server/server.js`:
   ```javascript
   app.use(cors({
     origin: [
       'https://jobtracker-xxxxx.netlify.app',
       'http://localhost:3000'
     ]
   }));
   ```

---

## 🔒 Deployment Option 3: AWS (EC2 + S3)

### 1. Setup EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo yum update -y
sudo yum install nodejs npm -y

# Install MongoDB client
sudo yum install mongodb-org-tools -y

# Clone repository
git clone https://github.com/your-username/JobTracker.git
cd JobTracker/server

# Install dependencies
npm install

# Create .env file
nano .env
# Add your MongoDB URI and JWT_SECRET

# Start with PM2 for persistence
npm install pm2 -g
pm2 start server.js --name "jobtracker-server"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo yum install nginx -y
sudo systemctl start nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/jobtracker.conf
```

**Nginx Configuration:**
```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Deploy Frontend to S3 + CloudFront

```bash
cd client

# Update API URL
echo "REACT_APP_API_URL=https://api.your-domain.com" > .env.production

# Build
npm run build

# Create S3 bucket
aws s3 mb s3://jobtracker-frontend

# Upload build files
aws s3 sync build/ s3://jobtracker-frontend --delete

# Create CloudFront distribution pointing to S3 bucket
# (Use AWS Console for this)
```

---

## 📦 Deployment Option 4: Docker + Docker Compose (Local/VPS)

### Create Dockerfile for Backend

Create `/server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Create Docker Compose

Create `/docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: job_trackers

  backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://mongodb:27017/job_trackers
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api

volumes:
  mongodb_data:
```

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🌍 Environment Configuration by Platform

### Production Environment Variables

**Backend (.env)**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_trackers

# Security
JWT_SECRET=your-extremely-secure-random-string-at-least-32-characters
NODE_ENV=production

# Server
PORT=5000

# CORS (if using different frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## 🔐 Security Checklist

### Before Going Live

1. **Password Security**
   - Generate strong JWT_SECRET (32+ characters)
   - Ensure MongoDB password is strong
   - Don't commit .env files

2. **CORS Configuration**
   ```javascript
   // server/server.js
   const corsOptions = {
     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
     credentials: true,
     optionsSuccessStatus: 200
   };
   app.use(cors(corsOptions));
   ```

3. **HTTPS/SSL**
   - Enable SSL on all deployment platforms
   - Update API URLs to use HTTPS

4. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   Add to backend:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', limiter);
   ```

5. **Environment Variables**
   - Never commit sensitive data
   - Use platform-specific secret managers
   - Rotate secrets regularly

6. **Database Security**
   - Enable IP whitelist in MongoDB Atlas
   - Use strong passwords
   - Regular backups

7. **Update Dependencies**
   ```bash
   npm audit
   npm audit fix
   ```

---

## 📊 Post-Deployment Verification

### Test Your Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-domain.com/api/health
   # Should return: {"message":"Server is running"}
   ```

2. **Frontend Access**
   - Open https://your-frontend-domain.com in browser
   - Should show login page

3. **Authentication Flow**
   - Register new account
   - Verify token stored in localStorage
   - Login with credentials

4. **Job Application Operations**
   - Add new job application
   - Upload resume
   - Parse job description
   - Use Smart Recall
   - Delete job

5. **File Upload**
   - Upload resume file
   - Verify it appears in card
   - Download and confirm working

---

## 🔧 Monitoring & Maintenance

### Setup Monitoring

**Render:**
- Dashboard shows CPU, Memory, Status
- Email alerts available

**Vercel:**
- Analytics tab shows performance metrics
- Automatic rollbacks for failed deployments

**Heroku:**
- `heroku logs --tail` for real-time logs
- Heroku Metrics add-on for monitoring

### Regular Maintenance

```bash
# Update dependencies monthly
npm update
npm audit fix

# Backup MongoDB
mongodump --uri="your-mongodb-uri" --out ./backup

# Check logs regularly
heroku logs --tail
# or
render logs
```

---

## 🚨 Troubleshooting

### Common Issues

**CORS Error**
```
Solution: Update CORS_ORIGIN in backend .env to match frontend domain
```

**MongoDB Connection Failed**
```
Solution: 
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas includes your server
- Check database credentials
```

**Resume Upload Not Working**
```
Solution:
- Verify /uploads directory exists and has write permissions
- Check multer configuration in backend
- Ensure file size < 10MB
```

**Frontend not connecting to backend**
```
Solution:
- Check REACT_APP_API_URL in .env.production
- Verify backend is running and accessible
- Check browser DevTools > Network tab for failed requests
```

---

## 📞 Deployment Support

Platform Documentation:
- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs
- **Heroku:** https://devcenter.heroku.com
- **AWS:** https://aws.amazon.com/getting-started
- **Docker:** https://docs.docker.com

---

## 🎯 Quick Start Deployment Scripts

### Deploy to Render (Fastest)

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repo, select backend folder
4. Add environment variables (MONGODB_URI, JWT_SECRET)
5. Deploy
6. Copy backend URL
7. Go to vercel.com → New Project
8. Select frontend folder
9. Add REACT_APP_API_URL environment variable
10. Deploy

**Total time: ~5 minutes**

---

## 📝 Next Steps

1. Choose your preferred deployment platform
2. Follow the specific deployment option instructions
3. Test all features after deployment
4. Set up monitoring and alerts
5. Document your deployment configuration
6. Consider setting up CI/CD pipelines for automatic deployments

---

**Last Updated:** March 2026
**Status:** Ready for Production
