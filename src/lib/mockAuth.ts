// Mock Authentication System for Hackathons
// Secure approach without storing passwords in localStorage

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'health_worker';
  createdAt: string;
  profilePicture?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// In-memory user storage (simulates database)
const users: Map<string, { 
  id: string;
  email: string; 
  fullName: string;
  passwordHash: string; // Simulated hash
  role: 'patient' | 'health_worker';
  createdAt: string;
}> = new Map();

// Simulate password hashing (for demo purposes)
const hashPassword = (password: string): string => {
  // Simple hash simulation - in real app, use bcrypt
  return btoa(password + 'salt123').replace(/[^a-zA-Z0-9]/g, '');
};

// Generate JWT-like token (for demo purposes)
const generateToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

// Validate token
const validateToken = (token: string): { valid: boolean; userId?: string } => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp > Date.now()) {
      return { valid: true, userId: payload.userId };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
};

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthAPI = {
  // Register new user
  register: async (email: string, password: string, fullName: string, role: 'patient' | 'health_worker'): Promise<AuthResponse> => {
    await delay(1000); // Simulate API call
    
    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return {
        success: false,
        message: 'An account with this email already exists.'
      };
    }
    
    // Validate input
    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.'
      };
    }
    
    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: email.toLowerCase(),
      fullName,
      passwordHash: hashPassword(password),
      role,
      createdAt: new Date().toISOString()
    };
    
    users.set(email.toLowerCase(), user);
    
    // Generate token
    const token = generateToken(userId);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      },
      token,
      message: 'Account created successfully!'
    };
  },
  
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(800); // Simulate API call
    
    const user = users.get(email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address.'
      };
    }
    
    // Check password
    if (user.passwordHash !== hashPassword(password)) {
      return {
        success: false,
        message: 'Incorrect password.'
      };
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      },
      token,
      message: 'Sign in successful!'
    };
  },
  
  // Validate current session
  validateSession: async (token: string): Promise<AuthResponse> => {
    await delay(200);
    
    const validation = validateToken(token);
    
    if (!validation.valid || !validation.userId) {
      return {
        success: false,
        message: 'Invalid or expired session.'
      };
    }
    
    // Find user by ID
    const user = Array.from(users.values()).find(u => u.id === validation.userId);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found.'
      };
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  },
  
  // Google Sign-In simulation
  googleSignIn: async (role: 'patient' | 'health_worker'): Promise<AuthResponse> => {
    await delay(1200); // Simulate OAuth flow
    
    // Simulate Google user data
    const googleUser = {
      email: `demo.${role}@gmail.com`,
      fullName: role === 'patient' ? 'Demo Patient' : 'Demo Health Worker',
      googleId: `google_${Date.now()}`
    };
    
    // Check if user exists or create new one
    let user = users.get(googleUser.email);
    
    if (!user) {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        email: googleUser.email,
        fullName: googleUser.fullName,
        passwordHash: '', // No password for Google users
        role,
        createdAt: new Date().toISOString()
      };
      users.set(googleUser.email, user);
    }
    
    const token = generateToken(user.id);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      },
      token,
      message: 'Google sign in successful!'
    };
  },
  
  // Get all users (for demo purposes)
  getAllUsers: () => {
    return Array.from(users.values()).map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt
    }));
  }
};

// Pre-populate with demo users for testing
mockAuthAPI.register('patient@demo.com', 'password123', 'Demo Patient', 'patient');
mockAuthAPI.register('healthworker@demo.com', 'password123', 'Demo Health Worker', 'health_worker');
mockAuthAPI.register('john.doe@example.com', 'securepass', 'John Doe', 'patient');
mockAuthAPI.register('dr.smith@hospital.com', 'doctorpass', 'Dr. Sarah Smith', 'health_worker');
