const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000/api';

export default class ApiClient {
  private static instance: ApiClient | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      try {
        window.localStorage.setItem('crm-auth-token', token);
      } catch {}
    } else {
      try {
        window.localStorage.removeItem('crm-auth-token');
      } catch {}
    }
  }

  getToken() {
    if (this.token) return this.token;
    try {
      this.token = window.localStorage.getItem('crm-auth-token');
    } catch {
      this.token = null;
    }
    return this.token;
  }

  async request<T>(path: string, init?: RequestInit) {
    const token = this.getToken();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  async patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
  }

  async del<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
