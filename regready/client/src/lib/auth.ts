// Authentication utilities
export interface User {
  id: number;
  email: string;
  username: string;
  companyName?: string;
  role?: 'user' | 'admin';
  subscriptionTier: 'trial' | 'starter' | 'pro' | 'agency';
  subscriptionStatus: 'trial' | 'active' | 'inactive' | 'cancelled';
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getUser(): User | null {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null && getUser() !== null;
}

export function hasActiveSubscription(): boolean {
  const user = getUser();
  return user?.subscriptionStatus === 'active';
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  // Add a small delay to prevent rate limiting issues
  setTimeout(() => {
    window.location.href = '/';
  }, 100);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}