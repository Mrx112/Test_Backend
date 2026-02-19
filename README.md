# YouApp Backend API

A professional, production-ready NestJS backend implementing authentication, user profiles, and real-time chat functionality using MongoDB, RabbitMQ, and JWT authentication.

## 🎯 Features

✅ **Authentication** - Secure user registration and login with JWT tokens  
✅ **User Profiles** - Comprehensive profile management with zodiac signs and horoscopes  
✅ **Real-time Chat** - Message queue with RabbitMQ for asynchronous messaging  
✅ **API Documentation** - Auto-generated Swagger/OpenAPI documentation  
✅ **Input Validation** - Strict DTO validation with detailed error messages  
✅ **Error Handling** - Comprehensive exception handling and logging  
✅ **Docker Support** - Multi-stage Dockerfile and docker-compose for development & production  
✅ **Database** - MongoDB with Mongoose schemas and indexing  
✅ **JWT Auth** - Secure authentication with refresh token support  

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- MongoDB 7.0+
- RabbitMQ 3.12+

### Installation & Setup

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/Mrx112/Test_Backend.git
cd Test_Backend/Backends/login_backend

# Copy environment file
cp .env.example .env

# Start services with Docker Compose
docker-compose up -d

# Application will be available at http://localhost:3000
# Swagger docs at http://localhost:3000/api/docs
```

#### Option 2: Local Development

```bash
# Clone and install
git clone https://github.com/Mrx112/Test_Backend.git
cd Test_Backend/Backends/login_backend

npm install --legacy-peer-deps

# Copy and configure environment
cp .env.example .env

# Make sure MongoDB and RabbitMQ are running
# Start development server
npm run start:dev

# Access at http://localhost:3000
```

## 📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Profile Endpoints

#### Create Profile
```http
POST /api/createProfile
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Software engineer and gamer",
  "height": 180,
  "weight": 75,
  "dateOfBirth": "1995-05-15T00:00:00Z",
  "gender": "MALE",
  "location": "New York, USA",
  "occupation": "Senior Software Engineer",
  "education": "BS Computer Science",
  "interests": ["gaming", "hiking", "reading"],
  "profileImageUrl": "https://example.com/profile.jpg",
  "galleryImageUrls": ["https://example.com/img1.jpg"],
  "favouriteGames": [
    {
      "id": "1",
      "name": "The Witcher 3",
      "image_url": "https://example.com/witcher3.jpg"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "displayName": "John Doe",
  "bio": "Software engineer and gamer",
  "zodiacSign": "TAURUS",
  "horoscope": "As a Taurus, you are known for being reliable...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Profile
```http
GET /api/getProfile
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):** Returns user's complete profile

#### Update Profile
```http
PUT /api/updateProfile
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "displayName": "Jane Doe",
  "bio": "Updated bio"
}
```

### Chat Endpoints

#### Send Message
```http
POST /api/sendMessage
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "receiverId": "507f1f77bcf86cd799439013",
  "content": "Hey, how are you?",
  "messageType": "TEXT",
  "attachments": []
}
```

**Response (201 Created):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439012",
    "receiverId": "507f1f77bcf86cd799439013",
    "content": "Hey, how are you?",
    "messageType": "TEXT",
    "status": "SENT",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### View Messages
```http
GET /api/viewMessages/{conversationId}?limit=50&offset=0
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "message": "Messages retrieved successfully",
  "data": {
    "conversationId": "507f1f77bcf86cd799439014",
    "totalMessages": 45,
    "messages": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "senderId": "507f1f77bcf86cd799439012",
        "receiverId": "507f1f77bcf86cd799439013",
        "content": "Hey, how are you?",
        "messageType": "TEXT",
        "status": "READ",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Generation
- Tokens are obtained from `/api/register` or `/api/login`
- Token expiration: 24 hours
- Format: Standard JWT with HS256 algorithm

### Password Requirements
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- Example: `SecurePass123!`

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth logic
│   ├── auth.module.ts       # Auth module
│   └── jwt.service.ts       # JWT token generation/validation
├── profile/                 # Profile management module
│   ├── profile.controller.ts
│   ├── profile.service.ts
│   └── profile.module.ts
├── chat/                    # Chat/messaging module
│   ├── chat.controller.ts
│   ├── chat.service.ts
│   └── chat.module.ts
├── config/
│   └── rabbitmq.service.ts  # RabbitMQ queue service
├── dtos/                    # Data Transfer Objects
│   ├── auth.dto.ts
│   ├── profile.dto.ts
│   └── message.dto.ts
├── schemas/                 # MongoDB schemas
│   ├── user.schema.ts
│   ├── profile.schema.ts
│   ├── message.schema.ts
│   └── conversation.schema.ts
├── guards/
│   └── jwt-auth.guard.ts    # JWT authentication guard
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## 🔧 Environment Variables

See `.env.example` for all available variables. Key variables:

```env
# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Database
MONGODB_URI=mongodb://root:root123@mongo:27017/youapp?authSource=admin

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_QUEUE=messages
RABBITMQ_EXCHANGE=chat
```

## 💾 Database Schema

### User Collection
```json
{
  "_id": ObjectId,
  "email": String (unique, indexed),
  "username": String (unique, indexed),
  "password": String (hashed),
  "lastLogin": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Profile Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId (ref: User, unique),
  "displayName": String,
  "bio": String,
  "height": Number,
  "weight": Number,
  "zodiacSign": String (enum),
  "dateOfBirth": Date,
  "horoscope": String,
  "gender": String (enum),
  "location": String,
  "interests": [String],
  "favouriteGames": [{
    "id": String,
    "name": String,
    "image_url": String
  }],
  "createdAt": Date,
  "updatedAt": Date
}
```

### Message Collection
```json
{
  "_id": ObjectId,
  "senderId": ObjectId (ref: User),
  "receiverId": ObjectId (ref: User),
  "content": String,
  "messageType": String (enum: TEXT, IMAGE, FILE, AUDIO, VIDEO),
  "status": String (enum: SENT, DELIVERED, READ),
  "attachments": [String],
  "reactions": [{
    "userId": ObjectId,
    "emoji": String,
    "createdAt": Date
  }],
  "isEdited": Boolean,
  "editedAt": Date,
  "createdAt": Date
}
```

## 🧪 Development

### Available Scripts

```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build

# Production run
npm run start:prod

# Unit tests
npm test

# Test with coverage
npm test:cov

# E2E tests
npm run test:e2e

# Linting
npm run lint

# Code formatting
npm run format
```

### Running Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- auth.service.spec.ts

# Run with coverage report
npm test:cov

# E2E tests
npm run test:e2e
```

## 🐳 Deployment

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Update `MONGODB_URI` for production database
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to allowed domains
- [ ] Enable HTTPS/TLS
- [ ] Configure RabbitMQ with authentication
- [ ] Setup database backups
- [ ] Configure monitoring and logging
- [ ] Setup CI/CD pipeline
- [ ] Enable rate limiting

### Environment for Production

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Docker build and run
docker build -t youapp-backend:latest .
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=$(openssl rand -base64 32) \
  -e MONGODB_URI=mongodb://... \
  youapp-backend:latest
```

## 📖 API Documentation

Swagger/OpenAPI documentation is automatically generated and available at:

```
http://localhost:3000/api/docs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- YouApp Team

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using NestJS, MongoDB, and RabbitMQ**
