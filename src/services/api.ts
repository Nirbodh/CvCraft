import { CV } from '../types/cv.ts';

const TOKEN_KEY = 'cvcraft_jwt_token';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Health
  async checkHealth() {
    return request<{
      status: string;
      version: string;
      database: {
        isMongo: boolean;
        mode: string;
        error: string | null;
        activeCollections: Record<string, string>;
        hint: string;
      };
    }>('/api/health');
  },

  // Auth
  async register(name: string, email: string, password: string) {
    const res = await request<{
      success: boolean;
      user: { id: string; name: string; email: string };
      token: string;
      message: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{
      success: boolean;
      user: { id: string; name: string; email: string };
      token: string;
      message: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe() {
    return request<{
      success: boolean;
      user: { id: string; name: string; email: string };
    }>('/api/auth/me');
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      removeStoredToken();
    }
  },

  // CV Operations
  async getCvs() {
    return request<{
      success: boolean;
      count: number;
      cvs: CV[];
    }>('/api/cvs');
  },

  async getCvById(id: string) {
    return request<{
      success: boolean;
      cv: CV;
    }>(`/api/cvs/${id}`);
  },

  async createCv(cvData: Partial<CV>) {
    return request<{
      success: boolean;
      message: string;
      cv: CV;
    }>('/api/cvs', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
  },

  async updateCv(id: string, cvData: Partial<CV>) {
    return request<{
      success: boolean;
      message: string;
      cv: CV;
    }>(`/api/cvs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cvData),
    });
  },

  async deleteCv(id: string) {
    return request<{
      success: boolean;
      message: string;
    }>(`/api/cvs/${id}`, {
      method: 'DELETE',
    });
  },

  // Document extraction
  async extractDocument(payload: {
    filename: string;
    fileType: 'pdf' | 'docx' | 'txt';
    fileBase64?: string;
    rawText?: string;
  }) {
    return request<{
      success: boolean;
      extracted: any;
      source: string;
      message?: string;
    }>('/api/extract', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Image & Photo Uploads (Cloudinary with local fallback)
  async uploadImage(image: string, folder = 'cvcraft_photos') {
    return request<{
      success: boolean;
      provider: string;
      url: string;
      publicId?: string;
      message: string;
    }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image, folder }),
    });
  },

  async getUploadStatus() {
    return request<{
      success: boolean;
      provider: string;
      isCloudinaryConfigured: boolean;
      message: string;
    }>('/api/upload/status');
  },
};
