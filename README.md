# YouApp Backend

This repository implements a NestJS backend for login, profile, and chat using MongoDB and RabbitMQ.

Run with Docker Compose:

```bash
docker-compose up --build
```

Environment (examples in docker-compose.yml):
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `RABBITMQ_URL` — RabbitMQ connection URL
- `RABBITMQ_EXCHANGE` / `RABBITMQ_QUEUE` — RabbitMQ exchange and queue

API Endpoints (base `/api`):

- **Register**: `POST /api/register`
  - Body: `{ email, username, password }`

- **Login**: `POST /api/login`
  - Body: `{ email, password }`

- **Create Profile**: `POST /api/createProfile` (auth)
  - Body: profile fields (see `src/dtos/profile.dto.ts`)

- **Get Profile**: `GET /api/getProfile` (auth)

- **Update Profile**: `PUT /api/updateProfile` (auth)

- **Send Message**: `POST /api/sendMessage` (auth)
  - Body: `{ receiverId, content, messageType?, attachments?, replyToId? }`

- **View Messages**: `GET /api/viewMessages/:conversationId` (auth)

Validation
- Global validation pipe is enabled (`src/main.ts`) using `class-validator` and `class-transformer`.

Notes
- Profiles include `zodiacSign`, `dateOfBirth`, and `horoscope` derived from DOB if provided.
- Chat sends notifications via RabbitMQ (`src/config/rabbitmq.service.ts`).

Testing
- Run unit tests with `npm test`.
