const MOCK_USERS = [];

class AuthService {
  async signup(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const userExists = MOCK_USERS.find((u) => u.email === email);
    if (userExists) {
      throw new Error('User already exists');
    }
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    MOCK_USERS.push(mockUser);
    const token = this._generateMockToken(mockUser.id, email);
    return {
      userId: mockUser.id,
      email: mockUser.email,
      token,
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const token = this._generateMockToken(user.id, email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', user.id);
    return {
      userId: user.id,
      email: user.email,
      token,
    };
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  _generateMockToken(userId, email) {
    const payload = {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    };
    const tokenString = JSON.stringify(payload);
    return btoa(tokenString);
  }
}

export default new AuthService();  
