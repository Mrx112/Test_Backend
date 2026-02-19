// Minimal mock for @nestjs/config
class ConfigService {
  constructor() {}
  get(key) {
    if (key === 'JWT_SECRET') return 'test-secret';
    if (key === 'JWT_EXPIRATION') return '24h';
    return undefined;
  }
}

module.exports = { ConfigService };
