const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3002';

export interface ScanResult {
  total_messages: number;
  total_evidence_rows: number;
  total_domains: number;
  accounts: AccountLead[];
}

export interface AccountLead {
  base_domain: string;
  messages: number;
  total_score: number;
  last_seen: string | null;
  first_seen: string | null;
  any_auth: boolean;
  any_billing: boolean;
  any_subscription: boolean;
  any_rewards: boolean;
  any_cloud_domain: boolean;
  example_subjects: string[];
  brand: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  onboardingCompleted: boolean;
  onboardingData: Record<string, unknown> | null;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body as T;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const scanAPI = {
  // ── Auth ──────────────────────────────────────────────────────────
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(token: string): Promise<AuthResponse> {
    return apiFetch('/api/user/me', {
      headers: authHeaders(token),
    });
  },

  // ── Onboarding ────────────────────────────────────────────────────
  async saveOnboarding(data: Record<string, unknown>, token: string): Promise<void> {
    await apiFetch('/api/user/onboarding', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  // ── Scan results ──────────────────────────────────────────────────
  async saveScan(result: ScanResult, token: string): Promise<{ scanId: string }> {
    return apiFetch('/api/user/scans', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        totalMessages: result.total_messages,
        totalEvidenceRows: result.total_evidence_rows,
        totalDomains: result.total_domains,
        accounts: result.accounts,
      }),
    });
  },

  async getScanHistory(token: string): Promise<unknown[]> {
    return apiFetch('/api/user/scans', {
      headers: authHeaders(token),
    });
  },

  // ── MBOX upload ───────────────────────────────────────────────────
  async uploadMboxFile(file: File, onProgress?: (progress: number) => void): Promise<ScanResult> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || error.error || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

      xhr.open('POST', `${API_BASE}/api/scan/upload`);
      xhr.send(formData);
    });
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
