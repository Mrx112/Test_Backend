# YouApp Backend - Quick Reference

## 🚀 Quick Start

```bash
# Option 1: Docker (Recommended)
git clone https://github.com/Mrx112/Test_Backend.git
cd Test_Backend/Backends/login_backend
cp .env.example .env
docker-compose up -d

# Option 2: Local
npm install --legacy-peer-deps
cp .env.example .env
npm run start:dev
```

## 📚 API Access

- **API Base URL:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs
- **RabbitMQ Dashboard:** http://localhost:15672 (guest:guest)

## 📋 Key Endpoints

### Auth (No Token Required)
```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Profile (Requires Token)
```bash
# Create Profile
curl -X POST http://localhost:3000/api/createProfile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Doe",
    "bio": "Bio text",
    "dateOfBirth": "1995-05-15T00:00:00Z"
  }'

# Get Profile
curl -X GET http://localhost:3000/api/getProfile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update Profile
curl -X PUT http://localhost:3000/api/updateProfile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "New Name"}'
```

### Chat (Requires Token)
```bash
# Send Message
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "USER_ID",
    "content": "Message text"
  }'

# View Messages
curl -X GET "http://localhost:3000/api/viewMessages/CONVERSATION_ID?limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build

# Remove everything (careful!)
docker-compose down -v
```

## 📝 Available Scripts

```bash
npm run start:dev      # Development with hot reload
npm run build          # Production build
npm run start:prod     # Production run
npm test               # Run unit tests
npm test:cov           # Test coverage
npm run test:e2e       # E2E tests
npm run lint           # Linting
npm run format         # Code formatting
```

## 🔐 Password Requirements

- Minimum 8 characters
- Must include:
  - Uppercase letter (A-Z)
  - Lowercase letter (a-z)
  - Number (0-9)
  - Special character (@$!%*?&)

**Example:** `SecurePass123!`

## 📊 Database Collections

- **Users:** Email/username validation, password hashing
- **Profiles:** Zodiac sign, horoscope, interests, games
- **Messages:** Sender/receiver, content, status, reactions
- **Conversations:** Participant tracking, last message

## 🛠 Environment Setup

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Key variables:
- `JWT_SECRET` - Change in production!
- `MONGODB_URI` - Database connection
- `RABBITMQ_URL` - Message broker
- `NODE_ENV` - development or production

## ✅ Verification Checklist

After starting:
- [ ] API responds at http://localhost:3000
- [ ] Swagger docs at http://localhost:3000/api/docs
- [ ] MongoDB running and connected
- [ ] RabbitMQ dashboard at http://localhost:15672
- [ ] Can register new user at `/api/register`
- [ ] Can login at `/api/login`
- [ ] Received JWT token in response

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port in .env
PORT=3001
```

**MongoDB connection failed:**
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is running: `docker-compose ps`

**RabbitMQ connection failed:**
- Check `RABBITMQ_URL` in `.env`
- View RabbitMQ logs: `docker-compose logs rabbitmq`

**Build errors:**
```bash
# Clear cache and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## 📖 Documentation

- **Full Guide:** See `README.md`
- **Implementation Details:** See `IMPLEMENTATION_GUIDE.md`
- **API Docs:** Visit http://localhost:3000/api/docs

## 🆘 Support

For issues:
1. Check the README.md for detailed documentation
2. Review IMPLEMENTATION_GUIDE.md for features
3. Check logs: `docker-compose logs -f app`
4. Open issue on GitHub

---

**Ready to go! 🚀**
