import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

const mockUserModel: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService: any = {
  sign: jest.fn().mockReturnValue('signed-token'),
  verify: jest.fn(),
};

describe('AuthService (unit)', () => {
  let service: AuthService;

  beforeEach(() => {
    // use the bcryptjs mock behavior from test/jest-mocks/bcryptjs.js
    service = new AuthService(mockUserModel as any, mockJwtService as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockUserModel.findOne.mockReset();
    mockUserModel.create.mockReset();
    mockUserModel.findById.mockReset();
    mockJwtService.sign.mockReset();
  });

  it('registers a user successfully', async () => {
    const registerDto = { email: 'a@b.com', username: 'john', password: 'password' } as any;
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({ _id: '1', email: registerDto.email, username: registerDto.username, password: 'hashed' });

    const res = await service.register(registerDto);

    expect(res.token).toBe('signed-token');
    expect(res.user.email).toBe(registerDto.email);
  });

  it('throws on login with invalid credentials', async () => {
    const loginDto = { email: 'x@y.com', password: 'bad' } as any;
    mockUserModel.findOne.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow();
  });
});
