# Billboard Map Platform - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Currently using mock data. In production, implement JWT authentication for protected endpoints.

## Endpoints

### Get All Billboards
```http
GET /billboards
```

**Query Parameters:**
- `type` (optional): Filter by billboard type (`static`, `digital`, `poster`, `wallscape`)
- `availability` (optional): Filter by availability (`available`, `coming_soon`, `sold`)
- `city` (optional): Filter by city name
- `state` (optional): Filter by state
- `minPrice` (optional): Minimum monthly rate
- `maxPrice` (optional): Maximum monthly rate
- `minTraffic` (optional): Minimum daily traffic
- `maxTraffic` (optional): Maximum daily traffic
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Example Request:**
```http
GET /billboards?type=digital&availability=available&city=New York&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Digital Display",
      "latitude": 40.7589,
      "longitude": -73.9851,
      "address": "123 Broadway",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "type": "digital",
      "size": "14x48",
      "facing": "North",
      "illuminated": true,
      "dailyTraffic": 85000,
      "speedLimit": 25,
      "visibility": "Excellent",
      "monthlyRate": 8500,
      "availability": "available",
      "availableDate": "2025-07-01",
      "description": "Prime location in Times Square area with high visibility and foot traffic.",
      "image": "https://via.placeholder.com/400x300/0066cc/ffffff?text=Digital+Billboard",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-06-20T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Get Single Billboard
```http
GET /billboards/:id
```

**Parameters:**
- `id` (required): Billboard ID

**Example Request:**
```http
GET /billboards/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Downtown Digital Display",
    "latitude": 40.7589,
    "longitude": -73.9851,
    "address": "123 Broadway",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "type": "digital",
    "size": "14x48",
    "facing": "North",
    "illuminated": true,
    "dailyTraffic": 85000,
    "speedLimit": 25,
    "visibility": "Excellent",
    "monthlyRate": 8500,
    "availability": "available",
    "availableDate": "2025-07-01",
    "description": "Prime location in Times Square area with high visibility and foot traffic.",
    "image": "https://via.placeholder.com/400x300/0066cc/ffffff?text=Digital+Billboard",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-06-20T00:00:00Z"
  }
}
```

### Find Nearby Billboards
```http
GET /billboards/search/nearby
```

**Query Parameters:**
- `lat` (required): Latitude (-90 to 90)
- `lng` (required): Longitude (-180 to 180)
- `radius` (optional): Search radius in miles (default: 10, max: 100)

**Example Request:**
```http
GET /billboards/search/nearby?lat=40.7589&lng=-73.9851&radius=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Digital Display",
      "latitude": 40.7589,
      "longitude": -73.9851,
      "distance": 0.0,
      // ... other billboard properties
    }
  ],
  "searchCriteria": {
    "center": {
      "lat": 40.7589,
      "lng": -73.9851
    },
    "radius": 5,
    "unit": "miles"
  }
}
```

### Get Billboard Statistics
```http
GET /billboards/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "available": 3,
    "comingSoon": 1,
    "sold": 1,
    "byType": {
      "static": 1,
      "digital": 2,
      "poster": 1,
      "wallscape": 1
    },
    "priceRange": {
      "min": 2800,
      "max": 12000,
      "average": 7400
    },
    "trafficRange": {
      "min": 45000,
      "max": 120000,
      "average": 82000
    }
  }
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-20T20:00:00.000Z",
  "uptime": 3600
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Latitude must be between -90 and 90",
      "param": "lat",
      "location": "query"
    }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Billboard not found",
  "message": "Billboard with ID 999 does not exist"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Data Models

### Billboard Object
```typescript
interface Billboard {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'static' | 'digital' | 'poster' | 'wallscape';
  size: string;
  facing: string;
  illuminated: boolean;
  dailyTraffic: number;
  speedLimit: number;
  visibility: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  monthlyRate: number;
  availability: 'available' | 'coming_soon' | 'sold';
  availableDate: string | null;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
```

## Future Endpoints (To Implement)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Billboard Management (Admin)
- `POST /billboards` - Create new billboard
- `PUT /billboards/:id` - Update billboard
- `DELETE /billboards/:id` - Delete billboard

### Inquiries
- `POST /inquiries` - Submit billboard inquiry
- `GET /inquiries` - Get user inquiries (authenticated)

### Favorites
- `POST /favorites` - Add billboard to favorites
- `GET /favorites` - Get user favorites
- `DELETE /favorites/:id` - Remove from favorites
