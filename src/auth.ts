// Simple placeholder auth for demo purposes
export function login(username: string): string {
  // In a real app, replace with real authentication
  localStorage.setItem('vimeo_demo_user', username);
  return username;
}

export function logout() {
  localStorage.removeItem('vimeo_demo_user');
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('vimeo_demo_user');
}
