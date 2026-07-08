const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export const authService = {
  async register(data: any) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  },

  async login(data: any) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    return result;
  },

  async verifyOtp(data: any) {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Verification failed');
    }
    return result;
  },

  async resendOtp(email: string) {
    const response = await fetch(`${API_URL}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to resend OTP');
    }
    return result;
  },

  async refreshToken(refresh_token: string) {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token })
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to refresh token');
    }
    return result;
  }
};
