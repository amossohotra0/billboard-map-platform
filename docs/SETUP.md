# Billboard Map Platform - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API Key
- WordPress installation (for plugin)

## Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   ```

5. **Start development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Backend Setup (Node.js/Express)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## WordPress Plugin Setup

1. **Copy plugin to WordPress:**
   ```bash
   cp -r wordpress-plugin/billboard-map /path/to/wordpress/wp-content/plugins/
   ```

2. **Activate the plugin:**
   - Go to WordPress Admin → Plugins
   - Find "Billboard Map Platform" and click "Activate"

3. **Configure plugin settings:**
   - Go to Settings → Billboard Map
   - Enter your Google Maps API Key
   - Save settings

4. **Use the shortcode:**
   ```
   [billboard_map]
   ```

## Google Maps API Key Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a new project or select existing one**

3. **Enable required APIs:**
   - Maps JavaScript API
   - Places API
   - Geocoding API

4. **Create API Key:**
   - Go to Credentials → Create Credentials → API Key
   - Restrict the key to your domains for security

5. **Configure API Key restrictions:**
   - Application restrictions: HTTP referrers
   - Add your domains (localhost:3000, your-domain.com)

## Database Setup (Optional)

For production use, replace mock data with a real database:

### MongoDB Setup:
```bash
# Install MongoDB
# Create database: billboard-map
# Update MONGODB_URI in .env file
```

### MySQL Setup:
```sql
CREATE DATABASE billboard_map;
-- Create tables for billboards, users, etc.
```

## Deployment

### Frontend (Netlify/Vercel):
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in deployment platform

### Backend (Heroku/AWS):
1. Create deployment configuration
2. Set environment variables
3. Deploy the backend code

### WordPress Plugin:
1. Create a zip file of the plugin folder
2. Upload via WordPress Admin → Plugins → Add New → Upload

## Testing

### Frontend:
```bash
cd frontend
npm test
```

### Backend:
```bash
cd backend
npm test
```

## Troubleshooting

### Common Issues:

1. **Google Maps not loading:**
   - Check API key is correct
   - Verify API key restrictions
   - Ensure Maps JavaScript API is enabled

2. **CORS errors:**
   - Check FRONTEND_URL in backend .env
   - Verify CORS configuration in server.js

3. **Plugin not working:**
   - Check WordPress error logs
   - Verify Google Maps API key in plugin settings
   - Ensure shortcode is used correctly

### Debug Mode:

Enable debug mode by setting:
```env
NODE_ENV=development
```

This will show detailed error messages and stack traces.

## Support

For issues and questions:
1. Check the documentation
2. Review error logs
3. Test with mock data first
4. Verify API key configuration
