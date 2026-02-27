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

export const scanAPI = {
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

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

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
