#!/bin/bash

# YouApp Backend Startup Script
# This script helps with common development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}YouApp Backend Setup${NC}"
echo -e "${GREEN}================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting services with Docker Compose...${NC}"

# Start services
docker-compose up --build -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

# Check MongoDB
echo -e "${YELLOW}Checking MongoDB...${NC}"
docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1 && echo -e "${GREEN}✓ MongoDB is ready${NC}" || echo -e "${RED}✗ MongoDB connection failed${NC}"

# Check RabbitMQ
echo -e "${YELLOW}Checking RabbitMQ...${NC}"
docker-compose exec -T rabbitmq rabbitmq-diagnostics -q ping >/dev/null 2>&1 && echo -e "${GREEN}✓ RabbitMQ is ready${NC}" || echo -e "${RED}✗ RabbitMQ connection failed${NC}"

# Wait for app
echo -e "${YELLOW}Waiting for application to start...${NC}"
sleep 10

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Services are running!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Available URLs:${NC}"
echo -e "  Backend API:       ${GREEN}http://localhost:3000${NC}"
echo -e "  RabbitMQ Console:  ${GREEN}http://localhost:15672${NC}"
echo -e "    Username: guest"
echo -e "    Password: guest"
echo -e "  MongoDB:           ${GREEN}localhost:27017${NC}"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo -e "  API Docs:          ${GREEN}API_DOCUMENTATION.md${NC}"
echo -e "  Implementation:    ${GREEN}README_IMPLEMENTATION.md${NC}"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  View logs:         docker-compose logs -f app"
echo -e "  Run tests:         docker-compose exec app npm run test"
echo -e "  Stop services:     docker-compose down"
echo -e "  Stop & clean:      docker-compose down -v"
echo ""
