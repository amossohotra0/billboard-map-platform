# Billboard Map Platform

A comprehensive web-based interactive map platform for exploring and filtering billboard inventory, similar to Lamar's inventory browser.

## Features

- **Interactive Map**: Google Maps integration with custom billboard pins
- **Smart Filtering**: Real-time filtering by type, location, size, and availability
- **Detailed Popups**: Clickable pins showing billboard details, pricing, and images
- **Performance Optimized**: Pin clustering for large datasets
- **Mobile Responsive**: Optimized for all device sizes
- **WordPress Integration**: Plugin/shortcode ready

## Tech Stack

- **Frontend**: React, JavaScript ES6+, HTML5, CSS3
- **Maps**: Google Maps API with custom markers
- **Backend**: Node.js/Express (API endpoints)
- **WordPress**: Custom plugin integration
- **Database**: MongoDB/MySQL for billboard inventory

## Project Structure

```
billboard-map-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/SCSS files
│   └── public/             # Static assets
├── backend/                 # Node.js API server
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── wordpress-plugin/        # WordPress plugin files
├── docs/                   # Documentation
└── assets/                 # Images and icons
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## API Key Setup

Create a `.env` file with your Google Maps API key:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Deployment

- Frontend: Deploy to Netlify/Vercel
- Backend: Deploy to Heroku/AWS
- WordPress: Upload plugin to wp-content/plugins/
