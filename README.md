# 🎵 Spotify API Integration

A professional Node.js/Express.js application that integrates with Spotify Web API to display your top tracks, currently playing song, and control playback. Built with MVC architecture and secure cookie-based authentication.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![License](https://img.shields.io/badge/license-ISC-blue)

## ✨ Features

### Authentication

- 🔐 Spotify OAuth 2.0 authorization flow
- 🍪 Secure cookie-based token storage (HTTP-only)
- 🔄 Automatic access token refresh
- 🛡️ CSRF protection with state verification
- 🔒 Session management with secure secrets

### Music Features

- 🎧 View your top tracks (customizable limit 1-50)
- 🎵 Display currently playing song with real-time status
- ⏯️ Play/Pause playback control
- ❌ Graceful handling of Spotify Premium requirements

### Developer Features

- 📚 Interactive API documentation page
- 🧪 Built-in endpoint testing interface
- 🏗️ Professional MVC architecture
- ✅ Comprehensive error handling
- 🌐 CORS configuration for production

## 🏗️ Architecture

```
src/
├── config/           # Configuration files
│   ├── cors.config.js
│   ├── server.config.js
│   └── spotify.config.js
├── controllers/      # Route controllers
│   ├── auth.controller.js
│   ├── root.controller.js
│   └── spotify.controller.js
├── middleware/       # Custom middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
├── routes/          # API routes
│   ├── auth.routes.js
│   ├── root.routes.js
│   └── spotify.routes.js
├── services/        # Business logic
│   └── spotify.service.js
├── utils/           # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── randomString.js
│   └── stateStore.js
├── views/           # EJS templates
│   └── index.ejs
├── public/          # Static files
│   └── styles.css
└── server.js        # Application entry point
```

## 🚀 API Endpoints

### Authentication Routes

| Method | Endpoint         | Description                 | Auth Required |
| ------ | ---------------- | --------------------------- | ------------- |
| GET    | `/auth/login`    | Initiate Spotify OAuth flow | ❌            |
| GET    | `/auth/callback` | OAuth callback handler      | ❌            |
| GET    | `/auth/status`   | Check authentication status | ❌            |

### Spotify API Routes

| Method | Endpoint               | Description                        | Auth Required |
| ------ | ---------------------- | ---------------------------------- | ------------- |
| GET    | `/spotify`             | Get top tracks & currently playing | ✅            |
| GET    | `/spotify/top-tracks`  | Get user's top tracks (limit 1-50) | ✅            |
| GET    | `/spotify/now-playing` | Get currently playing track        | ✅            |
| POST   | `/spotify/play`        | Resume/play a track                | ✅            |
| POST   | `/spotify/stop`        | Pause playback                     | ✅            |

### Utility Routes

| Method | Endpoint | Description                   | Auth Required |
| ------ | -------- | ----------------------------- | ------------- |
| GET    | `/`      | Interactive API documentation | ❌            |

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Spotify Developer Account
- Spotify Premium (for playback control features)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd spotify-api-integration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Add the following redirect URI to your app settings:
   - **Local**: `http://localhost:5000/auth/callback`
   - **Production**: `https://your-domain.com/auth/callback`
4. Note your **Client ID** and **Client Secret**

### 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:5000/auth/callback

# Session Secret (generate a random string)
SESSION_SECRET=your_random_secret_here

# CORS Origins (comma-separated for production)
ALLOWED_ORIGINS=
```

### 5. Run the application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## 🌐 Deploying to Render

### Prerequisites

- GitHub account with your code repository
- Render account (free tier available)

### Step 1: Prepare Your Repository

1. Ensure `.env` is in `.gitignore` ✅ (already configured)
2. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click **Edit Settings**
4. Add your Render URL to **Redirect URIs**:
   ```
   https://your-app-name.onrender.com/auth/callback
   ```
5. Click **Save**

### Step 3: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**

   - **Name**: `spotify-api-integration` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Advanced Settings:**

   - **Instance Type**: `Free` (or paid for better performance)
   - **Auto-Deploy**: `Yes`

5. Click **Environment** and add these variables:

   ```
   PORT=5000
   NODE_ENV=production
   SPOTIFY_CLIENT_ID=<your-spotify-client-id>
   SPOTIFY_CLIENT_SECRET=<your-spotify-client-secret>
   SPOTIFY_REDIRECT_URI=https://your-app-name.onrender.com/auth/callback
   SESSION_SECRET=<generate-a-strong-random-string>
   ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
   ```

6. Click **Create Web Service**

### Step 4: Verify Deployment

1. Wait for the deployment to complete (usually 2-5 minutes)
2. Visit your Render URL: `https://your-app-name.onrender.com`
3. You should see the interactive API documentation page
4. Click **Login with Spotify** to test authentication

### 🎯 Production Checklist

- ✅ `NODE_ENV` set to `production`
- ✅ Strong `SESSION_SECRET` generated
- ✅ `SPOTIFY_REDIRECT_URI` matches Render URL
- ✅ Spotify Dashboard redirect URI updated
- ✅ `ALLOWED_ORIGINS` configured if using separate frontend
- ✅ All dependencies in `package.json`
- ✅ `.env` file NOT committed to repository

## 🔒 Security Features

- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **CSRF Protection**: State parameter verification in OAuth flow
- **Environment Validation**: Required environment variables checked on startup
- **CORS Configuration**:
  - Development: Open for testing
  - Production: Whitelist specific origins
- **Secure Session**: Random session secrets with strong entropy
- **Error Sanitization**: No sensitive data exposed in error responses

## 🧪 Testing the API

### Using the Built-in Documentation Page

1. Navigate to `https://your-app-name.onrender.com/`
2. Click **Login with Spotify** to authenticate
3. Use the **Test Endpoint** buttons to try each API route
4. View responses directly in the browser

### Using cURL

**Login:**

```bash
# Visit in browser - will redirect to Spotify
https://your-app-name.onrender.com/auth/login
```

**Get Top Tracks:**

```bash
curl -X GET https://your-app-name.onrender.com/spotify/top-tracks \
  -H "Cookie: spotify_access_token=<your-token>"
```

**Get Currently Playing:**

```bash
curl -X GET https://your-app-name.onrender.com/spotify/now-playing \
  -H "Cookie: spotify_access_token=<your-token>"
```

## 📊 API Response Format

### Success Response

```json
{
	"success": true,
	"message": "Top tracks retrieved successfully",
	"data": {
		// Response data here
	}
}
```

### Error Response

```json
{
	"success": false,
	"message": "Error description",
	"error": "Error details"
}
```

## 🐛 Troubleshooting

### "Spotify Premium Required" Error

- **Cause**: Playback control features require Spotify Premium
- **Solution**: Upgrade to Spotify Premium or use read-only endpoints

### "No Active Device" Error

- **Cause**: No Spotify app is currently active
- **Solution**: Open Spotify on any device and start playing something

### "Invalid Redirect URI" Error

- **Cause**: Redirect URI mismatch between app and Spotify Dashboard
- **Solution**: Ensure URIs match exactly (including protocol and trailing slashes)

### "CORS Error" in Browser

- **Cause**: Frontend domain not in ALLOWED_ORIGINS
- **Solution**: Add your frontend domain to `ALLOWED_ORIGINS` in environment variables

### Token Refresh Issues

- **Cause**: Refresh token expired or invalid
- **Solution**: Log out and log in again to get new tokens

## 🔄 Render-Specific Notes

### Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free (enough for 1 always-on service)

### Upgrade Benefits

- No spin-down
- Faster performance
- More compute resources
- Custom domains

### Monitoring

- View logs in Render Dashboard → Your Service → Logs
- Monitor metrics in Render Dashboard → Your Service → Metrics

## 🛠️ Development

### Project Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

### Adding New Endpoints

1. Create route in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic in `src/services/`
4. Update route metadata in `src/routes/root.routes.js` for documentation

## 📝 Environment Variables Reference

| Variable              | Required | Description            | Example                                     |
| --------------------- | -------- | ---------------------- | ------------------------------------------- |
| PORT                  | No       | Server port            | 5000                                        |
| NODE_ENV              | Yes      | Environment mode       | production                                  |
| SPOTIFY_CLIENT_ID     | Yes      | Spotify app client ID  | abc123...                                   |
| SPOTIFY_CLIENT_SECRET | Yes      | Spotify app secret     | xyz789...                                   |
| SPOTIFY_REDIRECT_URI  | Yes      | OAuth callback URL     | https://app.onrender.com/auth/callback      |
| SESSION_SECRET        | Yes      | Session encryption key | random_string_here                          |
| ALLOWED_ORIGINS       | No       | CORS allowed origins   | https://example.com,https://www.example.com |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Express.js](https://expressjs.com/)
- [Render](https://render.com/)

## 📧 Support

For issues and questions:

- Open an issue on GitHub
- Check [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
- Review [Render Documentation](https://render.com/docs)

---

**Built with ❤️ using Node.js and Express.js**
