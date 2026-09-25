import type {
  User,
  AuthResponse,
  AnalysisResult,
  DashboardStats,
  GlobalTrends,
  SourceIntelligence
} from '../types';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const DOCS_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '/docs') : '/docs';
export const REDOC_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '/redoc') : '/redoc';
export const HEALTH_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '/api/health') : '/api/health';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('truthlens_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentication
  async register(data: { email: string; password: string; full_name?: string; role?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Invalid email or password');
    }
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // News Analysis
  async analyzeNews(payload: {
    input_type: string;
    text?: string;
    headline?: string;
    url?: string;
    language?: string;
    category?: string;
  }): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/news/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Analysis request failed');
    }
    return res.json();
  },

  async analyzeUrl(url: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/news/analyze-url`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'URL Analysis failed' }));
      throw new Error(err.detail || 'Failed to extract and analyze URL');
    }
    return res.json();
  },

  async getHistory(params?: {
    classification?: string;
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<AnalysisResult[]> {
    const url = new URL(`${API_BASE}/news/history`, window.location.origin);
    if (params?.classification) url.searchParams.set('classification', params.classification);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    if (params?.offset) url.searchParams.set('offset', params.offset.toString());

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async getAnalysisById(id: number | string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/news/history/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Analysis report not found');
    return res.json();
  },

  async saveArticle(analysisId: number, data: { notes?: string; tags?: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/news/save/${analysisId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save article');
    return res.json();
  },

  async getSavedArticles(): Promise<AnalysisResult[]> {
    const res = await fetch(`${API_BASE}/news/saved`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch saved articles');
    return res.json();
  },

  // Dashboard & Trends
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getGlobalTrends(params?: { category?: string; country?: string; timeframe?: string }): Promise<GlobalTrends> {
    const url = new URL(`${API_BASE}/trends/global`, window.location.origin);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.country) url.searchParams.set('country', params.country);
    if (params?.timeframe) url.searchParams.set('timeframe', params.timeframe);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch global trends');
    return res.json();
  },

  // Sources Explorer
  async getSources(params?: { search?: string; trust_tier?: string; country?: string }): Promise<SourceIntelligence[]> {
    const url = new URL(`${API_BASE}/sources`, window.location.origin);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.trust_tier) url.searchParams.set('trust_tier', params.trust_tier);
    if (params?.country) url.searchParams.set('country', params.country);

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  // Users & Settings
  async updateProfile(data: { full_name?: string; role?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async generateApiKey(): Promise<{ api_key: string; message: string }> {
    const res = await fetch(`${API_BASE}/users/generate-api-key`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate API key');
    return res.json();
  },

  async updateSettings(settings: Record<string, any>): Promise<any> {
    const res = await fetch(`${API_BASE}/users/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};
