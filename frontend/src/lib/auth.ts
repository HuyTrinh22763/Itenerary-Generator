// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
}

// Get user token
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

// Logout user
export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
